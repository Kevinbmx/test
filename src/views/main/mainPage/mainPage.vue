<template>
  <v-card>
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <v-carousel height=400  cycle hide-delimiters show-arrows-on-hover>
          <v-carousel-item
          :src="'//cdn.shopify.com/s/files/1/0177/6500/7432/files/bike-to-school-2019.08.15_1800x533.jpg?v=1565890178'"
          >
          </v-carousel-item>
          <v-carousel-item
          :src="'https://picsum.photos/2983/1542/?image=841'"
          >
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="pa-2">
        Compra por Categorias
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="6" sm="6" md="3" class="pa-2" v-for="(category,index) in categoryRandom" :key="index">
          <v-card
          class="eliminar-shadow"
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
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="pa-2">
        algunos de nuestro producto
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="6"  sm="4" md="2" class="pa-2" v-for="(product,index) in productRandom" :key="index">
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
      </v-col>
    </v-row>
  </v-card>
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
