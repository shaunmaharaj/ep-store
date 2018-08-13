package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import com.elasticpath.util.CustomerInfo;

public class CheckoutSignInPage extends AbstractPageObject {
	@FindBy(css = ".container .checkout-auth-option-list")
	private WebElement checkoutAuthPage;

	@FindBy(css = "div[data-region='checkoutAutRegisterOptionRegion'] button.checkout-auth-option-register-btn")
	private WebElement registerButton;

	@FindBy(css = "div[data-region='anonymousCheckoutFeedbackRegion'] ~div input[id='Email']")
	private WebElement anonymousEmailInput;

	@FindBy(css = "div[data-region='anonymousCheckoutFeedbackRegion'] ~button.checkout-auth-option-anonymous-checkout-btn")
	private WebElement anoymousCheckoutButton;

	@FindBy(css = "input[id='registration_form_emailUsername']")
	private WebElement existingEmailInput;

	@FindBy(css = "input[id='registration_form_password']")
	private WebElement existingUserPasswordInput;

	@FindBy(css = ".checkout-auth-option-login-btn")
	private WebElement loginAndContinueButton;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CheckoutSignInPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(checkoutAuthPage.isDisplayed())
				.as("Failed to load Checkout Sign In page")
				.isTrue();
	}

	/**
	 * Clicks Register Button.
	 * @return RegisterPage
	 */
	public RegisterPage clickRegisterButton() {
		clickButton(registerButton);
		return new RegisterPage(driver);
	}

	/**
	 * Clicks anonymous checkout.
	 * @return CheckoutPage
	 */
	public CheckoutPage anonymousCheckout() {
		CustomerInfo customerInfo = new CustomerInfo();
		clearAndType(anonymousEmailInput, customerInfo.getUuid() + "test@elasticpath.com");
		clickButton(anoymousCheckoutButton);
		return new CheckoutPage(driver);
	}

	/**
	 * Login and Continue as existing shopper.
	 * @param userName username
	 * @param password password
	 * @return CheckoutPage
	 */
	public CheckoutPage registeredShopperCheckout(final String userName, final String password) {
		clearAndType(existingEmailInput, userName);
		clearAndType(existingUserPasswordInput, password);
		clickButton(loginAndContinueButton);
		return new CheckoutPage(driver);
	}


}
