var Web3 = require("aion-web3");
const web3 = new Web3(new Web3.providers.HttpProvider(TEST_CONFIG.relay_url));
const account_with_balance = web3.eth.accounts.privateKeyToAccount(TEST_CONFIG.account.private_key.pk);

export.checkBalance = async function(addr){
	return (await web3.eth.getBalance(addr,"latest"))/1000000000000000000;
}

export.getTestCoin = async function(receiver, amount){
	let signed_data = account_with_balance.signTransaction({
		to:receiver, value:amount
	});
	web3.eth.sendSignedTransaction(signed_data).on('receipt',(receipt)=>{
		log.debug(receipt);
		return Promise.resolve();
	})
}

