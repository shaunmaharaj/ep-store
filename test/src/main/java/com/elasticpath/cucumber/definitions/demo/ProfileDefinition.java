package com.elasticpath.cucumber.definitions.demo;

import java.util.Map;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.HeaderPage;
import com.elasticpath.selenium.pages.PurchaseDetailsPage;
import com.elasticpath.selenium.pages.ProfilePage;

public class ProfileDefinition {

	private ProfilePage profilePage;
	private PurchaseDetailsPage purchaseDetailsPage;
	private HeaderPage headerPage;

	public ProfileDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
	}

	@When("^I navigate to the profile page")
	public ProfilePage goToProfilePage() {
		profilePage =  headerPage.clickProfileMenuLink();
		return profilePage;
	}

	@When("^I click the edit personal info button")
	public void clickEditPersonalInfoButton() {
		profilePage.editPersonalInfoButton();
	}

	@When("^I update my personal info to the following")
	public void editPersonalInfo(final Map<String, String> shopperPersonalInfo) {
		profilePage.updatePersonalInfo(shopperPersonalInfo.get("firstname"), shopperPersonalInfo.get("lastname"));
	}

	@When("^I click the add address button")
	public void clickAddAddressButton() {
		profilePage.clickProfileNewAddressButton();
	}

	@When("^I click the add payment method button")
	public void clickAddPaymentMethodButton() {
		profilePage.clickProfileNewPaymentMethodButton();
	}

	@Then("^I can update my personal info")
	public void verifyPesonalInfoUpdateRegion() {
		profilePage.verifyPesonalInfoUpdateRegionExist();
	}

	@Then("^I can see my purchase history")
	public void verifyPurchaseHistory() {
		profilePage.verifyPurchaseHistory();
	}

	@Then("^I can see my addresses")
	public void verifyProfileAddressesRegion() {
		profilePage.verifyProfileAddressesRegion();
	}

	@Then("^My personal info should be updated")
	public void verifyPersonalInfoUpdated(final Map<String, String> shopperPersonalInfo) {
		profilePage.verifyPersonalInfoUpdated(shopperPersonalInfo.get("firstname"));
	}

}
