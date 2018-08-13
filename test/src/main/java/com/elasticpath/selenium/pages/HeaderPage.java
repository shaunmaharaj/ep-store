package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class HeaderPage extends AbstractPageObject {

	@FindBy(id = "header_navbar_container")
	private WebElement navigationBar;

	@FindBy(id = "header_home_logo_link")
	private WebElement headerHomeLogoLink;

	@FindBy(id = "header_navbar_login_button")
	private WebElement loginLink;

	@FindBy(id = "header_navbar_cart_button")
	private WebElement cartLink;

	@FindBy(id = "header_navbar_loggedIn_button")
	private WebElement loggedInLink;

	@FindBy(id = "header_navbar_login_menu_profile_link")
	private WebElement profileMenuLink;

	@FindBy(id = "header_navbar_login_menu_logout_button")
	private WebElement logoutMenuLink;

	private final WebDriver driver;
	private final static String PARENT_CATEGORY_CSS = "li[data-name='%1s']";
	private final static String SUB_CATEGORY_CSS = PARENT_CATEGORY_CSS + " > div[aria-label='navbarDropdown'] > a[title='%2s']";
	private final static String searchInputCSS = "#header_navbar_search_container_input";

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public HeaderPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		getWaitDriver().waitForPageToLoad();
		assertThat(headerHomeLogoLink.isDisplayed())
				.as("Failed to verify Header page")
				.isTrue();
	}

	public CategoryPage selectCategory(final String categoryName) {
		getWaitDriver().waitForPageToLoad();
		navigationBar.findElement(By.cssSelector(String.format(PARENT_CATEGORY_CSS, categoryName))).click();
		return new CategoryPage(driver);
	}

	public void selectParentCategory(final String parentCategoryName) {
		getWaitDriver().waitForPageToLoad();
		navigationBar.findElement(By.cssSelector(String.format(PARENT_CATEGORY_CSS, parentCategoryName))).click();
	}

	public CategoryPage selectSubCategory(final String parentCategory, final String subCategoryName) {
		getWaitDriver().waitForPageToLoad();
		navigationBar.findElement(By.cssSelector(String.format(SUB_CATEGORY_CSS, parentCategory, subCategoryName))).click();
		return new CategoryPage(driver);
	}

	public void clickLoggedInLink() {
		loggedInLink.click();
	}

	public ProfilePage clickProfileMenuLink() {
		clickLoggedInLink();
		profileMenuLink.click();
		return new ProfilePage(driver);
	}

	public LoginPage clickLoginLink() {
		loginLink.click();
		return new LoginPage(driver);
	}

	public CartPage clickCartLink() {
		getWaitDriver().waitForPageToLoad();

		cartLink.click();
		return new CartPage(driver);
	}

}
