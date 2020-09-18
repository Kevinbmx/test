<template>
    <div id="pageIndexRolePermission">
      <v-container grid-list-xl fluid>
        <v-app id="inspire">
            <v-card   
            >
                <v-card-title>
                    Lista de roles y sus permisos
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
                        :items="this.rolePermission"
                        :search="search"
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-left">{{ props.item.permissions.length }}</td>
                            <td class="layout px-0">
                                <v-btn flat  icon color="primary" :to="{name: 'mainVerRolePermission',params: {idrol:props.item.id}}">
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
import {rolePermissionUrl} from '../../../packages/config'
import { mapGetters } from 'vuex'
    export default {
        name: 'RolePermissionIndex',
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
                { text: 'Cantidad de permisos', value: 'name', sortable: false },
                { text: 'Actions', value: 'name', sortable: false }
            ],
            rolePermission:[],
            module_id:'',
            dialog:false
            }
        },
        created(){
            this.getAllRolePermission()
        },
        methods: {
            getAllRolePermission(){
                this.$myApi.get(rolePermissionUrl)
                .then(response => {
                    if(response.data.hasPermission){
                        this.rolePermission= response.data.rolePermission.data
                    }else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            },
        }
    }
</script>
