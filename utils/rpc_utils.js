var Web3 = require("aion-web3");
const web3 = new Web3(new Web3.providers.HttpProvider(TEST_CONFIG.rpc_url));
const account_with_balance = web3.eth.accounts.privateKeyToAccount(TEST_CONFIG.test_accounts.private_key.pk);

exports.checkBalance = async function(addr){
	let balance = await web3.eth.getBalance(addr,"latest");
	log.debug("get balance:")
	log.debug(balance);
	return balance/1000000000000000000;
}

exports.getTestCoin = async function(receiver, amount){
	let signed_data = await account_with_balance.signTransaction({
		to:receiver, value:amount*1000000000000000000,gas:"0x5208"
	});
	log.debug(signed_data.rawTransaction);
	await web3.eth.sendSignedTransaction(signed_data.rawTransaction).on('transactionHash',(hash)=>{
		log.debug(hash);
	}).on('receipt',(receipt)=>{
		log.debug(receipt);
		return Promise.resolve();
	})
}

exports.getReceipt = function(txhash){
	return web3.eth.getTransactionReceipt(tx)
}

