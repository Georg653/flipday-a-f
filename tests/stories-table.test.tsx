// @vitest-environment jsdom
import React from 'react';
import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { StoriesTable } from '../src/components/admin/StoriesManagement/StoriesTable';
import type { Story } from '../src/types/admin/Stories/story.types';

afterEach(cleanup);
const story:Story={id:1,name:'Прогулка по городу',is_active:true,preview:'',expires_at:null,content_items:[],views:0,created_at:'2026-11-01T12:00:00',viewed:false};
const defaults={stories:[story],isLoading:false,error:null,onEdit:vi.fn(),onDelete:vi.fn(),onToggleStatus:vi.fn(),onPreview:vi.fn(),currentPage:1,handlePreviousPage:vi.fn(),handleNextPage:vi.fn(),canGoNext:false,canGoPrevious:false};

test('status checkbox does not open preview',()=>{
 const onToggleStatus=vi.fn(),onPreview=vi.fn();
 render(<StoriesTable {...defaults} onToggleStatus={onToggleStatus} onPreview={onPreview}/>);
 fireEvent.click(screen.getByRole('checkbox'));
 expect(onToggleStatus).toHaveBeenCalledWith(story);expect(onPreview).not.toHaveBeenCalled();
});
test('an action error leaves story rows and controls visible',()=>{
 render(<StoriesTable {...defaults} error="Ошибка запроса 422"/>);
 expect(screen.getByRole('alert').textContent).toContain('422');
 expect(screen.getByText(story.name!)).toBeTruthy();expect(screen.getByRole('checkbox')).toBeTruthy();
});
test('an in-flight status request disables the checkbox',()=>{
 render(<StoriesTable {...defaults} updatingIds={[1]}/>);
 expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBe(true);
});
