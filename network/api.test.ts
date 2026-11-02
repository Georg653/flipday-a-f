import { beforeAll, test, expect, vi } from 'vitest';
import axios from 'axios';
import client from '../src/services/admin/api/axios';
import { AuthApi } from '../src/services/admin/Auth/authApi';
import { StoriesApi } from '../src/services/admin/Stories/storiesApi';
import { NewsApi } from '../src/services/admin/News/newsApi';
import { PointsApi } from '../src/services/admin/Points/pointsApi';
import { RoutesApi } from '../src/services/admin/Routes/routesApi';
import { RouteCategoriesApi } from '../src/services/admin/RouteCategories/routeCategoriesApi';
import { LearningTopicsApi } from '../src/services/admin/LearningTopics/learningTopicsApi';
import { LearningSubtopicsApi } from '../src/services/admin/LearningSubtopics/learningSubtopicsApi';
import { LearningPagesApi } from '../src/services/admin/LearningPages/learningPagesApi';
import { AchievementsApi } from '../src/services/admin/Achievements/achievementsApi';
import { ProposalsApi } from '../src/services/admin/Proposals/proposalsApi';
import type { NewsCreateUpdatePayload } from '../src/types/admin/News/news.types';

beforeAll(async()=>{
 if(!process.env.TEST_API_URL) throw new Error('Start the isolated tests.browser_app server and set TEST_API_URL; never point this at production.');
 const marker=await axios.get(new URL('/__test_fixture__',process.env.TEST_API_URL).toString());
 if(marker.data.test_fixture!==true) throw new Error('Refusing to modify a server without the isolated test fixture marker.');
 const tokens=new Map<string,string>();
 vi.stubGlobal('localStorage',{getItem:(key:string)=>tokens.get(key)||null,setItem:(key:string,value:string)=>tokens.set(key,value),removeItem:(key:string)=>tokens.delete(key)});
 vi.stubGlobal('window',{location:{pathname:'/login'}});
 client.defaults.baseURL=process.env.TEST_API_URL;
 client.defaults.adapter='http';
 const login=await AuthApi.login({email:'admin@example.com',password:'Test-only-password'});
 localStorage.setItem('authToken',login.access_token);
});
const name=(label:string)=>`${label} ${Date.now()}`;
const photo=()=>new File([new Uint8Array([137,80,78,71])],'test.png',{type:'image/png'});

