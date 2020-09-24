<template>
  <div id="pageIndexCategory">
    <v-container grid-list-xl fluid>
      <v-card>
        <v-container fill-height fluid>
          <v-layout row wrap>
            <div v-if="this.hasPermission(this.crearCategoriaVar)">
              <v-flex lg2 xs12 sm12 md2 pa-0 v-if="getsize() == 0">
                <v-btn  slot="activator" @click="opendialog('dialog_form','addNewCategory')"  color="primary" dark>new Category</v-btn>
              </v-flex>
              <v-flex lg2 xs12 sm12 md2 pa-0 v-if="getsize() > 0">
                <v-btn  slot="activator" @click="opendialog('dialog_form','addParentCategory')" color="teal" dark>add parent</v-btn>
              </v-flex>
              <v-flex lg2 xs12 sm12 md2 pa-0 v-if="getsize() == 1">
                <v-btn  slot="activator" @click="opendialog('dialog_form','addChildrenCategory')" color="cyan" dark>add children</v-btn>
              </v-flex>
            </div>
            <div v-if="this.hasPermission(this.insertarImagenCategoriaVar)">
              <v-flex lg2 xs12 sm12 md2 pa-0 v-if="getsize() == 1  && getsize() < 2">
                <v-btn  slot="activator" @click="opendialog('dialog_image','imageCategory')" color="error">Ver Imagen</v-btn>
              </v-flex>
            </div>
            <div v-if="this.hasPermission(this.eliminarCategoriaVar)">
              <v-flex lg2 xs12 sm12 md2 pa-0 v-if="getsize() == 1">
                <v-btn  slot="activator" @click="opendialog('dialog_delete','deleteCategory')" color="error">delete</v-btn>
              </v-flex>
             </div>
            <v-dialog v-model="dialog_form" persistent max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="headline">Category Name</span>
                </v-card-title>
                <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Category name" v-model="nameCategory"  required></v-text-field>
                      </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click="ClearAndhideDialog('dialog_form')">Cerrar</v-btn>
                  <v-btn color="blue darken-1" flat @click="categorySubmit('dialog_form')">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog> 
            <v-dialog v-model="dialog_delete" persistent max-width="500px">
                <v-card>
                <v-card-title class="headline">Quieres eliminar esta categoria?</v-card-title>
                <v-card-text class="text-xs-center"><v-icon size=177 color="red darken-2">error</v-icon></v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click="ClearAndhideDialog('dialog_delete')">Cerrar</v-btn>
                  <v-btn color="blue darken-1" flat @click="categorySubmit('dialog_delete')">de acuerdo</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialog_image" persistent max-width="500px">
              <v-card>
                <v-card-title class="headline">Imagen de Categoria</v-card-title>
                <!-- <v-img src="https://picsum.photos/510/300?random" aspect-ratio="2" contain></v-img> -->
                <v-img
                @click="onPickFile()"
                :src="getImage.path"
                :lazy-src="getImage.path"
                aspect-ratio="2"
                contain
                ></v-img>
                <input
                      type="file"
                      style="display: none"
                      ref="fileInput"
                      accept="image/*"
                      @change="onFilePicked">
                <!-- {{getImage}} -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click="ClearAndhideDialog('dialog_image')">Cerrar</v-btn>
                  <v-btn color="blue darken-1" flat @click="categorySubmit('dialog_image')">de acuerdo</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialog_errorMatch" persistent max-width="500px">
              <v-card>
                <v-card-title class="headline">Chequeo incorrecto</v-card-title>
                <v-card-text class="text-xs-center"><v-icon size=177 color="red darken-2">error</v-icon></v-card-text>
                <v-card-actions>
                  <v-card-text>
                    <v-layout wrap>
                      'debes de chequear de la misma raiz!'
                    </v-layout>
                  </v-card-text>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click="dialog_errorMatch = false">Cerrar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>  
            <v-flex lg12 sm12 xs12>
              <div>
                <node-tree v-for="(child,index) in getCategory" :key="index" :node="child"></node-tree>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
