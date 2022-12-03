import React, { Dispatch, SetStateAction, useState } from "react";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import { LocalRelayer, RestRelayer } from "@biconomy/relayer";
import Button from "../Button";
import { useWeb3Context } from "../../contexts/Web3Context";
import { useSmartAccountContext } from "../../contexts/SmartAccountContext";
import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import axios from "axios";

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

  const {
    state,
    wallet: smartAccount,
    getSmartAccount,
  } = useSmartAccountContext();
  console.log("PROVIDEERERE")
  console.log(provider);
  // window.yy  = provider;
  (window as any).provider = provider;

  const [deployLoading1, setDeployLoading1] = useState(false);
  const [deployLoading2, setDeployLoading2] = useState(false);

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
    // const { provider } = useWeb3Context();
    // console.log("PROVIDEERERE2")
    // console.log(provider);
    // // window.yy  = provider;
    // (window as any).provider = provider;
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
    axios.post("http://localhost:8000/submitBracket", {
      address: smartAccount?.address,
      matches: matches
    }).then(async function (response) {
      console.log(response)
      console.log(response.data.tokenId)
// reverting to metamask for now???
// // create provider from Metamask
// const provider = new ethers.providers.Web3Provider(window.ethereum)
// // get the account that will pay for the trasaction
// const signer = provider.getSigner()

// let contract = new ethers.Contract(
//       contractAddress,
//       abi,
//       signer
//     )


// const tx = await contract.mint(1);

// console.log('transaction :>> ', tx)
// wait for the transaction to actually settle in the blockchain
// await tx.wait()

    }).catch(function (error) {
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
      {smartAccount?.address}
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
        <span>
        {champion}
      </span>
       ): (<></>)}
        </div>       
      </div>
      <Button
          title="Submit Bracket"
          onClickFunc={submitBracket}
          style={{
            fontSize: 20,
            padding: "30px 20px",
            border: 0,
            background:
              "linear-gradient(90deg, #0063FF -2.21%, #9100FF 89.35%)",
          }}
        />
{/* <SingleEliminationBracket
      matches={[
        {
          "id": 260005,
          "name": "Fifa World Cup 2022",
          "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
          "tournamentRoundText": "4", // Text for Round Header
          "startTime": "2021-05-30",
          "state": "DONE", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
          "participants": [
            {
              "id": "netherlands", // Unique identifier of any kind
              "resultText": "", // Any string works
              "isWinner": false,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
              "name": "giacomo123"
            },
            {
              "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
              "resultText": null,
              "isWinner": true,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
              "name": "Ant"
            }
          ]
        },
        {
          "id": 260005,
          "name": "Fifa World Cup 2022",
          "nextMatchId": 5, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
          "tournamentRoundText": "4", // Text for Round Header
          "startTime": "2021-05-30",
          "state": "DONE", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
          "participants": [
            {
              "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
              "resultText": "WON", // Any string works
              "isWinner": false,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
              "name": "giacomo123"
            },
            {
              "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
              "resultText": null,
              "isWinner": true,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
              "name": "Ant"
            }
          ]
        }        
      ]}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />         */}
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
