/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

package com.elasticpath.cucumber.definitions.demo;

import cucumber.api.java.en.Given;

import com.elasticpath.selenium.SetUp;
import com.elasticpath.selenium.pages.HeaderPage;

public class HeaderDefinition {
	private HeaderPage headerPage;

	public HeaderDefinition() {
		headerPage = new HeaderPage(SetUp.getDriver());
	}

	@Given("^I select category (.+)$")
	public void selectCategory(final String categoryName) {
		headerPage.selectCategory(categoryName);
	}

	@Given("^I select parent category (.+) and sub category (.+)$")
	public void selectParentAndSubCategory(final String parentCategoryName, final String subCategoryName) {
		headerPage.selectParentCategory(parentCategoryName);
		if (!subCategoryName.equals("-")) {
			headerPage.selectSubCategory(parentCategoryName, subCategoryName);
		}
	}

}
