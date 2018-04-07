#!/usr/bin/env node

const fs = require('fs');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const request = require('request')
const bodyParser = require("body-parser");


const bundleRenderer = createBundleRenderer(
  // Load the SSR bundle with require.
  require('./dist/vue-ssr-bundle.json'),
  {
    // Yes, I know, readFileSync is bad practice. It's just shorter to read here.
    template: fs.readFileSync('./index.html', 'utf-8')
  }
);

// Create the express app.
const app = express();

// Serve static assets from ./dist on the /dist route.
app.use('/dist', express.static('dist'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var StellarSdk = require('stellar-sdk');

// Start of API
var router = express.Router()

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  return res.json({ message: 'hooray! welcome to our api!' });   
});


router.post('/trustAsset', function(req, res){
  
  var StellarSdk = require('stellar-sdk');
  StellarSdk.Network.useTestNetwork();
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  
  // var issuingKeys = StellarSdk.Keypair
  // .fromSecret(req.body.SenderPrivateKey);

  var receivingKeys = StellarSdk.Keypair
  .fromSecret(req.body.privateKey)

  // var asset = {
  //   code : req.body.trustAssetCode,
  //   issuer : req.body.trustAssetIssuer
  // }

  var asset = new StellarSdk.Asset(req.body.trustAssetCode, req.body.trustAssetIssuer)

  // First, the receiving account must trust the asset
  server.loadAccount(receivingKeys.publicKey())
  .then(function(receiver) {
      var transaction = new StellarSdk.TransactionBuilder(receiver)
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      .addOperation(StellarSdk.Operation.changeTrust({
          asset: asset
          // limit: '1000'
      }))
      .build();
      transaction.sign(receivingKeys);
      return server.submitTransaction(transaction);
  })
  .then(function(result) {
    console.log('Successfully trust new currency. Results:', result);
    return res.json(result)
  })

})

router.post('/newAsset', function(req, res) {
  console.log('Successfully hit the newAsset API\n');
  console.log('New asset', req.body.newAsset)
  console.log('private key', req.body.privateKey)
  var StellarSdk = require('stellar-sdk');
  StellarSdk.Network.useTestNetwork();
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

  // Keys for accounts to issue and receive the new asset
  var issuingKeys = StellarSdk.Keypair
  .fromSecret(req.body.privateKey);
  // var receivingKeys = StellarSdk.Keypair
  // .fromSecret(receiverPrivateKey);

  // Create an object to represent the new asset
  var newAsset = new StellarSdk.Asset(req.body.newAsset, issuingKeys.publicKey());
  console.log('New asset created', newAsset)
  return res.json(newAsset)



  // // First, the receiving account must trust the asset
  // server.loadAccount(receivingKeys.publicKey())
  // .then(function(receiver) {
  //     var transaction = new StellarSdk.TransactionBuilder(receiver)
  //     // The `changeTrust` operation creates (or alters) a trustline
  //     // The `limit` parameter below is optional
  //     .addOperation(StellarSdk.Operation.changeTrust({
  //         asset: astroDollar,
  //         limit: '1000'
  //     }))
  //     .build();
  //     transaction.sign(receivingKeys);
  //     return server.submitTransaction(transaction);
  // })

  // // Second, the issuing account actually sends a payment using the asset
  // .then(function() {
  //     return server.loadAccount(issuingKeys.publicKey())
  // })
  // .then(function(issuer) {
  //     var transaction = new StellarSdk.TransactionBuilder(issuer)
  //     .addOperation(StellarSdk.Operation.payment({
  //         destination: receivingKeys.publicKey(),
  //         asset: astroDollar,
  //         amount: '10'
  //     }))
  //     .build();
  //     transaction.sign(issuingKeys);
  //     return server.submitTransaction(transaction);
  // })
  // .catch(function(error) {
  //     console.error('Error!', error);
  // });

});



