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
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import ProductListItemMain from './productlistitem.main';


class ProductRecommendationsDisplayMain extends React.Component {
  static propTypes = {
    recommendationDataProps: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    const { recommendationDataProps } = this.props;
    this.state = {
      productData: recommendationDataProps,
    };
  }

  renderProducts(product, length, MaxItemsInOneCarouselView) {
    // Need to do this for all possible recommendations. Crosssell, Recommendation, Replacement, Upsell, Warranty.
    const totalCount = length;

    // const MaxItemsInOneCarouselView = MaxItemsInOneCarouselView;
    console.log(`Total items to render: ${totalCount}`); // eslint-disable-line no-console
    const maxViews = totalCount / MaxItemsInOneCarouselView;
    console.log(`Total Views created: ${maxViews}`); // eslint-disable-line no-console
    const data = [];
    for (let CurrentView = 0, CurrentItem = 0; CurrentView < maxViews; CurrentView += 1, CurrentItem += MaxItemsInOneCarouselView) {
      if (CurrentView === 0) {
        data.push(
          <div className="carousel-item active" key={(CurrentItem)}>
            <div className="row">
              {this.renderCarouselView(CurrentItem, totalCount, product, MaxItemsInOneCarouselView)}
            </div>
          </div>,
        );
      } else {
        data.push(
          <div className="carousel-item " key={(CurrentItem + 1)}>
            <div className="row">
              {this.renderCarouselView(CurrentItem, totalCount, product, MaxItemsInOneCarouselView)}
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
    if (itemCount < totalCount && product[itemCount].rel === 'element') {
      console.log(`renderView: ${itemCount}`);// eslint-disable-line no-console
      data.push(
        <div className="col-6" key={`_${Math.random().toString(36).substr(2, 9)}`}>
          <ProductListItemMain productUrl={product[itemCount].uri} />
        </div>,
      );
    }
    for (let i = 1; i < MaxItemsInOneCarouselView; i++) {
      /* Copy this section to add more items in the same carousel view */
      itemCount += 1;
      if ((itemCount) < totalCount && product[(itemCount)].rel === 'element') {
        console.log(`renderView: ${itemCount}`); // eslint-disable-line no-console
        data.push(
          <div className="col-6" key={`_${Math.random().toString(36).substr(2, 9)}`}>
            <ProductListItemMain productUrl={product[(itemCount)].uri} />
          </div>,
        );
      }
    }

    return data;
  }

  render() {
    const data = [];
    const { productData } = this.state;
    /* Copy this section to add Carousel to the view */
    if (productData._recommendations[0]._crosssell[0].links.length > 0) {
      const product = productData._recommendations[0]._crosssell[0].links;
      const { length } = product.length;
      console.log(productData._recommendations[0]._crosssell[0]);// eslint-disable-line no-console
      data.push(
        <div key={`_${Math.random().toString(36).substr(2, 9)}`}>
          <label className="control-label" htmlFor="carousel1">
            Product Recommendations
          </label>
          <div className="col-md-12">
            <div className="carousel slide" data-ride="carousel" id="theCarousel">
              <div className="container">
                <div className="carousel-inner">
                  {this.renderProducts(product, length, 2)}
                </div>
              </div>
              <a className="left carousel-control" href="#theCarousel" data-slide="prev">
                <i className="glyphicon glyphicon-chevron-left" />
              </a>
              <a className="right carousel-control" href="#theCarousel" data-slide="next">
                <i className="glyphicon glyphicon-chevron-right" />
              </a>
            </div>
          </div>
        </div>,
      );
    }

    if (productData._recommendations[0]._replacement[0].links.length > 0) {
      const product = productData._recommendations[0]._replacement[0].links;
      const { length } = product.length;
      console.log(productData._recommendations[0]._replacement[0]); // eslint-disable-line no-console
      data.push(
        <div key={`_${Math.random().toString(36).substr(2, 9)}`}>
          <label className="control-label" htmlFor="carousel2">
            Product Replacements
          </label>
          <div className="col-md-12">
            <div className="carousel slide" data-ride="carousel" id="the_replacementCarousel">
              <div className="container">
                <div className="carousel-inner">
                  {this.renderProducts(product, length, 2)}
                </div>
              </div>
              <a className="left carousel-control" href="#the_replacementCarousel" data-slide="prev">
                <i className="glyphicon glyphicon-chevron-left" />
              </a>
              <a className="right carousel-control" href="#the_replacementCarousel" data-slide="next">
                <i className="glyphicon glyphicon-chevron-right" />
              </a>
            </div>
          </div>
        </div>,
      );
    }

    return (
      <div data-region="categoryBrowseRegion" style={{ display: 'block' }} key={`_${Math.random().toString(36).substr(2, 9)}`}>
        {data}
      </div>
    );
  }
}

export default withRouter(ProductRecommendationsDisplayMain);
