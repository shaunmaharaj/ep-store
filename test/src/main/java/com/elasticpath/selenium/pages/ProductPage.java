package com.elasticpath.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

public class ProductPage extends AbstractPageObject {

	@FindBy(className = "itemdetail-details")
	private WebElement itemDetail;

	@FindBy(id = "product_display_item_add_to_cart_button")
	private WebElement addToCartButton;

	@FindBy(id = "product_display_item_quantity_select")
	private WebElement quantitySelect;

	private final String SKU_OPTION_SELECT_CSS = "select[id*='product_display_item_sku_select_'][id*='%s']";


	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public ProductPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
	}

	public CartPage clickAddToCartButton() {
		clickButton(By.id("product_display_item_add_to_cart_button"));
		return new CartPage(driver);
	}

	public void selectQuantity(final String quantity) {
		new Select(quantitySelect).selectByVisibleText(quantity);
	}

	public void selectSkuOption(final String skuOption, final String choice) {
		String beforeUrl = driver.getCurrentUrl();
		Select skuOptionSelect = new Select(driver.findElement(By.cssSelector(String.format(SKU_OPTION_SELECT_CSS, skuOption.toUpperCase()))));
		skuOptionSelect.selectByVisibleText(choice);
		waitForUrlToChange(beforeUrl);
	}

}
