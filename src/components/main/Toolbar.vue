<template>
  <v-card tile dark class="primary"> 
    <v-row no-gutters class="pt-2 pb-2">
      <v-col cols="4" sm="2" md="2"  align="center" justify="center" order="1" order-sm="1" order-md="1">
        <router-link class="estiloTitulo" :to="{ name: 'mainPage' }"><span> Niño Tienda</span></router-link>
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="7" order="3" order-sm="2" order-md="2">
        <v-text-field
        class="mx-3"
          hide-details
            dark
            label="Buscar"
            prepend-inner-icon="search"
            solo-inverted
            v-model="searchField"
            @keyup.enter="search"
          ></v-text-field>
      </v-col>
      <v-col cols="8" sm="4" md="3" order="2" order-sm="3" order-md="3">
        <v-bottom-navigation 
          background-color="primary"
          class="remove-shadow"
          dark
          color="white"
        >
          <v-btn text :to="{name:'categories'}">
            <span>Categorias</span>
            <v-icon size="18">dashboard</v-icon>
          </v-btn>
          
          <v-btn text @click="openMenuMain()">
            <span>Mi Cuenta</span>
            <v-icon size="18">account_circle</v-icon>
          </v-btn>
          <v-btn text :to="{ name: 'carrito'}"  >
            <span>carrito({{this.$store.getters.getCantidadCarrito}})</span>
            <v-icon size="18">shopping_cart</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>

import {categoryParentUrl,carritoUrl} from '@/packages/config'
export default {
    data () {
      return {
        tabs: null,
        searchField:'',
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ]
      }
    },
    created(){
      this.fillCarrito()
    },
    methods:{
      fillCategory(){
          this.$myApi.get(categoryParentUrl)
          .then(response =>{
            //console.log('categorias toolbar',response )
            this.categories = response.data
          })
      },
      //esto lo utilizo solo para hacer consulta cuando hay dos carrito distinto 
      getCarritoByPedidoId(pedido_id){
        return new Promise((resolve) => {
          this.$myApi.get(carritoUrl + '/'+ pedido_id)
          .then(response =>{
            //console.log('carrito ',response)
            resolve(response.data.carrito)
            // return response.data.carrito
          })
        })
      },
      search(){
        if(this.searchField == null || this.searchField == ""){
          this.$router.push({name:'mainPage'})
        }else{
          this.$router.push({ name: 'search', query: { q: this.searchField } })
        }
      },
      openMenuMain() {
        // console.log(this)
        this.$parent.$parent.openMenuMain();
      },
      fillCarrito(){
        var pedido_id = localStorage.getItem('pedido_id')
        var token = localStorage.getItem('access_token')

        if(pedido_id == null && token != null){
          this.$store.dispatch('selectPedidoByUserId')
          .then(response => {
          //console.log('pedidoId null y toke not null',response) 
              if(response !== null){
                this.$store.dispatch('selectCarritoByPedidoId',response.id)
              //   .then(response =>{
              //   //console.log('carrito ',response)
              // })
            }
          })
        }else if(pedido_id != null && token != null){
          this.$store.dispatch('selectPedidoByUserId')
          .then(response1 => {
          //console.log('pedidoId not null y toke not null 1',response1) 
              if(response1 !== null){
                if(response1.id !== parseInt(pedido_id)){
                  //aqui solo ulitizo el metodo getCarritoByPedidoId por que quiero obtener el resultado de 
                  //ambos carrito para luego hacer una fusion
                  let userCart
                  let oldCarrito
                  this.getCarritoByPedidoId(parseInt(response1.id))
                  .then(responseUser=>{
                    userCart = responseUser
                    this.getCarritoByPedidoId(parseInt(pedido_id))
                    .then(responseUser=>{
                      oldCarrito = responseUser
                      //console.log('old carrito', oldCarrito)
                      //console.log('userCart ', userCart)
                      for(var index in oldCarrito){
                        let find =  userCart.find(file => file.product_id !== oldCarrito[index].product_id)
                        if(find){
                          let objCart = {
                            product_id:     oldCarrito[index].product_id, 
                            pedido_id:      find.pedido_id,
                            quantity:       oldCarrito[index].quantity,
                            price:          oldCarrito[index].price,
                          }
                          this.$store.dispatch('createAndUpdateCarrito',objCart)
                        }
                      }
                      this.$store.dispatch('deletePedidoAndCarritoByPedidoId',oldCarrito[index].pedido_id)
                      // .then(responseDelete=>{
                      //   //console.log('se elimino',responseDelete)
                      // })
                    });
                  });
                }else{
                this.$store.dispatch('selectCarritoByPedidoId',response1.id)
                // .then(response3 =>{
                // //console.log('carrito ',response3)
                // })
              }
            }else{
              this.$store.dispatch('selectPedidoById',pedido_id)
              .then(responsePedido=>{
                this.$store.dispatch('updatePedido',responsePedido.id)
                .then(responseUpdatePedido=>{
                  if(responseUpdatePedido){
                    this.$store.dispatch('selectCarritoByPedidoId',responsePedido.id)
                    // .then(response3 =>{
                    // //console.log('carrito ',response3)
                    // })
                  }
                })
              })
            }
        })
        }else if(pedido_id != null && token == null){
          this.$store.dispatch('selectPedidoById',pedido_id)
          .then(response => {
            //console.log('pedidoId not null y toke null 2',response) 
              if(response !== null){
                // this.$store.commit('selectPedidoByUserId',response)
                this.$store.dispatch('selectCarritoByPedidoId',response.id)
              //   .then(response1 =>{
              //   //console.log('carrito ',response1)
              // })
            }
          })
        }
      }
    }
}
</script>

<style  scoped>
  .v-text-field__details{
    display: none;
  }
  .v-item-group.v-bottom-nav .v-btn{
    min-width: 62px;
  }
  .remove-shadow{
    -webkit-box-shadow:none !important;
    box-shadow:none !important;
  }
  .full-with{
    width: 100%;
  }
  .estiloTitulo{
    color:#fff !important;
    text-decoration:none;   
    font-family: 'Roboto', sans-serif;
    line-height: 1.5;
  }
  .v-btn__content{
    color: #FFFFFFB3 ;
  }
</style>
