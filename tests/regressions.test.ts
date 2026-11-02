// @vitest-environment jsdom
function fixture<T>(value: unknown): T { return value as T; }
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { serializeContent } from '../src/features/ContentEditor/serializeContent';
import { getList } from '../src/services/admin/api/list';
import client from '../src/services/admin/api/axios';
import { NewsApi } from '../src/services/admin/News/newsApi';
import { useNewsForm } from '../src/hooks/admin/News/useNewsForm';
import { useLearningPagesManagement } from '../src/hooks/admin/LearningPagesManagement/useLearningPagesManagement';
import { useLearningSubtopicsManagement } from '../src/hooks/admin/LearningSubtopicsManagement/useLearningSubtopicsManagement';
import { usePointsManagement } from '../src/hooks/admin/Points/usePointsManagement';
import { LearningTopicsApi } from '../src/services/admin/LearningTopics/learningTopicsApi';
import { LearningSubtopicsApi } from '../src/services/admin/LearningSubtopics/learningSubtopicsApi';
import { LearningPagesApi } from '../src/services/admin/LearningPages/learningPagesApi';
import { PointsApi } from '../src/services/admin/Points/pointsApi';
import { RoutesApi } from '../src/services/admin/Routes/routesApi';
import { StoriesApi } from '../src/services/admin/Stories/storiesApi';
import { ProposalsApi } from '../src/services/admin/Proposals/proposalsApi';
import { parseUtcDate } from '../src/utils/dates';

import { usePointForm } from '../src/hooks/admin/Points/usePointForm';
import { useAchievementForm } from '../src/hooks/admin/AchievementsManagement/useAchievementForm';
import { useStoryForm } from '../src/hooks/admin/Stories/useStoryForm';
import { useRegisterForm } from '../src/hooks/admin/Auth/useRegisterForm';
import { AuthApi } from '../src/services/admin/Auth/authApi';
import { AchievementsApi } from '../src/services/admin/Achievements/achievementsApi';
beforeEach(() => { cleanup(); vi.restoreAllMocks(); });
const event = fixture({ preventDefault: vi.fn() });
const change = (name: string, value: string) => fixture(({ target: { name, value } }));

