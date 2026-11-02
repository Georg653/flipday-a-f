import { NewsApi } from '../../services/admin/News/newsApi';
import { StoriesApi } from '../../services/admin/Stories/storiesApi';
import { PointsApi } from '../../services/admin/Points/pointsApi';
import { RoutesApi } from '../../services/admin/Routes/routesApi';
import { RouteCategoriesApi } from '../../services/admin/RouteCategories/routeCategoriesApi';
import { LearningTopicsApi } from '../../services/admin/LearningTopics/learningTopicsApi';
import { LearningSubtopicsApi } from '../../services/admin/LearningSubtopics/learningSubtopicsApi';
import { LearningPagesApi } from '../../services/admin/LearningPages/learningPagesApi';
import { AchievementsApi } from '../../services/admin/Achievements/achievementsApi';
import { toRequestError } from '../../utils/errors';
import { resolveData } from './schema';
import type { Entry,Data } from './schema';
export interface Result {key:string;status:'success'|'error'|'blocked';id?:number;message?:string;}
const payload=<T,>(value:Data):T=>value as T;
export async function createEntry(entry:Entry,data:Data):Promise<number>{
 switch(entry.type){
  case 'news':return (await NewsApi.createNews(payload(data),null,null,[])).id;
  case 'stories':return (await StoriesApi.createStory(payload(data),null,[])).id;
  case 'points':return (await PointsApi.createPoint(payload(data),null,[])).id;
  case 'routes':return (await RoutesApi.createRoute(payload(data),null)).id;
  case 'categories':return (await RouteCategoriesApi.createRouteCategory(payload(data),null)).id;
  case 'topics':return (await LearningTopicsApi.createTopic(payload(data),null)).id;
  case 'subtopics':{const {topic_id,...body}=data;return (await LearningSubtopicsApi.createSubtopic(Number(topic_id),payload(body),null)).id;}
  case 'pages':{const {subtopic_id,...body}=data;return (await LearningPagesApi.createPage(Number(subtopic_id),payload(body),[])).id;}
  case 'achievements':return (await AchievementsApi.createAchievement(payload(data),null)).id;
 }
}
export async function executePlan(plan:Entry[],previous:Result[]=[],onProgress?:(results:Result[])=>void,create=createEntry,stop?:()=>boolean):Promise<Result[]>{
 const ids=new Map(previous.filter(result=>result.status==='success'&&result.id).map(result=>[result.key,result.id!]));
 const results:Result[]=[];
 for(const entry of plan){
  if(stop?.())break;
  if(ids.has(entry.key)){results.push({key:entry.key,status:'success',id:ids.get(entry.key)});onProgress?.([...results]);continue;}
  let data:Data;try{data=resolveData(entry,ids);}catch(cause){results.push({key:entry.key,status:'blocked',message:toRequestError(cause).message});onProgress?.([...results]);continue;}
  try{const id=await create(entry,data);ids.set(entry.key,id);results.push({key:entry.key,status:'success',id});}
  catch(cause){results.push({key:entry.key,status:'error',message:toRequestError(cause).message});}
  onProgress?.([...results]);
 }
 return results;
}
