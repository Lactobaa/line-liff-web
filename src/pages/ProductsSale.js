import React, { Component } from 'react';
import request from 'then-request';
import {
  Card, Button, CardTitle, CardText, Row, Col, CardImg, CardDeck, CardGroup
  , Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, CardImgOverlay
  , Input, CardFooter
} from 'reactstrap';
import '../utils/vconsole';
import '../assets/css/productsale.css';

const liff = window.liff;
class ProductsSale extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productsList: [],
      name: '',
      userLineID: '',
      pictureUrl: '',
      statusMessage: '',
    };
  }

  async componentDidMount() {
    request('GET', 'https://line-api.lactobaa.now.sh/api/v1/product',
      {})
      .getBody('utf8')
      .then(JSON.parse)
      .done((res) => {
        if (res.data && res.data.length) {
          res.data.map(d => {
            d.img = `https://line-api.lactobaa.now.sh/${d.img}`;
          });
          this.setState({
            productsList: res.data
          });
        }
      });
    this.initialize();
  }

  initialize() {
    liff.init(async () => {
      let getProfile = await liff.getProfile();
      console.log('aaaaaaaa', getProfile);
      this.setState({
        name: getProfile.displayName,
        userLineID: getProfile.userId,
        pictureUrl: getProfile.pictureUrl,
        statusMessage: getProfile.statusMessage
      });
    });
  }

  saveOrder(product) {
    console.log('saveOrder', this.state);
    const body = {
      name: 'lacto',
      userId: this.state.userLineID,
      status: 'created',
      product,
    }
    request('POST', 'https://line-api.lactobaa.now.sh/api/v1/order/add',
      { json: body })
      .getBody('utf8')
      .then(JSON.parse)
      .done((res) => {
        console.log('res.data', res.data);
      });
    liff.sendMessages([{
      type: 'text',
      text: "Thank you, Please wait!"
    }]).then(() => {
      liff.closeWindow();
    });
  }


  closeLIFF() {
    liff.closeWindow();
  }

  render() {
    // console.log('productsList', this.state.productsList);
    // console.log('name: ', this.state.name);
    return (
      // <CardGroup className="card-over">
      <div className="card-over">
        <Row>
          <Col md={12}>
            <Card className="card-header">
              <p>Welcome to</p>
              <h1>Coffee Cafe</h1>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={5} xs={5}><hr /></Col>
          <Col md={2} xs={2}>Coffee</Col>
          <Col md={5} xs={5}><hr /></Col>
        </Row>
        <Row className="product-card">
          {
            this.state.productsList.map((p, index) => {
              return (
                <Col key={`col-p-${index}`} md={3} sm={6} xs={6}>
                  <Card>
                    <CardImg src={p.img} alt="Card image cap" />
                    <CardImgOverlay>
                      <a onClick={this.saveOrder.bind(this, p)}><b>Select ></b></a>
                    </CardImgOverlay>
                  </Card>
                </Col>
              );
            })
          }
        </Row>
      </div >
      // </CardGroup>
    );
  }
}
export default ProductsSale;