require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.ACCOUNT_KEY;

const fs = require('fs');
const jsonFile = "./Bridge.json";
const contract = JSON.parse(fs.readFileSync(jsonFile));

const alchemyProvider = new ethers.providers.AlchemyProvider(network="homestead", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const bridgeContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const minABI = [
	{
		constant: true,
		inputs: [{ name: "_owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ name: "balance", type: "uint256" }],
		type: "function",
	},
];

async function main() {
	// query all bridge tokens
	const getBridgeTokenList = await bridgeContract.getBridgeTokenList();

	// extract data into { token address: [ token name, decimals ] }
	const extractList = getBridgeTokenList.reduce((a, v) => ({ ...a, [v.addr]: [v.name, v.decimals]}), {})
	console.log("Extract List: ", extractList);

	// iterate through extractList object
	// use balanceOf to get the supply of each token inside of contract
	const checkSupply = async () => {
		let supply = []
		for (let [token, value] of Object.entries(extractList)) {
			let tokenContract = new ethers.Contract(token, minABI, signer);
			let balance = await tokenContract.balanceOf(CONTRACT_ADDRESS);
			let format = ethers.utils.formatUnits(balance, value[1]).toString();
			supply.push({name: value[0], supply: format})
		}
		return supply
	}

	const supplyArray = await checkSupply()
	console.log("Supply : ", supplyArray)
}

main();
