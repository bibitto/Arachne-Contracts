import fs from "fs";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-preprocessor";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // officially supported chains: $npx hardhat verify --list-networks
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 5,
    },
    avalancheFujiTestnet: {
      url: process.env.FUJI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 43113,
    },
    mumbaiTestnet: {
      url: process.env.MUMBAI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 80001,
    },
    opGoerli: {
      url: process.env.OP_GOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 420,
    },
    arbGoerli: {
      url: process.env.ARB_GOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 421613,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPLOIA_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 534351,
    },
    gnosisTestnet: {
      url: process.env.GNOSIS_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 10200,
    },
    chilizTestnet: {
      url: process.env.CHILIZ_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 88882,
    },
    baseTestnet: {
      url: process.env.BASE_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 84531,
    },
    mantleTestnet: {
      url: process.env.MANTLE_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 5001,
    },
    zkSyncTestnet: {
      url: process.env.ZKSYNC_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 280,
    },
    zKatana: {
      url: process.env.ZKATANA_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 1261120,
    },
    celoTestnet: {
      url: process.env.CELO_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 44787,
    },
    neonDevnet: {
      url: process.env.NEON_DEVNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 245022926,
    },
    lineaTestnet: {
      url: process.env.LINEA_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 59140,
    },
    polygonZkevmTestnet: {
      url: process.env.POLYGON_ZKEVM_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 1442,
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.AVALANCH_ETHERSCAN_API_KEY || "",
      mumbaiTestnet: process.env.MUMBAI_ETHERSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./src", // Use ./src rather than ./contracts as Hardhat expects
    cache: "./cache/hardhat", // Use a different cache for Hardhat than Foundry
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
};

function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.trim().split("="));
}

export default config;
