export default function (instance) {
    return {
        getWeather(nameCity) {
            return instance.get(`?q=${nameCity}`)
        },
        getLocationWeather(latitude, longitude) {
            return instance.get(`?lat=${latitude}&lon=${longitude}`)
        },
    }
}
