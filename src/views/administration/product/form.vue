<template>
  <div id="pageIndexCategory">
      <v-container grid-list-xl fluid>
        <v-stepper v-model="stepper">
            <v-stepper-header>
                <div class="step" v-for="(step, index) in steps" :key=index>
                <v-stepper-step
                    :edit-icon="'check'"
                    :complete-icon="'edit'"
                    :step="index + 1"
                    :complete="(index + 1 ) <= stepper"
                    :editable="(index + 1) < stepper">{{ step.label }}</v-stepper-step>
                <v-divider></v-divider>
            </div>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <step-one @next-step="nextStep(2)"></step-one>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <step-two @next-step="nextStep(3)"></step-two>
                </v-stepper-content>

                <!-- <v-stepper-content step="3">
                    <step-three @next-step="finish()"></step-three>
                </v-stepper-content> -->
                 <v-stepper-content step="3">
                    <step-four @next-step="finish()" ></step-four>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
      </v-container>
  </div>
</template>

<script>
import stepOne from './stepOne'
import stepTwo from './stepTwo'
// import stepThree from './stepThree'
import stepFour from './stepFour'
import { mapState,mapGetters } from 'vuex'
import {crearProducto} from '@/packages/libreriaDeAccesos'
export default {
    computed:{ 
    ...mapState({
    // arrow functions can make the code very succinct!
        fileForDelete: state => state.product.fileForDelete,
    }),
    ...mapGetters([
        'hasPermission',
    ]),

  },
data () {
      return {
        crearProductoVar: crearProducto,
        method:'post',
        stepper: 0,
        steps: [
            {
                label: 'product',
                completed: false,
            },
            {
                label: 'description and characteristic',
                completed: false,
            },
            {
                label: 'imagenes',
                completed: false,
            },
        ],
      }
    },
    created(){
        this.$store.dispatch('clearFields')
        // if(!this.hasPermission(this.crearProductoVar)){
            //     this.$router.push({ name: 'withoutAccess' })
        // }
        if(this.$route.meta.mode === 'edit') {
            this.method = 'put'
            this.fillProductForUpdate()
        }else{
          this.$store.dispatch('hasThisPermission',this.crearProductoVar)
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
        stepOne,
        stepTwo,
        // stepThree
        stepFour
    },
    methods:{
        nextStep(step){
            this.stepper = step
            // console.log('next')
        },
        finish(){
            // console.log('termino')
            let object ={
                auth:this.$store.state.auth.token,
                productId : this.$route.params.id,
                method : this.method
            }
            this.$store.dispatch('CreateAndUpdateProductSubmit',object)
            this.$store.dispatch('addingImageFirebase')
            .then((response) => {
                if(response){
                // console.log('puede seguir',response)
                    this.$store.dispatch('CreateAndUpdateCharacteristic',object)
                    this.$store.dispatch('createAndUpdateFileProduct',object)
                    if(this.method == 'put' && this.fileForDelete.length > 0){
                        this.$store.dispatch('deleteImageFirebaseAndDataBase',object)
                    }
                    this.$router.push({ name: 'mainProduct' })
                }
            })
        },
        generateUUID() { 
            var d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
                d += performance.now(); //use high-precision timer if available
            }
            var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return newGuid;
        },
        fillProductForUpdate(){
                let object ={
                    auth:this.$store.state.auth.token,
                    id : this.$route.params.id
                }
                this.$store.dispatch('fillProductById',object)
                .then(response=>{
                    if(response){
                        this.$store.dispatch('fillCharacteristicByProductId',object)
                        this.$store.dispatch('fillFileByProductId',object)
                    }
                    else{
                        this.$router.push({ name: 'withoutAccess' })
                    }
                })
        }
    }

}
</script>

<style>

</style>
