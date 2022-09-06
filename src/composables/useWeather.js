import { computed, inject, ref } from 'vue'

const handleResponse = (res) => res.data
const handleError = (error) => error.response.data.message

export const useWeather = () => {
  const data = ref()
  const error = ref(null)
  const loading = ref(false)

  const api = inject('api')

  async function getWeather(city) {
    loading.value = true
    error.value = null

    try {
      data.value = handleResponse(await api.getWeather(city))
    } catch (error) {
      error.value = handleError(error)
    } finally {
      loading.value = false
    }
  }

  async function getWeatherByLocation(position) {
    loading.value = true
    error.value = null

    try {
      data.value = handleResponse(await api.getLocationWeather(
        position.coords.latitude,
        position.coords.longitude
      ))
    } catch (error) {
      error.value = handleError(error)
    } finally {
      loading.value = false
    }
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getWeather,
    getWeatherByLocation,
  }
}
