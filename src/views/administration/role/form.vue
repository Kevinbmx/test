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
                                name="name" 
                                label="name Role" 
                                type="text" 
                                :error-messages="errors.collect('name')"
                                data-vv-name="name"
                                required
                                v-model="name">
                            </v-text-field>
                            <v-textarea :maxlength="maxLengthTextArea"
                                v-validate="'required'"
                                data-vv-name="description"
                                :error-messages="errors.collect('description')"
                                v-model="description" label="Descripcion del rol" required>
                            </v-textarea>
                                <v-btn
                                outline
                                color="primary"
                                :to="{name: 'mainRole'}"
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
import {crearRol} from '@/packages/libreriaDeAccesos'
import {roleUrl} from '../../../packages/config'
export default {
data () {
      return {
            name:'',
            description:'',
            id : "",
            maxLengthTextArea:50,
            crearRolVar:crearRol
      }
    },
    created(){
        this.id = this.$route.params.id
        if(this.$route.meta.mode === 'edit') {
            this.fillRole(this.id)
        }else{
          this.$store.dispatch('hasThisPermission',this.crearRolVar)
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
                this.$myApi.post(roleUrl+'/'+this.id,{
                    name: this.name,
                    description: this.description
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.$router.push({ name: 'mainRole' })
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            }else{
                this.$myApi.post(roleUrl,{
                    name: this.name,
                    description: this.description
                })
                .then(response => {
                    if(response.data.hasPermission){
                        this.$router.push({ name: 'mainRole' })
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                });
            }
        },
        fillRole(id){
            this.$myApi.get(roleUrl+'/'+id)
            .then(response => {
                if(response.data.hasPermission){
                    this.name= response.data.role.name
                    this.description = response.data.role.description
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
