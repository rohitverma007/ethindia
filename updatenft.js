const { Revise } = require("revise-sdk");
const AUTH_TOKEN = "";
const revise = new Revise({auth: AUTH_TOKEN});
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

const API = async function() {
    // const response = await openai.createImage({
    //     prompt: "netherlands defeat america in soccer dutch lion",
    //     n: 1,
    //     size: "256x256",
    //   });
    // // const image_url = "";
    // image_url = response.data.data[0].url;
    const image_url = "https://i.imgur.com/b2bsgAN.png";
    console.log(image_url)
    return image_url
  }

async function run() {
    const allNfts = await revise.fetchNFTs('a1066484-1ee3-4837-9564-d95a5d6d757e');
    for(nft in allNfts) {
        console.log(nft)
    }
    const nftsToUpdate = []
    allNfts.forEach((nft) => {
        console.log(nft.metaData)
        if(nft.metaData[0]["netherlands_usa"] === "Netherlands"){
            // update nft
            nftsToUpdate.push(nft)
        }
    })
    revise.every('1000s').listenTo(API).start(async (data) => {
        nftsToUpdate.forEach(async (player)=>{
            // set additional properties about win rate? etc.
            await revise.nft(player).setImage(data).save()
        }) 
    });
    }
run()