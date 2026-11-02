import { test, expect } from '@playwright/test';

test.beforeAll(async ({request}) => {
 const marker=await request.get((process.env.E2E_API_ORIGIN || 'http://127.0.0.1:8013')+'/__test_fixture__');
 expect(marker.ok()).toBeTruthy();
 expect((await marker.json()).test_fixture).toBe(true);
});

test.beforeEach(async ({page}) => {
 await page.goto('/login');
 await page.getByLabel('Email',{exact:true}).fill('admin@example.com');
 await page.getByLabel('Пароль',{exact:true}).fill('Test-only-password');
 await page.getByRole('button',{name:'Войти',exact:true}).click();
 await expect(page).toHaveURL(/admin\/achievements/);
});

test('story status toggles twice through real HTTP multipart and remains after reload', async ({page}) => {
 await page.goto('/admin/stories');
 const checkbox=page.locator('tbody input[type=checkbox]').first();
 const original=await checkbox.isChecked();
 const response=page.waitForResponse(r=>r.request().method()==='PUT' && /stories\/\d+$/.test(r.url()));
 await checkbox.click();
 expect((await response).status()).toBe(200);
 await expect(checkbox).toBeChecked({checked:!original});
 await expect(page.locator('.story-preview-container')).toHaveCount(0);
 await page.reload();
 await expect(checkbox).toBeChecked({checked:!original});
 await checkbox.click();
 await expect(checkbox).toBeChecked({checked:original});
 await expect(page.getByRole('alert')).toHaveCount(0);
});

test('all ten admin tables render real API data', async ({page}) => {
 for(const section of ['achievements','news','stories','proposals','route-categories','points','routes','topics','learning-subtopics','learning-pages']){
  await page.goto('/admin/'+section);
  await expect(page.locator('tbody tr').first()).toBeVisible();
  await expect(page.locator('.page-header-title')).not.toBeEmpty();
 }
});

test('failed story toggle keeps table visible and restores checkbox', async ({page}) => {
 await page.goto('/admin/stories');
 const checkbox=page.locator('tbody input[type=checkbox]').first();
 const original=await checkbox.isChecked();
 await page.route('**/stories/*',async route => {
  if(route.request().method()==='PUT') return route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({detail:'Проверочная ошибка валидации'})});
  return route.continue();
 });
 await checkbox.click();
 await expect(page.getByRole('alert')).toContainText('Проверочная ошибка валидации');
 await expect(page.locator('tbody tr').first()).toBeVisible();
 await expect(checkbox).toBeChecked({checked:original});
});

test('dark workspace and light application preview remain separate',async({page})=>{
 await page.goto('/admin/news');
 await page.locator('tbody tr').first().click();
 const preview=page.locator('.content-preview-container');
 await expect(preview).toBeVisible();
 expect(await preview.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(247, 250, 253)');
 expect(await page.locator('.admin-layout').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(7, 7, 8)');
 await page.screenshot({path:process.env.ADMIN_SCREENSHOT || 'test-results/admin-dark-preview.png',fullPage:true});
});

test('news create, edit and delete using the actual form',async({page})=>{
 await page.goto('/admin/news');
 await page.getByRole('button',{name:'Добавить новость',exact:true}).click();
 const title='Браузерная новость '+Date.now();
 await page.locator('#title').fill(title);
 await page.locator('#description').fill('Проверка сохранения через настоящий интерфейс.');
 let response=page.waitForResponse(r=>r.request().method()==='POST' && r.url().endsWith('/news/'));
 await page.getByRole('button',{name:'Сохранить новость',exact:true}).click();
 expect((await response).status()).toBe(201);
 const row=page.locator('tbody tr').filter({hasText:title});
 await expect(row).toBeVisible();
 await row.getByRole('button',{name:'Ред.',exact:true}).click();
 await page.locator('#description').fill('Описание после редактирования.');
 response=page.waitForResponse(r=>r.request().method()==='PUT' && /news\/\d+$/.test(r.url()));
 await page.getByRole('button',{name:'Сохранить новость',exact:true}).click();
 expect((await response).status()).toBe(200);
 page.once('dialog',dialog=>dialog.accept());
 response=page.waitForResponse(r=>r.request().method()==='DELETE' && /news\/\d+$/.test(r.url()));
 await row.getByRole('button',{name:'Удал.',exact:true}).click();
 expect((await response).status()).toBe(204);
 await expect(row).toHaveCount(0);
});

test('edit and delete workflows for points, routes, learning and achievements',async({page})=>{
 for(const section of ['achievements','points','routes','learning-pages','learning-subtopics','topics']){
  await page.goto('/admin/'+section);
  const row=page.locator('tbody tr').first();
  await expect(row).toBeVisible();
  await row.getByRole('button',{name:'Ред.',exact:true}).click();
  const save=page.locator('form button[type=submit]').first();
  await expect(save).toBeEnabled();
  const response=page.waitForResponse(r=>r.request().method()==='PUT');
  await save.click();
  expect((await response).status(),section+' update').toBe(200);
  await expect(save).toHaveCount(0);
  page.once('dialog',dialog=>dialog.accept());
  const deletion=page.waitForResponse(r=>r.request().method()==='DELETE');
  await page.locator('tbody tr').first().getByRole('button',{name:'Удал.',exact:true}).click();
  expect((await deletion).status(),section+' delete').toBe(204);
 }
});
