package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class CheckoutPage extends AbstractPageObject {

	@FindBy(className = "checkout-container")
	private WebElement checkoutContainer;

	@FindBy(css = "div[data-region='checkoutActionRegion'] button.btn-cmd-submit-order")
	private WebElement completeOrderButton;

	@FindBy(css = "div[data-region='billingAddressesRegion'] button.checkout-new-address-btn")
	private WebElement addNewBillingAddress;

	@FindBy(css = "div[data-region='shippingAddressesRegion'] button.checkout-new-address-btn")
	private WebElement addNewShippingAddress;

	@FindBy(css = "div[data-region='paymentMethodsRegion'] button.checkout-new-payment-btn")
	private WebElement addNewPaymentMethod;


	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CheckoutPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(checkoutContainer.isDisplayed())
				.as("Failed to verify Checkout page")
				.isTrue();
	}

	public NewAddressPage clickNewAddressButton() {
		clickButton(addNewBillingAddress);
		return new NewAddressPage(driver);
	}

	public NewPaymentMethodPage clickNewPaymentMethodButton() {
		clickButton(addNewPaymentMethod);
		return new NewPaymentMethodPage(driver);
	}

	public OrderConfirmationPage clickCompleteOrderButton() {
		clickButton(completeOrderButton);
		return new OrderConfirmationPage(driver);
	}

}