test('status on/off uses real Axios multipart and preserves story fields',async()=>{
 const story=await StoriesApi.createStory({name:name('История'),is_active:true,expires_at:'2027-01-01 12:00:00',content_items:[{type:'image',content:'',duration:8}]},photo(),[photo()]);
 try {
  // Reproduce the original bug over HTTP before checking the fix.
  const broken=axios.create({baseURL:client.defaults.baseURL,headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('authToken')}`}});
  const form=new FormData();form.append('story_data_json',JSON.stringify({is_active:false}));
  const failed=await broken.put(`stories/${story.id}`,form,{validateStatus:()=>true});
  expect(failed.status).toBe(422);
  expect(JSON.stringify(failed.data.detail)).toContain('story_data_json');
  const off=await StoriesApi.updateStoryStatus(story,false);
  expect(off.is_active).toBe(false);expect(off.name).toBe(story.name);expect(off.expires_at).toBe(story.expires_at);expect(off.content_items).toEqual(story.content_items);
  const on=await StoriesApi.updateStoryStatus(off,true);expect(on.is_active).toBe(true);
  expect((await StoriesApi.getStoryById(story.id)).is_active).toBe(true);
 } finally {await StoriesApi.deleteStory(story.id);}
});

test('news create edit media retention and delete',async()=>{
 const payload:NewsCreateUpdatePayload={title:name('Новость'),description:'Описание',content:[{type:'image',src:''}]};
 const row=await NewsApi.createNews(payload,photo(),photo(),[photo()]);
 try {
  const changed=await NewsApi.updateNews(row.id,{...payload,title:name('Обновлено'),content:row.content},null,null,[],false,false);
  expect(changed.content).toEqual(row.content);expect(changed.background).toBe(row.background);
  expect((await NewsApi.getNewsById(row.id)).title).toBe(changed.title);
 } finally {await NewsApi.deleteNews(row.id);}
});

test('points, category and route create update delete with ordered IDs',async()=>{
 const cat=await RouteCategoriesApi.createRouteCategory({name:name('Категория'),description:'Описание'},null);
 const payload={name:name('Точка'),description:'Описание',latitude:53.9,longitude:27.5,is_partner:true,budget:10,content_data:{content:[{type:'text' as const,content:'Описание точки'}]}};
 const point=await PointsApi.createPoint(payload,photo(),[]);
 let routeId:number|undefined;
 try {
  expect((await PointsApi.getPointContent(point.id)).content[0].type).toBe('text');
  await PointsApi.updatePoint(point.id,{...payload,budget:20},null,[],false);
  const routePayload={name:name('Маршрут'),description:'Описание',route_category_id:cat.id,points:[point.id],distance:1000,estimated_time:25,budget:20};
  const route=await RoutesApi.createRoute(routePayload,photo());routeId=route.id;
  expect((await RoutesApi.updateRoute(route.id,routePayload,null,true)).image).toBeNull();
  expect((await RoutesApi.getRoutes({search:routePayload.name}))[0].points[0].id).toBe(point.id);
 } finally {
  if(routeId)await RoutesApi.deleteRoute(routeId);
  await PointsApi.deletePoint(point.id);await RouteCategoriesApi.deleteRouteCategory(cat.id);
 }
});

test('learning hierarchy create update delete',async()=>{
 const topic=await LearningTopicsApi.createTopic({name:name('Курс'),description:'Описание',experience_points:10,order:1},null);
 let subId:number|undefined;let pageId:number|undefined;
 try {
  const sub=await LearningSubtopicsApi.createSubtopic(topic.id,{name:name('Подтема'),description:'Описание',experience_points:10,order:1},null);subId=sub.id;
  const page=await LearningPagesApi.createPage(sub.id,{page_number:1,content:[{type:'text',content:'Текст'}]},[]);pageId=page.id;
  expect((await LearningPagesApi.updatePage(page.id,{page_number:1,content:[{type:'text',content:'Новый текст'}]},[])).subtopic_id).toBe(sub.id);
  await LearningSubtopicsApi.updateSubtopic(sub.id,{name:name('Подтема изменена')},null,true);
  await LearningTopicsApi.updateTopic(topic.id,{name:name('Курс изменён')},null,false);
 } finally {
  if(pageId)await LearningPagesApi.deletePage(pageId);
  if(subId)await LearningSubtopicsApi.deleteSubtopic(subId);
  await LearningTopicsApi.deleteTopic(topic.id);
 }
});

test('achievement CRUD',async()=>{
 const row=await AchievementsApi.createAchievement({name:name('Достижение'),description:'Описание',achievement_type:'points_visited',criteria_value:1,criteria_unit:'мест'},null);
 try {expect((await AchievementsApi.updateAchievement(row.id,{name:name('Изменено')},null,false)).id).toBe(row.id);}finally{await AchievementsApi.deleteAchievement(row.id);}
});

test('proposal status can change and be restored',async()=>{
 const row=(await ProposalsApi.getProposals({limit:1}))[0];
 const changed=await ProposalsApi.updateProposalStatus(row.id,{status:row.status==='approved'?'pending':'approved'});
 expect(changed.status).not.toBe(row.status);
 await ProposalsApi.updateProposalStatus(row.id,{status:row.status});
});

test('linked JSON import creates all sections through real frontend services',async()=>{
 const { buildPlan }=await import('../src/features/JsonImport/schema');
 const { BULK_TEMPLATE }=await import('../src/features/JsonImport/templates');
 const { executePlan }=await import('../src/features/JsonImport/execute');
 const source=structuredClone(BULK_TEMPLATE);
 for(const entry of source.records){if('name' in entry.data)entry.data.name=name(String(entry.data.name));}
 const results=await executePlan(buildPlan(source));
 try {
  expect(results.map(result=>({key:result.key,status:result.status,message:result.message}))).toEqual(source.records.map(entry=>({key:entry.key,status:'success',message:undefined})));
  const id=(key:string)=>results.find(result=>result.key===key)!.id!;
  const route=await RoutesApi.getRouteById(id('walk'));
  expect(route.route_category_id).toBe(id('water'));
  expect((await LearningPagesApi.getPageById(id('lesson'))).subtopic_id).toBe(id('prepare'));
 } finally {
  const remove={pages:LearningPagesApi.deletePage,subtopics:LearningSubtopicsApi.deleteSubtopic,topics:LearningTopicsApi.deleteTopic,news:NewsApi.deleteNews,routes:RoutesApi.deleteRoute,points:PointsApi.deletePoint,categories:RouteCategoriesApi.deleteRouteCategory,achievements:AchievementsApi.deleteAchievement};
  for(const result of [...results].reverse()){if(result.status==='success'){const type=source.records.find(entry=>entry.key===result.key)!.type as keyof typeof remove;await remove[type](result.id!);}}
 }
});
