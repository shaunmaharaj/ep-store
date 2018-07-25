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
import ProductRecommendationFetchAllPages from './productrecommendation.fetchallpages';


class ProductRecommendationsDisplayMain extends React.Component {
  static propTypes = {
    productData: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      maxItemsInCarouselView: 2,
    };
  }

  render() {
    const data = [];
    const { maxItemsInCarouselView } = this.state;
    const { productData } = this.props;
    /* Copy this section to add Carousel to the view */
    if (productData._recommendations[0]._crosssell[0].links.length > 0) {
      const product = productData._recommendations[0]._crosssell[0];
      const length = product.pagination.results;
      const title = 'Product Recommendations';
      data.push(
        <div key={product.self.type}>
          <label className="control-label" htmlFor="carousel1">
            {title}
          </label>
          <div className="col-md-12">
            <div className="carousel slide" data-ride="carousel" id="theCarousel">
              <ProductRecommendationFetchAllPages product={product} length={length} count={maxItemsInCarouselView} />
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
    /** Till here */

    return (
      <div data-region="categoryBrowseRegion" style={{ display: 'block' }} key={`_${Math.random().toString(36).substr(2, 9)}`}>
        {data}
      </div>
    );
  }
}

export default withRouter(ProductRecommendationsDisplayMain);
