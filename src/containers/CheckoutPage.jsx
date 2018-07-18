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

import React from 'react';
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import CheckoutSummaryList from '../components/checkout.summarylist';

const Config = require('Config');

// Array of zoom parameters to pass to Cortex
const zoomArray = [
  'defaultcart',
  'defaultcart:total',
  'defaultcart:discount',
  'defaultcart:order',
  'defaultcart:order:tax',
  'defaultcart:order:total',
  'defaultcart:appliedpromotions:element',
  'defaultcart:order:billingaddressinfo:selector:choice',
  'defaultcart:order:billingaddressinfo:selector:choice:description',
  'defaultcart:order:billingaddressinfo:selector:chosen',
  'defaultcart:order:billingaddressinfo:selector:chosen:description',
  'defaultcart:order:deliveries:element:destinationinfo:selector:chosen',
  'defaultcart:order:deliveries:element:destinationinfo:selector:chosen:description',
  'defaultcart:order:deliveries:element:destinationinfo:selector:choice',
  'defaultcart:order:deliveries:element:destinationinfo:selector:choice:description',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:chosen',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:chosen:description',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice',
  'defaultcart:order:deliveries:element:shippingoptioninfo:selector:choice:description',
];

class CheckoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: undefined,
    };
  }

  componentDidMount() {
    this.fetchOrderData();
  }

  fetchOrderData() {
    login().then(() => {
      fetch(`${Config.cortexApi.path}/?zoom=${zoomArray.join()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            orderData: res._defaultcart[0],
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  newAddress() {
    this.props.history.push('/newaddressform', { returnPage: '/checkout' });
  }

  editAddress(addressLink) {
    this.props.history.push('/editaddress', { returnPage: '/checkout', address: addressLink });
  }

  deleteAddress(addressLink) {
    login().then(() => {
      fetch(addressLink, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        this.fetchOrderData();
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  handleChange(link) {
    login().then(() => {
      fetch(link, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      }).then(() => {
        this.fetchOrderData();
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  newPayment() {
    this.props.history.push('/newpaymentform', { returnPage: '/checkout' });
  }

  renderShippingAddress() {
    if (this.state.orderData._order[0]._deliveries && this.state.orderData._order[0]._deliveries[0]._element[0]._destinationinfo) {
      let shippingAddresses = this.state.orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._selector[0]._chosen;
      if (this.state.orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._selector[0]._choice) {
        const choices = this.state.orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._selector[0]._choice;
        shippingAddresses = shippingAddresses.concat(choices);
      }
      return (
        shippingAddresses.map((shippingAddress, index) => {
          const { name, address } = shippingAddress._description[0];
          return (
            <div key={`shippingOption_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                <input type="radio" name="shipping" id="shippingOption" className="checkout-address-radio" defaultChecked={!index} onChange={() => this.handleChange(shippingAddress.self.href)} />
                <label htmlFor="shippingOption">
                  <div data-region="checkoutAddressRegion" style={{ display: 'block' }}>
                    <ul className="address-container">
                      <li className="address-name" data-el-value="address.name">
                        {name['given-name']}&nbsp;
                        {name['family-name']}
                      </li>
                      <li className="address-street-address" data-el-value="address.streetAddress">
                        {address['street-address']}
                      </li>
                      <li className="address-extended-address" data-el-value="address.extendedAddress">
                        {address['extended-address']}
                      </li>
                      <li>
                        <span className="address-city" data-el-value="address.city">
                          {address.locality}
                          ,&nbsp;
                        </span>
                        <span className="address-region" data-el-value="address.region">
                          {address.region}
                          ,&nbsp;
                        </span>
                        <span className="address-country" data-el-value="address.country">
                          {address['country-name']}
                        </span>
                        <span className="address-postal-code" data-el-value="address.postalCode">
                          {address['postal-code']}
                        </span>
                      </li>
                    </ul>
                  </div>
                </label>
              </div>
              <div className="address-btn-cell">
                <button className="btn checkout-edit-address-btn" data-el-label="checkout.editAddressBtn" type="button" onClick={() => { this.editAddress(shippingAddress._description[0].self.href); }}>
                  Edit
                </button>
                <button className="btn checkout-delete-address-btn" data-el-label="checkout.deleteAddressBtn" type="button" onClick={() => { this.deleteAddress(shippingAddress._description[0].self.href); }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })
      );
    }
    return (
      <div>
        <p data-el-value="checkout.noShippingAddressesMsg">
          You have no saved shipping addresses.
        </p>
      </div>
    );
  }

  renderShippingAddressSelector() {
    return (
      <div data-region="shippingAddressesRegion" style={{ display: 'block' }}>
        <div>
          <h2>
            Shipping Address
          </h2>
          <div data-region="shippingAddressSelectorsRegion" className="checkout-region-inner-container">
            {this.renderShippingAddress()}
          </div>
          <button className="btn btn-primary checkout-new-address-btn" data-el-label="checkout.newShippingAddressBtn" type="button" onClick={() => { this.newAddress(); }}>
            Add a New Address
          </button>
        </div>
      </div>
    );
  }

  renderShippingOptions() {
    if (this.state.orderData._order[0]._deliveries && this.state.orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo) {
      let shippingOptions = this.state.orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._selector[0]._chosen;
      if (this.state.orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._selector[0]._choice) {
        const choices = this.state.orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._selector[0]._chosen;
        shippingOptions = shippingOptions.concat(choices);
      }
      return (
        shippingOptions.map((shippingOption, index) => (
          <div key={`shippingOption_${Math.random().toString(36).substr(2, 9)}`}>
            <input type="radio" name="shippingOption" id="shippingOption" className="shipping-option-radio" defaultChecked={!index} onChange={() => this.handleChange(shippingOption.self.href)} />
            <label htmlFor="shippingOption">
              <span data-el-value="shippingOptionDisplayName">
                {shippingOption._description[0]['display-name']}
              </span>
              <span data-el-value="shippingOptionCarrier">
                {shippingOption._description[0].carrier}
              </span>
              <span data-el-value="shippingOptionCost">
                {shippingOption._description[0].cost[0].display}
              </span>
            </label>
          </div>
        ))
      );
    }
    return (
      <div>
        <p data-el-value="checkout.noShippingOptionsMsg">
          There are no shipping options available for your chosen shipping address.
        </p>
      </div>
    );
  }

  renderShippingOptionsSelector() {
    if (this.state.orderData._order[0]._deliveries && this.state.orderData._order[0]._deliveries[0]._element[0]._destinationinfo) {
      return (
        <div>
          <h2>
            Shipping Options
          </h2>
          <div data-region="shippingOptionSelectorsRegion">
            {this.renderShippingOptions()}
          </div>
        </div>
      );
    }
    return ('');
  }

  renderBillingAddress() {
    if (this.state.orderData._order[0]._billingaddressinfo) {
      let billingAddresses = this.state.orderData._order[0]._billingaddressinfo[0]._selector[0]._chosen;
      if (this.state.orderData._order[0]._billingaddressinfo[0]._selector[0]._choice) {
        const choices = this.state.orderData._order[0]._billingaddressinfo[0]._selector[0]._choice;
        billingAddresses = billingAddresses.concat(choices);
      }
      return (
        billingAddresses.map((billingAddress, index) => {
          const { name, address } = billingAddress._description[0];
          return (
            <div key={`billingOption_${Math.random().toString(36).substr(2, 9)}`}>
              <div className="address-ctrl-cell" data-region="checkoutAddressSelector">
                <input type="radio" name="billing" id="billingOption" className="checkout-address-radio" defaultChecked={!index} onChange={() => this.handleChange(billingAddress.self.href)} />
                <label htmlFor="billingOption">
                  <div data-region="checkoutAddressRegion" style={{ display: 'block' }}>
                    <ul className="address-container">
                      <li className="address-name" data-el-value="address.name">
                        {name['given-name']}&nbsp;
                        {name['family-name']}
                      </li>
                      <li className="address-street-address" data-el-value="address.streetAddress">
                        {address['street-address']}
                      </li>
                      <li className="address-extended-address" data-el-value="address.extendedAddress">
                        {address['extended-address']}
                      </li>
                      <li>
                        <span className="address-city" data-el-value="address.city">
                          {address.locality}
                          ,&nbsp;
                        </span>
                        <span className="address-region" data-el-value="address.region">
                          {address.region}
                          ,&nbsp;
                        </span>
                        <span className="address-country" data-el-value="address.country">
                          {address['country-name']}
                        </span>
                        <span className="address-postal-code" data-el-value="address.postalCode">
                          {address['postal-code']}
                        </span>
                      </li>
                    </ul>
                  </div>
                </label>
              </div>
              <div className="address-btn-cell">
                <button className="btn checkout-edit-address-btn" type="button" data-el-label="checkout.editAddressBtn" onClick={() => { this.editAddress(billingAddress._description[0].self.href); }}>
                  Edit
                </button>
                <button className="btn checkout-delete-address-btn" type="button" data-el-label="checkout.deleteAddressBtn" onClick={() => { this.deleteAddress(billingAddress._description[0].self.href); }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })
      );
    }
    return (
      <div>
        <p data-el-value="checkout.noBillingAddressesMsg">
          You have no saved billing addresses.
        </p>
      </div>
    );
  }

  renderBillingAddressSelector() {
    return (
      <div>
        <h2>
          Billing Address
        </h2>
        <div data-region="billingAddressSelectorsRegion" className="checkout-region-inner-container">
          {this.renderBillingAddress()}
        </div>
        <button className="btn btn-primary checkout-new-address-btn" type="button" data-el-label="checkout.newBillingAddressBtn" onClick={() => { this.newAddress(); }}>
          Add a New Address
        </button>
      </div>
    );
  }

  render() {
    if (this.state.orderData) {
      return (
        <div>
          <AppHeaderMain />
          <div className="app-main" data-region="appMain" style={{ display: 'block' }}>
            <div className="checkout-container container">
              <div className="checkout-container-inner">
                <div data-region="checkoutTitleRegion" className="checkout-title-container" style={{ display: 'block' }}>
                  <div>
                    <h1 className="view-title">
                      Checkout Summary
                    </h1>
                  </div>
                </div>
                <div className="checkout-main-container">
                  <div data-region="billingAddressesRegion" style={{ display: 'block' }}>
                    {this.renderBillingAddressSelector()}
                  </div>
                  <div className="checkout-shipping-container">
                    {this.renderShippingAddressSelector()}
                    <div data-region="shippingOptionsRegion">
                      {this.renderShippingOptionsSelector()}
                    </div>
                  </div>
                  <div data-region="paymentMethodsRegion" style={{ display: 'block' }}>
                    <div>
                      <h2>
                        Payment Method
                      </h2>
                      <div data-region="paymentMethodSelectorsRegion" className="checkout-region-inner-container">
                        <div>
                          <p data-el-value="checkout.noPaymentMethodsMsg">
                            You have no saved payment method.
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-primary checkout-new-payment-btn" type="button" data-el-label="checkout.newPaymentMethodBtn" onClick={() => { this.newPayment(); }}>
                        Add a New Payment Method
                      </button>
                    </div>
                  </div>
                </div>
                <div className="checkout-sidebar" data-region="checkoutOrderRegion" style={{ display: 'block' }}>
                  <div>
                    <div className="checkout-sidebar-inner">
                      <div data-region="checkoutSummaryRegion" className="checkout-summary-container" style={{ display: 'inline-block' }}>
                        <CheckoutSummaryList data={this.state.orderData} />
                      </div>
                      <div data-region="checkoutActionRegion" className="checkout-submit-container" style={{ display: 'block' }}>
                        <button className="btn-cmd-submit-order" type="button" data-el-label="checkout.submitOrder" disabled>
                          Complete Purchase
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AppFooterMain />
        </div>
      );
    }
    return (
      <div>
        <AppHeaderMain />
        <div className="loader" />
        <AppFooterMain />
      </div>
    );
  }
}

export default CheckoutPage;
