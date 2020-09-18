// import Vue from 'vue'
// import axios from 'axios'
// import Auth from '../packages/Auth.js'
import {loginUrlCustom,logoutUrl,registertUrl} from '../../packages/config'

// Vue.use(Auth)
const state = {
  token: localStorage.getItem('access_token') || null,
}

const getters={
  loggedIn(){
    return state.token !== null
  }
}

const mutations = {
  retrieveToken(state, token) {
    state.token = token
  },


  destroyToken(state) {
    state.token = null
  },
}

const actions = {

  retrieveToken (context, credentials){
    return new Promise((resolve, reject) => {
      this.$myApi.post(loginUrlCustom,{
        username: credentials.username,
        password: credentials.password,
      })
      .then(response=>{
        const token = response.data.access_token
        localStorage.setItem('access_token', token)
        context.commit('retrieveToken', token)
        resolve(true)
        // console.log(response);
      })
      .catch(error =>{
        // console.log(error)
            reject(error)
      })
    })
    // commit('SET_AUTH_USER',userObj)
  },

  destroyToken(context) {
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
    if (context.getters.loggedIn) {
      return new Promise((resolve, reject) => {
        this.$myApi.post(logoutUrl)
          .then(response => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('pedido_id')
            localStorage.removeItem('role_id')
            context.commit('destroyToken')
            resolve(response)
            // console.log(response);
            // context.commit('addTodo', response.data)
          })
          .catch(error => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('pedido_id')
            localStorage.removeItem('role_id')
            context.commit('destroyToken')
            reject(error)
          })
      })
    }
  },
  register(context, data) {
    return new Promise((resolve, reject) => {
      this.$myApi.post(registertUrl, {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: data.role_id
      })
        .then(response => {
        // console.log(response)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
}


export default{
  state, getters, mutations, actions
}