/**
 * TODO:
 *
 *
 * FIXME:
 * -arreglar el chequeo automatico cuando creas , añadis nuevo padre, y creas hijo
 * -arreglar el chequeo automatico cuando se quiere chequear en una raiz no correspondiente
*/
import NodeTree from "./nodeTree";
import { mapGetters,mapState } from 'vuex'
import {crearCategoria,listarCategoria,eliminarCategoria,insertarImagenCategoria} from '@/packages/libreriaDeAccesos'


export default {
   props:{
    tittleDialog:{
      type:String,
    },
    textDialog:{
      type:String,
    }
  },
  data: () => ({
    nameCategory : "",
    nameMethod:'',
    loading: false,
    dialog_form: false,
    dialog_delete:false,
    dialog_errorMatch:false,
    dialog_image:false,
    crearCategoriaVar : crearCategoria,
    insertarImagenCategoriaVar:insertarImagenCategoria,
    eliminarCategoriaVar:eliminarCategoria,
    listarCategoriaVar:listarCategoria
  }),
  components: {
    NodeTree,
  },
  created (){
      this.$store.dispatch('retrieveCategory')
      .then(response=>{
        if(!response){
          this.$router.push({ name: 'withoutAccess' })
        }
      })
  },
  computed:{
    ...mapGetters([
      'getImage',
      'hasPermission',
      'getCategory'
    ]),
    ...mapState([
      'acceso',
    ]),
  },
  methods:{
    onPickFile () {
        this.$refs.fileInput.click()
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
              path : fileReader.result,
              file:files,
              uuid:this.generateUUID()
      }
      this.$store.dispatch('putImageCategory',object)
      })
      fileReader.readAsDataURL(files[0])
    },
    getsize(){
      return this.$store.getters.getsize
    },
    categorySubmit(dialogName){
      // console.log('entra al metodo',this.nameMethod)
        if (this.nameMethod ==="addNewCategory" && this.hasPermission(this.crearCategoriaVar))
        {
          this.$store.dispatch('addCategorySubmit',
          {
            name: this.nameCategory,
            parent_id: 0,
          }).catch(()=>{
            // console.log(error)
          })
        }
        else if(this.nameMethod ==="addParentCategory" && this.hasPermission(this.crearCategoriaVar))
        {
          this.$store.dispatch('addParentSubmit',
          {
            name: this.nameCategory,
          }).catch(()=>{
            // console.log(error)
          })
        }
        else if(this.nameMethod =="addChildrenCategory" && this.hasPermission(this.crearCategoriaVar))
        {
          this.$store.dispatch('addChildrenSubmit',
          {
            name: this.nameCategory,
          }).catch(()=>{
            // console.log(error)
          })
        }
      else if(this.nameMethod =="deleteCategory" && this.hasPermission(this.eliminarCategoriaVar)){
        // console.log('entraaaaaaa')
        this.$store.dispatch('deleteCategorySubmit')
          .catch(()=>{
            // console.log(error)
          })
        }
      else if(this.nameMethod =="imageCategory"  && this.hasPermission(this.insertarImagenCategoriaVar)){
          this.$store.dispatch('createImageCategory')
          .catch(()=>{
            // console.log(error)
          })
        }
      else{
       this.$router.push({ name: 'withoutAccess' })
      }
        this.ClearAndhideDialog(dialogName)
    },

    ClearAndhideDialog(dialogName){
      if(dialogName=='dialog_form'){
        this.nameCategory = ""
        this.$validator.reset()
        this.dialog_form = !this.dialog_form
      }
      else if(dialogName == 'dialog_delete'){
        this.dialog_delete = !this.dialog_delete
      }else{
        if(!this.dialog_image){
          this.$store.dispatch('getImageCategory')
          .catch(()=>{
            // console.log(error)
          })
        }
        this.dialog_image = !this.dialog_image
      }
    },

    abrirPopupError(){
      this.dialog_errorMatch =  true
    },

    opendialog(dialogName,actionName){
    //  DialogName = true
      this.nameMethod = actionName
      this.ClearAndhideDialog(dialogName)
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
  }
};
</script>

<style>
  /* ul, li{
    margin-top: 10px;
    margin-bottom: 10px;

  } */
</style>
