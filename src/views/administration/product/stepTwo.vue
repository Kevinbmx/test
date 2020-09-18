<template>
  <div>
    <v-form>
      <v-layout
        wrap
        justify-space-between
      >
        <v-flex
              xs12
              md12
        >
          <v-textarea
            v-validate="'required'"
            name="nameProduct" 
            label="descripcion del producto" 
            type="text" 
            :error-messages="errors.collect('description')"
            data-vv-name="description"
            required
            rows="8"
            v-model="description">
          </v-textarea>
        </v-flex>
      </v-layout>
      <v-layout
       v-for="(charact, index) in characteristics" :key="index"
        wrap
        justify-space-between
      >
        <v-flex xs9 sm11 md11 v-show="charact.state !== 'delete'">
          <v-text-field
            v-validate="'required'"
            :label="'caracteristica '+ (index+1)" 
            type="text" 
            :error-messages="errors.collect('characteristica '+(index+1))"
            :data-vv-name="'characteristica '+(index+1)"
            required
            v-model="charact.characteristicName">
          </v-text-field>
        </v-flex>
        <v-flex xs3 sm1 md1 v-show="charact.state !== 'delete'" >
          <v-tooltip top>
            <v-btn @click="deleteCharacteristic(index)"   slot="activator" flat icon color="red">
              <v-icon>delete</v-icon>
            </v-btn>
             <span>eliminar caracteristica</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-layout  wrap
        justify-space-between>
        <v-flex xs12
              md12>
          <v-tooltip top>
            <v-btn @click="addCharacteristic()"   slot="activator" flat icon color="primary">
              <v-icon>add_circle</v-icon>
            </v-btn>
            <span>new characteristic</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12
              md12>
          <v-btn
            color="primary"
            @click="validate()"
            >
            Continue
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import { mapMultiRowFields } from "vuex-map-fields";
  export default {
    data () {
      return {
    
      }
    },
    computed:{
      ...mapMultiRowFields(["characteristics"]),
        description: {
        get () {
            return this.$store.state.product.productObj.description
        },
        set (value) {
            this.$store.commit('updateDescription', value)
        }
        },
    },
    methods:{
      validate(){
      this.$validator.validate().then(result => {
        if (result) {
          this.$emit('next-step')
        }
      });
    },
    addCharacteristic(){
       this.$validator.validate().then(result => {
        if (result) {
          this.$store.dispatch('addCharacteristic')
        }
      });
    },
    deleteCharacteristic(index){
      var state = this.$route.meta.mode
      let obj = {
        index : index,
        state :state
      }
      this.$store.dispatch('deleteCharacteristic',obj)
    }
    }
  }
</script>
<style>

</style>
