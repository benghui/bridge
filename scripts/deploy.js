// const hre = require("hardhat");

const main = async () => {
	const [deployer] = await ethers.getSigners();
	const accountBalance = await deployer.getBalance();

	console.log('Deploying contracts with account: ', deployer.address);
	console.log('Account balance: ', accountBalance.toString());

	const Erc721 = await ethers.getContractFactory('BengERC721');
	const erc721 = await Erc721.deploy();
	await erc721.deployed();

	console.log('BengERC721 address: ', erc721.address);

	const Erc20 = await ethers.getContractFactory('BengERC20');
	const erc20 = await Erc20.deploy();
	await erc20.deployed();

	console.log('BengERC20 address: ', erc20.address);
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();
