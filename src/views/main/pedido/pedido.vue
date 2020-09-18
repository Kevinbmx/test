<template>
    <v-container grid-list-xl >
        <v-layout wrap justify-space-between pa-3 >
            <h2>Tus pedidos</h2>
        </v-layout>
        <div v-if="this.pedido.length > 0">
        <div style="border: 1px solid rgba(0,0,0,0.12); margin-bottom: 24px;" v-for="(order,index) in this.pedido" :key="index">
            <v-layout wrap justify-space-between  style="background-color: rgba(0,0,0,0.12); margin:0px">
                <v-flex xs8 md2 sm2 >
                    FECHA PEDIDO 
                    <br>
                    {{order.created_at}}
                    <!-- 10 de diciembre de 2019 -->
                </v-flex>
                <v-flex xs4 md1 sm1 >
                    TOTAL
                    <br>
                    {{order.total}}
                    <!-- 1200.00 Bs. -->
                </v-flex>
                 <v-flex xs12 md5 sm5 >
                    ENVIAR
                    <br>
                    {{order.direction.direction}}
                    <!-- 1200.00 Bs. -->
                </v-flex>
                <v-flex xs6 md2 sm2 >
                    ESTADO
                    <p>{{order.estado}} </p>
                </v-flex>
                <v-flex xs6 md2 sm2 >
                    PEDIDO N° {{order.id}} 
                    <v-btn
                    v-if="order.estado=='confirmado'"
                    small
                    flat 
                    round
                    color="red"
                    dark
                    @click="openDialog(order.id)"
                    >
                    cancelar pedido
                    </v-btn>

    <v-dialog v-model="dialog" persistent max-width="400px">

      <v-card>
        <v-card-title>
          <span class="headline">Anular Pedido</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-textarea :maxlength="maxLengthTextArea"
                    v-validate="'required'"
                     name="motivoAnulacion" 
                    :error-messages="errors.collect('motivoAnulacion '+(index+1))"
                    v-model="motivoAnulacion" label="Motivo de anulacion de Pedido" required>
                </v-textarea>
                <label>{{maxLengthTextArea-motivoAnulacion.length}}</label>
              </v-flex>
             
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog()">cerrar</v-btn>
          <v-btn color="red" flat @click="motivoAnularPedido()">confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
                </v-flex>
            </v-layout>
            <div v-for="(cart,index) in order.carrito" :key="index">
                <v-layout wrap justify-space-between pt-3>
                    <v-flex xs12 md2 sm2 >
                        <router-link :to="{ name: 'productDetail',params: { id: cart.product.id }}">
                            <v-img
                            :src= cart.product.file[0].path
                            aspect-ratio="2"
                            contain
                            >
                            </v-img>
                        </router-link>
                    </v-flex>
                    <v-flex xs12 md5 sm5 >
                            <v-flex md12 xs12 py-0 > 
                                <router-link :to="{ name: 'productDetail',params: { id: cart.product_id } }">
                                    <h3 class="text-justify">{{cart.product.name}}</h3>
                                </router-link>
                            </v-flex>
                    </v-flex>
                    <v-flex xs12 md3 sm3 style="display:flex; color: #D90000;" >
                        <v-flex md12 xs12 py-0 > 
                            <h3>{{cart.product.price | moneda }}</h3> <p class="margin-price"> &nbsp; Bs.</p>
                        </v-flex>
                    </v-flex>
                </v-layout>
                <v-divider ></v-divider>
            </div>
        </div>
        <div class="pagination">
            <v-btn class="ma-2" 
                :to="{ name: 'pedido',query: { page: paginador.prev_page_url } }" 
                outline color="secondary"  exact
                :disabled="!paginador.prev_page_url">
                    anterior
            </v-btn> 
            <span>Pagina {{paginador.current_page}} de {{paginador.last_page}}</span>
            <v-btn class="ma-2" 
                :to="{ name: 'pedido',query: { page: paginador.next_page_url }}" 
                outline color="secondary"  exact
                :disabled="!paginador.next_page_url">
                    siguiente
            </v-btn>
        </div>
        </div>
        <div v-else>
            No tienes ningun pedido echo.
        </div>
    </v-container>
</template>


<script>
import moment from 'moment'
import {tusPedidoConfirmadoUrl,MotivoAnularPedidoUrl} from '../../../packages/config'
export default {
     data () {
        return {
            paginador:{},
            pedido : {},
            pageQuery:'',
            dialog: false,
            pedidoId:null,
            motivoAnulacion:"",
            maxLengthTextArea:130
        }
    },
    watch: { 
      $route (to, from) {
        this.initializeData()
        this.getTusPedidos()
      }
    },
    created(){
        this.initializeData()
        this.getTusPedidos()
    },
    methods:{
        getTusPedidos(){
            var urlFormada=''
            if(this.pageQuery == null){
                urlFormada = tusPedidoConfirmadoUrl
            }
            else{
                urlFormada = tusPedidoConfirmadoUrl+'?page='+this.pageQuery
            }
            this.$myApi.get(urlFormada)
                .then(response => {
                    this.paginando(response.data.pedido)
                    this.pedido = response.data.pedido.data;
                });
            },
        initializeData(){
            this.pageQuery = this.$route.query.page == null ? null : this.$route.query.page;
        },
        motivoAnularPedido(){
            this.$validator.validate().then(result => {
                if (result) {
                    let objPedido = {
                        motivo_anulacion:this.motivoAnulacion,
                        fecha_anulacion: moment().format('YYYY-MM-DD HH:MM'),
                        pedido_id: this.pedidoId
                    }
                    this.$myApi.post(MotivoAnularPedidoUrl,objPedido)
                    .then(response => {
                          if(response.data.pedido == 1){
                            this.getTusPedidos()
                            this.closeDialog()
                        }
                    });
                }
            });
        },
        
        openDialog(pedId){
            this.pedidoId = pedId
            this.dialog = true
        },
        closeDialog(pedId){
            this.pedidoId = null
            this.dialog = false
            this.motivoAnulacion=""
        },
        paginando(data){
            let objPaginador = {
                current_page: data.current_page,
                last_page: data.last_page,
                //le sumo mas 1 para sustraer la posicion correcta de mi string
                next_page_url: data.next_page_url == null ? null : data.next_page_url.substring(data.next_page_url.indexOf('=')+1, data.next_page_url.length),
                prev_page_url: data.prev_page_url == null ? null : data.prev_page_url.substring(data.prev_page_url.indexOf('=')+1, data.prev_page_url.length)
            }
            this.paginador = objPaginador
        }
    }
}
</script>