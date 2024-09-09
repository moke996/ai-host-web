

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 导入路由


import ElementPlus from 'element-plus'; // 导入 Element Plus
import 'element-plus/dist/index.css';

const app = createApp(App);


app.use(ElementPlus); // 使用 Element Plus
app.use(router); // 使用路由

app.mount('#app');


// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')