import './plugins/axios'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@mdi/font/css/materialdesignicons.min.css';
import router from './router'
import axios from "axios";
loadFonts()

const API = 'http://localhost:8000/api/books/'
const authAPI = 'http://localhost:8000/api/auth/'

export const httpServer = axios.create({
  withCredentials: true,
  baseURL: API,
  headers: { "Accept-Language": "ru-RU,ru" },
});

export const authServer = axios.create({
  withCredentials: true,
  baseURL: authAPI,
  headers: { "Accept-Language": "ru-RU,ru" },
});




createApp(App).use(router)
  .use(vuetify)
  .mount('#app')
