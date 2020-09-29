<template>
    <div>
        <div v-if="this.$store.state.carrito.carrito.length > 0">
            <v-row no-gutters>
                <v-col cols="2"  md="2" sm="2" >
                      productos
                </v-col>
                <v-spacer></v-spacer>
                   <v-col cols="6" sm="3" md="3" offset-md="4">
                        precio
                </v-col>
            </v-row>
            <v-divider ></v-divider>
            <v-row no-gutters v-for="(cart,index) in this.$store.state.carrito.carrito" :key="index" class="align-center pt-3">
                <v-col cols="12"  md="12" sm="12" class="align-rigth" >
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon v-bind="attrs"
                                v-on="on" @click="eliminarItem(cart)" color="pink">
                                <v-icon  color="pink">
                                clear
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>eliminar</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12"  md="2" sm="2">
                    <router-link :to="{ name: 'productDetail',params: { id: cart.product.id }}">
                        <v-img
                        :src= cart.product.file[0].path
                        aspect-ratio="2"
                        contain
                        >
                        </v-img>
                    </router-link>
                </v-col>
                <v-col cols="12" md="7" sm="7">
                    <v-row>
                        <v-col cols="12"  md="12" class="d-flex justify-center" >
                            <router-link :to="{ name: 'productDetail',params: { id: cart.product_id } }">
                                <h3 class="text-justify">{{cart.product.name}}</h3>
                            </router-link>     
                        </v-col>
                    </v-row>
                    <v-row class="d-flex justify-center">   
                        <v-col cols="3"  md="2" sm="2" class="pa-0 ">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small icon v-bind="attrs"
                                        v-on="on" @click="changeQuantityCarrito(cart,'restar')" color="red">
                                        <v-icon color="red">
                                        remove
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>disminuir</span>
                            </v-tooltip>

                        </v-col>
                        <v-col cols="6"  md="2" sm="1" class="pa-0">
                            <p>{{cart.quantity}}</p>
                        </v-col>
                        <v-col cols="3"  md="2" sm="2" class="pa-0">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small icon v-bind="attrs"
                                        v-on="on" @click="changeQuantityCarrito(cart,'sumar')" color="primary">
                                        <v-icon color="primary">
                                        add
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>aumentar</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" sm="3" style="display:flex; color: #D90000;">
                    <h3>{{cart.product.price | moneda }}</h3> <p class="margin-price"> &nbsp; Bs.</p>
                </v-col>
            </v-row>
            <v-divider ></v-divider>
            <v-row>
                <v-col cols="12" style="display:flex; justify-content: flex-end;">
                     <p>subtotal({{this.$store.getters.getCantidadCarrito +' productos'}}): &nbsp;</p> <span style="color: #D90000;">{{this.$store.getters.getSubtotalCarrito | moneda }} Bs.</span>
                </v-col>
                <v-col cols="12" class="align-rigth ">
                    <v-btn  color="primary" @click="validate()">
                        Siguiente
                    </v-btn>
                </v-col>
            </v-row>
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
    }
    .align-center{
        text-align: center;
    }
    .margin-price{
        margin-bottom: 0px;
        margin-top: 3px;
    }
    p{
        margin: 0px;
    }
</style>