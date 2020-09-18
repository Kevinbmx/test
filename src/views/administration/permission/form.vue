<template>
    <div id="pageIndexCategory">
        <v-card>
            <v-card-title>
                Agregar Permiso a {{this.nameModule}}
                <v-divider
                    class="mx-2"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-form >
                <v-container>
                    <v-layout  wrap
                    justify-space-between>
                        <v-flex
                        xs12
                        md6
                        >
                            <v-text-field
                                v-validate="'required'"
                                name="namePermission" 
                                label="name permission" 
                                type="text" 
                                :error-messages="errors.collect('namePermission')"
                                data-vv-name="namePermission"
                                required
                                v-model="namePermission">
                            </v-text-field>
                            <v-btn
                                outline
                                color="primary"
                                :to="{name: 'mainPermisosPorModulo'}"
                                >
                                cancelar
                            </v-btn>
                            <v-btn
                                color="primary"
                                @click="save()"
                                >
                                guardar
                            </v-btn>
                             
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import {permissionUrl,moduleUrl } from '../../../packages/config'
import {crearPermiso} from '@/packages/libreriaDeAccesos'
export default {
data () {
      return {
            namePermission:'',
            idmodule:'',
            idpermission:'',
            nameModule:'',
            crearPermisoVar : crearPermiso
      }
    },
    created(){
        this.idmodule = this.$route.params.idmodule
        this.fillmodule(this.idmodule)
        if(this.$route.meta.mode === 'edit') {
            this.idpermission = this.$route.params.idpermission
            this.fillPermission(this.idpermission)
        }else{
          this.$store.dispatch('hasThisPermission',this.crearPermisoVar)
          .then(response=>{
              if(!response){
                  this.$router.push({ name: 'withoutAccess' })
              }
          })
        }
    },
    beforeMount() {
    },
    components:{
    
    },
    methods:{
        save(){
            if(this.$route.meta.mode === 'edit') {
                this.$myApi.post(permissionUrl+'/'+this.idpermission,{
                    name: this.namePermission,
                    module_id: this.idmodule
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.$router.push({ name: 'mainPermisosPorModulo',params: {idmodulo:this.idmodule} })
                    }else{
                        this.$router.push({name: 'withoutAccess'})
                    }
                });
                // console.log('editado')
            }else{
                this.$myApi.post(permissionUrl,{
                    name: this.namePermission,
                    module_id: this.idmodule
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.$router.push({ name: 'mainPermisosPorModulo',params: {idmodulo:this.idmodule} })
                    }else{
                        this.$router.push({name: 'withoutAccess'})
                    }
                });
                // console.log('guardado')
            }
        },

        
        fillmodule(id){
            this.$myApi.get(moduleUrl+'/'+id)
            .then(response => {
                this.nameModule =  response.data.name
            });
        },
        fillPermission(id){
            this.$myApi.get(permissionUrl+'/'+id)
            .then(response => {
                if(response.data.hasPermission){
                    this.namePermission= response.data.permission.name
                }else{
                    this.$router.push({ name: 'withoutAccess' })
                }
            });
        }
    }

}
</script>

<style>

</style>
