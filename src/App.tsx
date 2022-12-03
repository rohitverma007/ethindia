import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import TabsBody from "./components/TabsBody";
import { useSmartAccountContext } from "./contexts/SmartAccountContext";
import { useWeb3AuthContext } from "./contexts/SocialLoginContext";
import Button from "./components/Button";
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
// import { GlootTheme, StyledSvgViewer } from "styled-components";
// JUST SEND JSON TO BACKEND.
// THEN CREATE NFTS
// DO FRONTEND LSAT

// const correct_matches = [
//   {
//     "netherlands_usa": "netherlands"
//   },
//   {
//     "argentina_australia": null
//   },
//   {
//     "japan_croatia": null
//   },
//   {
//     "brazil_south_korea": null
//   },
//   {
//     "france_poland": null
//   },
//   {
//     "england_senegal": null
//   },
//   {
//     "morocco_spain": null
//   },
//   {
//     "portugal_switzherland": null
//   }

// ]
// for(const ob of correct_matches) {
//   for(const a in ob){
//     if(ob[a] != null){
//       if(ob[a] == user[a]){
//         return {
//           // NEW NFT
//         }
//       }
//     }
//   }
// }



const App: React.FC = () => {
  const classes = useStyles();
  const { connect, address, loading: eoaWalletLoading } = useWeb3AuthContext();
  const { loading } = useSmartAccountContext();
  const onPartyClick = (party: typeof Match) => {
    console.log(party)
  }
  const onMatchClick = (match: typeof Match) => {
    console.log(match)
  }
  if (!address) {
    return (
      <div
        className={classes.bgCover}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "30vh",
        }}
      >
        <h1 className={classes.title}>PredictNow</h1>
        {/* <SingleEliminationBracket

      matches={[
        {
          "id": 1,
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
              "name": "Netherlands"
            },
            {
              "id": "iusa",
              "resultText": null,
              "isWinner": false,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
              "name": "USA"
            }
          ]
        },
        {
          "id": 2,
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
              "name": "Netherlands"
            },
            {
              "id": "iusa",
              "resultText": null,
              "isWinner": true,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
              "name": "Ant"
            }
          ]          
        }   
      ]}
      matchComponent={({
        match,
        onMatchClick,
        onPartyClick,
        onMouseEnter,
        onMouseLeave,
        topParty,
        bottomParty,
        topWon,
        bottomWon,
        topHovered,
        bottomHovered,
        topText,
        bottomText,
        connectorColor,
        computedStyles,
        teamNameFallback,
        resultFallback,
      }) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            color: '#000',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            onMouseEnter={() => {console.log(topParty);onMouseEnter(topParty.id);}}
            style={{ display: 'flex' }}
          >
            <div>{topParty.name || teamNameFallback}</div>
            <div>{topParty.resultText ?? resultFallback(topParty)}</div>
          </div>
          <div
            style={{ height: '1px', width: '100%', background: '#FF8C00' }}
          />
          <div
            onMouseEnter={() => onMouseEnter(bottomParty.id)}
            style={{ display: 'flex' }}
          >
            <div>{bottomParty.name || teamNameFallback}</div>
            <div>{bottomParty.resultText ?? resultFallback(topParty)}</div>
          </div>
        </div>
      )}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />               */}
        <Button
          title="Get Started"
          onClickFunc={connect}
          isLoading={eoaWalletLoading}
          style={{
            fontSize: 20,
            padding: "30px 20px",
            border: 0,
            background:
              "linear-gradient(90deg, #0063FF -2.21%, #9100FF 89.35%)",
          }}
        />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className={classes.bgCover}>
      <Navbar />
      {loading ? (
        <div className={classes.container}>
          <img src="/logo.svg" className={classes.animateBlink} alt="" />
        </div>
      ) : (
        <TabsBody />
      )}
      <ToastContainer />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    backgroundColor: "#1a1e23",
    // backgroundImage: `url(/img/northern-lights-bg.png)`,
    backgroundSize: "cover",
    width: "100%",
    minHeight: "100vh",
    color: "#fff",
    fontStyle: "italic",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "80vh",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 50,
    fontSize: 60,
    background: "linear-gradient(90deg, #12ECB8 -2.21%, #00B4ED 92.02%)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  },
  animateBlink: {
    animation: "$bottom_up 2s linear infinite",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  "@keyframes bottom_up": {
    "0%": {
      transform: "translateY(0px)",
    },
    "25%": {
      transform: "translateY(20px)",
    },
    "50%": {
      transform: "translateY(0px)",
    },
    "75%": {
      transform: "translateY(-20px)",
    },
    "100%": {
      transform: "translateY(0px)",
    },
  },
}));

export default App;
