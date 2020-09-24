<template>
  <div style="background:white;">
    <!-- <v-breadcrumbs class="breadCrumbs" :items="items" divider=">"></v-breadcrumbs> -->
      <v-layout row wrap>
        <v-flex md12 v-if="haveProductAndCategory">
          <v-layout row wrap mb-4 class="text-md-center" v-show="allCategory.length > 0"> 
            <v-flex xs12 sm12 md12 lg12 mt-4 mb-3  > 
            <span class="titleCategory">Compra por Categoria</span>
              <!-- <h3 class="text-md-center">Compra por Categoria</h3> -->
            </v-flex>
            <!-- <router-link :to="{ name: 'search',query: { id: 5, page: 1} }" > first   page </router-link>
            <router-link :to="{ name: 'search',query: { id: 5, page: 2} }" > second page </router-link> -->
            <v-flex xs6 sm3 md3 pa-2 v-for="(category,index) in allCategory" :key="index">
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
                <!-- <v-card-title v-show="category.children.length > 0">
                  <div>
                    <ul>
                        <li v-for="(children,index) in category.children" :key="index">
                          <router-link :to="{ name: 'perCategory',params: { id: children.id } }">
                            {{children.name}}
                          </router-link>
                          </li>
                    </ul>
                  </div>
                </v-card-title> -->
              </v-card>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap mt-4>
            <v-flex xs12 sm4 md2 lg2 px-2 pt-2 v-for="(product,index) in allProduct" :key="index">
              <!-- {{product}} -->
              <v-hover>
                <v-card
                class="mx-auto eliminar-shadow"
                >
                  <router-link :to="{ name: 'productDetail',params: { id: product.id} }" >
                    <v-layout row wrap mpb-1>
                      <v-flex xs5 sm12 md12>
                        <v-img
                          :aspect-ratio="1.3"
                          :src="product.file[0].path"
                          :lazy-src="product.file[0].path"
                          contain
                        ></v-img>
                      </v-flex>
                      <v-flex xs7 sm12 md12 pl-2 pb-2 >
                        <p>{{product.name}}</p>
                        <span  style="color:rgb(217, 0, 0);">{{product.price}}Bs.</span>
                      </v-flex>
                    </v-layout>
                  </router-link>
                </v-card>
              </v-hover>
              <v-divider ></v-divider>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-else>
          no se encontro ningun resultado
        </v-flex>
      </v-layout>
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
