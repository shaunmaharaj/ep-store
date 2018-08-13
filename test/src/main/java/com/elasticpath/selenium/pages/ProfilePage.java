package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class ProfilePage extends AbstractPageObject {

	@FindBy(css = "div[data-region='profilePersonalInfoRegion']")
	private WebElement profilePersonalInfoRegion;

	@FindBy(css = "div[data-region='profilePersonalInfoRegion'] button.profile-personal-info-edit-btn")
	private WebElement editPersonalInfoButton;

	@FindBy(id = "registration_form_firstName")
	private WebElement firstName;

	@FindBy(id = "registration_form_lastName")
	private WebElement lastName;

	@FindBy(css = "div[data-region='create-streetAddress-btn-container'] button.streetAddress-save-btn")
	private WebElement savePersonalInfoButton;


	@FindBy(css = "div[data-region='profileAddressesRegion'] button.profile-new-address-btn")
	private WebElement addProfileNewAddress;

	@FindBy(css = "div[data-region='paymentMethodsRegion'] button.profile-new-address-btn")
	private WebElement addProfileNewPaymentMethod;


	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public ProfilePage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(profilePersonalInfoRegion.isDisplayed())
				.as("Failed to verify Profile page")
				.isTrue();
	}

	public void editPersonalInfoButton() {
		clickButton(editPersonalInfoButton);
	}

	public void enterFirstName(final String firstName) {
		clearAndType(this.firstName, firstName);
	}

	public void enterLastName(final String lastName) {
		clearAndType(this.lastName, lastName);
	}

	public void savePersonalInfoButton() {
		clickButton(savePersonalInfoButton);
	}

	public void updatePersonalInfo(final String firstName, final String... lastName) {
		enterFirstName(firstName);
		if (lastName != null && lastName.length > 0) {
			enterLastName(lastName[0]);
		}
		savePersonalInfoButton();
	}

	public NewAddressPage clickProfileNewAddressButton() {
		clickButton(addProfileNewAddress);
		return new NewAddressPage(driver);
	}

	public NewPaymentMethodPage clickProfileNewPaymentMethodButton() {
		clickButton(addProfileNewPaymentMethod);
		return new NewPaymentMethodPage(driver);
	}

}
