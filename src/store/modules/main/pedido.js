// import Vue from 'vue'
import {tusPedidoConfirmadoUrl} from '../../../packages/config'

const state = {
    pedido : null,
}

const getters = {
  
}

const mutations = {
    getTusPedidos(state,response){
        state.pedido = response;
    }

    
}

const actions = {
    getTusPedidos(context){
        this.$myApi.get(tusPedidoConfirmadoUrl)
        .then(response =>{
          // console.log('confirmado',response.data)
            if(response.data != null){
                context.commit('getTusPedidos',response.data)
            }
        })
       
    },
}


export default{
    state, getters, mutations, actions
}
