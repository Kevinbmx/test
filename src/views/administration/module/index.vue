<template>
    <div id="pageIndexModule">
      <v-container grid-list-xl fluid>
        <v-app id="inspire">
            <v-card   
            >
                <v-card-title>
                    Module
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
                    ></v-text-field>
                </v-card-title>
                <v-card-text >
                    <v-data-table
                        :headers="headers"
                        :items="this.modules"
                        :search="search"
                        :rows-per-page-items='[10,25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="layout px-0">
                                <v-btn 
                                    v-if="hasPermission(actualizarModuloVar)"    
                                    flat  icon color="primary" :to="{name: 'editModule',params: {id:props.item.id}}">
                                    <v-icon small>
                                        edit
                                    </v-icon>
                                </v-btn>
                                <v-btn 
                                    v-if="hasPermission(eliminarModuloVar)"
                                    flat  icon color="red"  @click="openDialog(props.item.id)">
                                    <v-icon small>
                                        delete
                                    </v-icon>
                                </v-btn>
                                </td>
                        </template>
                        <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                        </v-alert>
                    </v-data-table>
                </v-card-text>
                <v-card-text style="position: relative">
                    <v-fab-transition>
                        <v-tooltip top>
                            <v-btn  
                                    v-if="hasPermission(crearModuloVar)"
                                    dark
                                    :to="{ name: 'createModule' }"
                                    right
                                    fixed
                                    bottom
                                    fab slot="activator" color="primary">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                            <span>new Module</span>
                        </v-tooltip>
                    </v-fab-transition>
                </v-card-text>
                <v-dialog v-if="hasPermission(eliminarModuloVar)" v-model="dialog" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                        <span class="headline">¿Quieres eliminar este Modulo?</span>
                        </v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="closeDialog()">cerrar</v-btn>
                        <v-btn color="red" flat @click="deleteModule()">confirmar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card>
        </v-app>
    </v-container>
   
</div>
</template>
<script>
import {crearModulo,listarModulo,actualizarModulo,eliminarModulo} from '@/packages/libreriaDeAccesos'
import {moduleUrl} from '../../../packages/config'
import { mapGetters } from 'vuex'
    export default {
        name: 'ModuleIndex',
        data () {
            return {
                search: '',
                headers: [
                    {
                    text: 'nombre de modulo',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                    },
                    { text: 'Actions', value: 'name', sortable: false }
                ],
                modules:[],
                module_id:'',
                dialog:false,
                listarModuloVar : listarModulo,
                crearModuloVar : crearModulo,
                actualizarModuloVar : actualizarModulo,
                eliminarModuloVar : eliminarModulo
            }
        },
        created(){
            this.getAllModule()
        },
        computed:{
            ...mapGetters([
                'hasPermission',
            ]),
        },
        methods: {
            getAllModule(){
                this.$myApi.get(moduleUrl)
                .then(response => {
                    if(response.data.hasPermission){
                        this.modules= response.data.module.data
                    }else{
                         this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            deleteModule(){
                this.$myApi.delete(moduleUrl+'/'+ this.module_id)
                .then(response => {
                    if(response.data.hasPermission){
                        this.getAllModule()
                        this.closeDialog()
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            openDialog(id){
                this.module_id = id;
                this.dialog = true;
            },
            closeDialog(){
                this.module_id ='';
                this.dialog = false;
            }
        }
    }
</script>
