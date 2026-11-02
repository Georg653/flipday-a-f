// @vitest-environment jsdom
import { describe,it,expect,vi } from 'vitest';
import { render,screen,fireEvent,waitFor,cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { readJson,validateData,buildPlan,resolveData,formFields,formBlocks } from '../src/features/JsonImport/schema';
import { BULK_TEMPLATE,TEMPLATES } from '../src/features/JsonImport/templates';
import { executePlan } from '../src/features/JsonImport/execute';
import { JsonImportControl } from '../src/features/JsonImport/JsonImportControl';
afterEach(cleanup);
describe('JSON validation and mapping',()=>{
 it('reads BOM and rejects malformed input',()=>{expect(readJson('\uFEFF{"x":1}')).toEqual({x:1});expect(()=>readJson('{')).toThrow('Неверный JSON');});
 it('checks all form templates',()=>{for(const [kind,data] of Object.entries(TEMPLATES))expect(validateData(kind as keyof typeof TEMPLATES,data,true)).toBeTruthy();});
 it('rejects wrong fields and unsafe media',()=>{expect(()=>validateData('news',{title:'x',typo:1},true)).toThrow('неизвестное поле');expect(()=>validateData('news',{preview_url:'javascript:alert(1)'},true)).toThrow();});
 it('checks required fields and coordinates',()=>{expect(()=>validateData('points',{name:'x'})).toThrow('description');expect(()=>validateData('points',{latitude:91},true)).toThrow('latitude');});
 it('sorts dependencies even when reversed',()=>{const plan=buildPlan({...BULK_TEMPLATE,records:[...BULK_TEMPLATE.records].reverse()});expect(plan.findIndex(e=>e.key==='water')).toBeLessThan(plan.findIndex(e=>e.key==='walk'));expect(plan.findIndex(e=>e.key==='city')).toBeLessThan(plan.findIndex(e=>e.key==='lesson'));});
 it('rejects missing or wrong-kind references and duplicate keys',()=>{const records=structuredClone(BULK_TEMPLATE.records);records[2].data={...records[2].data,route_category_id:'missing'};expect(()=>buildPlan({version:1,records})).toThrow('не найден');records[2].data={...records[2].data,route_category_id:'river'};expect(()=>buildPlan({version:1,records})).toThrow('должен ссылаться');expect(()=>buildPlan({version:1,records:[records[0],records[0]]})).toThrow('Повторяется');});
 it('resolves generated IDs',()=>{const route=buildPlan(BULK_TEMPLATE).find(e=>e.key==='walk')!;expect(resolveData(route,new Map([['water',14],['river',22]]))).toMatchObject({route_category_id:14,points:[22]});});
 it('normalizes timezone dates for backend',()=>{const data=validateData('stories',{expires_at:'2027-01-02T15:00:00+03:00'},true);expect(data.expires_at).toBe('2027-01-02 12:00:00');expect(formFields('stories',data).expires_at).toMatch(/^2027-01-02T/);});
 it('maps quiz answers and content without HTML execution',()=>{const data=validateData('pages',TEMPLATES.pages,true);const blocks=formBlocks(data.content);expect(blocks[2].options?.find(o=>o.id==='a')?.isCorrect).toBe(true);expect(()=>validateData('pages',{content:[{type:'test',question:'?',options:[{id:'a',text:'a'},{id:'b',text:'b'}],correct_option_id:'c'}]},true)).toThrow('correct_option_id');});
 it('maps uploaded URL fields without carrying local files',()=>{expect(formFields('news',{preview_url:'https://example.com/x.png'})).toMatchObject({preview_file:null,preview_url:'https://example.com/x.png',remove_preview:false});});
});
it('retries failed entries and blocked children without duplicating successes',async()=>{
 const plan=buildPlan(BULK_TEMPLATE);let next=100;const create=vi.fn(async(entry:{key:string})=>{if(entry.key==='city')throw Error('offline');return next++;});
 const first=await executePlan(plan,[],undefined,create);expect(first.find(e=>e.key==='prepare')?.status).toBe('blocked');
 const retry=vi.fn(async()=>next++);const done=await executePlan(plan,first,undefined,retry);expect(done.every(e=>e.status==='success')).toBe(true);expect(retry).toHaveBeenCalledTimes(3);
});
it('stops before the next record',async()=>{let stop=false;const create=vi.fn(async()=>{stop=true;return 1;});expect(await executePlan(buildPlan(BULK_TEMPLATE),[],undefined,create,()=>stop)).toHaveLength(1);});
it('fills a form only after explicit apply and reports malformed JSON',async()=>{
 const apply=vi.fn();render(<JsonImportControl kind="news" onApply={apply}/>);
 const field=screen.getByLabelText('JSON для заполнения формы');fireEvent.change(field,{target:{value:'{"title":"Новая новость"}'}});expect(apply).not.toHaveBeenCalled();fireEvent.click(screen.getByText('Заполнить форму'));await waitFor(()=>expect(apply).toHaveBeenCalledWith({title:'Новая новость'}));
 fireEvent.change(field,{target:{value:'{'}});fireEvent.click(screen.getByText('Заполнить форму'));await screen.findByRole('alert');expect(apply).toHaveBeenCalledTimes(1);
});

it('uses the same phone frame for populated and empty previews',async()=>{
 const { ContentPreview }=await import('../src/components/previews/ContentPreview/ContentPreview');
 const { StoryPreview }=await import('../src/components/previews/StoryPreview/StoryPreview');
 const view=render(<div className="admin-layout"><ContentPreview data={{content:[{type:'text',content:'<script>bad()</script>'}]}}/><StoryPreview slides={[]}/></div>);
 expect(view.container.querySelectorAll('[data-phone-size="320x660"]')).toHaveLength(2);
 expect(view.container.querySelector('script')).toBeNull();
 expect(screen.getByText('<script>bad()</script>')).toBeTruthy();
});
