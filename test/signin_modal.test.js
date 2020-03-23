const { expect } = require('chai');
require("../utils/common-utils");
log.updateLogFile("signin_modal.test");

describe("Signin modal Test",function(){
	before(async function(){
		let account_status = await get_current_state(".account");
		//if()
	})

})




async function goto_random_place(mode){
	let random_method = get_num_from_0_to_less_n(3+mode=="pool"?1:0);
	switch(random_method){
		case 0:
			await goto_dashboard();
			break;
		case 1:
			await goto_account();
			break;
		case 2:
			await goto_staking();
			break;
		default:
			await goto_pool();
	}
}

async function signout_from_random_place(type){
	let random_method = get_num_from_0_to_less_n(5*(type!="visitor"?2:1));
	switch(random_method){
		case 0:
			if(mode=="pool") {
				await signout_from_pool();
				break;
			}
		case 1:
			await signout_from_staking();
			break;
		case 2:// when visitor log in on pool manangement mode, they can sign out from pool section;
		case 3:
		case 4:
			await signout_from_account();
			break;
		case 5:
			if(mode=="pool") {
				await goto_pool();
				await click('#header-signin-out');
				break;
			}
		case 6:
			await goto_dashboard();
			await click('#header-signin-out');
			break;
		case 7:
			await goto_account();
			await click('#header-signin-out');
			break;
		case 8:
			await goto_staking();
			await click('#header-signin-out');
			break;
		default:
			//await 
	}
}