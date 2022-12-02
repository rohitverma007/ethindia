import React, { Dispatch, SetStateAction, useState } from "react";
// import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import { LocalRelayer, RestRelayer } from "@biconomy/relayer";
import Button from "../Button";
// import { useWeb3Context } from "../../contexts/Web3Context";
import { useSmartAccountContext } from "../../contexts/SmartAccountContext";
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
  // const { provider } = useWeb3Context();
  const {
    state,
    wallet: smartAccount,
    getSmartAccount,
  } = useSmartAccountContext();

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

  return (
    <main className={classes.main}>
     heu hey
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
