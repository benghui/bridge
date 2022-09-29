require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.ACCOUNT_KEY;

const fs = require('fs');
const fastcsv = require('fast-csv');
const fileName = "fx-bridge token supply.csv";
const jsonFile = "./Bridge.json";
const contract = JSON.parse(fs.readFileSync(jsonFile));

const alchemyProvider = new ethers.providers.AlchemyProvider(network = "homestead", API_KEY);
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

async function writeOnce() {
	// query all bridge tokens
	const getBridgeTokenList = await bridgeContract.getBridgeTokenList();

	// iterate through getBridgeTokenList
	// use balanceOf to get the supply of each token inside of contract
	// add blockNumber and timestamp to the object and push corresponding token data into a supply array
	const checkSupply = async () => {
		let supply = [];
		const blockNumber = await alchemyProvider.getBlockNumber();
		const timestamp = (await alchemyProvider.getBlock(blockNumber)).timestamp;
		await Promise.all(
			getBridgeTokenList.map(async (token) => {
				let tokenContract = new ethers.Contract(token.addr, minABI, signer);
				let balance = await tokenContract.balanceOf(CONTRACT_ADDRESS);
				let format = ethers.utils.formatUnits(balance, token.decimals).toString();
				supply.push({ name: token.name, supply: format, blockNumber: blockNumber, timestamp: timestamp });
			})
		)
		return await supply
	}

	const supplyArray = await checkSupply();
	// console.log("Supply: ", supplyArray);

	// create new CSV with headers if file does not exist. Else append to existing file without headers
	if (!fs.existsSync(fileName)) {
		fastcsv
			.write(supplyArray, { headers: true, writeHeaders: true, includeEndRowDelimiter: true })
			.pipe(fs.createWriteStream(fileName));
	} else {
		fastcsv
			.write(supplyArray, { headers: true, writeHeaders: false, includeEndRowDelimiter: true })
			.pipe(fs.createWriteStream(fileName, { flags: "a" }));
	}
}

async function main() {
	// setInterval to run query once every 5s and write to CSV
	let intervalTimerId = setInterval(async () => await writeOnce(), 5000);

	// setTimeout to end the interval after 1 minute.
	setTimeout(() => {
		clearInterval(intervalTimerId);
	}, 65000);
}

main();
