/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { login } from '../utils/AuthService';
import ProductListMain from './productlist.main';
import ProductListPaginationTop from './productlistpaginationtop.main';
import ProductListPaginationBottom from './productlistpaginationbottom.main';
import cortexFetch from '../utils/Cortex';

const Config = require('Config');

class CategoryItemsMain extends React.Component {
  static propTypes = {
    categoryUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      categoryModel: { links: [] },
      selfUri: '',
    };
  }

  componentDidMount() {
    const { categoryUrl } = this.props;
    login().then(() => {
      cortexFetch(`${categoryUrl}?zoom=items`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
          },
        })
        .then(res => res.json())
        .then((res) => {
          this.setState({
            categoryModel: res,
            selfUri: categoryUrl,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selfUri } = this.state;
    if (Config.cortexApi.path + selfUri !== nextProps.categoryUrl) {
      login().then(() => {
        cortexFetch(`${nextProps.categoryUrl}?zoom=items`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
            },
          })
          .then(res => res.json())
          .then((res) => {
            this.setState({
              selfUri: nextProps.categoryUrl,
              categoryModel: res,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      });
    }
  }

  render() {
    const { categoryModel, selfUri } = this.state;
    const { categoryUrl } = this.props;
    if (categoryModel.links.length > 0 && categoryModel._items && categoryModel._items[0].links.length === 0 && selfUri === categoryUrl) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                {categoryModel['display-name']}
              </h1>
            </div>
            <br />
            <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
              <div>
                <h3>
                  {intl.get('no-products-found')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (categoryModel.links.length > 0 && selfUri === categoryUrl) {
      return (
        <div className="category-items-container container">
          <div data-region="categoryTitleRegion" style={{ display: 'block' }}>
            <div>
              <h1 className="view-title">
                {categoryModel['display-name']}
              </h1>
            </div>
          </div>
          <ProductListPaginationTop paginationDataProps={categoryModel._items ? categoryModel._items[0] : categoryModel} />
          <ProductListMain productData={categoryModel._items ? categoryModel._items[0] : categoryModel} />
          <ProductListPaginationBottom paginationDataProps={categoryModel._items ? categoryModel._items[0] : categoryModel} />
        </div>
      );
    }

    return (<div className="loader" />);
  }
}

export default CategoryItemsMain;
