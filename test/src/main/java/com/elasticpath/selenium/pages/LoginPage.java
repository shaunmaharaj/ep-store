package com.elasticpath.selenium.pages;

import static org.assertj.core.api.Assertions.assertThat;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPage extends AbstractPageObject {


	@FindBy(css = "div[id='login-modal'][style*='block']")
	private WebElement loginModel;

	@FindBy(id = "login_modal_login_button")
	private WebElement loginButton;

	@FindBy(id = "login_modal_register_button")
	private WebElement registerLink;

	private final WebDriver driver;

	/**
	 * Constructor.
	 *
	 * @param driver WebDriver which drives this page.
	 */
	public LoginPage(final WebDriver driver) {
		super(driver);
		this.driver = driver;
	}

	@Override
	public void verifyCorrectPageIsDisplayed() {
		assertThat(loginModel.isDisplayed())
				.as("Failed to verify Login page")
				.isTrue();
	}

	public void enterUserName(final String userName) {
		clearAndType(loginModel.findElement(By.id("login_modal_username_input")), getPropertyManager().getProperty("default.customer.username"));
	}

	public void enterPassword(final String password) {
		clearAndType(loginModel.findElement(By.id("login_modal_password_input")), getPropertyManager().getProperty("default.customer.password"));
	}

	public void clickLoginButton() {
		clickButton(loginButton);
		getWaitDriver().waitForElementToBeInvisible(By.cssSelector("div[id='login-modal'][style*='block']"));
	}

	public void loginAsDefaultCustomer() {
		login(getPropertyManager().getProperty("default.customer.username"), getPropertyManager().getProperty("default.customer.password"));
	}

	public void login(final String userName, final String password) {
		enterUserName(userName);
		enterPassword(password);
		clickLoginButton();
	}

	public RegisterPage clickRegisterLink() {
		registerLink.click();
		return new RegisterPage(driver);
	}


}
