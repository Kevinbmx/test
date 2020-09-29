<template>
    <v-container grid-list-xl >
        <v-row no-gutters>
            <v-col>
                <h2>Tus pedidos</h2>
            </v-col>
        </v-row>
        <v-row no-gutters  v-if="this.pedido.length > 0">
            <v-col cols="12" v-for="(order,index) in this.pedido" :key="index" style="border: 1px solid rgba(0,0,0,0.12); margin-bottom: 24px; padding:0px">
                 <v-row style="background-color: rgba(0,0,0,0.12); margin:0px">
                     <v-col cols="8" sm="2" md="2" >
                          <span> FECHA PEDIDO:</span>
                        <br>
                        {{order.updated_at}}
                    </v-col>
                    <v-col cols="4" sm="1" md="1">
                         <span>TOTAL:</span>
                        <br>
                        {{order.total}}
                    </v-col>
                    <v-col cols="12" sm="4" md="4" >
                        <span>ENVIAR:</span>
                        <br>
                        {{order.direction.direction}}
                    </v-col>
                    <v-col cols="6" sm="2" md="2">
                        <span>ESTADO:</span>
                        <p>{{order.estado}} </p>
                    </v-col>
                    <v-col cols="6" sm="3" md="3" >
                         <span>PEDIDO N°: {{order.id}}</span> 
                         <br>
                        <v-btn
                        class="pa-0"
                        v-if="order.estado=='confirmado'"
                        small
                        text 
                        rounded
                        color="red"
                        dark
                        @click="openDialog(order.id)"
                        >
                        Cancelar Pedido
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row v-for="(cart,index) in order.carrito" :key="index" class="ma-1" >
                    <v-col cols="12" sm="2" md="2">
                        <router-link :to="{ name: 'productDetail',params: { id: cart.product.id }}">
                            <v-img
                            :src= cart.product.file[0].path
                            aspect-ratio="2"
                            contain
                            >
                            </v-img>
                        </router-link>
                    </v-col>
                    <v-col cols="12" sm="7" md="7" >
                        <router-link :to="{ name: 'productDetail',params: { id: cart.product_id } }">
                            <h4 class="text-justify">{{cart.product.name}}</h4>
                        </router-link>
                    </v-col>
                    <v-col cols="12" sm="3" md="3" style="display:flex; color: #D90000; " >
                        <h4>{{cart.product.price | moneda }} Bs.</h4>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <div>
                    <v-btn class="ma-2" 
                        :to="{ name: 'pedido',query: { page: paginador.prev_page_url } }" 
                        outlined color="secondary"  exact
                        :disabled="!paginador.prev_page_url">
                            anterior
                    </v-btn> 
                    <span>Pagina {{paginador.current_page}} de {{paginador.last_page}}</span>
                    <v-btn class="ma-2" 
                        :to="{ name: 'pedido',query: { page: paginador.next_page_url }}" 
                        outlined color="secondary"  exact
                        :disabled="!paginador.next_page_url">
                            siguiente
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        
        <v-row no-gutters v-else>
            <v-col>
                No tienes ningun pedido echo.
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="400px">
            <v-card>
                <v-card-title>
                <span class="headline">Anular Pedido</span>
                </v-card-title>
                <v-card-text>
                <v-container grid-list-md>
                    <v-textarea 
                        v-validate="'required'"
                        name="motivoAnulacion" 
                        :error-messages="errors.collect('motivoAnulacion')"
                        v-model="motivoAnulacion" label="Motivo de anulacion de Pedido"
                         maxlength="130" counter required>
                    </v-textarea>
                </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog()">cerrar</v-btn>
                    <v-btn color="red" text @click="motivoAnularPedido()">confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
      $route () {
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
        closeDialog(){
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