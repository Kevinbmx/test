<template>
    <div id="pageIndexCategory">
        <v-card>
            <v-card-title>
                Agregar Modulos
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
                                name="nameModule" 
                                label="name Module" 
                                type="text" 
                                :error-messages="errors.collect('nameModule')"
                                data-vv-name="nameModule"
                                required
                                v-model="nameModule">
                            </v-text-field>
                                <v-btn
                                outline
                                color="primary"
                                :to="{name: 'mainModule'}"
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
import {crearModulo} from '@/packages/libreriaDeAccesos'
import {moduleUrl} from '../../../packages/config'
export default {
data () {
      return {
            nameModule:'',
            id : "",
            crearModuloVar:crearModulo
      }
    },
    created(){
        this.id = this.$route.params.id
        if(this.$route.meta.mode === 'edit') {
            this.fillModule(this.id)
        }else{
          this.$store.dispatch('hasThisPermission',this.crearModuloVar)
          .then(response=>{
              if(!response){
                  this.$router.push({ name: 'withoutAccess' })
              }
          })
        }
    },
    methods:{
        save(){
            if(this.$route.meta.mode === 'edit') {
                this.$myApi.post(moduleUrl+'/'+this.id,{
                    name: this.nameModule
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.$router.push({ name: 'mainModule' })
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            }else{
                this.$myApi.post(moduleUrl,{
                    name: this.nameModule
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.$router.push({ name: 'mainModule' })
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            }
        },
        fillModule(id){
            this.$myApi.get(moduleUrl+'/'+id)
            .then(response => {
                if(response.data.hasPermission){
                    this.nameModule= response.data.module.name
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
