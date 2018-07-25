/**
* Copyright © 2018 Elastic Path Software Inc. All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
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
import PropTypes from 'prop-types';
import { login } from '../utils/AuthService';
import ProductListItemMain from './productlistitem.main';

const Config = require('Config');


class ProductRecommendationFetchAllPages extends React.Component {
static propTypes = {
  product: PropTypes.objectOf(PropTypes.any).isRequired,
  length: PropTypes.number.isRequired,
  maxItemsInCarouselView: PropTypes.number.isRequired,
}

constructor(props) {
  super(props);
  this.state = {
    links: [],
  };
}

componentDidMount() {
  const { product } = this.props;
  const { links } = this.state;
  const arr = product.links;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].rel === 'element') {
      links.push(arr[i]);
    } else if (arr[i].rel === 'next') {
      this.expandUrl(arr[i].href);
    }
  }
  this.setState({
    links,
  });
}

expandUrl(href) {
  const { links } = this.state;
  login().then(() => {
    fetch(`${href}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
      .then(res => res.json())
      .then((res) => {
        const arr = res.links;
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i].rel === 'element') {
            links.push(arr[i]);
          } else if (arr[i].rel === 'next') {
            this.expandUrl(arr[i].href);
          }
        }
        this.setState({
          links,
        });
        return res;
      });
  });
}

static renderProducts(product, length, MaxItemsInOneCarouselView) {
  const totalCount = product.length;
  const maxViews = totalCount / MaxItemsInOneCarouselView;
  const data = [];
  for (let CurrentView = 0, CurrentItem = 0; CurrentView < maxViews; CurrentView += 1, CurrentItem += MaxItemsInOneCarouselView) {
    if (CurrentView === 0) {
      data.push(
        <div className="carousel-item active" key={(CurrentItem)}>
          <div className="row">
            {ProductRecommendationFetchAllPages.renderCarouselView(CurrentItem, totalCount, product, MaxItemsInOneCarouselView)}
          </div>
        </div>,
      );
    } else {
      data.push(
        <div className="carousel-item " key={(CurrentItem + 1)}>
          <div className="row">
            {ProductRecommendationFetchAllPages.renderCarouselView(CurrentItem, totalCount, product, MaxItemsInOneCarouselView)}
          </div>
        </div>,
      );
    }
  }
  return (
    <div>
      {data}
    </div>
  );
}

static renderCarouselView(currentItem, totalCount, product, MaxItemsInOneCarouselView) {
/* Renders Each View in Carousel */
  const data = [];
  let itemCount = currentItem;
  if (itemCount < totalCount) {
    data.push(
      <div className="col-6" key={`_${Math.random().toString(36).substr(2, 9)}`}>
        <ProductListItemMain productUrl={product[itemCount].uri} />
      </div>,
    );
  }
  for (let i = 1; i < MaxItemsInOneCarouselView; i += 1) {
    /* Copy this section to add more items in the same carousel view */
    itemCount += 1;
    if (itemCount < totalCount && product[itemCount].rel === 'element') {
      data.push(
        <div className="col-6" key={`_${Math.random().toString(36).substr(2, 9)}`}>
          <ProductListItemMain productUrl={product[itemCount].uri} />
        </div>,
      );
    }
  }

  return data;
}

render() {
  const data = [];
  const { length, maxItemsInCarouselView } = this.props;
  const { links } = this.state;
  if (links.length > 0) {
    data.push(
      <div className="carousel-inner" key={`_${Math.random().toString(36).substr(2, 9)}`}>
        {ProductRecommendationFetchAllPages.renderProducts(links, length, maxItemsInCarouselView)}
      </div>,
    );
  }
  return (
    <div className="container">
      {data}
    </div>
  );
}
}


export default ProductRecommendationFetchAllPages;
