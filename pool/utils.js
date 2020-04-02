global.get_delegations_details = function(){
    return driver.executeScript("return Object.entries(getState().delegations).map(o=>{return {pool:o[0],stake:{number:o[1].stake.toNumber(),localeString:o[1].stake.toLocaleString()}};})");
}

global.get_rewards_details =function(){
    return driver.executeScript("return Object.entries(getState().delegations).map(o=>{return {pool:o[0],rewards:{number:o[1].rewards.toNumber(),localeString:o[1].rewards.toLocaleString()}};})");
}

global.get_auto_delegate_details =function(){
    return driver.executeScript("return Object.entries(getState().delegations).map(o=>{return {pool:o[0],auto_delegate_rewards:o[1].auto_delegate_rewards};})");

}
global.find_non_delegate_active_pool = async function(){
	let pools = await get_current_state(".pools.map(o=>{return {address:o.address,active:o.active,stake_self:o.stake_self.toNumber()}});");
	let my_delegation = (await get_delegations_details()).map(item=>item.pool);
	for(let i = 0; i < pools.length; i++){

		if(!my_delegation.includes(pools[i].address) && pools[i].active === '0x01' && pools[i].stake_self >= 1000){
			return i;
		}
	}
	return -1;
}

global.get_pools = function(){
	return get_current_state(".pools.map(o=>{return {address:o.address, active:o.active,stake_self:o.stake_self.toNumber()}});");
}

global.get_pools_map =async  function(){
	let pools = await get_current_state(".pools.map(o=>{return [o.address,{name:(o.meta_name==''?o.address:o.meta_name),address:o.address,active:o.active,stake_self:o.stake_self.toNumber()}]});");
	return Object.fromEntries(pools);
}

global.get_non_zero_delegation = async function(){
	let delegations = (await get_delegations_details()).filter(o=>o.stake.number>0);
	console.log(delegations);
	return delegations;
}