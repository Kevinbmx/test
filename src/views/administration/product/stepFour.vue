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
        <v-flex xs12 sm6 md3  v-for="(file,index) in files" :key="index">
            <v-card>
                <v-img
                :src="file.url"
                :lazy-src="file.url"
                aspect-ratio="1"
                contain
                >
                </v-img>
                
                <v-card-actions>
                    <v-btn flat color="orange" @click="onPickFile(index)">Upload Image</v-btn>
                    <input
                        type="file"
                        style="display: none"
                        ref="fileInput"
                        accept="image/*"
                        @change="onFilePicked">
                    <v-btn flat color="orange" v-show="dessapearDeleteButton" @click="deleteFileImage(index)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
      <v-flex xs12 sm6 md3 >
     <v-btn @click="addFileImage" :disabled="disableButtonAddFile" >otro</v-btn>
      </v-flex>
  </v-layout>
   <v-btn
      :disabled="dialogButton"
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
import { mapGetters } from 'vuex'
import { mapMultiRowFields } from "vuex-map-fields";
export default {
      data () {
      return {
        dialogButton:true,
        dialog: false,
        mostrar:true,
        index:'',
        disableButtonAddFile:true,
        dessapearDeleteButton:true
      }
    },
    mounted(){
      for (let index = 0; index < this.fileGetter.length; index++) {
        const element = this.fileGetter[index];
        if(element.url==''){
          this.disableButtonAddFile=false
          this.dialogButton = false
        }
      }
    },
     watch: {
      dialog (val) {
        if (!val) return

        setTimeout(() => (this.dialog = false), 4000)
      }
    },
  
     computed:{
    ...mapMultiRowFields(["files"]),
    ...mapGetters([
            'fileGetter',
        ]),
    },
    methods:{
       
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
        onFilePicked (event) {
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
              return alert('Please add a valid file!')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
            let object ={
                    index : this.index,
                    url : fileReader.result,
                    file:files,
                    uuid:this.generateUUID()
            }
            this.$store.dispatch('putImage',object)
            })
            fileReader.readAsDataURL(files[0])
            var sizeFile = this.fileGetter.length
            if(sizeFile == this.$store.state.product.maxUploadImage){
                this.disableButtonAddFile = true
                  this.dialogButton = false
            }else{
            this.image = files[0]
            this.disableButtonAddFile = false
            this.mostrar = false
            this.dessapearDeleteButton=true
            this.dialogButton = false
            }
        },
        onPickFile (index) {
            this.index = index
            this.$refs.fileInput[index].click()
        },
        deleteFileImage(index){
          var sizeFile = this.fileGetter.length
          if((sizeFile-1) > 0){
            this.$store.dispatch('deleteFileImage',index)
            this.disableButtonAddFile = false
            this.dialogButton = false
          }else
            if(index==0 && this.files[0].url !== ''){
                this.$store.dispatch('emptyFile',index)
                this.disableButtonAddFile = true
                this.dialogButton = true
            }
        },
        addFileImage(){
            this.disableButtonAddFile = true
            this.dialogButton = true
        
            var sizeFile = this.fileGetter.length
            if(sizeFile < this.$store.state.product.maxUploadImage){
              if(sizeFile == 0){
                this.$store.dispatch('addFileImage')
                return
              }
              if(this.fileGetter[(sizeFile-1)].url !== ''){
                this.$store.dispatch('addFileImage')
              }else{
                this.disableButtonAddFile = false
              }
            } 
        },
        validate(){
                this.$emit('next-step')
        }
       
    }
}
</script>

<style>

</style>
