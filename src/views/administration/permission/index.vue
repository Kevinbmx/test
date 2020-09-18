<template>
    <div id="pageIndexModule">
        <v-container grid-list-xl fluid>
            <v-app id="inspire">
                <v-card>
                    <v-card-title>
                        Lista de modulos con su cantidad de permisos
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
                            :items="this.permissions"
                            :search="search"
                            :rows-per-page-items='[10,25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'
                        >
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="text-xs-left">{{ props.item.permission.length }}</td>
                                <td class="text-xs-left layout px-0">
                                    <v-btn flat  
                                        v-if="hasPermission(listarPermisoVar)"
                                        icon color="primary" 
                                        :to="{name: 'mainPermisosPorModulo',params: {idmodule:props.item.id}}">
                                        <v-icon small>
                                        remove_red_eye
                                        </v-icon>
                                    </v-btn>
                                    </td>
                            </template>
                            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                            </v-alert>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-app>
        </v-container>
    </div>
</template>
<script>
import {listarPermiso} from '@/packages/libreriaDeAccesos'
import {permissionUrl} from '../../../packages/config'
import { mapGetters } from 'vuex'
    export default {
        name: 'ModuleIndex',
        data () {
        return {
            search: '',
            headers: [
                {
                text: 'Nombre del modulo',
                align: 'left',
                sortable: false,
                value: 'name'
                },
                { text: 'Cantidad de permisos', value: 'name', sortable: false },
                { text: 'Actions', value: 'name', sortable: false }
            ],
            permissions:[],
            module_id:'',
            listarPermisoVar:listarPermiso
            }
        },
        components: {
        },
        created(){
            this.getAllPermission()
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
            getAllPermission(){
                this.$myApi.get(permissionUrl)
                .then(response => {
                    if(response.data.hasPermission){
                        this.permissions= response.data.moduleWithPermission.data
                    }else{
                         this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
        }
    }
</script>
