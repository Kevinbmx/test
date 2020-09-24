<template>
    <div id="pageIndexRole">
      <v-container grid-list-xl fluid>
        <v-app id="inspire">
            <v-card   
            >
                <v-card-title>
                    Role
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
                        :items="this.roles"
                        :search="search"
                        :rows-per-page-items='[10,25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-left">{{ props.item.description }}</td>
                            <td class="layout px-0">
                                <v-btn flat 
                                    v-if="hasPermission(actualizarRolVar)"
                                    icon color="primary" :to="{name: 'editRole',params: {id:props.item.id}}">
                                    <v-icon small>
                                        edit
                                    </v-icon>
                                </v-btn>
                                <v-btn flat 
                                    v-if="hasPermission(eliminarRolVar)"
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
                                v-if="hasPermission(crearRolVar)"
                                :to="{ name: 'createRole' }"
                                right
                                fixed
                                bottom
                                fab slot="activator" color="primary">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                            <span>new Role</span>
                        </v-tooltip>
                    </v-fab-transition>
                </v-card-text>
                <v-dialog v-if="hasPermission(eliminarRolVar)" v-model="dialog" persistent max-width="400px">
                    <v-card>
                        <v-card-title>
                        <span class="headline">¿Quieres eliminar este Modulo?</span>
                        </v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="closeDialog()">cerrar</v-btn>
                        <v-btn color="red" flat @click="deleteRole()">confirmar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card>
        </v-app>
    </v-container>
   
</div>
</template>
<script>
import {crearRol,listarRol,actualizarRol,eliminarRol} from '@/packages/libreriaDeAccesos'
import {roleUrl} from '../../../packages/config'
import { mapGetters } from 'vuex'
    export default {
        name: 'RoleIndex',
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
                { text: 'descripcion', value: 'name', sortable: false },
                { text: 'Actions', value: 'name', sortable: false }
            ],
            roles:[],
            role_id:'',
            dialog:false,
            listarRolVar : listarRol,
            crearRolVar : crearRol,
            actualizarRolVar : actualizarRol,
            eliminarRolVar : eliminarRol
            }
        },
        created(){
            this.getAllRole()
        },
        computed:{
            ...mapGetters([
                'hasPermission',
            ]),
        },
        mounted(){
            // this.removeCollapse();
        },
        methods: {
            getAllRole(){
                this.$myApi.get(roleUrl)
                .then(response => {
                    if(response.data.hasPermission){
                       this.roles= response.data.role.data
                    }else{
                         this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            deleteRole(){
                this.$myApi.delete(roleUrl+'/'+ this.role_id)
                .then(response => {
                    if(response.data.hasPermission){
                        this.getAllRole()
                        this.closeDialog()
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
            openDialog(id){
                this.role_id = id;
                this.dialog = true;
            },
            closeDialog(){
                this.role_id ='';
                this.dialog = false;
            }
        }
    }
</script>
