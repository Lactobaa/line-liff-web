import React, { Component } from 'react';
import { Route, Link, NavLink, Switch, BrowserRouter } from 'react-router-dom'
import './App.css';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ProductsSale from './pages/ProductsSale';

const Home = () => <h1>Home</h1>
// const About = () => <h1>About</h1>
const Post = () => <h1>Post</h1>
const Project = () => <h1>Project</h1>

class App extends Component {

  render() {
    console.log('window.location.pathname', window.location.pathname);
    return (
      <div className="my-app">
        {(window.location.pathname !== '/sale') &&
          <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="container">
              <div className="navbar-brand">
                <div className="navbar-item">
                  <img src={`${process.env.PUBLIC_URL}/sign.png`} alt="sign" width="30" height="28" />
                  <h1 style={{ fontWeight: 900, paddingLeft: 10 }}>Coffee Cafe</h1>
                </div>
              </div>
              <div className="navbar-menu">
                <div className="navbar-end">
                  <NavLink exact to="/" activeClassName="is-active" className="navbar-item">Home</NavLink>
                  <NavLink to="/products" activeClassName="is-active" className="navbar-item">Manage Products</NavLink>
                </div>
              </div>
            </div>
          </nav>
        }
        <div className="App container">
          {/* <BrowserRouter>
          <Switch> */}
          <Route exact path="/" component={Orders} />
          <Route path="/products" component={Products} />
          {/* {/* <Route path="/posts" component={Post} /> */}
          <Route path="/sale" component={ProductsSale} />
          {/* </Switch>
          </BrowserRouter> */}
        </div>
      </div >
    )
  }
}

export default App;
