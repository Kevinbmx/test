<template>
  <div style="background:white;">
    <v-row no-gutters v-if="haveProductAndCategory &&  allCategory.length > 0">
      <v-col cols="12" class="pa-2 mt-4 mb-3 text-md-center">
         <span class="titleCategory">Compra por Categoria</span>
      </v-col>
      <v-col cols="6" sm="3" md="3" class="pa-2" v-for="(category,index) in allCategory" :key="index">
       <v-card class="eliminar-shadow">
          <router-link :to="{ name: 'search',query: { id: category.id } }">
            <v-layout class="fondoNameCategory">
              <v-flex xs12 align-end flexbox class="quitarPadding">
                <span class="headline">{{category.name}}</span>
              </v-flex>
            </v-layout>
            <v-img
              class="white--text"
              :aspect-ratio="1.6"
              :src="category.path == null ? imagenNoDisponible : category.path"
            >
            </v-img>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters v-if="haveProductAndCategory &&  allCategory.length > 0">
      <v-col cols="12" sm="4" md="2" class="mt-4 px-2 pt-2" v-for="(product,index) in allProduct" :key="index" >
        <v-hover>
          <v-card class="mx-auto eliminar-shadow">
            <router-link :to="{ name: 'productDetail',params: { id: product.id} }" >
              <v-row no-gutters>
                <v-col cols="5" sm="12" md="12" >
                  <v-img
                    :aspect-ratio="1.3"
                    :src="product.file[0].path"
                    :lazy-src="product.file[0].path"
                    contain
                  ></v-img>
                </v-col>
                <v-col cols="7" sm="12" md="12" class="pl-2 pb-2">
                  <p>{{product.name}}</p>
                  <span  style="color:rgb(217, 0, 0);">{{product.price}}Bs.</span>
                </v-col>
              </v-row>
            </router-link>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row v-else>
       <v-col cols="12">
         <span class="titleCategory"> no se encontro ningun resultado</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {childPerCategoryUrl,relatedProductbyCategoryUrl,relatedProductAndCategorybySearch,imagenNoDisponibleUrl} from '@/packages/config'
export default {
  data () {
      return {
        allCategory:"" ,
        allProduct:"",
        idQuery : "",
        pageQuery : "",
        qQuery : "",
        haveQquerydata : false,
        haveProductAndCategory : true,
        imagenNoDisponible : imagenNoDisponibleUrl
      }
    },
    watch: { 
      $route () {
        this.initializeData()
        this.haveQquery(this.haveQquerydata,this.qQuery,this.idQuery)
      }
    },
    created(){
      this.initializeData()
      this.haveQquery(this.haveQquerydata,this.qQuery,this.idQuery)
    },
    methods:{
      haveQquery($haveQquerydata,$qQuery,$idQuery){
        if($haveQquerydata){
          this.FieldFillBySearch($qQuery)
          // console.log('hay query')
        }else{
          // console.log('no hay query')
          this.fillallCategory($idQuery)
          this.relatedProductbyCategory($idQuery,this.pageQuery)
        }
      },
      FieldFillBySearch($q){
        this.$myApi.get(relatedProductAndCategorybySearch+'/'+$q)
        .then(response => {
          // console.log(response.data)
          this.allCategory = response.data.category
          this.allProduct = response.data.product
          if(this.allCategory.length < 0 && this.allProduct.length < 0){
            this.haveProductAndCategory = false
          }else{
            this.haveProductAndCategory = true
          }
        })
      },
      fillallCategory($id){
        this.$myApi.get(childPerCategoryUrl+'/'+$id)
        .then(response => {
          // console.log(response.data)
          this.allCategory = response.data
        })
      },
      relatedProductbyCategory($id,$page){
        var urlFormada = ''
        if($page == null){
          urlFormada = relatedProductbyCategoryUrl+'/'+$id
        }
        else{
          urlFormada = relatedProductbyCategoryUrl+'/'+$id+'?page='+$page
        }
        this.$myApi.get(urlFormada)
        .then(response => {
          this.allProduct = response.data.data
          // this.allProduct = response.data
          // console.log(response.data.data)
        })
      },
      initializeData(){
        this.idQuery = this.$route.query.id == null ? null :this.$route.query.id;
        this.pageQuery = this.$route.query.page == null ? null : this.$route.query.page;
        this.qQuery = this.$route.query.q == null ? null : this.$route.query.q;
        if(this.qQuery !== null){
          this.haveQquerydata = true
        }else{
          this.haveQquerydata = false
        }
        
      }
    }
}
</script>

<style scoped>
ul li::before {
  content: "\2022";
  color: #111;
  font-weight: bold;
  display: inline-block; 
  width: 1em;
  margin-left: -1em;
  line-height: 23px;
}
span{
  font-size: 14px !important;
  line-height: 16px !important;
  font-style: normal!important;
    /* font-weight: regular !important; */
  text-transform: uppercase;
  /* padding: 10px 15px;
  background: rgba(0,0,0,0.3) */
}
.quitarPadding{
  text-align: center;
  padding: 0px 0px !important;
}
.eliminar-shadow{
  height: 100%;
}
.titleCategory{
  font-size: 19px !important;
    line-height: 16px !important;
    font-style: normal!important;
    text-transform: uppercase;
}
.breadCrumbs{
  background-color: whitesmoke;
  padding: 5px 12px;
}
.text-md-center{
  text-align: center;
}
</style>
