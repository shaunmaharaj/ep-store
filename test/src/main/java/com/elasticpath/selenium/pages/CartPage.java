package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

public class CartPage extends AbstractPageObject {

	@FindBy(className = "cart-container")
	private WebElement cartContainer;

	@FindBy(className = "btn-cmd-checkout")
	private WebElement checkoutButton;

	@FindBy(id = "promo-code")
	private WebElement promoCode;

	@FindBy(id = "cart-lineItem-select-quantity")
	private WebElement quantitySelect;

	@FindBy(css = "div[data-region='itemTotalPriceRegion'] .cart-total-purchase-price")
	private WebElement cartLineItemPriceElement;

	@FindBy(css ="button.btn-cart-removelineitem")
	private WebElement removeLineItemButton;

	private final static String removeButtonCSS = "button.btn-cart-removelineitem";
	private final static String emptyCartContainerCSS = ".cart-empty-container";

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public CartPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
	}

	public CheckoutPage clickProceedToCheckoutButton() {
		clickButton(checkoutButton);
		return new CheckoutPage(driver);
	}

	public CheckoutSignInPage proceedToCheckoutSignIn() {
		clickButton(checkoutButton);
		return new CheckoutSignInPage(driver);
	}

	public void verifyCartItem(final String productName) {
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Product " + productName + " is not in the cart as expected")
				.isTrue();
	}

	public void updateCartLineItemQuantity(final String quantity) {
		new Select(quantitySelect).selectByVisibleText(quantity);
	}

//	TODO verify price based on given lineitem name.
	public void verifyCartLineItemTotalPrice(final String cartLineItemTotalPrice) {
		getWaitDriver().waitForPageToLoad();
		assertThat(cartLineItemTotalPrice)
				.as("Expected cart line item total price not match.")
				.isEqualTo(cartLineItemPriceElement.getText());
	}

	public void removeCartLineItem(final String productName) {
		clickButton(removeLineItemButton);
	}

	public void verifyLineItemNotExist(final String productName) {
		getWaitDriver().waitForPageToLoad();
		setWebDriverImplicitWait(1);
		assertThat(isElementPresent(By.linkText(productName)))
				.as("Product " + productName + " is not removed from the cart")
				.isFalse();
		setWebDriverImplicitWaitToDefault();
	}

	public void clearCart() {
		setWebDriverImplicitWait(3);
		if(isElementPresent(By.cssSelector(emptyCartContainerCSS))) {

			for (WebElement remoteButton : getDriver().findElements(By.cssSelector(removeButtonCSS))) {
				getDriver().findElement(By.cssSelector(removeButtonCSS)).click();
				getWaitDriver().waitForPageToLoad();
				assertThat(isElementPresent(By.cssSelector(emptyCartContainerCSS)))
						.as("Cart is not empty")
						.isTrue();
			}
		}
		setWebDriverImplicitWaitToDefault();
	}

}
