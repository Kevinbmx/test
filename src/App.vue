<template>
  <div id="appRoot">
    <template v-if="!$route.meta.public">
      <v-app id="inspire" class="app">
        <app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>
        <v-content>
          <!-- Page Header -->
          <page-header v-if="$route.meta.breadcrumb"></page-header>
          <div class="page-wrapper">
            <router-view></router-view>
          </div>   
          <!-- App Footer -->
          <footers></footers>
        </v-content>
        <!-- Go to top -->
        <app-fab></app-fab>
        <!-- theme setting -->
      </v-app>
    </template>
    <template v-else>
      <v-app class="app" >
        <toolbar></toolbar>
        <router-view :key="$route.fullpath"></router-view>
        <v-navigation-drawer
          class="setting-drawer"
          temporary
          right
          v-model="rightDrawer"
          fixed
          >
          <menu-main></menu-main>
        </v-navigation-drawer>       
      </v-app>
    </template>
    <v-snackbar
      :timeout="3000"
      bottom
      right
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <v-btn dark text @click.native="snackbar.show = false" icon> 
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>    
  </div>
</template>
<script>
import AppDrawer from '@/components/admin_client/layout/AppDrawer';
import AppToolbar from '@/components/admin_client/layout/AppToolbar';
import AppFab from '@/components/admin_client/layout/AppFab';
import PageHeader from '@/components/admin_client/layout/PageHeader';
import MenuMain from '@/components/main/MenuMain';
import Footers from '@/components/admin_client/layout/Footers';
import AppEvents from  '@/event';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import './index'
import toolbar from '@/components/main/Toolbar';

export default {
  components: {
    AppDrawer,
    AppToolbar,
    AppFab,
    PageHeader,
    MenuMain,
    Footers,
    toolbar,
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
    }
  }),
  created () {
    this.retrieveAcceso()
    AppEvents.forEach(item => {
      this.$on(item.name, item.callback);
    });
    window.getApp = this;
  },
  methods: {
    openMenuMain() {
      if(!localStorage.getItem('access_token')){
        this.$router.push({name: 'login'})
      }else{
        this.$vuetify.goTo(0);
        this.rightDrawer = (!this.rightDrawer);
      }
    },
    retrieveAcceso(){
      //console.log('esta viendo los accesos')
      this.$store.dispatch('retrieveAcceso')
    }
  },

};
</script>


<style lang="stylus" scoped>

  .setting-fab 
    top:50%!important; 
    right:0;
    border-radius:0  
  .page-wrapper
    min-height:calc(100vh - 64px - 50px - 81px );     
</style>
