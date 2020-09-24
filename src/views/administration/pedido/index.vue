<template>
    <div id="pageIndexModule">
        <v-container grid-list-xl fluid>
            <v-app id="inspire">
                <v-card>
                    <v-card-title>
                        Pedidos
                        <v-divider
                            class="mx-2"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                        @keyup.enter="getAllPedido()"
                        ></v-text-field>
                    </v-card-title>
                    <v-card-text >
                        <v-data-table
                            :headers="headers"
                            :items="pedidos"
                            hide-actions
                            :rows-per-page-items='[7]'>
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item.id}}</td>
                                <td class="text-xs-left">{{ props.item.estado}}</td>
                                <td class="text-xs-left">{{ props.item.fecha_entrega}}</td>
                                <td class="text-xs-left">{{ props.item.fecha_anulacion}}</td>
                                <td class="text-xs-left">{{ props.item.motivo_anulacion}}</td>
                                <td class="text-xs-left">{{ props.item.total}}</td>
                                <td class="text-xs-left">{{ getName(props.item.user)}}</td>
                                <td class="text-xs-left">{{ getDirection(props.item.direction)}}</td>
                                <td class="layout px-0">
                                    <v-btn flat  
                                    v-if="hasPermission(anularPedidoAdminVar) && props.item.estado == 'confirmado'"
                                    icon color="red" @click="openDialog(props.item.id)">
                                        <v-icon small>
                                            cancel
                                        </v-icon>
                                    </v-btn>
                                </td>
                            </template>
                            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                            </v-alert>
                        </v-data-table>
                        <div class="paginator-admin">
                            <span class="mr-5">{{paginador.from}}-{{paginador.to}} of {{paginador.total}}</span>
                            <v-btn 
                                :to="{ name: 'mainPedido',query: { page: paginador.prev_page_url } }" 
                                flat  icon
                                :disabled="!paginador.prev_page_url">
                                <v-icon>navigate_before</v-icon>
                            </v-btn> 
                            <v-btn 
                                :to="{ name: 'mainPedido',query: { page: paginador.next_page_url }}" 
                                flat  icon
                                :disabled="!paginador.next_page_url">
                                <v-icon>navigate_next</v-icon>
                            </v-btn>
                        </div>
                    </v-card-text>
                    <v-dialog 
                        v-if="hasPermission(eliminarPedidoVar)"
                        v-model="dialog" persistent max-width="400px">
                        <v-card>
                            <v-card-title>
                            <span class="headline">¿Quieres anular este pedido?</span>
                            </v-card-title>
                            <v-card-text>
                                <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field label="Motivo Anulacion" v-model="motivoAnulacion"  required></v-text-field>
                                </v-flex>
                                </v-layout>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="closeDialog()">cerrar</v-btn>
                                <v-btn color="red" flat @click="deletePedido()">confirmar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-app>
        </v-container>
    </div>
</template>
<script>
import moment from 'moment'
import {anularPedidoAdmin,eliminarPedido} from '@/packages/libreriaDeAccesos'
import {pedidoSearchUrl,MotivoAnularPedidoUrl} from '../../../packages/config'
import { mapGetters } from 'vuex'
    export default {
        name: 'PedidoIndex',
        data () {
            return {
                search: '',
                expand: false,
                headers: [
                    { text: 'N° pedido', value: 'id', sortable: true },
                    { text: 'estado', value: 'estado', sortable: true },
                    { text: 'fecha entrega', value: 'fecha_entrega', sortable: true},
                    { text: 'fecha anulacion', value: 'fecha_anulacion', sortable: true},
                    { text: 'motivo anulacion', value: 'motivo_anulacion', sortable: true},
                    { text: 'total', value: 'total', sortable: false },
                    { text: 'usuario', value: 'user', sortable: false },
                    { text: 'direccion', value: 'direction', sortable: false },
                    { text: 'Actions', value: 'action', sortable: false }
                ],
                pedidos:[],
                Pedido_id:'',
                dialog:false,
                anularPedidoAdminVar : anularPedidoAdmin,
                eliminarPedidoVar : eliminarPedido,
                paginador:{},
                motivoAnulacion:''
            }
        },
        created(){
            this.initializeData()
            this.getAllPedido()
        },
        computed:{
            ...mapGetters([
                'hasPermission',
            ]),
        },
       watch: { 
            $route () {
                this.initializeData()
                this.getAllPedido()
            }
        },
        methods: {
            getAllPedido(){
                var urlFormada=''
                if(this.pageQuery == null){
                    urlFormada = pedidoSearchUrl
                }
                else{
                    urlFormada = pedidoSearchUrl+'?page='+this.pageQuery
                }
                this.$myApi.post(urlFormada,{
                    search: this.search
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.pedidos = response.data.pedido.data
                        this.paginando(response.data.pedido)
                    }else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            initializeData(){
                this.pageQuery = this.$route.query.page == null ? null : this.$route.query.page;
            },
            deletePedido(){
                let objPedido = {
                    motivo_anulacion:this.motivoAnulacion,
                    fecha_anulacion: moment().format('YYYY-MM-DD HH:MM'),
                    pedido_id: this.Pedido_id
                }
                this.$myApi.post(MotivoAnularPedidoUrl,objPedido)
                .then(response => {
                    if(response.data.pedido == 1){
                        this.getAllPedido()
                        this.closeDialog()
                    }
                });
            },
            getName(user){
                var usuario =''
                usuario = user == null ? ' ' : user;
                if(usuario != null){
                    return usuario.name
                }else{
                    return ' '
                }
            },
            getDirection(direction){
                var direct =''
                direct = direction == null ? ' ' : direction;
                if(direct != null){
                    return direct.direction
                }else{
                    return ' '
                }
            },
            openDialog(id){
                this.Pedido_id = id;
                this.dialog = true;
            },
            closeDialog(){
                this.Pedido_id ='';
                this.dialog = false;
            },
            paginando(data){    
                let objPaginador = {
                    from: data.from,
                    to: data.to,
                    total: data.total,
                    //le sumo mas 1 para sustraer la posicion correcta de mi string
                    next_page_url: data.next_page_url == null ? null : data.next_page_url.substring(data.next_page_url.indexOf('=')+1, data.next_page_url.length),
                    prev_page_url: data.prev_page_url == null ? null : data.prev_page_url.substring(data.prev_page_url.indexOf('=')+1, data.prev_page_url.length)
                }
                this.paginador = objPaginador
            }
        }
    }
</script>
<style scoped>
    .paginator-admin{
        font-size: 12px;
        color: rgba(0, 0, 0, 0.54);
        font-family: Roboto, sans-serif;
        line-height: 1.5;
        text-align: right;
    }
</style>