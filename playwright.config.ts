import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./e2e',workers:1,use:{baseURL:'http://127.0.0.1:5174',viewport:{width:1440,height:1000},headless:true,launchOptions:{executablePath:process.env.ADMIN_CHROMIUM || undefined}},reporter:'list',timeout:45000});
