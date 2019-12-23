/* global FileReader */
import React, { Component } from 'react';
import request from 'then-request';
import {
  Card, Button, CardTitle, CardText, Row, Col, CardImg, CardGroup
  , Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label
  , Input
} from 'reactstrap';
import '../assets/css/products.css';
import config from '../config';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      productsList: [],
      selectedFile: '',
      result: '',
      name: '',
      price: '',
      img: '',
      action: '',
      index: '',
    };
  }

  componentDidMount() {
    request('GET', `${config.api}/api/v1/product`,
      {})
      .getBody('utf8')
      .then(JSON.parse)
      .done((res) => {
        if (res.data && res.data.length) {
          res.data.map(d => {
            d.img = `${config.api}/${d.img}`;
          });
          this.setState({
            productsList: res.data
          });
        }
      });
  }

  async deleteProduct(index) {
    let { productsList } = this.state;
    const id = productsList[index]._id.toString();
    await request('DELETE', `${config.api}/api/v1/product/${id}/delete`,
      {})
      .getBody('utf8')
      .then(JSON.parse)
      .done((res) => {
        delete productsList[index];
        this.setState({ productsList });
      });
  }

  editProduct(index) {
    this.setState({
      showModal: true,
      img: this.state.productsList[index].img,
      name: this.state.productsList[index].name,
      price: this.state.productsList[index].price,
      action: 'edit',
      index,
    })
  }

  onChangeHandler(event) {
    let store = this;
    let reader = new FileReader();
    reader.onload = function (event) {
      let image = new Image();
      image.src = event.target.result;
      image.onload = function () {
        let data = event.target.result;
        // item.header.image_url = data;
        store.setState({ selectedFile: data, img: data });
      };
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  openModal() {
    this.setState({ showModal: true, action: 'create' });
  }

  async onSubmitProduct() {
    let {
      name,
      price,
      selectedFile,
      productsList,
      action,
      index,
    } = this.state;
    const body = {
      name,
      price,
      img: selectedFile,
    };
    if (action === 'create') {
      await request('POST', `${config.api}/api/v1/product/add`,
        { json: body })
        .getBody('utf8')
        .then(JSON.parse)
        .done((res) => {
          console.log(res.data);
          if (res.data) {
            res.data.img = `${config.api}/${res.data.img}`;
            productsList.push(res.data);
            this.setState({
              productsList,
              showModal: false,
              name: '',
              price: '',
              img: '',
              selectedFile: '',
              result: '',
            });
          }
        });
    } else {
      const id = productsList[index]._id.toString();
      await request('PUT', `${config.api}/api/v1/product/${id}/`,
        { json: body })
        .getBody('utf8')
        .then(JSON.parse)
        .done((res) => {
          console.log(res.data);
          if (res.data) {
            const product = {
              id: res.data._id.toString(),
              name: res.data.name,
              price: res.data.price,
              img: `${config.api}/${res.data.img}`,
            };
            productsList[index] = product;
            this.setState({
              productsList,
              showModal: false,
              name: '',
              price: '',
              img: '',
              selectedFile: '',
              result: '',
            });
          }
        });
    }
  }

  toggle = () => this.setState({
    showModal: false,
    selectedFile: '',
    result: ''
  });

  onNameChange(e) {
    this.setState({ name: e.target.value });
  }

  onPriceChange(e) {
    this.setState({ price: e.target.value });
  }

  render() {
    const productItems = this.state.productsList.map((p, index) => {
      return (
        <Col md="3" xs="6" key={`list ${index}`}>
          <Card body className="product-list-card">
            <CardImg src={p.img} alt="Card image cap" />
            <CardTitle>Name: {p.name}</CardTitle>
            <CardText>Price: {p.price}</CardText>
            <FormGroup>
              <Button onClick={this.editProduct.bind(this, index)}>Edit</Button>{' '}
              <Button onClick={this.deleteProduct.bind(this, index)}>Delete</Button>
            </FormGroup>
          </Card>
        </Col>
      )
    });

    const AddModal = (
      <Modal className="product-add" isOpen={this.state.showModal} toggle={this.toggle.bind(this)}>
        <ModalHeader>Add New Product</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="productName">Name: </Label>
            <Input type="text" name="name" value={this.state.name} id="productName" onChange={this.onNameChange.bind(this)} />
          </FormGroup>
          <FormGroup>
            <Label for="productPrice">Price: </Label>
            <Input type="text" name="price" value={this.state.price} id="productPrice" onChange={this.onPriceChange.bind(this)} />
          </FormGroup>
          <FormGroup className="img-preview">
            <Label for="productImg">Image: </Label>
            <Input type="file" name="file" id="productImg" onChange={(e) => { this.onChangeHandler(e) }} />
            <CardImg src={this.state.img} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.onSubmitProduct.bind(this)}>Submit</Button>{' '}
          <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
    return (
      <CardGroup className="product-list">
        <Row>
          <Col md="3" xs="6">
            <Card body className="product-new-card" onClick={this.openModal.bind(this)}>
              <CardImg width="50%" src={`${process.env.PUBLIC_URL}/icon/plus.png`} />
            </Card>
          </Col>
          {productItems}
        </Row>
        {AddModal}
      </CardGroup>)
  }
}
export default Products;