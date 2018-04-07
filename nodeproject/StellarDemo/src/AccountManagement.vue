<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <h2>Account Management</h2>

    <h>Enter public key </h>
    <input v-model="publicKey" placeholder="public key">
    <h>Enter private key </h>
    <input v-model="privateKey" placeholder="private key">

    <button id="btn" class="" v-on:click="query">Query Account</button>
    <h3> Account Information </h3>
    <div v-if="accountDict">
        <h4> Account ID: {{account_id}} </h4>
        <h4> Sequence: {{sequence}} </h4>
        <h4> <pre> Balances: {{balances}} </pre></h4>
        <h4> Send money </h4>
        <h> Enter public key of receiver </h>
        <input v-model="receiverPublicKey" placeholder="Public key of receiver">
        <h> Enter amount of money to send</h>        
        <input v-model="amount" placeholder="Amount to send">
        <h> Enter currency of money</h>
        <input v-model="currency" placeholder="Currency to send">        
        <button id="btn" class="" v-on:click="send">Send</button>    
    </div>

    <!-- <div v-if="asset"> -->
        <h3> Create a new currency </h3>
        <h> Enter name of new currency</h>        
        <input v-model="assetName" placeholder="Name of new currency">
        <button id="btn" class="" v-on:click="newAsset">Create New Asset</button>
        <div v-if="newCurrency">
            <h4> New Currency Name: {{newCurrency}} </h4>
            <h4> Issuer: {{issuer}} </h4>
        </div>

        <h4> Trust a new currency </h4>
        <input v-model="trustAssetCode" placeholder="Name of new asset/currency">
        <input v-model="trustAssetIssuer" placeholder="Name of the issuer">
        <button id="btn" class="" v-on:click="trustAsset">Trust this new asset</button>
        <div v-if="trusted">
          <h> Trusted new currency: {{trustAssetCode}} </h>
        </div>

    </div>
  </div>
</template>

<script>

import axios from 'axios';


export default {
  name: 'app',
  data () {
    return {
      msg: 'Create an account here',
      accountData: null,
      publicKey : null,
      privateKey : null,
      accountDict: false,
      account_id: null,
      sequence: null,
      balances: null,
      receiverPublicKey: null,
      amount: 0,
      currency: null,
      assetName: null,
    //   asset : true,
      trustAssetCode : null,
      trustAssetIssuer : null,
      newCurrency: null,
      issuer: null,
      trusted: false,
    }
  },
  methods: {
    query: function(){
      axios.post("http://localhost:8080/api/queryAccount",{
        publicKey: this.publicKey,
        privateKey: this.privateKey
      })
      .then((response)  =>  {
        console.log(response.data)
        var data = response.data
        this.accountDict = true
        this.account_id = data['account_id']
        this.sequence = data['sequence']
        this.balances = data['balances']

      }, (error)  =>  {
        console.log(error)
      })
    },
    send: function(){
      axios.post("http://localhost:8080/api/send",{
        receiverPublicKey: this.receiverPublicKey,
        senderPrivateKey: this.privateKey,
        amount: this.amount,
        currency: this.currency,
        
      })
      .then((response)  =>  {
        var data = response.data
        console.log(data)

      }, (error)  =>  {
        console.log(error)
      })
    },
    newAsset: function(){
      axios.post("http://localhost:8080/api/newAsset",{
        privateKey: this.privateKey,
        newAsset : this.assetName        
      })
      .then((response)  =>  {
        var data = response.data
        console.log(data)
        this.newCurrency = data['code']
        this.issuer = data['issuer']
      }, (error)  =>  {
        console.log(error)
      })
    },
    trustAsset: function(){
      axios.post("http://localhost:8080/api/trustAsset",{
        privateKey: this.privateKey,
        trustAssetCode : this.trustAssetCode,
        trustAssetIssuer : this.trustAssetIssuer
      })
      .then((response)  =>  {
        var data = response.data
        console.log(data)
        this.trusted = true
      }, (error)  =>  {
        console.log(error)
      })
    },    

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
