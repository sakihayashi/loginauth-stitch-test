import React, { Component } from 'react'
import { Location } from '@reach/router'
import { Link } from 'gatsby'
import { Menu, X } from 'react-feather'
import Logo from './Logo'
import LoginModal from './Login-modal'

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

import './Nav.css'

export class Navigation extends Component {
  state = {
    active: false,
    activeSubNav: false,
    currentPath: false,
    modalShow: false 
  }

  handleModalOpenAndClose = () => {
    this.setState({ modalShow: !this.state.modalShow })
  }

  // componentDidMount = () => {
  
  //   //this client means belongs to the local class but not a state
  //   //get the data from the data base
  //   this.client = Stitch.initializeDefaultAppClient("userauthtest-cricc");

  //   const mongodb = this.client.getServiceClient(
  //     //connect to atlas
  //     RemoteMongoClient.factory,
  //     "mongodb-atlas"
  //   );

  //   //class varieble as DB name forum post
  //   this.db = mongodb.db("forum");

  //   // this.displayTodosOnLoad();

  //   this.setState({ currentPath: this.props.location.pathname })
  // }
    

  displayTodosOnLoad = () => {
    // Anonymously log in and display comments on load
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        this.addTopic();
      })
      .catch(console.error);
  }

  displayTodos = () => {
    // query the remote DB and update the component state
    console.log(this.db);
  
    this.db
      .collection("topic")
      .find({}, { limit: 1000 })
      .asArray()
      .then(todos => {
        console.log(todos)
      });
   }


   addTopic = (event) => {
    
    // const { value } = this.state;
    // insert the todo into the remote Stitch DB
    // then re-query the DB and display the new todos
    this.db
      .collection("topic")
      .insertOne({
        owner_id: this.client.auth.user.id,
        forumTitle: 'test',
        forumQuestion: 'test question'
      })
      .then((test) => {
        this.displayTodos();
      })
      .catch(console.error);
  }

  handleMenuToggle = () => this.setState({ active: !this.state.active })

  // Only close nav if it is open
  handleLinkClick = () => this.state.active && this.handleMenuToggle()

  toggleSubNav = subNav =>
    this.setState({
      activeSubNav: this.state.activeSubNav === subNav ? false : subNav
    })

  render() {
    const modalProps ={
      triggerText: 'This is a button to trigger the Modal'
    }
    const { active } = this.state,
      { subNav } = this.props,
      NavLink = ({ to, className, children, ...props }) => (
        <Link
          to={to}
          className={`NavLink ${
            to === this.state.currentPath ? 'active' : ''
          } ${className}`}
          onClick={this.handleLinkClick}
          {...props}
        >
          {children}
        </Link>
      )

    return (
      <nav className={`Nav ${active ? 'Nav-active' : ''}`}>
        <div className="Nav--Container container">
          <Link to="/" onClick={this.handleLinkClick}>
            <Logo />
            
          </Link>
          <span className="site-name">Flamingod News</span>
          <div className="Nav--Links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about/">About</NavLink>
            <div
              className={`Nav--Group ${
                this.state.activeSubNav === 'posts' ? 'active' : ''
              }`}
            >
              <span
                className={`NavLink Nav--GroupParent ${
                  this.props.location.pathname.includes('posts') ||
                  this.props.location.pathname.includes('blog') ||
                  this.props.location.pathname.includes('post-categories')
                    ? 'active'
                    : ''
                }`}
                onClick={() => this.toggleSubNav('posts')}
              >
                Blog
              </span>
              <div className="Nav--GroupLinks">
                <NavLink to="/blog/" className="Nav--GroupLink">
                  All Posts
                </NavLink>
                {subNav.posts.map((link, index) => (
                  <NavLink
                    to={link.slug}
                    key={'posts-subnav-link-' + index}
                    className="Nav--GroupLink"
                  >
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink to="/default/">Default</NavLink>
            <NavLink to="/contact/">Contact</NavLink>
          </div>
          <button
            className="Button-blank Nav--MenuButton"
            onClick={this.handleMenuToggle}
          >
            {active ? <X /> : <Menu />}
          </button>
        </div>
        <LoginModal {...modalProps} />

        {/* { this.state.modalShow ?  <LoginModal
          show={this.state.modalShow}
          onHide={this.handleModalOpenAndClose}
        /> : ''}  */}
        
      </nav>
    )
  }
}

export default ({ subNav }) => (
  <Location>{route => <Navigation subNav={subNav} {...route} />}</Location>
)
