<template>
    <div id="pageIndexCategory">
        <v-card>
            <v-card-title>
                Asignar accesos
                <v-divider
                    class="mx-2"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-form >
                <v-container  grid-list-md >
                <h4>chequee si quieres buscar por modulo</h4>
                    <v-layout row wrap >
                        <v-flex
                        xs6
                        md2
                        v-for="(mod,index) in modulos" :key="index"
                        >
                        <v-checkbox
                            v-model="moduleSelected"
                            :label="mod.name"
                            :value="mod.id"
                        ></v-checkbox>     
                        </v-flex>
                    </v-layout>
                </v-container>
                 <v-divider></v-divider>
                <v-container >
                    <v-layout row wrap>
                        <v-flex xs12 md5 >
                            <v-layout style="max-height: 400px">
                                <v-flex xs12 md12 text-xs-center style="overflow: auto">
                                    <h4>permisos sin asignar</h4>
                                    <v-data-table
                                        :headers="headers"
                                        :items="this.permissionsWithoutAcces"
                                        hide-actions 
                                        hide-headers
                                        class="elevation-1"
                                        >
                                        <template slot="items" slot-scope="props">
                                            <td>
                                                <v-checkbox
                                                    v-model="permissionsWithoutAccesSelected"
                                                    :value="props.item.id"
                                                     :disabled="boolPermissionWithouttAccesCheckbox"
                                                ></v-checkbox>     
                                            </td>
                                            <td class="text-xs-left">{{ props.item.name }}</td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 md2 >
                            <v-layout >
                                <v-flex xs12 md12 style="text-align: center;" >
                                    <v-btn icon @click="quitarPermiso()" :disabled="boolQuitarPermisoButton">
                                        <v-icon medium color="primary" >
                                            arrow_back
                                        </v-icon>
                                    </v-btn>
                                    <br>
                                    <v-btn icon @click="agregarPermiso()" :disabled="boolAgregarPermisoButton">
                                        <v-icon medium color="primary">arrow_forward</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 md5 >
                            <v-layout style="max-height: 400px">
                                <v-flex xs12 md12 class="tabla" text-xs-center style="overflow: auto">
                                    <h4>accesos permitidos</h4>
                                    <v-data-table
                                        :headers="headersAccess"
                                        :items="this.accesPermissions"
                                        hide-actions 
                                        hide-headers
                                        class="elevation-1"
                                        >
                                        <template slot="items" slot-scope="props">
                                            <td>
                                                <v-checkbox style="display: flex; align-items: center;"
                                                    v-model="accesPermissionsSelected"
                                                    :value="props.item.id"
                                                    :disabled="boolAccesPermissionCheckbox"
                                                ></v-checkbox>     
                                            </td>
                                            <td class="text-xs-left">{{ props.item.name }}</td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import {actualizarAcceso} from '@/packages/libreriaDeAccesos'
import {rolePermissionUrl,permissionsWithoutAccesUrl,accesPermissionsUrl,addRolepermissionUrl,removeRolepermissionUrl} from '../../../packages/config'
export default {
data () {
    return {
        idRol:'',
        querypermissionWithoutAcces:'',
        queryAccessPermission:'',
        moduleSelected:[],
        modulos: [], 
            headers: [
                {
                text: 'permisos sin asignar',
                align: 'left',
                sortable: false,
                value: 'name'
                },
            ],
            headersAccess: [
                {
                text: 'accesos',
                align: 'left',
                sortable: false,
                value: 'name'
                },
            ],
            boolAgregarPermisoButton :true,
            boolQuitarPermisoButton:true,
            permissionsWithoutAccesSelected:[],
            permissionsWithoutAcces:[],
            accesPermissionsSelected:[],
            accesPermissions:[],
            boolAccesPermissionCheckbox : false,
            boolPermissionWithouttAccesCheckbox : false,
            actualizarAccesoVar :actualizarAcceso
      }
    },
    watch: {
        permissionsWithoutAccesSelected: function () {
            if(this.permissionsWithoutAccesSelected.length>0){
                this.boolAgregarPermisoButton = false
                this.boolAccesPermissionCheckbox = true
            }else{
                this.boolAgregarPermisoButton = true
                this.boolAccesPermissionCheckbox = false
            }
        },
        accesPermissionsSelected: function () {
            if(this.accesPermissionsSelected.length>0){
                this.boolQuitarPermisoButton = false
                this.boolPermissionWithouttAccesCheckbox = true
            }else{
                this.boolQuitarPermisoButton = true
                this.boolPermissionWithouttAccesCheckbox = false
            }
        },
        moduleSelected: function(){
            this.actualizarDatos();
        }
      

    },
    created(){
        this.$store.dispatch('hasThisPermission',this.actualizarAccesoVar)
        .then(response=>{
            if(response){
                this.idRol = this.$route.params.idrol
                this.fillModulosCheckBox()
                this.fillPermissionsWithoutAcces()
                this.fillAccesPermission()
            }
            else{
                this.$router.push({ name: 'withoutAccess' })
            }
        })
        
    },
    methods:{
        fillModulosCheckBox(){
            this.$myApi.get(rolePermissionUrl+'/module')
            .then(response => {
                if(response.data.hasPermission){
                    this.modulos = response.data.module
                }else{
                    this.$router.push({ name: 'withoutAccess' })
                }
            });
        },
        fillPermissionsWithoutAcces(){
            this.$myApi.post(permissionsWithoutAccesUrl+'/'+this.idRol,{
            module_id : this.querypermissionWithoutAcces})
            .then(response => {
                if(response.data.hasPermission){
                    this.permissionsWithoutAcces = response.data.permissionsWithoutAcces
                }else{
                    this.$router.push({ name: 'withoutAccess' })
                }
            });
        },
        fillAccesPermission(){
            this.$myApi.post(accesPermissionsUrl+'/'+this.idRol,{
                module_id : this.queryAccessPermission})
                .then(response => {
                    if(response.data.hasPermission){
                        this.accesPermissions = response.data.rolePermission
                    }else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
        },
        quitarPermiso(){
            this.$myApi.post(removeRolepermissionUrl+'/'+this.idRol,{
                permission_id : this.accesPermissionsSelected})
                .then(response => {
                    if(response.data.hasPermission){
                        this.actualizarDatos()
                    }else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
        },
        agregarPermiso(){
             this.$myApi.post(addRolepermissionUrl+'/'+this.idRol,{
                permission_id : this.permissionsWithoutAccesSelected})
                .then(response => {
                    if(response.data.hasPermission){
                        this.actualizarDatos()
                    }else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
        },
        actualizarDatos(){
            this.accesPermissionsSelected = []
            this.permissionsWithoutAccesSelected = []
            if(this.moduleSelected.length > 0){
                var arrayToString = this.moduleSelected.toString()
                this.querypermissionWithoutAcces = 'and m.id in ('+ arrayToString+')'
                this.queryAccessPermission = this.moduleSelected
            }else{
                this.querypermissionWithoutAcces = ''
                this.queryAccessPermission = ''
            }
            this.fillPermissionsWithoutAcces()
            this.fillAccesPermission()
        }
    }

}
</script>

<style>
    .v-input__slot{
        margin-bottom: 0px !important;
    }
    .v-messages{
        display: none;
    }
</style>
