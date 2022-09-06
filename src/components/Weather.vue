<template>
  <div class="loading" v-if="loading">
    <LoadingWeather/>
  </div>
  <div class="weather" v-else>
    <div class="weather-main" v-if="!error && townWeather">
      <div class="weather-main__date">
        <input @keyup.enter="manualRefresh" v-model="cityName">
        <h2>{{ dateString }}</h2>
        <h2>{{ timeString }}</h2>
        <button type="button" class="weather-main__refresh" @click="manualRefresh">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
      <div class="weather-main__icon">
        <img class="iconAnimation" alt="cloud" :src="require(`@/assets/iconWeather/${weatherIcon}.svg`)">
      </div>
      <div class="weather-main__temp">
        <h2>{{ weatherDescription }}</h2>
        <div class="temp">
          <img alt="thermometer" src="@/assets/thermometer.svg">
          <p>{{ showCelsius ? tempCelsius : tempFahrenheit }}</p>
          <div class="weather-main__temp-units">
            <div>
              <input
                hidden
                type="radio"
                name="units"
                id="celsius"
                :value="true"
                v-model="showCelsius"
              >
              <label for="celsius">℃</label>
            </div>
            <div>
              <input
                hidden
                type="radio"
                name="units"
                id="fahrenheits"
                :value="false"
                v-model="showCelsius"
              >
              <label for="fahrenheits">℉</label>
            </div>
          </div>
        </div>
      </div>
      <div class="weather-main__info">
        <div>
          <img src="@/assets/compass.svg" alt="compass">
          <h2>{{ visibility }}km</h2>
        </div>
        <div>
          <img src="@/assets/cloudy.svg" alt="cloudy">
          <h2>{{ pressure }}hPa</h2>
        </div>
        <div>
          <img src="@/assets/rain.svg" alt="rain">
          <h2>{{ humidity }}%</h2>
        </div>
      </div>
    </div>
    <div class="weather-main__error" v-else>
      <img alt="tornado" src="@/assets/tornado.svg">
      <h2>Something went wrong!</h2>
      <h5>Sorry! Something went wrong! Please try again </h5>
      <button @click="manualRefresh">TRY AGAIN</button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import LoadingWeather from "./LoadingWeather"
import { useWeather } from '@/composables/useWeather'

const updateWeatherTime = 300000

export default {
  name: 'Weather',
  components: {
    LoadingWeather,
  },
  setup() {
    const cityName = ref('');
    const dateNow = ref(new Date())
    const dateString = computed(() => dateNow.value.toDateString())
    const timeString = computed(() => dateNow.value.toLocaleTimeString())
    const showCelsius = ref(true);

    const {
      data: townWeather,
      loading,
      error,
      getWeather,
      getWeatherByLocation
    } = useWeather()

    const tempCelsius = computed(() => `${Math.trunc(townWeather.value?.main.temp - 273.15)}`);
    const tempFahrenheit = computed(() => `${Math.trunc(((townWeather.value?.main.temp - 273.15) * 1.8) + 32)}`);
    const weatherDescription = computed(() => townWeather.value.weather[0].description.toUpperCase());
    const visibility = computed(() => Math.trunc(townWeather.value.visibility / 1000));
    const weatherIcon = computed(() => townWeather.value.weather[0].icon);
    const pressure = computed(() => townWeather.value.main.pressure);
    const humidity = computed(() => townWeather.value.main.humidity);

    const getLocation = () => navigator.geolocation.getCurrentPosition(getWeatherByLocation);
    const getCityWeather = () => getWeather(cityName.value)

    const clockInterval = ref(null)
    const weatherInterval = ref(null)

    const printTime = () => {
      clockInterval.value = setInterval(() => {
        dateNow.value = new Date();
      }, 1000)
    }

    const updateWeather = () => {
      if (!cityName.value) {
        getLocation()
      } else {
        getCityWeather()
      }
      weatherInterval.value = setInterval(() => {
        getCityWeather()
      }, updateWeatherTime)
    }

    const manualRefresh = () => {
      clearInterval(weatherInterval.value)
      weatherInterval.value = null
      updateWeather()
    }

    watch(townWeather, (value) => {
      cityName.value = value.name
    })

    onMounted(() => {
      getLocation();
      printTime();
      setTimeout(updateWeather, updateWeatherTime)
    })

    onUnmounted(() => {
      clearInterval(clockInterval.value)
      clearInterval(weatherInterval.value)
      clockInterval.value = null
      weatherInterval.value = null
    })

    return {
      cityName,
      manualRefresh,
      townWeather,
      error,
      loading,
      dateString,
      timeString,
      showCelsius,
      tempCelsius,
      tempFahrenheit,
      weatherIcon,
      weatherDescription,
      visibility,
      pressure,
      humidity
    }
  }
}
</script>
<style scoped>

h1 {
  color: var(--title-color);
}

.weather {
  display: flex;
  justify-content: center;
}

.weather-main {
  margin: auto;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
}

.temp {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
}

.temp p {
  font-size: 55px;
  margin: 0 10px 0 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.weather-main__info {
  display: flex;
  justify-content: space-evenly;
}

.weather-main__icon img {
  width: 150px;
  height: 150px;
}

.weather-main__temp {
  margin: 20px 0 20px 0;
}

.weather-main__temp img {
  margin: 0;
  width: 70px;
  height: 70px;
}

.weather-main__temp-units {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
}

.weather-main__temp-units label {
  display: block;
  font-size: 16px;
  padding: 0.25em;
  cursor: pointer;
  opacity: 0.7;
  transition: var(--transition-duration);
  border-radius: 0.25em;
}

.weather-main__temp-units label:hover {
  background: var(--hover-bg-color);
}

.weather-main__temp-units input:checked ~ label {
  font-weight: bold;
  cursor: default;
  opacity: 1;
}

.weather-main__temp-units input:checked ~ label:hover {
  background: transparent;
}

.weather-main__info img {
  width: 70px;
  height: 70px;
}

.weather-main__info h1 {
  margin: 0 0 20px;
}

.weather-main__error {
  padding: 50px 15px 0 15px;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
}

.weather-main__error h2, h5 {
  margin: 5px 0 0 0;
  color: var(--title-color);
}

.weather-main__error button {
  color: var(--error-color);
  font-size: 20px;
  margin: 100px auto 20px;
}

.weather-main__error button:hover {
  color: var(--error-hover-color);
  background: var(--hover-bg-color);
}

.weather-main__error img {
  width: 150px;
  height: 150px;
  padding: 0 0 40px 0;
}

.weather-main__date {
  position: relative;
}

.weather-main__refresh {
  padding: 8px;
  position: absolute;
  top: 6px;
  right: 8px;
}

.weather-main__date input {
  font-size: 30px;
  font-weight: bold;
  color: var(--title-color);
  background: none;
  border: none;
  text-align: center;
  outline: none;
  padding: 10px;
  border-bottom: 2px solid var(--title-color);
  transition: var(--transition-duration);
  cursor: pointer;
}

.weather-main__date input:hover {
  border-radius: 10px 10px 0 0;
  background: #eaeaea;
}

</style>
