import React, { useEffect, useRef, useId } from 'react';
import './Modal.css';
interface ModalProps {isOpen:boolean;onClose:()=>void;title?:string;children:React.ReactNode;footer?:React.ReactNode;size?:'sm'|'md'|'lg'|'xl'|'fullscreen';}
export const Modal:React.FC<ModalProps>=({isOpen,onClose,title,children,footer,size='md'})=>{
 const dialog=useRef<HTMLDivElement>(null);
 const heading=useId();
 const close=useRef(onClose);
 useEffect(()=>{close.current=onClose;},[onClose]);
 useEffect(()=>{
  if(!isOpen)return;
  const previous=document.activeElement as HTMLElement|null;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const focusable=()=>Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled):not([type=file]):not([type=hidden]),textarea:not(:disabled),select:not(:disabled),[tabindex="0"]')||[]).filter(el=>!el.closest('[aria-hidden="true"]'));
  (dialog.current?.querySelector<HTMLElement>('input:not(:disabled):not([type=file]):not([type=hidden])')||focusable()[0]||dialog.current)?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();close.current();}
   if(event.key==='Tab'){
    const elements=focusable(),first=elements[0],last=elements[elements.length-1];
    if(!first){event.preventDefault();return;}
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
   }
  };
  document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=overflow;previous?.focus();};
 },[isOpen]);
 if(!isOpen)return null;
 return <div className="modal-overlay">
  <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={title?heading:undefined} aria-label={title?undefined:'Диалог'} className={`modal-container modal-size-${size}`}>
   <header className="modal-header-bar"><div><span className="modal-eyebrow">РЕДАКТОР КОНТЕНТА</span>{title&&<h3 id={heading} className="modal-title">{title}</h3>}</div><button type="button" onClick={onClose} className="modal-close-button" aria-label="Закрыть"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 5 10 10M15 5 5 15"/></svg></button></header>
   <div className="modal-body">{children}</div>
   {footer&&<div className="modal-footer">{footer}</div>}
  </div>
 </div>;
};
