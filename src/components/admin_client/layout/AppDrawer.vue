<template>
  <v-navigation-drawer
    id="appDrawer"
    :mini-variant.sync="mini"
    fixed
    :dark="$vuetify.dark"
    app
    v-model="drawer"
    width="260"
    >
    <v-toolbar color="primary darken-1" dark>
      <v-toolbar-title class="ml-0">
        <span class="hidden-sm-and-down">Niño Tienda</span>
      </v-toolbar-title>        
    </v-toolbar>
    <perfect-scrollbar @ps-scroll-y="onScroll" ref="scrollbar">
        <v-list>
          <v-subheader>Inventario</v-subheader>
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="subItem in item.items"
          :key="subItem.title"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list> 
    </perfect-scrollbar>        
  </v-navigation-drawer>
</template>
<script>
import menu from '@/api/admin/menu';
export default {
  name: 'app-drawer',
  
  props: {
    expanded: {
      type: Boolean,
      default: true
    },
  },
  data: () => ({
    mini: false,
    drawer: true,
    items: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    }    
  }),
  computed: {
    computeGroupActive () {
      return true;
    },
    computeLogo () {
      return '/static/m.png';
    },

    sideToolbarColor () {
      return this.$vuetify.options.extra.sideNav;
    },

  },
  created () {
    window.getApp.$on('APP_DRAWER_TOGGLED', () => {
      this.drawer = (!this.drawer);
    });
  },
  

  methods: {
    genChildTarget (item, subItem) {
      if (subItem.href) return;
      if (subItem.component) {
        return {
          name: subItem.component,
        };
      }
      return { name: `${item.group}/${(subItem.name)}` };
    },
    onScroll(event) {
      console.log(this.$refs.scrollbar.ps, event);
    }
  }
};
</script>


<style>
#appDrawer {
  overflow: hidden;
}
#appDrawer .drawer-menu--scroll {
  height: calc(100vh - 48px);
  overflow: auto;
}

</style>
