import './plugins/axios'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@mdi/font/css/materialdesignicons.min.css';
import router from './router'
import axios from "axios";
// import { createI18n } from 'vue-i18n'

loadFonts()

const API = 'https://dailyguidetips.com/api/books/'
const authAPI = 'https://dailyguidetips.com.190/api/auth/'

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


// const i18n = createI18n({
//   locale: 'ru',
//   fallbackLocale: 'en',
//   messages: {
//     en: {
//       title: {
//         projectName: 'Books memo'
//       },
//     },
//     ru: {
//       title: {
//         projectName: 'Books memo'
//       }
//     }
//   }
// })


createApp(App).use(router)
  .use(vuetify)
  .mount('#app')

// .use(i18n)