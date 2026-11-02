import * as React from 'react';
import { createPortal } from 'react-dom';
import './Select.css';
export interface SelectOption {value:string|number;label:string;disabled?:boolean;}
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {options:SelectOption[];label?:string;placeholder?:string;}

export const Select=React.forwardRef<HTMLSelectElement,SelectProps>(({options,label,id,placeholder,className='',value,defaultValue,disabled,onChange,...props},ref)=>{
 const generated=React.useId();const base=id||generated;
 const native=React.useRef<HTMLSelectElement>(null),trigger=React.useRef<HTMLButtonElement>(null),popup=React.useRef<HTMLDivElement>(null);
 const [internal,setInternal]=React.useState(String(defaultValue??options.find(option=>!option.disabled)?.value??''));
 const selected=String(value??internal);
 const [open,setOpen]=React.useState(false),[active,setActive]=React.useState(0);
 const [position,setPosition]=React.useState({top:0,left:0,width:0,maxHeight:240});
 const current=options.find(option=>String(option.value)===selected);
 React.useImperativeHandle(ref,()=>native.current!);
 const place=React.useCallback(()=>{
  if(!trigger.current)return;
  const rect=trigger.current.getBoundingClientRect();
  const below=window.innerHeight-rect.bottom-14,above=rect.top-14;
  const height=Math.min(260,Math.max(below>=170?below:above,100));
  setPosition({top:below>=170?rect.bottom+6:Math.max(8,rect.top-height-6),left:rect.left,width:rect.width,maxHeight:height});
 },[]);
 React.useLayoutEffect(()=>{if(open)place();},[open,place]);
 React.useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!trigger.current?.contains(event.target as Node)&&!popup.current?.contains(event.target as Node))setOpen(false);};
  const scroll=(event:Event)=>{if(!popup.current?.contains(event.target as Node))place();};
  document.addEventListener('pointerdown',outside);window.addEventListener('resize',place);window.addEventListener('scroll',scroll,true);
  return()=>{document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',place);window.removeEventListener('scroll',scroll,true);};
 },[open,place]);
 React.useEffect(()=>{if(open)document.getElementById(`${base}-option-${active}`)?.scrollIntoView?.({block:'nearest'});},[open,active,base]);
 const choose=(index:number)=>{
  const option=options[index];if(!option||option.disabled||disabled)return;
  if(native.current){native.current.value=String(option.value);native.current.dispatchEvent(new Event('change',{bubbles:true}));}
  setOpen(false);trigger.current?.focus();
 };
 const move=(delta:number)=>{
  let index=active;
  for(let step=0;step<options.length;step++){index=(index+delta+options.length)%options.length;if(!options[index].disabled){setActive(index);return;}}
 };
 const key=(event:React.KeyboardEvent<HTMLButtonElement>)=>{
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(!open){setActive(Math.max(0,options.findIndex(option=>String(option.value)===selected)));setOpen(true);}else move(event.key==='ArrowDown'?1:-1);}
  else if(event.key==='Enter'||event.key===' '){event.preventDefault();if(open)choose(active);else{setActive(Math.max(0,options.findIndex(option=>String(option.value)===selected)));setOpen(true);}}
  else if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();setOpen(false);}
  else if(event.key==='Tab')setOpen(false);
  else if(event.key.length===1){const index=options.findIndex(option=>!option.disabled&&option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));if(index>=0){setActive(index);setOpen(true);}}
 };
 return <div className={`select-wrapper ${className}`}>
  {label&&<label id={`${base}-label`} htmlFor={base} className="select-label">{label}</label>}
  <select {...props} ref={native} id={`${base}-native`} className="select-native" aria-hidden="true" tabIndex={-1} disabled={disabled} value={selected} onChange={event=>{if(value===undefined)setInternal(event.target.value);onChange?.(event);}}>
   {placeholder&&<option value="" disabled>{placeholder}</option>}
   {options.map(option=><option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
  </select>
  <button ref={trigger} id={base} type="button" className={`select-trigger ${open?'is-open':''}`} role="combobox" aria-label={props['aria-label']} aria-labelledby={label?`${base}-label`:undefined} aria-expanded={open} aria-controls={`${base}-listbox`} aria-activedescendant={open?`${base}-option-${active}`:undefined} aria-haspopup="listbox" disabled={disabled} onKeyDown={key} onClick={()=>{setActive(Math.max(0,options.findIndex(option=>String(option.value)===selected)));setOpen(!open);}}>
   <span className={current?'select-value':'select-placeholder'}>{current?.label||placeholder||'Выберите значение'}</span><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg>
  </button>
  {open&&createPortal(<div ref={popup} id={`${base}-listbox`} role="listbox" aria-label={label||placeholder||'Варианты'} className="select-popup" style={{position:'fixed',...position,zIndex:2200}}>
   {options.length?options.map((option,index)=><div key={option.value} id={`${base}-option-${index}`} role="option" aria-selected={String(option.value)===selected} aria-disabled={option.disabled||undefined} className={`select-option ${index===active?'is-focused':''}`} onPointerMove={()=>{if(!option.disabled)setActive(index);}} onMouseDown={event=>event.preventDefault()} onClick={()=>choose(index)}><span>{option.label}</span>{String(option.value)===selected&&<span className="select-check" aria-hidden="true">✓</span>}</div>):<div className="select-empty">Нет доступных вариантов</div>}
  </div>,document.body)}
 </div>;
});
Select.displayName='Select';
