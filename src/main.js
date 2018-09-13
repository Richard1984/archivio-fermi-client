import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

// CUSTOM
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import axios from 'axios'

Vue.config.productionTip = false

export const SocketInstance = socketio('/', { secure: true, rejectUnauthorized: false, transports: ['websocket', 'flashsocket', 'polling'] })

export const eventBus = new Vue({
  methods: {
    openPopUp (entity, component, width) {
      this.$emit('openPopUp', entity, component, width)
    },
    closePopUp () {
      this.$emit('closePopUp')
    },
    uploading (progress) {
      this.$emit('uploading', progress)
    },
    notification (notification) {
      this.$emit('notification', notification)
    }
  }
})

const host = {
  heroku: 'https://archivio-fermi.herokuapp.com/',
  local: 'http://localhost:3000'
}

export const v1 = axios.create({
  baseURL: `${host.local}/api/v1`,
  withCredentials: true,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})

export const service = axios.create({
  baseURL: `${host.local}`,
  withCredentials: true,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})

Vue.use(VueSocketIO, SocketInstance)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
