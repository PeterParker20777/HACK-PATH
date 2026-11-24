import {db} from './supabase.js';
const {data:{session}}=await db.auth.getSession();
if(session){const link=document.querySelector('#loginButton');link.href='dashboard.html';const label=link.querySelector('[data-en]');label.dataset.en='MY COURSES';label.dataset.ar='كورساتي';label.textContent=label.dataset[document.documentElement.lang]||label.dataset.en;}
