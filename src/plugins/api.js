import api from '../api/index'

export default {
    install(app) {
        app.config.globalProperties.$ApiWeather = api;
        app.provide('api', api);
    }
}
