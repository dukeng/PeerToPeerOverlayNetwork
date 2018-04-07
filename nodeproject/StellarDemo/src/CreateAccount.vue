<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <h2>Create an Account with Stellar</h2>
    <h2>Step 1: Generate a keypair </h2>
    <button id="btn" class="" v-on:click="createKeyPair">Generate keys</button>
    <!-- <div v-for="joke in key" :key="joke.id">
      <h3>{{ joke.id }}</h3>
      <p>{{ joke.joke }}</p>
      <p>{{ joke.category }}</p>
    </div> -->
    <div v-if="key_loaded">
      <h3> Publickey: {{key.public}} </h3>
      <h3> Privatekey: {{key.private}} </h3>
      <h2> Step 2: Create an account with Stellar </h2>
      <button id="btn" class="" v-on:click="createTestAccount">Create Test Account</button>
    </div>

    <div v-if="accountData">
      <h3> You have successfully created an account with Stellar </h3>
      <h3> Envelope_xdr: {{accountData.envelope_xdr}} </h3>
      <h3> Ledger: {{accountData.ledger}} </h3>        
    </div>
    
  </div>
</template>

<script>

import axios from 'axios';


export default {
  name: 'CreateAccount',
  data () {
    return {
      msg: 'Create an account here',
      key_loaded : false,
      key : { public : null, private: null},
      accountData: null
    }
  },
  methods: {
    createKeyPair: function(){
      this.key_loaded =false;
      // axios.get("http://api.icndb.com/jokes/random/10")
      axios.get("http://localhost:8080/api/generateKeyPair")
      .then((response)  =>  {
        this.key_loaded = true;
        console.log(response)
        console.log(response.data)
        this.key = response.data;
        console.log(this.key)
      }, (error)  =>  {
        this.key_loaded = false;
        console.log(error)
      })
    },
    createTestAccount : function(){
      axios.post("http://localhost:8080/api/createTestAccount", {
        public: this.key.public,
        private: this.key.private
      })
      .then((response) => {
        console.log(response)
        this.accountData = response.data;
      }, (error) => {
        console.log(error)
      })

    } 
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