router.post('/send', function(req, res) {
  console.log("Hit the send API");
  console.log("senderPrivateKey", req.body.senderPrivateKey)
  console.log("receiver Public key" ,req.body.receiverPublicKey)
  console.log("amount send: ", req.body.amount)
  console.log("currency", req.body.currency)
  req.body.amount = req.body.amount.toString()
  
  
  var StellarSdk = require('stellar-sdk');
  var pair = StellarSdk.Keypair.random();
  StellarSdk.Network.useTestNetwork();
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  var sourceKeys = StellarSdk.Keypair
  .fromSecret(String(req.body.senderPrivateKey));
  var destinationId = String(req.body.receiverPublicKey)
  var currency;
  if (req.body.currency){
    currency =  new StellarSdk.Asset(req.body.currency, sourceKeys.publicKey());
  }else{
    currency = StellarSdk.Asset.native()

  }
  // Transaction will hold a built transaction we can resubmit if the result is unknown.
  var transaction;

  // First, check to make sure that the destination account exists.
  // You could skip this, but if the account does not exist, you will be charged
  // the transaction fee when the transaction fails.
  server.loadAccount(destinationId)
  // If the account is not found, surface a nicer error message for logging.
  .catch(StellarSdk.NotFoundError, function (error) {
      throw new Error('The destination account does not exist!');
  })
  // If there was no error, load up-to-date information on your account.
  .then(function() {
      return server.loadAccount(sourceKeys.publicKey());
  })
  .then(function(sourceAccount) {

      // console.log(sourceAccount);
      // Start building the transaction.
      transaction = new StellarSdk.TransactionBuilder(sourceAccount)
      .addOperation(StellarSdk.Operation.payment({
          destination: destinationId,
          // Because Stellar allows transaction in many currencies, you must
          // specify the asset type. The special "native" asset represents Lumens.
          asset: currency,
          amount: req.body.amount
      }))
      // A memo allows you to add your own metadata to a transaction. It's
      // optional and does not affect how Stellar treats the transaction.
      .addMemo(StellarSdk.Memo.text('Test Transaction'))
      .build();
      // Sign the transaction to prove you are actually the person sending it.
      transaction.sign(sourceKeys);
      // And finally, send it off to Stellar!
      return server.submitTransaction(transaction);

  })
  .then(function(result) {
      console.log('Successfully sent. Results:', result);
      return res.json(result)
  })
  .catch(function(error) {
      console.error('Something went wrong!', error)
      return res.json(error)
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
  });

});


router.post('/queryAccount', function(req, res) {
  console.log('Successfully hit the queryAccount API\n');
  
  StellarSdk.Network.useTestNetwork();
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  var publicKey = req.body.publicKey
  // console.log("keyyy", publicKey)
  server.loadAccount(publicKey)
  // If the account is not found, surface a nicer error message for logging.
  .catch(StellarSdk.NotFoundError, function (error) {
      throw new Error('The destination account does not exist!');
  })
  // If there was no error, load up-to-date information on your account.
  .then(function() {
      return server.loadAccount(publicKey);
  })
  .then(function(sourceAccount) {
    // console.log(sourceAccount) 
    return res.json(sourceAccount)
  })

});

router.get('/generateKeyPair', function(req, res) {
  var pair = StellarSdk.Keypair.random();
  console.log(pair.secret());
  console.log(pair.publicKey());
  return res.json({ public: pair.publicKey(),
                    private: pair.secret() 
  });
});

router.post('/createTestAccount', function(req, res) {
  publicKey = req.body.public
  request.get({
      url: 'https://friendbot.stellar.org',
      qs: { addr: publicKey },
      json: true
  }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error('ERROR!', error || body);
        return res.json(error); 
      }
      else {
        console.log('SUCCESS! You have a new account :)\n', body);
        return res.json(body);  
        
      }
  });
  // return res.json({message : "Something went wrong"});  
});


app.use('/api', router);


// Render all other routes with the bundleRenderer.
app.get('*', (req, res) => {
  bundleRenderer
    // Renders directly to the response stream.
    // The argument is passed as "context" to main.server.js in the SSR bundle.
    .renderToStream({url: req.path})
    .pipe(res);
});

// Bind the app to this port.
app.listen(8080);