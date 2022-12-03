const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// require('dotenv').config();
const cors = require('cors');
const { Revise } = require("revise-sdk");
const AUTH_TOKEN = "REDACT";
const revise = new Revise({auth: AUTH_TOKEN});

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

    
    

    // TODO - get incremental id.

    const tokenId = Math.floor(Math.random() * 1700);
    // create nft

    const nft = await revise.addNFT(
        {
          image:
            "https://i.imgur.com/jzdqME4.png",
          name: "Bracket",
          tokenId: tokenId.toString(),
          description: "Just Submittsing Bracket. round of 16",
        },
        req.body.matches,
        "6024e639-397e-4d5e-8a9a-734cd851fe79"
      );
    
      console.log(nft);
      console.log({'tokenId': tokenId.toString()});

    
    


    res.send({'tokenId': tokenId.toString()})




  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})