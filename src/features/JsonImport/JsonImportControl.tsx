import { useRef,useState } from 'react';
import { Button } from '../../components/ui/Button/Button';
import { readJson,record,validateData,LABELS } from './schema';
import type { Kind,Data } from './schema';
import { TEMPLATES } from './templates';
import { toRequestError } from '../../utils/errors';
import './JsonImport.css';

export async function copyTemplate(value:unknown,show:(text:string)=>void):Promise<string>{
 const text=JSON.stringify(value,null,2);
 try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);return 'Шаблон скопирован.';}
 catch{show(text);return 'Шаблон выведен в поле. Выделите его и нажмите Ctrl+C.';}
}
export const JsonImportControl=({kind,onApply,disabled=false}:{kind:Kind;onApply:(data:Data)=>void|Promise<void>;disabled?:boolean})=>{
 const [text,setText]=useState(''),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);const file=useRef<HTMLInputElement>(null);
 const load=async(value:File)=>{try{if(value.size>5*1024*1024)throw new Error('Файл должен быть не больше 5 МБ.');const source=await value.text();const parsed=record(readJson(source));validateData(kind,parsed,true);setText(source);setError('');setMessage('Файл прочитан. Нажмите «Заполнить форму», чтобы применить данные.');}catch(cause){setError(toRequestError(cause).message);}};
 const apply=async()=>{setError('');setMessage('');setBusy(true);try{await onApply(validateData(kind,readJson(text),true));setMessage('Поля формы заполнены. Проверьте их и нажмите обычную кнопку сохранения.');}catch(cause){setError(toRequestError(cause).message);}finally{setBusy(false);}};
 return <details className="json-import-control"><summary>Заполнить из JSON <span>файл или текст</span></summary><div className="json-import-body">
  <p>Раздел: {LABELS[kind]}. Заполняет форму без отправки на сервер. Файлы изображений выбираются отдельно; в JSON можно указать ссылки.</p>
  <div className="json-toolbar"><Button type="button" variant="outline" size="sm" disabled={disabled||busy} onClick={()=>file.current?.click()}>Загрузить JSON</Button><Button type="button" variant="outline" size="sm" onClick={async()=>setMessage(await copyTemplate(TEMPLATES[kind],setText))}>Копировать шаблон</Button></div>
  <input ref={file} type="file" accept=".json,application/json" hidden aria-label="Файл JSON для формы" onChange={event=>{const value=event.target.files?.[0];if(value)void load(value);event.target.value='';}}/>
  <textarea className="json-source" aria-label="JSON для заполнения формы" placeholder="Вставьте JSON из шаблона" value={text} onChange={event=>{setText(event.target.value);setError('');setMessage('');}} spellCheck={false}/>
  {error&&<div role="alert" className="form-error">{error}</div>}{message&&<p role="status" className="json-message">{message}</p>}
  <Button type="button" variant="outline" size="sm" disabled={!text.trim()||disabled||busy} onClick={()=>void apply()}>{busy?'Проверка…':'Заполнить форму'}</Button>
 </div></details>;
};
