<template>
  <v-app id="register" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <router-link class="estiloTitulo" :to="{ name: 'mainPage' }"><h1 class="flex my-4 primary--text">Trovare</h1></router-link>
                </div> 
                <v-form>
                  <v-text-field
                    v-validate="'required|max:15'"
                    v-model="name"
                    :counter="15"
                    :error-messages="errors.collect('name')"
                    label="Name"
                    data-vv-name="name"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-validate="'required|email'"
                    v-model="email"
                    :error-messages="errors.collect('email')"
                    label="E-mail"
                    data-vv-name="email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-validate="'required'"
                    name="password"
                    label="Password"
                    id="password"
                    v-model="password"
                    :error-messages="errors.collect('password')"
                    type="password"
                    ref="password"
                    required
                    >
                  </v-text-field>

                  <v-text-field
                  v-validate="'required|confirmed:password'"
                    name="password_confirmation"
                    label="Confirm Password"
                    id="password_confirmation"
                    v-model="confirmPassword"
                    :error-messages="errors.collect('password_confirmation')"
                    type="password"
                    :rules="[comparePasswords]"
                    data-vv-as="password">
                  </v-text-field>
                </v-form>
              </v-card-text>
            <v-card-actions>
              <!-- <v-spacer></v-spacer> -->
              <v-btn block color="primary"  @click="register" :loading="loading">register</v-btn>
            </v-card-actions>
              <div class="text-xs-center">
                <v-btn flat small :to="{name:'login'}">Login</v-btn>
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
    $_veeValidate: {
      validator: 'new'
    },

    data: () => ({
      loading: false,
      alertName:'',
      alertType:'',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }),
    methods: {
      register() {
        this.$validator.validateAll().then(response =>{
          if(response){
            this.loading = true
            this.$store.dispatch('register', {
              name: this.name,
              email: this.email,
              password: this.password,
              role_id:2
            })
            .then(() => {
              this.loading = false
              this.alertName = 'Registered Successfully!'
              this.alertType='success'
              this.$router.push({ name: 'login', params: {
                alertName: this.alertName , alertType:this.alertType , alert:true} })
              // this.$router.push({ name: 'login' })
            })
            .catch(() => {
                this.loading = false
            })
          }
        })
      },
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : 'correcto'
      },
    }
}
</script>
<style scoped lang="css">
  #register {
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