describe('admin regressions', () => {
 it('keeps upload order and stored album media', () => {
  const a = new File(['a'], 'a.png'); const b = new File(['b'], 'b.png');
  const result = serializeContent([
   { id: '1', type: 'image', src: 'old/key' },
   { id: '2', type: 'album', items: [{id:'a',url:'old/album',file:null,preview:null},{id:'b',url:null,file:a,preview:null}] },
   { id: '3', type: 'audio', file:b },
  ]);
  expect(result.files).toEqual([a,b]);
  expect(result.content.map(b => 'src' in b ? b.src : null)).toEqual(['old/key',['old/album',''],'']);
 });
 it('rejects media without a file instead of leaving submitting stuck', () => {
  expect(() => serializeContent([{id:'1',type:'image'}])).toThrow();
 });
 it('paginates a 1000 item selector in server-safe chunks', async () => {
  const spy=vi.spyOn(client,'get').mockImplementation(async (url) => {
   const q=new URL(String(url),'https://example.test').searchParams;
   const offset=Number(q.get('offset')),limit=Number(q.get('limit'));
   expect(limit).toBeLessThanOrEqual(200);
   return fixture({data:Array.from({length:Math.max(0,Math.min(limit,425-offset))},(_,i)=>({id:offset+i}))});
  });
  expect(await getList('points/',{limit:1000})).toHaveLength(425);
  expect(spy).toHaveBeenCalledTimes(3);
 });
 it('retains false filters and offsets and rejects malformed lists', async () => {
  const spy=vi.spyOn(client,'get').mockResolvedValue(fixture({data:[]}));
  await getList('stories/',{is_active:false,limit:10,offset:20});
  expect(spy.mock.calls[0][0]).toContain('is_active=false');
  expect(spy.mock.calls[0][0]).toContain('offset=20');
  spy.mockResolvedValue(fixture({data:{detail:'error'}}));
  await expect(getList('stories/')).rejects.toThrow();
 });
 it('submits a new news item and calls success', async () => {
  const saved={id:1}; const create=vi.spyOn(NewsApi,'createNews').mockResolvedValue(fixture(saved));
  const success=vi.fn(); const {result}=renderHook(()=>useNewsForm({newsToEdit:null,onSuccess:success}));
  act(()=>{result.current.handleChange(change('title','Новость')); result.current.handleChange(change('description','Описание'));});
  await act(async()=>result.current.handleSubmit(event));
  expect(create).toHaveBeenCalledWith(expect.objectContaining({title:'Новость'}),null,null,[]);
  expect(success).toHaveBeenCalledWith(saved);
  expect(result.current.isSubmitting).toBe(false);
 });
 it('reports news API validation failure and permits retry', async () => {
  vi.spyOn(NewsApi,'createNews').mockRejectedValue({response:{data:{detail:[{msg:'duplicate'}]}}});
  const {result}=renderHook(()=>useNewsForm({newsToEdit:null,onSuccess:vi.fn()}));
  act(()=>{result.current.handleChange(change('title','N'));result.current.handleChange(change('description','D'));});
  await act(async()=>result.current.handleSubmit(event));
  expect(result.current.formError).toContain('duplicate'); expect(result.current.isSubmitting).toBe(false);
 });
 it('pages forward and back in learning pages',async()=>{
  vi.spyOn(LearningTopicsApi,'getTopics').mockResolvedValue(fixture([{id:1,name:'Topic'}]));
  vi.spyOn(LearningSubtopicsApi,'getSubtopicsByTopicId').mockResolvedValue(fixture([{id:2,name:'Subtopic'}]));
  const spy=vi.spyOn(LearningPagesApi,'getPagesBySubtopicId').mockResolvedValue(fixture(Array.from({length:10},(_,id)=>({id}))));
  const {result}=renderHook(()=>useLearningPagesManagement());
  await waitFor(()=>expect(result.current.canGoNext).toBe(true));
  act(()=>result.current.handleNextPage());
  await waitFor(()=>expect(spy).toHaveBeenLastCalledWith(2,{limit:10,offset:10}));
  expect(result.current.currentPage).toBe(2);
  act(()=>result.current.handlePreviousPage());
  await waitFor(()=>expect(spy).toHaveBeenLastCalledWith(2,{limit:10,offset:0}));
 });
 it('returns from second subtopic page to the first',async()=>{
  vi.spyOn(LearningSubtopicsApi,'getAllTopics').mockResolvedValue(fixture([{id:1,name:'Topic'}]));
  const spy=vi.spyOn(LearningSubtopicsApi,'getSubtopicsByTopicId').mockResolvedValue(fixture(Array.from({length:10},(_,id)=>({id}))));
  const {result}=renderHook(()=>useLearningSubtopicsManagement());
  await waitFor(()=>expect(result.current.canGoNext).toBe(true));
  act(()=>result.current.handleNextPage());
  await waitFor(()=>expect(spy).toHaveBeenLastCalledWith(1,{limit:10,offset:10}));
  act(()=>result.current.handlePreviousPage());
  await waitFor(()=>expect(spy).toHaveBeenLastCalledWith(1,{limit:10,offset:0}));
 });
 it('reloads points after creating a record',async()=>{
  const spy=vi.spyOn(PointsApi,'getPoints').mockResolvedValue([]);
  const {result}=renderHook(()=>usePointsManagement());
  await waitFor(()=>expect(result.current.loading).toBe(false));
  spy.mockResolvedValue(fixture([{id:3,name:'New'}]));
  act(()=>result.current.handleFormSuccess(fixture({id:3})));
  await waitFor(()=>expect(result.current.points[0]?.id).toBe(3));
 });
 it('sends route image removal as a form field',async()=>{
  const spy=vi.spyOn(client,'put').mockResolvedValue(fixture({data:{id:1}}));
  await RoutesApi.updateRoute(1,fixture({}),null,true);
  expect((spy.mock.calls[0][1] as FormData).get('remove_image')).toBe('true');
 });
 it('status toggles preserve story data by sending only the status',async()=>{
  const spy=vi.spyOn(client,'put').mockResolvedValue(fixture({data:{id:1}}));
  await StoriesApi.updateStoryStatus(fixture({id:1}),false);
  expect(JSON.parse((spy.mock.calls[0][1] as FormData).get('story_data_json') as string)).toEqual({is_active:false});
 });
 it('uses the proposal status route with a separating slash',async()=>{
  const spy=vi.spyOn(client,'patch').mockResolvedValue(fixture({data:{}}));
  await ProposalsApi.updateProposalStatus('test',fixture({}));
  expect(spy.mock.calls[0][0]).toBe('proposals/test/status');
 });
 it('accepts UTC dates with and without an existing zone suffix',()=>{
  expect(parseUtcDate('2026-11-01 12:00:00').toISOString()).toBe('2026-11-01T12:00:00.000Z');
  expect(parseUtcDate('2026-11-01T15:00:00+03:00').toISOString()).toBe('2026-11-01T12:00:00.000Z');
 });
});

// Additional form regressions discovered while preparing the independent release.

