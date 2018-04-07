<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <div class="generate">
      <CreateAccount/>
    </div>
    <div class="row">
      <div class="column" style="background-color:#aaa;">
      <AccountManagement/>   
    </div>
    <div class="column" style="background-color:#bbb;">
      <AccountManagement/>    
  </div>
</div>    
    
  </div>
</template>

<script>

import CreateAccount from './CreateAccount.vue'
import AccountManagement from './AccountManagement.vue'


export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to our demo of Stellar'
    }
  },
  components: {
    CreateAccount,
    AccountManagement
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  
  /* @import'~bootstrap/dist/css/bootstrap.css' */

}


.generate {
  height: 500px;  
}

* {
    box-sizing: border-box;
}

.logo {
  height: 150px;
  width: 150px;
}
/* Create two equal columns that floats next to each other */
.column {
    float: left;
    width: 50%;
    padding: 10px;
    height: 2000px; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
    content: "";
    display: table;
    clear: both;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
