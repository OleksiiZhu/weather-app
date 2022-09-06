import {createApp} from 'vue'
import App from './App.vue'
import ApiPlugin from './plugins/api'

const app = createApp(App)

app.use(ApiPlugin);
app.mount('#app')
