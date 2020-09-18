import Vue from 'vue'
import Vuetify from 'vuetify'

// Helpers
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary:'#293F56',
    // primary:'#1689B0',
    // primary:'#232F3E',//like amazon
    // primary: colors.blue.darken4, 
    secondary: colors.teal.lighten2,
    accent: colors.indigo.base 
  }
})