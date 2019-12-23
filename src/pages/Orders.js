import React, { Component } from 'react';
import ReactInterval from 'react-interval';
import request from 'then-request';
import {
  Button,
} from 'reactstrap';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
    };
  }

  async componentDidMount() {
    this.getOrders();
  }

  getOrders() {
    request('GET', 'https://line-api.lactobaa.now.sh/api/v1/order',
      {})
      .getBody('utf8')
      .then(JSON.parse)
      .done((res) => {
        if (res.data && res.data.length) {
          this.setState({
            orderList: res.data
          });
        }
      });
  }

  displayRow() {
    const orders = this.state.orderList.filter(i => i.status !== 'served');
    return orders.map((o, index) => {
      return (<tr key={`tr-${index}`}>
        <td>{index + 1}</td>
        <td>{o.name}</td>
        <td>{o.product.name}</td>
        <td>{o.product.price}</td>
        <td><Button onClick={this.servedOrder.bind(this, o, index)}>Served</Button></td>
      </tr>)
    });
  }

  async servedOrder(order, index) {
    const id = order._id.toString();
    const body = {
      userId: order.userId,
      status: 'served',
    }
    await request('PUT', `https://line-api.lactobaa.now.sh/api/v1/order/${id}`,
      { json: body })
      .getBody('utf8')
      .then(JSON.parse)
      .done((res) => {
        if (res.data) {
          const orders = this.state.orderList;
          orders[index] = res.data;
          this.setState({
            orderList: orders,
          });
        }
      });
  }

  render() {
    console.log(this.state.orderList);
    return (
      <div style={{ width: '100%'}}>
        <ReactInterval timeout={10000} enabled={true}
          callback={() => this.getOrders()} />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.displayRow()}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Orders;