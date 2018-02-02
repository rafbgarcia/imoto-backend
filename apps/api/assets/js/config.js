const isProduction = window.location.hostname.indexOf("imotodelivery.com") != -1
let config = {}

if (isProduction) {
  config = {
    apiHost: "https://imotodelivery.com"
  }
} else {
  config = {
    apiHost: "http://172.21.0.3:4000"
  }
}

export default config
