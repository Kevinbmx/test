<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <router-link class="estiloTitulo" :to="{ name: 'mainPage' }"><h1 class="flex my-4 primary--text">Trovare</h1></router-link>
                </div>   
                  <v-alert
                    v-model='alert'
                    dismissible
                    :type='alertType'
                  >
                    {{alertName}}
                  </v-alert>             
                <v-form>
                  <v-text-field
                    v-validate="'required|email'"
                    append-icon="person"
                    name="login" 
                    label="Login" 
                    type="text" 
                    :error-messages="errors.collect('username')"
                    data-vv-name="username"
                    required
                    v-model="username">
                   </v-text-field>
                  <v-text-field 
                    v-validate="'required'"
                    append-icon="lock" 
                    name="password" 
                    label="Password" 
                    id="password" 
                    type="password" 
                     :error-messages="errors.collect('password')"
                    data-vv-name="password"
                    required
                    v-model="password">
                    </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <!-- <v-spacer></v-spacer> -->
                <!-- <v-btn block color="primary" @click="login" :loading="loading">
                    Login
                    
                </v-btn> -->
                <v-btn block color="primary"  @click="login" :loading="loading">Login</v-btn>
              </v-card-actions>
              <div class="text-xs-center">
                <v-btn flat small :to="{name:'register'}">Register</v-btn>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props:{
    alert:{
      type:Boolean,
      default: false
    },
    alertName:{
      type:String,
      default: 'su correo o su contraseña es incorrecta'
    },
    alertType:{
      type:String,
      default: 'error'
    }
  },
  data: () => ({
    loading: false,
      username: 'admin@admin.com',
      password: 'secret'
  }),
  methods: {
    login () {
      this.$validator.validateAll().then(response =>{
        if(response){
          this.loading = true
          this.$store.dispatch('retrieveToken',{
            username:this.username,
            password:this.password,
          })
          .then(response =>{
            if(response){
              this.loading = false
              this.$router.push({name: 'mainPage'})
              location.reload();
            }
          })
          .catch(error =>{
           this.$props.alert = true
            this.loading = false
            // console.log('errorssss',error)
          })
        }
      })
    }
  }

};
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