describe('form validation and checkboxes', () => {
 it('creates a point in one call with its content', async () => {
  const create = vi.spyOn(PointsApi, 'createPoint').mockResolvedValue(fixture({id: 5}));
  const update = vi.spyOn(PointsApi, 'updatePoint');
  const success = vi.fn();
  const {result} = renderHook(() => usePointForm({pointToEdit: null, onSuccess: success}));
  act(() => {
   for (const [name, value] of Object.entries({name: 'Place', description: 'D', latitude: '53.9', longitude: '27.5'})) result.current.handleChange(change(name, value));
   result.current.handleChange({target: {name: 'manageContent', value: true, type: 'checkbox'}});
   result.current.addBlock('text');
  });
  act(() => result.current.updateBlock(result.current.formData.content[0].id, {content: 'Hello'}));
  await act(async () => result.current.handleSubmit(fixture(event)));
  expect(create).toHaveBeenCalledWith(expect.objectContaining({content_data: {content: [{type:'text', content:'Hello'}]}}), null, []);
  expect(update).not.toHaveBeenCalled();
  expect(success).toHaveBeenCalled();
 });
 it('rejects invalid point coordinates and allows correction', async () => {
  const create = vi.spyOn(PointsApi, 'createPoint');
  const {result} = renderHook(() => usePointForm({pointToEdit: null, onSuccess: vi.fn()}));
  act(() => { for (const [name,value] of Object.entries({name:'P',description:'D',latitude:'100',longitude:'20'})) result.current.handleChange(change(name,value)); });
  await act(async () => result.current.handleSubmit(fixture(event)));
  expect(create).not.toHaveBeenCalled(); expect(result.current.formError).toContain('координаты'); expect(result.current.isSubmitting).toBe(false);
 });
 it('sets achievement image removal as a boolean', () => {
  const {result} = renderHook(() => useAchievementForm({achievementToEdit:null,onSuccess:vi.fn()}));
  act(() => result.current.handleRemoveImage(true));
  expect(result.current.formData.remove_image).toBe(true);
 });
 it('rejects a fractional achievement criterion before the API', async () => {
  const create = vi.spyOn(AchievementsApi, 'createAchievement');
  const {result} = renderHook(() => useAchievementForm({achievementToEdit:null,onSuccess:vi.fn()}));
  act(() => result.current.handleChange(change('criteria_value','1.5')));
  await act(async () => result.current.handleSubmit(fixture(event)));
  expect(create).not.toHaveBeenCalled(); expect(result.current.formError).toContain('целым');
 });
 it('changes story activity with an actual boolean', () => {
  const {result} = renderHook(() => useStoryForm({storyToEdit:null,onSuccess:vi.fn()}));
  act(() => result.current.handleActiveChange(false));
  expect(result.current.formData.is_active).toBe(false);
 });
 it('displays registration success as text when the API returns tokens', async () => {
  vi.spyOn(AuthApi,'register').mockResolvedValue({access_token:'token',refresh_token:'refresh',token_type:'bearer'});
  const success=vi.fn(); const {result}=renderHook(() => useRegisterForm({onSuccess:success}));
  act(() => {for(const [name,value] of Object.entries({name:'Name',email:'new@example.com',password:'test-password'})) result.current.handleChange(change(name,value));});
  await act(async () => result.current.handleSubmit(fixture(event)));
  expect(typeof result.current.successMessage).toBe('string'); expect(success).toHaveBeenCalledWith(expect.any(String));
 });
 it('normalizes route point IDs into objects for the route editor', async () => {
  vi.spyOn(client,'get').mockResolvedValue({data:[fixture({id:1,points:[7],name:'Route'})]});
  vi.spyOn(PointsApi,'getPoints').mockResolvedValue([fixture({id:7,name:'Place'})]);
  const routes = await RoutesApi.getRoutes({limit:10});
  expect(routes[0].points[0]).toEqual({id:7,name:'Place'});
 });
});

describe('real Axios serialization', () => {
 it('sends story status as FormData rather than JSON', async () => {
  let sent: unknown;
  let contentType: unknown;
  const original=client.defaults.adapter;
  client.defaults.adapter=async config => { sent=config.data; contentType=config.headers.get('Content-Type'); return {data:{id:1,is_active:false}, status:200,statusText:'OK',headers:{},config}; };
  try {
   await StoriesApi.updateStoryStatus(fixture({id:1}), false);
   expect(sent).toBeInstanceOf(FormData);
   expect(String(contentType)).not.toContain('application/json');
   expect(JSON.parse((sent as FormData).get('story_data_json') as string)).toEqual({is_active:false});
  } finally {client.defaults.adapter=original;}
 });
});
