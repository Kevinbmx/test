<template>
<div>
    <v-layout row>
        <v-flex xs12 sm12 md12>
            <v-alert
        v-if="mostrar"
      :value="true"
      type="info"
    >
      Debes subir al menos una sola imagen.
    </v-alert>
        </v-flex>
    </v-layout>
    <v-layout  wrap>
     
        <v-flex xs12 sm6 md3>
            <v-card>
                <v-img
                :src="imageUrl1"
                :lazy-src="imageUrl1"
                aspect-ratio="1"
                contain
                >
                </v-img>
                
                <v-card-actions>
                    <v-btn flat color="orange" @click="onPickFile(1)">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked">
                    <v-btn flat color="orange" @click="deleteImage(1)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card>
                <v-img
                :src="imageUrl2"
                :lazy-src="imageUrl2"
                aspect-ratio="1"
                contain
                >
                </v-img>
                
                <v-card-actions>
                    <v-btn flat color="orange" @click="onPickFile(2)">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked">
                    <v-btn flat color="orange" @click="deleteImage(2)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>  <v-flex xs12 sm6 md3>
            <v-card>
                <v-img
                :src="imageUrl3"
                :lazy-src="imageUrl3"
                aspect-ratio="1"
                contain
                >
                </v-img>
                
                <v-card-actions>
                    <v-btn flat color="orange" @click="onPickFile(3)">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked">
                    <v-btn flat color="orange" @click="deleteImage(3)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6 md3>
            <v-card>
                <v-img
                :src="imageUrl4"
                :lazy-src="imageUrl4"
                aspect-ratio="1"
                contain
                >
                </v-img>
                
                <v-card-actions>
                    <v-btn flat color="orange" @click="onPickFile(4)">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked">
                    <v-btn flat color="orange" @click="deleteImage(4)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex xs12 sm6 md3>
            <v-card>
                <v-img
                :src="imageUrl5"
                :lazy-src="imageUrl5"
                aspect-ratio="1"
                contain
                >
                </v-img>
                
                <v-card-actions>
                    <v-btn flat color="orange" @click="onPickFile(5)">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked">
                    <v-btn flat color="orange" @click="deleteImage(5)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>

            
  </v-layout>
          <!-- <v-btn
  color="primary"
  @click="validate()"
  >
  finish
  </v-btn> -->
   <v-btn
      :disabled="dialog"
      :loading="dialog"
      class="white--text"
      color="primary"
      @click="validate()"
    >
      finalizar
    </v-btn>
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Guardando producto
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
 import { mapState } from 'vuex'; 
export default {
      data () {
      return {
           dialog: false,
        mostrar:false,
        number:'',
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        imageUrl4: '',
        imageUrl5: '',
      }
    },
     watch: {
      dialog (val) {
        if (!val) return

        setTimeout(() => (this.dialog = false), 4000)
      }
    },
     computed:{
    ...mapState(['files'])
     
    },
    methods:{
        onPickFile (number) {
            this.number=number
            this.$refs.fileInput.click()
        },
        deleteImage(number){
            if(number == 1){
                this.imageUrl1 = ''
            }
            else if(number ==2){
                this.imageUrl2 = ''
            }
             else if(number ==3){
                this.imageUrl3 = ''
            }
             else if(number ==4){
                 this.imageUrl4 = ''
            }
             else if(number ==5){
                 this.imageUrl5 = ''
            }
         
            this.$store.dispatch('deleteFile', number)
        },
        onFilePicked (event) {
            const files = event.target.files
            let objFile={
                number:this.number,
                file:files,
                uuid:this.generateUUID()
            }
             this.$store.dispatch('addFile', objFile)
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
            return alert('Please add a valid file!')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                if(this.number == 1){
                    this.imageUrl1 = fileReader.result
                }
                else if(this.number==2){
                    this.imageUrl2 = fileReader.result
                }
                else if(this.number==3){
                    this.imageUrl3 = fileReader.result
                }
                else if(this.number==4){
                    this.imageUrl4 = fileReader.result
                }
                else if(this.number==5){
                    this.imageUrl5 = fileReader.result
                }
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]
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
        validate(){
            let contador = 0
            if(this.imageUrl1 == ''&&this.imageUrl2==''&&this.imageUrl3==''&&this.imageUrl4==''&&this.imageUrl5==''){
                contador++
            }
            // console.log(contador)
            if(contador==1){
                // console.log('mostrar')
                this.mostrar = true
            }else{
                // console.log('no mostrar')
                this.mostrar = false
                this.dialog = true
                this.$emit('next-step')
            }
        },
    }
}
</script>

<style>

</style>
