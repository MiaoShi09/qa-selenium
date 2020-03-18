

class Element_Map{

	construction(driver){
		this.driver = driver;
		this.elements= {};
		this.url = "";
	}

	async reloadPage(){
		this.url = await this.driver.getCurrentUrl();

	}
}