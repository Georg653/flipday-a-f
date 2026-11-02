import { parseUtcDate } from '../../utils/dates';
import type { ContentBlockFormData } from '../../types/common/content.types';

export const LABELS={news:'Новости',stories:'Истории',points:'Точки',routes:'Маршруты',categories:'Категории маршрутов',topics:'Темы обучения',subtopics:'Подтемы',pages:'Страницы обучения',achievements:'Достижения'} as const;
export type Kind=keyof typeof LABELS;
export type Data=Record<string,unknown>;
export interface Entry {type:Kind;key:string;data:Data;}
const fields:Record<Kind,string[]>={
 news:['title','description','content','preview_url','background_url'],
 stories:['name','is_active','expires_at','content_items','preview_url'],
 points:['name','description','latitude','longitude','is_partner','budget','image_url','content','content_data'],
 routes:['name','description','route_category_id','points','distance','estimated_time','budget','image_url'],
 categories:['name','description','image_url'],topics:['name','description','experience_points','order','image_url'],subtopics:['name','description','experience_points','order','image_url','topic_id'],pages:['page_number','content','subtopic_id'],achievements:['name','description','achievement_type','criteria_value','criteria_unit','image_url'],
};
const types=['distance','points_visited','routes_completed','topic_learned','total_topics_learned','total_subtopics_learned','point_visited','route_visited'];
export const record=(value:unknown,label='JSON'):Data=>{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error(`${label}: ожидается объект.`);return value as Data;};
const text=(value:unknown,label:string,empty=false)=>{if(typeof value!=='string'||(!empty&&!value.trim()))throw new Error(`${label}: нужна ${empty?'':'непустая '}строка.`);return value;};
const number=(value:unknown,label:string,min=0,max=Number.MAX_SAFE_INTEGER,integer=false)=>{if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))throw new Error(`${label}: ${integer?'целое ':''}число от ${min} до ${max}.`);return value;};
export function media(value:unknown,label:string,urlOnly=false):string{
 const src=text(value,label);
 if(/^https?:\/\//i.test(src)){try{const url=new URL(src);if(!url.hostname)throw Error();return src;}catch{throw new Error(`${label}: неверный URL.`);}}
 if(!urlOnly && !src.includes(':') && !src.startsWith('//') && !src.includes('..') && /^[\p{L}\p{N}_./%\- ]+$/u.test(src))return src;
 throw new Error(`${label}: используйте http/https URL${urlOnly?'':' или существующий ключ медиа'}. Локальный файл нельзя передать строкой.`);
}
function ref(value:unknown,label:string,partial:boolean){if(typeof value==='string'&&value.trim()){if(partial)throw new Error(`${label}: в форме укажите числовой ID. Ссылки по ключам доступны в общем импорте.`);return value;}return number(value,label,1,Number.MAX_SAFE_INTEGER,true);}
export function blocks(value:unknown):Data[]{
 if(!Array.isArray(value))throw new Error('content: ожидается массив блоков.');
 if(value.length>300)throw new Error('В одной записи допускается до 300 блоков.');
 return value.map((raw,index)=>{
  const b=record(raw,`Блок ${index+1}`),type=text(b.type,`Блок ${index+1}.type`);const out:Data={type};
  if(type==='text'||type==='heading'){out.content=text(b.content,`Блок ${index+1}.content`,true);if(type==='heading')out.level=number(b.level,`Блок ${index+1}.level`,1,4,true);}
  else if(['image','video','audio'].includes(type)){out.src=media(b.src,`Блок ${index+1}.src`);if(b.text!==undefined&&b.text!==null)out.text=text(b.text,'text',true);}
  else if(type==='album'||type==='slider'){if(!Array.isArray(b.src)||!b.src.length)throw new Error(`Блок ${index+1}.src: нужен непустой массив ссылок.`);out.src=b.src.map((src,i)=>media(src,`Блок ${index+1}.src[${i}]`));}
  else if(type==='test'){
   out.question=text(b.question,`Блок ${index+1}.question`);
   if(!Array.isArray(b.options)||b.options.length<2)throw new Error(`Блок ${index+1}: минимум два ответа.`);
   const options=b.options.map(raw=>{const opt=record(raw,'Ответ');return {id:text(opt.id,'Ответ.id'),text:text(opt.text,'Ответ.text')};});
   if(new Set(options.map(o=>o.id)).size!==options.length)throw new Error('ID ответов должны быть уникальными.');
   if(!options.some(o=>o.id===b.correct_option_id))throw new Error(`Блок ${index+1}: correct_option_id должен указывать на один из ответов.`);
   out.options=options;out.correct_option_id=b.correct_option_id;out.message=b.message===undefined?'':text(b.message,'message',true);
  } else throw new Error(`Блок ${index+1}: неизвестный type «${type}».`);
  return out;
 });
}
export function validateData(kind:Kind,input:unknown,partial=false):Data{
 const data=record(input),out:Data={};
 for(const key of Object.keys(data))if(!fields[kind].includes(key))throw new Error(`${LABELS[kind]}: неизвестное поле «${key}». Скопируйте шаблон.`);
 for(const [key,value] of Object.entries(data)){
  if(['content','content_items','content_data','points'].includes(key))continue;
  if(['topic_id','subtopic_id','route_category_id'].includes(key))out[key]=ref(value,key,partial);
  else if(['is_active','is_partner'].includes(key)){if(typeof value!=='boolean')throw new Error(`${key}: true или false.`);out[key]=value;}
  else if(['latitude','longitude'].includes(key))out[key]=number(value,key,key==='latitude'?-90:-180,key==='latitude'?90:180);
  else if(['budget','distance','estimated_time','experience_points','order','page_number','criteria_value'].includes(key))out[key]=number(value,key,['experience_points','page_number','criteria_value'].includes(key)?1:0,Number.MAX_SAFE_INTEGER,['estimated_time','experience_points','order','page_number','criteria_value'].includes(key));
  else if(['image_url','preview_url','background_url'].includes(key))out[key]=value===null?null:media(value,key,true);
  else if(key==='expires_at'){if(value!==null&&(typeof value!=='string'||Number.isNaN(parseUtcDate(value).getTime())))throw new Error('expires_at: ISO-дата или null.');out[key]=value===null?null:parseUtcDate(String(value)).toISOString().slice(0,19).replace('T',' ');}
  else if(key==='achievement_type'){if(!types.includes(String(value)))throw new Error('achievement_type: неизвестный тип достижения.');out[key]=value;}
  else if(value===null&&['name','description','criteria_unit'].includes(key)&&!(key==='description'&&['news','points','routes','achievements'].includes(kind)))out[key]=null;
  else out[key]=text(value,key,['description','criteria_unit'].includes(key)&&!['news','points','routes','achievements'].includes(kind));
 }
 if(data.content!==undefined)out.content=blocks(data.content);
 if(data.content_data!==undefined){if(kind!=='points')throw new Error('content_data используется для точек.');out.content_data={content:blocks(record(data.content_data).content)};}
 if(kind==='points'&&out.content){out.content_data={content:out.content};delete out.content;}
 if(data.points!==undefined){if(!Array.isArray(data.points)||!data.points.length)throw new Error('points: нужен непустой массив ID или ключей точек.');out.points=data.points.map(value=>ref(value,'points',partial));}
 if(data.content_items!==undefined){
  if(!Array.isArray(data.content_items)||!data.content_items.length)throw new Error('content_items: нужен хотя бы один слайд.');
  out.content_items=data.content_items.map((raw,i)=>{const slide=record(raw);if(!['image','video'].includes(String(slide.type)))throw new Error(`Слайд ${i+1}: type image или video.`);return {type:slide.type,content:media(slide.content,`Слайд ${i+1}.content`),duration:number(slide.duration??5,'duration',.1,3600)};});
 }
 if(!Object.keys(out).length)throw new Error('Нет полей для заполнения.');
 if(partial)return out;
 const required:Record<Kind,string[]>={news:['title','description'],stories:['preview_url','content_items'],points:['name','description','latitude','longitude'],routes:['name','description','route_category_id','points'],categories:['name'],topics:['name'],subtopics:['name','topic_id'],pages:['page_number','subtopic_id'],achievements:['name','description','achievement_type','criteria_value']};
 for(const key of required[kind])if(out[key]===undefined||out[key]===null)throw new Error(`${LABELS[kind]}: требуется ${key}.`);
 if(['topics','subtopics'].includes(kind)){out.description??=null;out.experience_points??=10;out.order??=0;out.image_url??=null;}
 if(['news','pages'].includes(kind))out.content??=[];
 if(kind==='stories'){out.name??=null;out.is_active??=true;out.expires_at??=null;}
 if(kind==='points'){out.is_partner??=false;out.budget??=0;}
 if(kind==='routes'){out.distance??=0;out.estimated_time??=0;out.budget??=0;}
 if(kind==='achievements')out.criteria_unit??='';
 return out;
}
export function readJson(source:string):unknown{
 if(new TextEncoder().encode(source).length>5*1024*1024)throw new Error('Файл должен быть не больше 5 МБ.');
 try{return JSON.parse(source.replace(/^\uFEFF/,''));}catch{throw new Error('Неверный JSON: проверьте кавычки, запятые и скобки.');}
}
function dependencies(entry:Entry):[string,Kind][]{
 const d=entry.data,result:[string,Kind][]=[];
 for(const [field,type] of [['topic_id','topics'],['subtopic_id','subtopics'],['route_category_id','categories']] as const)if(typeof d[field]==='string')result.push([d[field] as string,type]);
 if(Array.isArray(d.points))for(const point of d.points)if(typeof point==='string')result.push([point,'points']);
 return result;
}
export function buildPlan(input:unknown):Entry[]{
 const root=record(input);if(root.version!==1||!Array.isArray(root.records))throw new Error('Ожидается {"version":1,"records":[...]} — скопируйте шаблон.');
 if(!root.records.length||root.records.length>2000)throw new Error('В файле должно быть от 1 до 2000 записей.');
 const entries=root.records.map((raw,index)=>{const e=record(raw);if(typeof e.type!=='string'||!(e.type in LABELS)||!Object.prototype.hasOwnProperty.call(LABELS,e.type))throw new Error(`Запись ${index+1}: неизвестный type.`);const type=e.type as Kind;return {type,key:text(e.key,`Запись ${index+1}.key`),data:validateData(type,e.data)};});
 const map=new Map<string,Entry>();for(const entry of entries){if(map.has(entry.key))throw new Error(`Повторяется ключ «${entry.key}».`);map.set(entry.key,entry);}
 const sorted:Entry[]=[],done=new Set<string>(),visiting=new Set<string>();
 const visit=(entry:Entry)=>{if(done.has(entry.key))return;if(visiting.has(entry.key))throw new Error('Циклические ссылки в файле.');visiting.add(entry.key);for(const [key,kind] of dependencies(entry)){const parent=map.get(key);if(!parent)throw new Error(`«${entry.key}»: не найден ключ «${key}».`);if(parent.type!==kind)throw new Error(`«${entry.key}»: ключ «${key}» должен ссылаться на ${LABELS[kind]}.`);visit(parent);}visiting.delete(entry.key);done.add(entry.key);sorted.push(entry);};
 entries.forEach(visit);return sorted;
}
export function resolveData(entry:Entry,ids:Map<string,number>):Data{
 const data={...entry.data};for(const [field] of [['topic_id'],['subtopic_id'],['route_category_id']])if(typeof data[field]==='string'){const id=ids.get(data[field] as string);if(!id)throw new Error(`Родитель «${data[field]}» ещё не создан.`);data[field]=id;}
 if(Array.isArray(data.points))data.points=data.points.map(value=>{if(typeof value!=='string')return value;const id=ids.get(value);if(!id)throw new Error(`Точка «${value}» ещё не создана.`);return id;});return data;
}
export function formBlocks(value:unknown):ContentBlockFormData[]{return blocks(value).map(block=>{
 const form:ContentBlockFormData={id:crypto.randomUUID(),type:block.type as ContentBlockFormData['type'],file:null};
 for(const key of ['level','content','question','message','text'] as const)if(block[key]!==undefined)Object.assign(form,{[key]:block[key]});
 if(block.type==='album'||block.type==='slider')form.items=(block.src as string[]).map(url=>({id:crypto.randomUUID(),url,file:null,preview:url}));
 else if(typeof block.src==='string')form.src=block.src;
 if(block.type==='test')form.options=(block.options as {id:string;text:string}[]).map(option=>({...option,isCorrect:option.id===block.correct_option_id}));return form;
});}
export const externalMedia=(value:string|null|undefined)=>value&&/^https?:\/\//i.test(value)?value:undefined;
export function formFields(kind:Kind,data:Data):Data{
 const form:Data={};for(const key of ['title','name','description','criteria_unit','achievement_type','is_active','is_partner'])if(data[key]!==undefined)form[key]=data[key]??'';
 for(const key of ['latitude','longitude','budget','distance','estimated_time','criteria_value','order','experience_points','topic_id','subtopic_id','page_number'])if(data[key]!==undefined)form[key]=String(data[key]);
 if(data.image_url!==undefined){Object.assign(form,{image_url:data.image_url,image_local_url:data.image_url,image_preview_url:data.image_url,image_file:null,remove_image:false});}
 for(const field of ['preview','background'])if(data[`${field}_url`]!==undefined)Object.assign(form,{[`${field}_url`]:data[`${field}_url`],[`${field}_file`]:null,[`remove_${field}`]:false,...(field==='preview'?{preview_local_url:data.preview_url}:{})});
 if(data.content!==undefined)form.content=formBlocks(data.content);
 if(data.content_data!==undefined){form.content=formBlocks(record(data.content_data).content);form.manageContent=true;}
 if(data.content_items!==undefined)form.content_items=(data.content_items as Data[]).map(item=>({id:crypto.randomUUID(),type:item.type,duration:String(item.duration),content_url:item.content,content_file:null,content_preview:item.content}));
 if(kind==='stories'&&data.expires_at!==undefined){const date=data.expires_at?parseUtcDate(String(data.expires_at)):null;form.expires_at=date?new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16):'';}
 return form;
}
