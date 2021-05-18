import React, { Component } from 'react'
import { Route, Router, Switch, NavLink } from 'react-router-dom'
import { Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import Blogs from './components/Blogs'
import MyBlogs from './components/MyBlogs'
import EditBlog from './components/editBlog'
import NewBlog from './components/newBlog'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Router history={this.props.history}>
          {this.generateMenu()}

          {this.generateCurrentPage()}
        </Router>
      </div>
    )
  }

  generateMenu() {
    return (
      <Segment inverted style={{ borderRadius: 0 }}>
        <Menu inverted secondary>
          <NavLink to="/" exact activeClassName="active" className="item">
            HOME
          </NavLink>
          {/* <NavLink to="/blogs" activeClassName="active" className="item">
            BLOGS
          </NavLink> */}
          {!this.props.auth.isAuthenticated() && (
            <Menu.Menu position="right">
              <Menu.Item name="SIGN IN" onClick={this.handleLogin} />
            </Menu.Menu>
          )}
          {this.props.auth.isAuthenticated() && (
            <Menu.Menu position="right">
              <NavLink to="/new" activeClassName="active" className="item">
                NEW BLOG
              </NavLink>
              <NavLink to="/my-blogs" activeClassName="active" className="item">
                MY BLOGS
              </NavLink>
              <Menu.Item name="SIGN OUT" onClick={this.handleLogout} />
            </Menu.Menu>
          )}
        </Menu>
      </Segment>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <Blogs {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/my-blogs"
          exact
          render={(props) => {
            return <MyBlogs {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/new"
          exact
          render={(props) => {
            return <NewBlog {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/my-blogs/edit/:blogId"
          exact
          render={(props) => {
            return <EditBlog {...props} auth={this.props.auth} />
          }}
        />
        <Route component={NotFound} />
      </Switch>
    )
  }
}
