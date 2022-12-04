import React, { Dispatch, SetStateAction, useState } from "react";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import { LocalRelayer, RestRelayer } from "@biconomy/relayer";
import Button from "../Button";
import { useWeb3Context } from "../../contexts/Web3Context";
import { useSmartAccountContext } from "../../contexts/SmartAccountContext";
import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import axios from "axios";
import { WorldIDWidget } from '@worldcoin/id'

import {
  getEOAWallet,
  showErrorMessage,
  showSuccessMessage,
} from "../../utils";

type OnboardingProps = {
  setValue: Dispatch<SetStateAction<number>>;
};

const Onboarding: React.FC<OnboardingProps> = ({ setValue }) => {
  const classes = useStyles();
  const provider = useWeb3Context();
  const [quarter1, setQuarter1] = useState('');
  const [quarter2, setQuarter2] = useState('');
  const [quarter3, setQuarter3] = useState('');
  const [quarter4, setQuarter4] = useState('');
  const [quarter5, setQuarter5] = useState('');
  const [quarter6, setQuarter6] = useState('');
  const [quarter7, setQuarter7] = useState('');
  const [quarter8, setQuarter8] = useState('');
  const [semi1, setSemi1] = useState('');
  const [semi2, setSemi2] = useState('');
  const [semi3, setSemi3] = useState('');
  const [semi4, setSemi4] = useState('');
  const [final1, setFinal1] = useState('');
  const [final2, setFinal2] = useState('');
  const [champion, setChampion] = useState('');
  const [nftMinted, setNftMinted] = useState(false);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [wSignal, setWSignal] = useState('');
  const [nullifierHash, setNullifierHash] = useState('');
  const [proof, setProof] = useState('');
  // const contractAddress = "0x5Efbf183afDb18857E1902C5D364FbBE770Fcb6D"; //old
  // const contractAddress = "0x6C7937cFBE120f354eF5a3Df6117585A957c4162"; //latest
  // const contractAddress = "0xF34eD67273377065Dc941fa3dEBaC90FE76947A8" //actual latest
  const contractAddress = "0xeBed36b4671B9a760E15BFbCD92d2F7a72ef3f6B" //actual actual latest
  
  const {
    state,
    wallet: smartAccount,
    getSmartAccount,
  } = useSmartAccountContext();
  (window as any).provider = provider;

  const [tokenId, setTokenId] = useState(0)
  const [deployLoading1, setDeployLoading1] = useState(false);
  const [deployLoading2, setDeployLoading2] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);

  const deploySmartAccount1 = async () => {
    try {
      if (!smartAccount || !state) {
        showErrorMessage("Init Smart Account First");
        return;
      }
      setDeployLoading1(true);
      // you can create instance of local relayer with current signer or any other private key signer
      const relayer = new LocalRelayer(
        getEOAWallet(process.env.REACT_APP_PKEY || "", null)
      );

      console.log('relayer');
      console.log(relayer);
      const context = smartAccount.getSmartAccountContext();

      try{
      const deployment = await relayer.deployWallet({
        config: state,
        context,
        index: 0,
      }); // index 0

      const res = await deployment.wait(1);
      console.log(res);
    } catch(err) {
      console.log('fails here')
      console.log(err)
    }
      
      
      getSmartAccount();
      showSuccessMessage("Smart Account deployed");
      setDeployLoading1(false);
    } catch (err: any) {
      setDeployLoading1(false);
      showErrorMessage(err.message.slice(0, 60));
      console.error("deploySmartAccount", err);
    }
  };

  const submitBracket = async () => {
    setMintLoading(true)
    const matches = [
      {"netherlands_usa": quarter1},
      {"argentina_australia": quarter2},
      {"japan_croatia": quarter3},
      {"brazil_south_korea": quarter4},
      {"france_poland": quarter5},
      {"england_senegal": quarter6},
      {"morocco_spain": quarter7},
      {"portugal_switzherland": quarter8},
      {"quarter_1": semi1},
      {"quarter_2": semi2},
      {"quarter_3": semi3},
      {"quarter_4": semi4},
      {"semi_1": final1},
      {"semi_2": final2},
      {"final": champion},
     ]
     setWSignal(smartAccount?.address ? smartAccount?.address : '')
    axios.post("https://predictnow.ngrok.io/submitBracket", {
      address: smartAccount?.address,
      matches: matches,
      merkle_root: merkleRoot,
      signal: wSignal,
      nullifier_hash: nullifierHash,
      proof: proof
    }).then(async function (response) {
      showSuccessMessage("Minting your NFT... mmm...");
      console.log(response)
      console.log(response.data.tokenId)
      const tokenId = response.data.tokenId;
      setTokenId(tokenId);
        const erc20Interface = new ethers.utils.Interface([
          'function mint(address to, uint256 tokenId)'
        ])
        let toAddress = smartAccount?.address;
        if (!smartAccount?.provider?.connection?.url?.includes('eip-1193')){
          toAddress = smartAccount?.owner;
        }
        console.log(toAddress)
        // TODO - change for social potentially
        const data = erc20Interface.encodeFunctionData(
          'mint', [smartAccount?.address, tokenId]
        )
        const tx1 = {
          to: contractAddress,
          data
        }
        const txResponse = await smartAccount?.sendGasLessTransaction({ transaction: tx1 });
        console.log(txResponse)
        setMintLoading(false)
        setNftMinted(true)
    }).catch(function (error) {
      // worldcoin failure catch
      console.log(error)
    })
  };

  const deploySmartAccount2 = async () => {
    try {
      if (!smartAccount || !state) {
        showErrorMessage("Init Smart Account First");
        return;
      }
      setDeployLoading2(true);
      const relayer = new RestRelayer({
        url: "https://sdk-relayer.staging.biconomy.io/api/v1/relay",
        socketServerUrl: 'wss://sdk-testing-ws.staging.biconomy.io/connection/websocket'
      });
      smartAccount.setRelayer(relayer);

      const feeQuotes = await smartAccount.prepareDeployAndPayFees();
      console.log("feeQuotes ", feeQuotes);

      console.log("token address ", feeQuotes[1].address);

      const txHash = await smartAccount.deployAndPayFees(5, feeQuotes[1]);
      showSuccessMessage(`Tx hash ${txHash}`);
      //console.log(sendTx);
      console.log(txHash);

      await sleep(5000);

      getSmartAccount();
      showSuccessMessage("Smart Account deployed");
      setDeployLoading2(false);
    } catch (err: any) {
      setDeployLoading2(false);
      showErrorMessage(err.message.slice(0, 60));
      console.error("deploySmartAccount", err);
    }
  };

  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // const SingleElimination = () => (
   
  // );

   
   const handleCssChanges = (event: any) => {
    console.log(event.target.textContent);
    console.log(event)
    // reset first
    for(let i = 0; i < event.target.parentElement.children.length; i++){
      event.target.parentElement.children[i].style.color = "#CDF0EA";
      event.target.parentElement.children[i].style["box-shadow"] = "2px 2px #3e497a"
    }
    event.target.style.color = "rgb(48 172 150)";
    event.target.style["box-shadow"] = "1px 1px 0px #3e497a";
   }
   const setQuarter1Info = (event: any) => {
    handleCssChanges(event);
      setQuarter1(event.target.textContent);


   } 

   const setQuarter2Info = (event: any) => {
    handleCssChanges(event);
    setQuarter2(event.target.textContent)
   }
   const setQuarter3Info = (event: any) => {
    handleCssChanges(event);
    setQuarter3(event.target.textContent)
   }
   const setQuarter4Info = (event: any) => {
    handleCssChanges(event);
    setQuarter4(event.target.textContent)
   }
   const setQuarter5Info = (event: any) => {
    handleCssChanges(event);
    setQuarter5(event.target.textContent)
   }
   const setQuarter6Info = (event: any) => {
    handleCssChanges(event);
    setQuarter6(event.target.textContent)
   }
   const setQuarter7Info = (event: any) => {
    handleCssChanges(event);
    setQuarter7(event.target.textContent)
   }
   const setQuarter8Info = (event: any) => {
    handleCssChanges(event);
    setQuarter8(event.target.textContent)
   }   
   const setSemi1Info = (event: any) => {
    handleCssChanges(event);
    setSemi1(event.target.textContent);
   }
   const setSemi2Info = (event: any) => {
    handleCssChanges(event);
    setSemi2(event.target.textContent);
   }
   const setSemi3Info = (event: any) => {
    handleCssChanges(event);
    setSemi3(event.target.textContent);
   }
   const setSemi4Info = (event: any) => {
    handleCssChanges(event);
    setSemi4(event.target.textContent);
   }
   const setFinal1Info = (event: any) => {
    handleCssChanges(event);
    setFinal1(event.target.textContent);
   }
   const setFinal2Info = (event: any) => {
    handleCssChanges(event);
    setFinal2(event.target.textContent);
   }
   const setChampionInfo = (event: any) => {
    handleCssChanges(event);
    setChampion(event.target.textContent);
   }                  
  return (
    <main className={classes.main}>
      <h1>FIFA World Cup 2022 - Prediction Bracket.</h1>
      <div className="allRounds" style={{'display': 'flex', 'flexDirection': 'row'}}>

      
      <div className="roundof16" style={{'display': 'flex', 'flexDirection': 'column', 'paddingRight': '20px'}}>
      <span >
      <Button onClickFunc={(e: any)=>{setQuarter1Info(e)}} title="Netherlands"></Button>
      <Button onClickFunc={(e: any)=>{setQuarter1Info(e)}} title="USA"></Button>
      </span>
      <p></p>
      <span>
      <Button onClickFunc={setQuarter2Info} title="Argentina"></Button>
      <Button onClickFunc={setQuarter2Info} title="Australia"></Button>
      </span>
      <p></p>

      <span>
      <Button onClickFunc={setQuarter3Info} title="Japan"></Button>
      <Button onClickFunc={setQuarter3Info} title="Croatia"></Button>
      </span>
      <p></p>
      <Button onClickFunc={setQuarter4Info} title="Brazil"></Button>
      <Button onClickFunc={setQuarter4Info} title="South Korea"></Button>
      <p></p>
      <Button onClickFunc={setQuarter5Info}  title="France"></Button>
      <Button onClickFunc={setQuarter5Info} title="Poland"></Button>
      <p></p>
      <Button onClickFunc={setQuarter6Info} title="England"></Button>
      <Button onClickFunc={setQuarter6Info} title="Senegal"></Button>
      <p></p>
      <Button onClickFunc={setQuarter7Info} title="Morocco"></Button>
      <Button onClickFunc={setQuarter7Info} title="Spain"></Button>
      <p></p>
      <Button onClickFunc={setQuarter8Info} title="Portugal"></Button>
      <Button onClickFunc={setQuarter8Info} title="Switzerland"></Button>     
      </div> 
      <div  style={{'display': 'flex', 'flexDirection': 'column', 'paddingTop': '20px', 'paddingRight': '20px'}}>
       {quarter1 ? (
        <span>
        <Button onClickFunc={setSemi1Info} title={quarter1}></Button>
      {quarter2 ? <Button onClickFunc={setSemi1Info} title={quarter2}></Button> : <></>}
      </span>
       ): (<></>)}
       
          
      
      <p></p>
      {quarter3 ? (
        <span>
        <Button onClickFunc={setSemi2Info} title={quarter3}></Button>
      {quarter4 ? <Button onClickFunc={setSemi2Info} title={quarter4}></Button> : <></>}
      </span>
       ): (<></>)}
<p></p>
      {quarter5 ? (
        <span>
        <Button onClickFunc={setSemi3Info} title={quarter5}></Button>
      {quarter6 ? <Button onClickFunc={setSemi3Info} title={quarter6}></Button> : <></>}
      </span>
       ): (<></>)}

       <p></p>
      {quarter7 ? (
        <span>
        <Button onClickFunc={setSemi4Info} title={quarter7}></Button>
      {quarter8 ? <Button onClickFunc={setSemi4Info} title={quarter8}></Button> : <></>}
      </span>
       ): (<></>)}

      </div>
      <div  style={{'display': 'flex', 'flexDirection': 'column', 'paddingTop': '60px', 'paddingRight': '20px'}}>
      {semi1 ? (
        <span>
        <Button onClickFunc={setFinal1Info} title={semi1}></Button>
      {semi2 ? <Button onClickFunc={setFinal1Info} title={semi2}></Button> : <></>}
      </span>
       ): (<></>)}     
       <p></p>   
      {semi3 ? (
        <span>
        <Button onClickFunc={setFinal2Info} title={semi3}></Button>
      {semi4 ? <Button onClickFunc={setFinal2Info} title={semi4}></Button> : <></>}
      </span>
       ): (<></>)}               
        </div>
        <div  style={{'display': 'flex', 'flexDirection': 'column', 'paddingTop': '80px', 'paddingRight': '20px'}}>
      {final1 ? (
        <span>
        <Button onClickFunc={setChampionInfo} title={final1}></Button>
      {final2 ? <Button onClickFunc={setChampionInfo} title={final2}></Button> : <></>}
      </span>
       ): (<></>)}        
        </div>   
        <div  style={{'display': 'flex', 'flexDirection': 'column', 'paddingTop': '100px', 'paddingRight': '20px'}}>
      {champion ? (
        <>
        <span>
        {champion}
      </span>
      <p></p>
      <Button
          title="Submit Bracket"
          onClickFunc={submitBracket}
          isLoading={mintLoading}
          style={{
            fontSize: 16,
            padding: "20px 10px",
            border: 0,
            background:
              "linear-gradient(90deg, #0063FF -2.21%, #9100FF 89.35%)",
          }}
        />
        {nftMinted ? 
        <a style={{'color': 'white'}} href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`} target="_blank">Click to see NFT</a>
      :<></>}
        </>
       ): (<></>)}
        </div>       
      </div>
      

        {!merkleRoot ? <><WorldIDWidget
        actionId="wid_staging_e4267d5b2bca16a8a301e221270f7da1" 
        signal={smartAccount?.address}
        enableTelemetry
        onSuccess={(verificationResponse) => {
          console.log(verificationResponse)
          
          setMerkleRoot(verificationResponse.merkle_root)
          setNullifierHash(verificationResponse.nullifier_hash)
          setProof(verificationResponse.proof)
          }
        } // you'll actually want to pass the proof to the API or your smart contract
        onError={(error) => console.error(error)}
      />
      {/* This happens when merkelroot isnt hterelooool */}
      
      </> : <></>}
      {champion && merkleRoot ? <>      
      <Button
          title="Submit Bracket"
          onClickFunc={submitBracket}
          isLoading={mintLoading}
          style={{
            fontSize: 20,
            padding: "30px 20px",
            border: 0,
            background:
              "linear-gradient(90deg, #0063FF -2.21%, #9100FF 89.35%)",
          }}
        />
        </> : <></>}
   </main>
  );
};

const useStyles = makeStyles(() => ({
  main: {
    margin: "auto",
    padding: "10px 40px",
    maxWidth: 1200,
    color: "#a0aec0",
  },
  subTitle: {
    fontFamily: "Rubik",
    color: "#fff",
    fontSize: 28,
  },
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    "@media (max-width: 699px)": {
      width: "90%",
      flexDirection: "column",
    },
  },
  element: {
    width: "27%",
    backgroundColor: "#1a1e23",
    height: 300,
    filter: "drop-shadow(0px 2px 24px rgba(0, 0, 0, 0.1))",
    border: "2px solid #393E46",
    borderLeft: "solid 3px #393E46",
    boxShadow: "5px 5px 0px #393E46",
    borderRadius: 12,
    // height: "max-content",
    padding: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (max-width: 699px)": {
      width: "100%",
      marginBottom: 20,
    },
  },
  text: {
    fontSize: 20,
    color: "#fff",
    // wordBreak: "break-all",
  },
  subText: {
    fontSize: 14,
    padding: 10,
    backgroundColor: "#FF996647",
  },
  container2: {
    textAlign: "center",
    marginTop: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default Onboarding;
