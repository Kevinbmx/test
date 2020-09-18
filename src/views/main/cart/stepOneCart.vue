<template>
<div>
    <div v-if="this.$store.state.carrito.carrito.length > 0">
        <v-flex xs12 md12 sm12>
            <v-layout wrap justify-space-between>
                <v-flex md2 sm2 > 
                    productos
                </v-flex>
                <v-flex md3 sm3 offset-md7> 
                    precio
                </v-flex>
            </v-layout>
        </v-flex>
        <v-divider ></v-divider>
        <div v-for="(cart,index) in this.$store.state.carrito.carrito" :key="index">
            <v-layout wrap justify-space-between pt-3>
                <v-flex md12 sm12 xs12 class="align-rigth" > 
                    <v-tooltip color="red" left>
                        <v-btn flat small icon slot="activator" @click="eliminarItem(cart)" color="pink">
                            <v-icon>clear</v-icon>
                        </v-btn>
                        <span>eliminar</span>
                    </v-tooltip>
                </v-flex>
                <v-flex xs12 md2 sm2 >
                    <router-link :to="{ name: 'productDetail',params: { id: cart.product.id }}">
                        <v-img
                        :src= cart.product.file[0].path
                        aspect-ratio="2"
                        contain
                        >
                        </v-img>
                    </router-link>
                </v-flex>
                <v-flex xs12 md5 sm5 >
                        <v-flex md12 xs12 pa-0 > 
                            <router-link :to="{ name: 'productDetail',params: { id: cart.product_id } }">
                                <h3 class="text-justify">{{cart.product.name}}</h3>
                            </router-link>
                        </v-flex>
                        <v-flex md12 xs12 pa-0  > 
                            <v-layout wrap class="align-center">
                                <v-flex md2 xs3 sm2>
                                    <v-tooltip color="red" bottom>
                                        <v-btn flat small icon slot="activator"  color="red" @click="changeQuantityCarrito(cart,'restar')">
                                            <v-icon>remove</v-icon>
                                        </v-btn>
                                        <span>disminuir</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex md2 xs6 sm1>
                                    <p>{{cart.quantity}}</p>
                                    <!-- <v-text-field
                                        :disabled = true
                                        v-model="cart.quantity"
                                        label="cantidad"
                                    >
                                    </v-text-field> -->
                                </v-flex>
                                <v-flex md2 xs3 sm2>
                                    <v-tooltip color="primary" bottom>
                                        <v-btn flat small icon slot="activator" color="primary" @click="changeQuantityCarrito(cart,'sumar')">
                                            <v-icon>add</v-icon>
                                        </v-btn>
                                        <span>aumentar</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex md2 xs12 sm2>
                                    <!-- <v-btn flat >Eliminar</v-btn> -->
                                </v-flex>
                            </v-layout>
                        </v-flex>
                </v-flex>
                <v-flex xs12 md3 sm3 style="display:flex; color: #D90000;" >
                    <h3>{{cart.product.price | moneda }}</h3> <p class="margin-price"> &nbsp; Bs.</p>
                </v-flex>
            </v-layout>
            <v-divider ></v-divider>
        </div>
        
        <v-flex xs12 md12 sm12 style="display:flex; justify-content: flex-end;">
            <p>subtotal({{this.$store.getters.getCantidadCarrito +' productos'}}): &nbsp;</p> <span style="color: #D90000;">{{this.$store.getters.getSubtotalCarrito | moneda }} Bs.</span>
        </v-flex>
        
        <div class="align-rigth">
            <v-btn  color="primary" @click="validate()">
                Siguiente
            </v-btn>
        </div>
    </div>
    <div v-else>
        Tu carrito est&aacute; vac&iacute;o
        <v-btn :to="{ name: 'categories'}" color="primary" >
            Ir a categorias
        </v-btn>
    </div>
</div>
</template>

<script>
export default {

    data () {
        return {
            cantidad: [],
            carrito:''
        }
    },
    methods:{
        eliminarItem(cart){
            this.$store.dispatch('eliminarItem',cart)
        },
        changeQuantityCarrito(cart, action){
            let objcarrito = {
                'pedido_id' : cart.pedido_id,
                'product_id'  : cart.product_id,
                'quantity' : cart.quantity,
                'price' : cart.product.price
            }
            var quantityProduct = cart.product.quantity
            if(action == 'restar'){
                objcarrito.quantity --
            }else if(action == 'sumar'){
                objcarrito.quantity ++
            }
            if(objcarrito.quantity > 0 && objcarrito.quantity <=  quantityProduct){
                this.$store.dispatch('createAndUpdateCarrito',objcarrito)
                .then(response =>{
                    if(response){
                        // console.log('entro a actualizar')
                    }
                })
            }else{
                // console.log('no se puede hacer nada')
            }
        },
        validate(){
        this.$validator.validate().then(result => {
            if (result) {
                if(this.$store.state.auth.token == null){
                    this.$router.push({ name: 'login' })
                }else{
                    this.$emit('next-step')
                }
            }
        });
        }
    }
}
</script>

<style  scoped>
    .align-rigth{
        text-align: right;
        padding: 0px 5px !important;
    }
    .align-center{
        text-align: center;
    }
    .margin-price{
        margin-bottom: 0px;
        margin-top: 3px;
    }
</style>