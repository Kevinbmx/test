<template>
<div style="background:white;">
    <v-layout row wrap mb-3>
      <v-flex md6>
        <v-container>
          <v-layout row wrap mb-3 class="showTittleImage">
              <v-flex md12>
              <span>Marca: <strong>{{productDetail.brand}}</strong></span>
            </v-flex>
            <v-flex md12>
              <h2>{{productDetail.name}}</h2>
            </v-flex>
          </v-layout>
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
      </v-flex>
      <v-flex md6>
        <template>
          <v-container>
            <v-layout row wrap mb-3 class="showTittle">
              <v-flex md12>
                <h2>{{productDetail.name}}</h2>
              </v-flex>
              <v-flex md7>
                <span>Marca: <strong>{{productDetail.brand}}</strong></span>
              </v-flex>
            </v-layout>
              <v-divider></v-divider>
            <v-layout row wrap mb-3>
              <v-flex xs12 md12 mt-2 order-xs1 order-md1 style="display:flex; color: #D90000;">
                <h1>{{productDetail.price}}  </h1><p> Bs.</p>
              </v-flex>
              <v-flex xs12 md12 order-xs3 order-md2 mt-2>
                <strong>Caracteristicas:</strong>
              </v-flex>
              <v-flex xs12 md12 order-xs4 order-md3 mt-2>
                <ul>
                  <li v-for="(characteristic,index) in productDetail.characteristic" :key="index">
                    <span> {{characteristic.characteristic}}</span>
                  </li>
                </ul>
              </v-flex>
              <v-flex xs12 md12 order-xs5 order-md4 mt-2>
                <strong>Descripcion:</strong>
              </v-flex>
              <v-flex xs12 md12 order-xs6 order-md5 mt-2 >
                <span>{{productDetail.description}}</span>
              </v-flex>
              <v-flex xs2 md2 order-xs2 order-md6 mt-3>
                <v-select
                  :items="cantidad"
                  label="Cantidad"
                  no-data-text="no hay stock"
                  v-model="cantidadSelected"
                  :error="errorComboBox"
                  outlined
                ></v-select>
            
              </v-flex>
              <v-flex xs12 md12 order-xs2 order-md7 mt-3>
                <v-btn block color="secondary" @click="addCarrito" dark>añadir al carrito  <v-icon right dark>shopping_cart</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </template>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex md12>
        <template>
          <v-divider></v-divider>
          <v-container fluid  pa-0 >
            <v-layout row >
              <v-flex xs12 pa-2>
              productos que te puedan interesar
              </v-flex>
            </v-layout>
            <v-layout row wrap >
              <v-flex xs6 sm4 md2 lg2 pa-2 v-for="(product,index) in productRandom" :key="index">
                <v-hover>
                  <v-card
                  slot-scope="{ hover }"
                  :class="`elevation-${hover ? 12 : 2}`"
                  class="mx-auto eliminar-shadow"
                  >
                  <!-- {{product}} -->
                    <router-link :to="{ name: 'productDetail',params: { id: product.id } }" exact>
                      <v-img
                        :aspect-ratio="1.6"
                        :src="product.file[0].path"
                        :lazy-src="product.file[0].path"
                        contain
                      ></v-img>
                      <p>{{product.name}}</p>
                      <span style="color:rgb(217, 0, 0);">{{product.price}}Bs.</span>
                    </router-link>
                  </v-card>
                </v-hover>
              </v-flex>
            </v-layout>
          </v-container>
        </template>
      </v-flex>
    </v-layout>
</div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
// import touch from '@/components/widgets/touchSpin/TouchSpin'
import {ProductDetailUrl,productRandomUrl} from '@/packages/config'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide,
    // touch
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
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
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
/* .gallery-top {
  height: 64% !important;
  width: 80%;
} */
/* .gallery-thumbs {
  height: 20% !important;
  width: 80%;
} */
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
.swiper-button-prev {
  background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z' fill='#E78127'/></svg>") !important;
}

.swiper-button-next {
  background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z' fill='#E78127'/></svg>") !important;
}
#product {
  width: 400px;
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
