<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"><v-icon medium>person</v-icon>{{ getUser.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-item-group v-model="items" color="primary">
        <v-list-item
          v-for="(item, i) in items"
           :key="i"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title "></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="cerrarSesion">
          <v-list-item-icon>
             <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Cerrar Sesion</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        items: [
          { title: 'Tus Pedidos', icon: 'list_alt',to:{name:'pedido'}},
          // { title: 'Tus Direcciones', icon: 'directions',to:{name:'mainPage'}},
        ],
      }
    },
    computed: {
      ...mapGetters([
        'getUser',
      ])
    },
    methods:{
      cerrarSesion() {
        this.$store.dispatch('destroyToken')
        .then(
          this.$router.push({ name: 'login' })
        )
      },
    }
  }
</script>
