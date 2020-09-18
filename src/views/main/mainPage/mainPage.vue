<template>
  <div>
    <v-carousel height=400  cycle hide-delimiters>
      <v-carousel-item
      :src="'//cdn.shopify.com/s/files/1/0177/6500/7432/files/bike-to-school-2019.08.15_1800x533.jpg?v=1565890178'"
      >
      </v-carousel-item>
      <v-carousel-item
      :src="'https://picsum.photos/2983/1542/?image=841'"
      >
      </v-carousel-item>
    </v-carousel>
    <v-container fluid grid-list-xl class="white">
    <v-container fluid grid-list-xl pa-0 >
      <v-layout row wrap>
        <v-flex xs12 pa-2>
        Compra por Categorias
        </v-flex>
        <v-flex xs6 sm6 md3 pa-2 v-for="(category,index) in categoryRandom" :key="index">
            <v-card
            class="mx-auto eliminar-shadow"
            >
              <router-link :to="{ name: 'search',query: { id: category.id } }">
            <v-img
              :aspect-ratio="1.7"
              :src="category.path"
              :lazy-src="category.path"
            ></v-img>
            {{category.name}}
              </router-link>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    </v-container>
    <v-container fluid grid-list-xl mt-3 class="white">
    <v-container fluid  pa-0 >
      <v-layout row >
        <v-flex xs12 pa-2>
        algunos de nuestro producto
        </v-flex>
      </v-layout>
      <v-layout row wrap >
        <v-flex xs6 sm4 md2 lg2 pa-2 v-for="(product,index) in productRandom" :key="index">
          <v-hover>
            <v-card
          
          
            class="mx-auto eliminar-shadow"
            >
            <!-- {{product}} -->
            <router-link :to="{ name: 'productDetail',params: { id: product.id } }">
            <v-img
              :aspect-ratio="1.1"
              :src="product.file[0].path"
              :lazy-src="product.file[0].path"
              contain
            ></v-img>
            </router-link>
          </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
    </v-container>
  </div>
</template>

<script>
import {categoryRandomUrl,productRandomUrl} from '@/packages/config'
export default {
  data: () => ({
    categoryRandom : "",
    productRandom : ""
    }),
    created(){
      this.fillCategoryRandom()
      this.fillProductRandom()
    },
  mounted() {
  //   this.mySiema = new Siema({
  //      perPage: {
  //        300:2,
  //        750:3,
  //   800: 4,
  //   1240: 5 
  // }
  //   })
  },
  methods:{
    fillCategoryRandom(){
      this.$myApi.get(categoryRandomUrl)
      .then(response => {
        this.categoryRandom = response.data
      })
    },
      fillProductRandom(){
      this.$myApi.get(productRandomUrl)
      .then(response => {
        this.productRandom = response.data
      })
    }
  }
}
</script>

<style>
  .eliminar-shadow{
    -webkit-box-shadow:none !important;
    box-shadow:none !important;
  }
  a{
    text-decoration: none;
  }
  
</style>
