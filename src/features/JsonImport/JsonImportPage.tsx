import { useEffect,useRef,useState } from 'react';
import { Button } from '../../components/ui/Button/Button';
import { Select } from '../../components/ui/Select/Select';
import { buildPlan,readJson,LABELS } from './schema';
import type { Entry,Kind } from './schema';
import { BULK_TEMPLATE,TEMPLATES } from './templates';
import { copyTemplate } from './JsonImportControl';
import { executePlan } from './execute';
import type { Result } from './execute';
import { toRequestError } from '../../utils/errors';
import './JsonImport.css';

export default function JsonImportPage(){
 const [source,setSource]=useState(''),[plan,setPlan]=useState<Entry[]>([]),[results,setResults]=useState<Result[]>([]),[error,setError]=useState(''),[message,setMessage]=useState(''),[running,setRunning]=useState(false),[template,setTemplate]=useState('all');
 const file=useRef<HTMLInputElement>(null),stop=useRef(false),mounted=useRef(true);
 const successes=results.filter(result=>result.status==='success').length;
 const failures=results.filter(result=>result.status!=='success').length;
 const locked=running||successes>0;
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;stop.current=true;};},[]);
 useEffect(()=>{if(!running)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[running]);
 const change=(text:string)=>{setSource(text);setPlan([]);setResults([]);setError('');setMessage('');};
 const check=()=>{try{const parsed=buildPlan(readJson(source));setPlan(parsed);setResults([]);setError('');setMessage(`Проверено: ${parsed.length} записей. Проверьте список ниже и запустите импорт.`);}catch(cause){setPlan([]);setError(toRequestError(cause).message);}};
 const load=async(value:File)=>{try{if(value.size>5*1024*1024)throw new Error('Максимальный размер — 5 МБ.');const text=await value.text();const parsed=buildPlan(readJson(text));change(text);setPlan(parsed);setMessage(`Файл «${value.name}»: ${parsed.length} записей готовы к проверке.`);}catch(cause){setError(toRequestError(cause).message);}};
 const copy=async()=>{let value:unknown=BULK_TEMPLATE;if(template!=='all'){const kind=template as Kind;const data={...TEMPLATES[kind],...(kind==='subtopics'?{topic_id:1}:kind==='pages'?{subtopic_id:1}:kind==='stories'?{preview_url:'https://example.com/replace-with-your-preview.jpg'}:{})};value={version:1,records:[{type:kind,key:'example',data}]};}setMessage(await copyTemplate(value,change));};
 const run=async()=>{if(running||!plan.length)return;setRunning(true);setError('');stop.current=false;setMessage('Импорт идёт. Не покидайте страницу до завершения.');try{const done=await executePlan(plan,results,value=>{if(mounted.current)setResults(value);},undefined,()=>stop.current);if(mounted.current){setResults(done);const good=done.filter(value=>value.status==='success').length;setMessage(`Создано: ${good} из ${plan.length}. ${stop.current?'Остановлено после текущей записи.':''}`);}}catch(cause){if(mounted.current)setError(toRequestError(cause).message);}finally{if(mounted.current)setRunning(false);}};
 return <div className="page-container json-import-page">
  <header className="page-header"><div className="page-header-top"><div><h2 className="page-header-title">Импорт JSON</h2><p className="json-subtitle">Добавление записей сразу в несколько разделов</p></div><span className="json-format-badge">JSON · версия 1</span></div></header>
  <div className="json-page-grid"><section className="json-editor-card"><h3>1. Файл или текст</h3><p>Загрузите файл либо вставьте JSON. Сначала проверяются поля и связи — на этом этапе база не меняется.</p>
   <div className="json-toolbar"><Button type="button" variant="outline" disabled={locked} onClick={()=>file.current?.click()}>Загрузить JSON-файл</Button><Select label="Шаблон" id="json-template-kind" options={[{value:'all',label:'Связанные записи — пример'},...Object.entries(LABELS).map(([value,label])=>({value,label}))]} value={template} disabled={locked} onChange={event=>setTemplate(event.target.value)}/><Button type="button" variant="outline" disabled={locked} onClick={()=>void copy()}>Копировать шаблон</Button></div>
   <input ref={file} type="file" accept=".json,application/json" hidden aria-label="Файл общего импорта JSON" onChange={event=>{const value=event.target.files?.[0];if(value)void load(value);event.target.value='';}}/>
   <textarea className="json-source json-source-large" aria-label="JSON для общего импорта" value={source} onChange={event=>change(event.target.value)} placeholder={'{\n  "version": 1,\n  "records": [...]\n}'} spellCheck={false} readOnly={locked}/>
   <div className="json-toolbar"><Button type="button" variant="outline" disabled={!source.trim()||locked} onClick={check}>Проверить JSON</Button>{successes>0&&!running&&<Button type="button" variant="outline" onClick={()=>change('')}>Другой файл</Button>}</div>
   {error&&<div role="alert" className="form-error">{error}</div>}{message&&<p role="status" className="json-message">{message}</p>}
  </section><aside className="json-help-card"><h3>Как связать записи</h3><p>У каждой записи есть <code>type</code>, уникальный <code>key</code> и объект <code>data</code>.</p><p>Вместо ID родителя можно указать его ключ из этого же файла. Например: <code>"topic_id": "city"</code> или <code>"points": ["river"]</code>. Порядок записей в файле не важен.</p><p>Числовые ID ссылаются на записи, которые уже существуют в базе.</p><h4>Перед импортом</h4><ul><li>Создаются новые записи. Обновления и удаления существующих здесь нет.</li><li>JSON не содержит реальные файлы изображений. Используйте доступные URL; ссылки example.com в шаблонах нужно заменить.</li><li>Для историй обязательны preview_url и хотя бы один слайд.</li><li>Предложения пользователей через этот API создавать нельзя — они не включены в импорт.</li><li>До 2000 записей и 5 МБ на файл.</li></ul><p className="json-caution">Успешные записи сохраняются сразу. При ошибке часть файла может быть уже импортирована. Повторная загрузка файла после перезагрузки страницы создаст новые записи.</p></aside></div>
  {!!plan.length&&<section className="json-plan"><div className="json-plan-header"><div><h3>2. Проверенные записи</h3><p>{plan.length} всего · {successes} создано · {failures} требуют внимания</p></div><div className="json-toolbar">{running?<Button type="button" variant="outline" onClick={()=>{stop.current=true;setMessage('Остановка после текущей записи…');}}>Остановить</Button>:<Button type="button" disabled={successes===plan.length} onClick={()=>void run()}>{successes? 'Продолжить импорт':`Создать ${plan.length} записей`}</Button>}</div></div>
   <progress className="json-progress" max={plan.length} value={successes}/><div className="table-scroll-wrapper json-plan-scroll"><table className="table-main"><thead className="table-header-row"><tr><th>Раздел</th><th>Ключ / название</th><th>Результат</th></tr></thead><tbody>{plan.map(entry=>{const result=results.find(value=>value.key===entry.key);return <tr className="table-body-row" key={entry.key}><td className="table-body-cell">{LABELS[entry.type]}</td><td className="table-body-cell"><strong>{String(entry.data.title||entry.data.name||`Страница ${entry.data.page_number||''}`)}</strong><small className="json-key">{entry.key}</small></td><td className="table-body-cell">{result?.status==='success'?<span className="status-badge status-active">Создано · ID {result.id}</span>:result?<span className="json-record-error">{result.status==='blocked'?'Ожидание родителя: ':''}{result.message}</span>:<span className="json-pending">Ожидает</span>}</td></tr>;})}</tbody></table></div>
  </section>}
 </div>;
}
