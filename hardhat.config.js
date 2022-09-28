require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.ACCOUNT_KEY],
    },
    mainnet: {
      url: process.env.MAINNET,
      accounts: [process.env.ACCOUNT_KEY],
    },
  },
};
