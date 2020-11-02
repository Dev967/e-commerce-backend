const axios = require('axios').default

//REQUEST interceptors
axios.interceptors.request.use(
    (config) => {
        console.log("interceptor", config.data)
        config.data.systemKey = process.env._system_secret
        return config
    },
    (err) => {
        return err
    })

//RESPONSE interceptors
//!EMPTY

module.exports = axios