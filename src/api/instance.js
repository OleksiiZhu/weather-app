import axios from "axios";
import { appIdInterceptor } from '@/api/interceptors'

const instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/weather',
    headers: {
        'accept': 'application/json'
    }
})

instance.interceptors.request.use(appIdInterceptor)

export default instance
