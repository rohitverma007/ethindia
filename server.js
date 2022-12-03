const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// require('dotenv').config();
const cors = require('cors');
const { Revise } = require("revise-sdk");
const AUTH_TOKEN = "REDACT";
const revise = new Revise({auth: AUTH_TOKEN});
const axios = require('axios');

const app = express()
// app.use(cors());
app.use( bodyParser.json() );
app.use(function(req,res,next){

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/submitBracket', async (req, res) => {
    console.log(req.body)


    // TODO uncomment once worldcoin fixes their stuff
    // axios.post("https://developer.worldcoin.org/api/v1/verify", {
    //   merkle_root: req.body.merkle_root,
    //   nullifier_hash: req.body.nullifier_hash,
    //   action_id: "wid_staging_e4267d5b2bca16a8a301e221270f7da1",
    //   signal: req.body.signal, // UPDATE TO ETH ADREEESS
    //   proof: req.body.proof
    // }).then(async (response) => {
    //   console.log(response)
      // if(response.success && response.nullifier_hash){
        // continue creating nft
    // TODO - get incremental id.

    // create nft 
    const tokenId = Math.floor(Math.random() * 2000);

      const nft = await revise.addNFT(
        {
          image:
            "https://i.imgur.com/jzdqME4.png",
          name: "2022 Bracket",
          tokenId: tokenId.toString(),
          description: "A predicted bracket for World Cup 2022.",
        },
        req.body.matches,
        "d6af863b-1253-45d1-bc2c-7537bab28754" //TODO - Change according to collection ID created
      );
    
      console.log(nft);
      console.log({'tokenId': tokenId.toString()});
      res.send({'tokenId': tokenId.toString()})

      // TODO - unocmment once worldcoin is fixed
      // } else {
      //   res.send({message: "PLEASE VERIFY WORLD ID"})
      // }

    // }).catch((error) => {
    //   console.log(error)
    // })

    // res.send(400)
    






  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})