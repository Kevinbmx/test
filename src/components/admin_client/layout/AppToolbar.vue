<template>
  <v-toolbar
    color="primary"
    fixed
    dark
    app
    >
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="handleDrawerToggle"></v-toolbar-side-icon>
    </v-toolbar-title>
    <v-spacer></v-spacer>
      
    <v-btn icon href="https://github.com/tookit/vue-material-admin">
      <v-icon>fa fa-github</v-icon>
    </v-btn>
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
      <h3>{{getUser.name}}</h3>
  </v-toolbar>
</template>
<script>
import { mapGetters } from 'vuex'
import Util from '@/util';
export default {
  name: 'app-toolbar',
  data: () => ({
  
  }),
  computed: {
    toolbarColor () {
      return this.$vuetify.options.extra.mainNav;
    },
        ...mapGetters([
        'getUser',
      ])
  },
  methods: {
    handleDrawerToggle () {
      window.getApp.$emit('APP_DRAWER_TOGGLED');
    },
    handleFullScreen () {
      Util.toggleFullScreen();
    }
  }
};
</script>
