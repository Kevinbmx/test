<template>
    <div id="pageIndexModule">
        <v-container grid-list-xl fluid>
            <v-app id="inspire">
                <v-card>
                    <v-card-title>
                        Permisos de {{this.permissions.name}}
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
                    <v-card-text style="position: relative">
                        <v-btn outline  small   color="primary" :to="{name: 'mainPermission'}" >ir atras</v-btn>
                    </v-card-text>
                    <v-card-text >
                        <v-data-table
                            :headers="headers"
                            :items="this.permissions.permission"
                            :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="layout px-0">
                                    <v-btn 
                                    v-if="hasPermission(actualizarPermisoVar)"
                                    flat  icon color="primary" :to="{name: 'editPermission',params: {idpermission: props.item.id,idmodule: permissions.id}}">
                                        <v-icon small>
                                            edit
                                        </v-icon>
                                    </v-btn>
                                    <v-btn flat  
                                    v-if="hasPermission(eliminarPermisoVar)"
                                    icon color="red"  @click="openDialog(props.item.id)">
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
                                <v-btn  dark
                                        v-if="hasPermission(crearPermisoVar)"
                                        :to="{name: 'createPermission'}"
                                        right
                                        fixed
                                        bottom
                                        fab slot="activator" color="primary">
                                    <v-icon dark>add</v-icon>
                                </v-btn>
                                <span>new Permission</span>
                            </v-tooltip>
                        </v-fab-transition>
                    </v-card-text>
                    <v-dialog 
                        v-if="hasPermission(eliminarPermisoVar)"
                        v-model="dialog" persistent max-width="400px">
                        <v-card>
                            <v-card-title>
                            <span class="headline">¿Quieres eliminar este permiso?</span>
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
import {permissionUrl,permisosPorModuloUrl} from '../../../packages/config'
import {crearPermiso,actualizarPermiso,eliminarPermiso} from '@/packages/libreriaDeAccesos'
import { mapGetters } from 'vuex'
    export default {
        name: 'permisoPorModuleIndex',
        data () {
        return {
            search: '',
            headers: [
                {
                text: 'nombre del permiso',
                align: 'left',
                sortable: false,
                value: 'name'
                },
                { text: 'Actions', value: 'name', sortable: false }
            ],
            permissions:[],
            permission_id:'',
            dialog:false,
            crearPermisoVar : crearPermiso,
            actualizarPermisoVar : actualizarPermiso,
            eliminarPermisoVar : eliminarPermiso
            }
        },
        created(){
            this.getAllPermissionbymodule()
        },
        computed:{
            ...mapGetters([
                'hasPermission',
            ]),
        },
        methods: {
            getAllPermissionbymodule(){
                this.$myApi.get(permisosPorModuloUrl+'/'+this.$route.params.idmodule)
                .then(response => {
                    if(response.data.hasPermission){
                        this.permissions= response.data.permission
                    }
                    else{
                         this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            deleteModule(){
                this.$myApi.delete(permissionUrl+'/'+ this.permission_id)
                .then(response => {
                    // console.log('se destruyo...',response)
                    if(response.data.hasPermission){
                        this.getAllPermissionbymodule()
                        this.closeDialog()
                    }else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            openDialog(id){
                this.permission_id = id;
                this.dialog = true;
            },
            closeDialog(){
                this.permission_id ='';
                this.dialog = false;
            }
        }
    }
</script>
