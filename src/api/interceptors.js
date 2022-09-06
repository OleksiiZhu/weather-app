const appId = process.env.VUE_APP_API_KEY

export const appIdInterceptor = (config) => {
  config.params ? (config.params.appid = appId) : config.params = { appid: appId }
  return config
}
