const env = () => {
  let host = location.hostname
  let productionUrls = ['pie.ng', 'herokuapp.com', ]
  for(let i = 0; i < productionUrls.length; i++ ) {
    if(host.lastIndexOf(productionUrls[i]) === (host.length - productionUrls[i].length)) {
      return 'production'
    }
  }
  return 'development'
}

// const isProduction = env === 'production' ? true : false
const isProduction = true

export { env as default, isProduction }