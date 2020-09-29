<template>
  <div style="background:white;">
    <v-row no-gutters class="mb-3">
      <v-col cols="12" md="6" >
        <v-container>
          <v-row no-gutters class="mb-3 showTittleImage">
            <v-col cols="12" >
              <span>Marca: <strong>{{productDetail.brand}}</strong></span>
            </v-col>
            <v-col cols="12">
              <h2>{{productDetail.name}}</h2>
            </v-col>
          </v-row>
        </v-container>
        <swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop">
          <swiper-slide v-for="image in productDetail.file " :key="image.index" class="slide-img">
            <!-- <img :src="image.link" alt=""> -->
            <v-img
              :src="image.path"
              :lazy-src="image.path"
              
              aspect-ratio="1.7" 
              contain
            >
            </v-img>
          </swiper-slide>
          <div class="swiper-button-next" slot="button-next"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
        </swiper>
        <!-- swiper2 Thumbs -->
        <swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
          <swiper-slide v-for="image in productDetail.file" :key="image.index" class="slide-img">
            <v-img
                  :src="image.path"
                  :lazy-src="image.path"
                  aspect-ratio="1"
                  contain
                  >
                  </v-img>
            <!-- <img :src="image.link" alt=""> -->
          </swiper-slide>
        </swiper>
      </v-col>
      <v-col cols="12" md="6" class="pa-4">
        <v-row no-gutters class="mb-3 showTittle">
          <v-col cols="12">
            <h2>{{productDetail.name}}</h2>
          </v-col>
          <v-col cols="7">
            <span>Marca: <strong>{{productDetail.brand}}</strong></span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters class="mb-3">
          <v-col cols="12" md="12" class="mt-2" order="1" order-md="1" style="display:flex; color: #D90000;">
            <h1>{{productDetail.price}}  </h1><p> Bs.</p>
          </v-col>
          <v-col cols="12" md="12" order="3" order-md="2" class="mt-2">
            <strong>Caracteristicas:</strong>
          </v-col>
          <v-col cols="12" md="12" order="4" order-md="3"  class="mt-2">
            <ul>
              <li v-for="(characteristic,index) in productDetail.characteristic" :key="index">
                <span> {{characteristic.characteristic}}</span>
              </li>
            </ul>
          </v-col>
          <v-col cols="12" md="12" order="5" order-md="4"  class="mt-2">
           <strong>Descripcion:</strong>
          </v-col>
          <v-col cols="12" md="12" order="6" order-md="5" class="mt-2">
            <span>{{productDetail.description}}</span>
          </v-col>
          <v-col cols="4" md="3" order="2" order-md="6"  class="mt-3">
            <v-select
                :items="cantidad"
                label="Cantidad"
                no-data-text="no hay stock"
                v-model="cantidadSelected"
                :error="errorComboBox"
            ></v-select>
          </v-col>
          <v-col cols="12" md="12" order="2" order-md="7"  class="mt-2">
            <v-btn block color="secondary" @click="addCarrito" dark>añadir al carrito  <v-icon right dark>shopping_cart</v-icon></v-btn>
          </v-col>
        </v-row>
     
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="12" class="pa-3">
          productos que te puedan interesar
      </v-col>
      <v-col cols="12" sm="4" md="2" class="px-2 pt-2" v-for="(product,index) in productRandom" :key="index">
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
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import {ProductDetailUrl,productRandomUrl} from '@/packages/config'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide,
  },
  data:()=>({
    cantidad: [],
    cantidadSelected:'',
    errorComboBox:true,
    parameterId:'',
    productDetail:'',
    productRandom:'',
    swiperOptionTop: {
      initialSlide: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    },
    swiperOptionThumbs: {
      initialSlide: 1,
      spaceBetween: 20,
      centeredSlides: true,
      slidesPerView: "auto",
      touchRatio: 0.2,
      slideToClickedSlide: true
    }
  }),
  created(){
    this.fillProductDetail(this.$route.params.id)
    this.fillProductRandom()
    //  this.fetchData()
  },
  methods:{
    fillProductDetail($id){
      this.$myApi.get(ProductDetailUrl+'/'+$id)
      .then(response => {
        this.productDetail = response.data
        this.fillComboBoxCantidad(response.data.quantity)
      })
    },
    fillProductRandom(){
      this.$myApi.get(productRandomUrl)
      .then(response => {
        this.productRandom = response.data
      })
    },

    fillComboBoxCantidad(cantidad){
      this.cantidad = []
      if(cantidad > 0 ){
        for (var x=0 ; x < cantidad ; x++){
          this.cantidad.push(x+1) 
        }
      }
    },
    async addCarrito(){
      if(localStorage.getItem('pedido_id') == null || this.$store.state.carrito.pedido == null){
        await this.$store.dispatch('createPedido')
        // console.log('entro a crear pedido')
      }
      let object ={
            pedido:this.$store.state.carrito.pedido,
            cantidadSelected : this.cantidadSelected,
            product : this.productDetail,
      }
        await this.$store.dispatch('addCarrito', object)
    }
  },
watch: { 
  '$route.params.id': function(search) {
    // console.log(search);
      this.fillProductDetail(search)
  },
  cantidadSelected(){
    this.errorComboBox = false
  }
},
  
mounted() {
  this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.swiper
      const swiperThumbs = this.$refs.swiperThumbs.swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  }
}
</script>

<style scoped>
.gallery-thumbs .swiper-slide {
  width: 100px;
  height: 100px;
  opacity: 0.4;
}
.gallery-thumbs .swiper-slide-active {
  opacity: 1;
}
img {
  width: inherit;
  height: inherit;
}

.showTittleImage{
  display: none;
}
@media screen and (max-width: 425px) {
  .gallery-thumbs.gallery-thumbs .swiper-slide {
    width: 56px
  }

}
@media screen and (max-width: 768px) {
  .showTittleImage{
    display: block
  }
  .showTittle{
    display: none;
  }
}
p{
  margin-bottom: 0px;
  margin-top: 16px;
}

ul li::before {
  content: "\2022";
  color: #111;
  font-weight: bold;
  display: inline-block; 
  width: 1em;
  margin-left: -1em;
  line-height: 23px;
}
.slide-img{
  height: 100% !important;
}
a{
  text-decoration: none;
}
span{
  line-height: 23px;
}
.breadCrumbs{
  background-color: whitesmoke;
  padding: 5px 12px;
}
</style>
