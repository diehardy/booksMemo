import './plugins/axios'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import axios from "axios";
loadFonts()

const API = 'http://localhost:8000/api/books/'

export const httpServer = axios.create({
  withCredentials: true,
  baseURL: API,
  headers: { "Accept-Language": "ru-RU,ru" },
});


createApp(App).use(router)
  .use(vuetify)
  .mount('#app')
