export const ChainId = {
  // MAINNET: 1, // Ethereum
  GOERLI: 5,
  // POLYGON_MUMBAI: 80001,
  // POLYGON_MAINNET: 137,
};

export let activeChainId = ChainId.GOERLI;
export const supportedChains = [
  ChainId.GOERLI,
  // ChainId.POLYGON_MAINNET,
  // ChainId.POLYGON_MUMBAI,
];

export const getRPCProvider = (chainId: number) => {
  switch (chainId) {
    case 5:
      return "https://eth-goerli.alchemyapi.io/v2/lmW2og_aq-OXWKYRoRu-X6Yl6wDQYt_2";
  }
};

export const getSupportedChains = () => {};
