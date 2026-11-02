// @vitest-environment jsdom
import React, { useState } from 'react';
import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Select } from '../src/components/ui/Select/Select';
import { ImageUpload } from '../src/components/ui/ImageUpload/ImageUpload';
import { Modal } from '../src/components/ui/Modal/Modal';

afterEach(cleanup);
const options=[{value:'all',label:'Все статусы'},{value:'true',label:'Только активные'},{value:'false',label:'Только неактивные'}];
function Filter(){const [value,setValue]=useState('all');return <Select label="Статус" id="status" value={value} options={options} onChange={event=>setValue(event.target.value)}/>;}

test('custom select changes a controlled filter through its native event',()=>{
 render(<Filter/>);
 const trigger=screen.getByRole('combobox');fireEvent.click(trigger);
 fireEvent.click(screen.getByRole('option',{name:'Только неактивные'}));
 expect(trigger.textContent).toContain('Только неактивные');expect(trigger.getAttribute('aria-expanded')).toBe('false');
});
test('custom select supports arrows and Enter',()=>{
 render(<Filter/>);const trigger=screen.getByRole('combobox');
 fireEvent.keyDown(trigger,{key:'ArrowDown'});fireEvent.keyDown(trigger,{key:'ArrowDown'});fireEvent.keyDown(trigger,{key:'Enter'});
 expect(trigger.textContent).toContain('Только активные');
});
test('Escape closes the dropdown without closing its parent modal',()=>{
 const close=vi.fn();render(<Modal isOpen onClose={close} title="Редактор"><Filter/></Modal>);
 const trigger=screen.getByRole('combobox');fireEvent.click(trigger);fireEvent.keyDown(trigger,{key:'Escape'});
 expect(screen.queryByRole('listbox')).toBeNull();expect(close).not.toHaveBeenCalled();
});
test('disabled select cannot open',()=>{
 render(<Select options={options} label="Статус" disabled/>);fireEvent.click(screen.getByRole('combobox'));
 expect(screen.queryByRole('listbox')).toBeNull();
});
test('upload normalizes stored media keys and handles a failed image',()=>{
 render(<ImageUpload id="image" name="image" previewUrl="stories/previews/example.png" onChange={vi.fn()}/>);
 const image=screen.getByRole('img') as HTMLImageElement;
 expect(image.src).toContain('/media/stories/previews/example.png');
 fireEvent.error(image);expect(screen.queryByRole('img')).toBeNull();expect(screen.getByText('Не удалось загрузить файл')).toBeTruthy();
});
test('video uploads show video rather than a broken image element',()=>{
 const {container}=render(<ImageUpload id="video" name="video" mediaType="video" previewUrl="https://example.com/clip.mp4" onChange={vi.fn()}/>);
 expect(container.querySelector('video')).toBeTruthy();expect(container.querySelector('img')).toBeNull();
});
test('modal shows a title, closes with Escape and restores overflow',()=>{
 const close=vi.fn();document.body.style.overflow='auto';
 const {unmount}=render(<Modal isOpen title="Новая история" onClose={close}><input aria-label="Название"/></Modal>);
 expect(screen.getByRole('dialog').getAttribute('aria-labelledby')).toBeTruthy();
 expect(screen.getByRole('heading',{name:'Новая история'})).toBeTruthy();fireEvent.keyDown(document,{key:'Escape'});expect(close).toHaveBeenCalledOnce();
 unmount();expect(document.body.style.overflow).toBe('auto');
});
