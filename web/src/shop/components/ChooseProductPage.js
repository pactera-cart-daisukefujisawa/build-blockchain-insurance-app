'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import * as shopActions from '../actions/shopActions';
import ProductCarousel from './ProductCarousel';

class ChooseProductPage extends React.Component {

  static get propTypes() {
    return {
      intl: intlShape.isRequired,
      shopType: PropTypes.string.isRequired,
      products: PropTypes.array.isRequired,
      productInfo: PropTypes.object,
      shopActions: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      productInfo: props.productInfo || {}
    };

    this.selectProduct = this.selectProduct.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.onSerialNoChanged = this.onSerialNoChanged.bind(this);
  }

  selectProduct(product) {
    let serialNo = generateSerialNo();
    this.setState({ productInfo: Object.assign({}, product, { serialNo }) });
  }

  nextStep() {
    // Persist data
    this.props.shopActions.submitProduct(this.state.productInfo);
    // Navigate to the next page
    this.setState({ redirectToNext: true });
  }

  onSerialNoChanged(event) {
    event.preventDefault();
    let serialNo = (event.target.value || '').toUpperCase();
    this.setState({
      productInfo: Object.assign(
        {}, this.state.productInfo, { serialNo })
    });
  }

  render() {
    let messageAtTop;
    switch (this.props.shopType) {
      case 'insurances':
        messageAtTop = <FormattedMessage id='Buy a Insurance' />;
        break;
      case 'smart-phones':
        messageAtTop = <FormattedMessage id='Buy a Smart Phone' />;
        break;
      case 'skis':
        messageAtTop = <FormattedMessage id='Buy a Pair of Skis' />;
        break;
    }
    let { intl, products } = this.props;
    let { productInfo, redirectToNext } = this.state;

    if (redirectToNext) {
      return (
        <Redirect to='/insurance' />
      );
    }

    const style = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
    };

    const lavelStyle = {
      fontWeight: "900",
    };

    const actionAreastyle = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "flex-end",
    };

    return (
      <div>
        <div style={style}>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
              <span>
                <ProductCarousel products={products}
                  selectedProductIndex={productInfo.index}
                  onSelectedProduct={this.selectProduct} />
              </span>
            </div>
          </div>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
              <div className='ibm-column-form'>
                <p>
                  <label><FormattedMessage id='Product Brand' />:</label>
                  <span style={lavelStyle}>{productInfo.brand}</span>
                </p>
                <p>
                  <label><FormattedMessage id='Product Model' />:</label>
                  <span style={lavelStyle}>{productInfo.model}</span>
                </p>
                <p>
                  <label><FormattedMessage id='Price' />:</label>
                  <span style={lavelStyle}>
                    {intl.formatNumber(productInfo.price,
                        {
                          style: 'currency',
                          currency: intl.formatMessage({ id: 'currency code' }),
                          minimumFractionDigits: 2
                        })}
                  </span>
                </p>
                <p>
                  <label><FormattedMessage id='Serial No.' />:</label>
                  <span style={lavelStyle}>{productInfo.serialNo}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='ibm-columns' style={actionAreastyle}>
          <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right'>
            <button type='button' className='ibm-btn-pri ibm-btn-blue-50'
              onClick={this.nextStep}>
              <FormattedMessage id='Next' />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function generateSerialNo() {
  return Math.random().toString(36).substring(7).toUpperCase();
}

function mapStateToProps(state, ownProps) {
  return {
    shopType: state.shop.type,
    products: state.shop.products,
    productInfo: state.shop.productInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    shopActions: bindActionCreators(shopActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(ChooseProductPage)));
