const isProduction = window.location.hostname.indexOf("imotodelivery.com") != -1
let config = {}

if (isProduction) {
  config = {
    apiHost: "https://imotodelivery.com",
    startSentry: () => Raven.config('https://e9dbd50d84e746b3adc21788424f8556@sentry.io/283876').install()
  }
} else {
  config = {
    apiHost: "http://localhost:4000",
    startSentry: () => {}
  }
}

export default config
