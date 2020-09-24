<template>
    <div>
        <!-- {{dir}} -->
            <v-layout wrap justify-space-between v-if="hasDirection">
                <v-flex xs12 md12 sm12>
                    <h3>Seleccione una direccion o añada una nueva</h3> 
                </v-flex>
        
                <v-flex xs12 md4 sm6 v-for="(dir, index) in directions" :key="index" :class="{'is-active': dir.id === selectedDirection}">
                    <v-layout wrap justify-space-between  >
                        <!-- <v-flex md12 > -->
                            <!-- <v-layout wrap justify-space-between> -->
                            <v-flex xs8 sm9 md10 pb-0>
                                <h3>{{dir.name}}</h3>
                            </v-flex>
                        
                            <!-- </v-layout> -->
                        <!-- </v-flex> -->
                        <v-flex xs12 sm12 md12 pt-0 style="margin-top:-9px;"> 
                            <span>Dir. {{dir.direction}}</span> <br>
                            <span>cel. {{dir.phone_number}}</span>   
                            <gmap-map style="height: 300px;"
                                :zoom="14" :center="converToPosition(dir.latitud, dir.longitud)"
                                >
                            <gmap-marker
                                :position="converToPosition(dir.latitud, dir.longitud)"
                                :clickable="false" 
                                :draggable="false"
                                />
                            </gmap-map>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                            <v-btn block color="secondary" dark   @click="setSelectedDirection(dir.id)">
                                Seleccionar
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm12 md12>
                    <div v-if="showErrorSelection" class="theme--light error--text"> <span>Seleccione una direccion antes de confirmar su pedido</span></div>
                    <v-btn outline color="secondary" @click="showFormDirection()">
                        añadir direccion<v-icon>add</v-icon>
                    </v-btn>
                </v-flex>
            <v-divider ></v-divider>
            <v-flex  xs12 sm12 md12 v-show="!hasDirection">
                <v-alert
                    :value="true"
                    dismissible
                    color="warning"
                    icon="priority_high"
                    outline
                    >
                    no tienes direcciones guardada, create una
                </v-alert>
            </v-flex>
        </v-layout>
        <v-layout  wrap justify-space-between v-else>
            <v-flex xs12 sm12 md12 >
                <v-layout  wrap justify-space-between>
                    <v-flex xs6 >
                        <v-text-field
                            v-validate="{ required: true}"
                            name="name" 
                            label="Nombre completo" 
                            :error-messages="errors.collect('name')"
                            data-vv-name="name"
                            v-model="name"
                            required
                            >
                        </v-text-field>
                        <div class="v-messages theme--light error--text"> <span>{{ errors.first('name') }}</span></div>
                        <v-textarea
                            v-validate="{required: true, max: 100}"
                            name="direction" 
                            label="direccion del pedido" 
                            type="text" 
                            :error-messages="errors.collect('direction')"
                            data-vv-name="direction"
                            v-model="direction"
                            required
                            >
                        </v-textarea>
                        <div class="v-messages theme--light error--text"> <span>{{ errors.first('direction') }}</span></div>
                        <v-text-field
                            v-validate="{ required: true, max: 12}"
                            name="celular" 
                            label="celular destinatario" 
                            :error-messages="errors.collect('celular')"
                            data-vv-name="celular"
                            v-model="phone_number"
                            required
                            >
                        </v-text-field>
                        <div class="v-messages theme--light error--text"> <span>{{ errors.first('phone_number') }}</span></div>
                    </v-flex>
                    <v-flex xs6 >
                        <gmap-map style="height: 400px;"
                                :zoom="14" :center="center"
                                ref="map" @click="clicked">
                            <gmap-marker
                                :position="converToPosition(new_direction.latitud,new_direction.longitud)"
                                :clickable="false" 
                                :draggable="false"
                            />
                        </gmap-map>
                            <!-- <div class="v-messages theme--light error--text"> <span>{{ errors.first('latitud') }}</span></div> -->
                            <!-- <div class="v-messages theme--light error--text"> <span>{{ errors.first('longitud') }}</span></div> -->
                            <div v-if="showMark" class="v-messages theme--light error--text"> <span>marque su direccion en el mapa</span></div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
                <v-btn outline color="secondary" @click="showFormDirection()">
                    seleccionar direccion<v-icon>add</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm12 md12 class="align-rigth">
                <v-btn
                color="primary"
                @click="continuar()"
                >
                Siguiente
                </v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    $_veeValidate: {
        validator: 'new'
    },
    data () {
        return {
            selectedDirection:'',
            // showDirection:true,
            showMark:false,
            showErrorSelection:false,
            center: {
                lat: -17.34222036995646,
                lng: -63.255672454833984
            },
        }
    },
    mounted() {
        this.$store.dispatch('getDirectionsByUserId')
    },
    computed: {
        ...mapState({
            directions: state => state.carrito.directions,
            new_direction: state => state.carrito.new_direction,
            hasDirection: state => state.carrito.hasDirection
        }),
        name: {
            get () {
                return this.new_direction.name
            },
            set (value) {
                this.$store.commit('name', value)
            }
        },
        direction: {
            get () {
                return this.new_direction.direction
            },
            set (value) {
                this.$store.commit('direction', value)
            }
        },
        phone_number: {
            get () {
                return this.new_direction.phone_number
            },
            set (value) {
                this.$store.commit('phone_number', value)
            }
        },
    },
    methods: {
        // ...mapMutations(['new_direction']),
        clicked (e) {
            let objPosition = {
                'latitud':e.latLng.lat(),
                'longitud':e.latLng.lng()
            }
            this.$store.commit('latitud_latitud',objPosition)
            // this.latitud =  e.latLng.lat()
            // this.longitud =  e.latLng.lng()
            // this.position ={lat:e.latLng.lat(), lng:e.latLng.lng()}
            // console.log('lat',e.latLng.lat())
            // console.log('lng',e.latLng.lng())
        },
        converToPosition(lat, lng){
            let objPosition = {
                'lat' : parseFloat(lat),
                'lng' : parseFloat(lng)
            }
            // console.log('obj',objPosition)
            return objPosition
        },
        setSelectedDirection(id){
            this.showErrorSelection = false
            this.selectedDirection = id
            this.$store.dispatch('selectDirection',id)
        },
        showFormDirection(){
            this.selectedDirection = ''
            this.$store.dispatch('selectDirection',null)
            this.showErrorSelection = true
            this.$store.commit('setHasDirection')
            // Swal.fire('Hello world!')
        },
        validate(){
            this.$validator.validate().then(result => {
                if (result) {
                    this.$emit('next-step')
                }
            });
        },
        continuar(){
            if(!this.hasDirection){
                if(this.new_direction.latitud == 0 && this.new_direction.longitud == 0){
                    // console.log('no marco')
                    this.showMark = true
                }else{
                    this.showMark = false
                    this.validate()
                }
            }else{
                if(this.selectedDirection == 0 || this.selectedDirection == '' ){
                    this.showErrorSelection = true
                }else{
                    this.showErrorSelection = false
                    this.validate()
                }
            }
        }
    }
}

</script>
<style scoped>
    .is-active{
        border: 3px #23d160 solid
    }
    .align-rigth{
        text-align: right;
    }
</style>
