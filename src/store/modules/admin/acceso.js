import {accesPermissionsByUserTokenUrl,hasThisPermissionUrl} from '../../../packages/config'

const state = {
  userObj:{},
  acceso:[],

}
const getters={
  hasPermission: state => permiso => {
    // console.log(state.acceso)
    return (state.acceso.find(a => a.name === permiso)) ? true : false ;
  },
  getUser(state) {
    return state.userObj
  },
}
const mutations = {
  retrieveAcceso(state, allAcceso) {
    state.acceso = allAcceso
  },
  retrieveUser(state, userObj) {
    state.userObj = userObj
  },
}
const actions = {
  //accesPermissionsByUserToken 
  retrieveAcceso({ dispatch, commit}){
    if(localStorage.getItem('access_token')){
      this.$myApi.get(accesPermissionsByUserTokenUrl)
        .then(response => {
          // console.log('acceso by user token',response)
          dispatch('retrieveUser',response.data.user)
          commit('retrieveAcceso', response.data.rolePermission)
        });
    }
  },
  retrieveUser(context,user){
    localStorage.setItem('role_id', user.role_id)
    context.commit('retrieveUser', user)
  },
  hasThisPermission(context, permission){
    return new Promise((resolve, reject) => {
      this.$myApi.post(hasThisPermissionUrl ,{
        namePermission: permission,
        })
        .then(response => {
          // console.log(response)
          resolve(response.data.hasPermission)
        })
        .catch(error => {
         //console.log(error)
          reject(error)
        })
      }
    )}
}

export default{
    state, getters, mutations, actions
  }
  