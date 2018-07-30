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
import ReactRouterPropTypes from 'react-router-prop-types';
import { login } from '../utils/AuthService';
import AppHeaderMain from '../components/appheader.main';
import AppFooterMain from '../components/appfooter.main';
import PaymentMethodContainer from '../components/paymentmethod.container';
import ShippingOptionContainer from '../components/shippingoption.container';
import AddressContainer from '../components/address.container';
import CheckoutSummaryList from '../components/checkout.summarylist';
import OrderTableMain from '../components/ordertable.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

const zoomArray = [
  // zooms for checkout summary
  'defaultcart',
  'defaultcart:total',
  'defaultcart:discount',
  'defaultcart:order',
  'defaultcart:order:tax',
  'defaultcart:order:total',
  'defaultcart:appliedpromotions:element',
  // zoom for billing address
  'defaultcart:order:billingaddressinfo:billingaddress',
  // zoom for shipping address
  'defaultcart:order:deliveries:element:destinationinfo:destination',
  // zoom for shipping option
  'defaultcart:order:deliveries:element:shippingoptioninfo:shippingoption',
  // zoom for payment method
  'defaultcart:order:paymentmethodinfo:paymentmethod',
  // zooms for table items
  'defaultcart:lineitems:element',
  'defaultcart:lineitems:element:total',
  'defaultcart:lineitems:element:item',
  'defaultcart:lineitems:element:item:code',
  'defaultcart:lineitems:element:item:definition',
  'defaultcart:lineitems:element:item:definition:options:element',
  'defaultcart:lineitems:element:item:definition:options:element:value',
  // zoom for purchaseform
  'defaultcart:order:purchaseform',
];

class OrderReviewPage extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

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
      cortexFetch(`${Config.cortexApi.path}/?zoom=${zoomArray.join()}`,
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
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  completeOrder() {
    const purchaseZoomArray = [
      'paymentmeans:element',
      'shipments:element:destination',
      'shipments:element:shippingoption',
      'billingaddress',
      'discount',
      'appliedpromotions:element',
      'lineitems:element',
      'lineitems:element:options:element',
      'lineitems:element:options:element:value',
    ];
    const { orderData } = this.state;
    const { history } = this.props;
    const purchaseform = orderData._order[0]._purchaseform[0].links.find(link => link.rel === 'submitorderaction').href;
    login().then(() => {
      cortexFetch(`${purchaseform}?followlocation&zoom=${purchaseZoomArray.join()}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          history.push('/purchaseReceipt', { data: res });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  renderShippingOption() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    if (deliveries) {
      const [option] = orderData._order[0]._deliveries[0]._element[0]._shippingoptioninfo[0]._shippingoption;
      return (
        <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
          <h3>
            Shipping Option
          </h3>
          <ShippingOptionContainer option={option} />
        </div>
      );
    }
    return null;
  }

  renderShippingAddress() {
    const { orderData } = this.state;
    const deliveries = orderData._order[0]._deliveries;
    if (deliveries) {
      const [shippingAddress] = orderData._order[0]._deliveries[0]._element[0]._destinationinfo[0]._destination;
      const { name, address } = shippingAddress;
      return (
        <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
          <h3>
            Shipping Address
          </h3>
          <AddressContainer name={name} address={address} />
        </div>
      );
    }
    return null;
  }

  renderBillingAddress() {
    const { orderData } = this.state;
    const [billingAddress] = orderData._order[0]._billingaddressinfo[0]._billingaddress;
    const { name, address } = billingAddress;
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
        <h3>
          Billing Address
        </h3>
        <AddressContainer name={name} address={address} />
      </div>
    );
  }

  renderPaymentMethod() {
    const { orderData } = this.state;
    const displayName = orderData._order[0]._paymentmethodinfo[0]._paymentmethod[0]['display-name'];
    return (
      <div style={{ display: 'inline-block', paddingLeft: '20px', verticalAlign: 'top' }}>
        <h3>
          Payment Method
        </h3>
        <PaymentMethodContainer displayName={displayName} />
      </div>
    );
  }

  render() {
    const { orderData } = this.state;
    if (orderData) {
      return (
        <div>
          <AppHeaderMain />
          <div className="app-main" style={{ display: 'block' }}>
            <div className="order-container container">
              <div className="order-container-inner">
                <div className="order-title-container" style={{ display: 'block' }}>
                  <h1 className="view-title">
                    Review Your Order
                  </h1>
                </div>
                <div className="order-main-container" style={{ display: 'block' }}>
                  <div className="order-options-container" style={{ display: 'block', paddingBottom: '20px' }}>
                    {this.renderShippingOption()}
                    {this.renderShippingAddress()}
                    {this.renderBillingAddress()}
                    {this.renderPaymentMethod()}
                  </div>
                  <div className="order-items-container" style={{ display: 'block' }}>
                    <OrderTableMain data={orderData} />
                  </div>
                </div>
                <div className="checkout-sidebar" style={{ display: 'block' }}>
                  <div>
                    <div className="checkout-sidebar-inner">
                      <div className="checkout-summary-container" style={{ display: 'inline-block' }}>
                        <CheckoutSummaryList data={orderData} isLoading={false} />
                      </div>
                      <div className="checkout-submit-container" style={{ display: 'block' }}>
                        <button className="btn-cmd-submit-order" type="button" onClick={() => { this.completeOrder(); }}>
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

export default OrderReviewPage;
