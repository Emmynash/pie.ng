import React from 'react'
import { Link } from 'react-router-dom'

// import config from '../../../../config/config.client'

import avatar from '../../../../assets/images/users/avatar-1.png'

/* global Element */
const fullScreen = (e) => {
  e.preventDefault()
  document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
    ? document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen
    ? document.mozCancelFullScreen() : document.webkitCancelFullScreen
    && document.webkitCancelFullScreen() : document.documentElement.requestFullscreen
    ? document.documentElement.requestFullscreen() : document.documentElement.mozRequestFullScreen
    ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen
    && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
}

export default ({ user, logout, changeAccount, businesses, activeAccount, accountType, toggleMode, mode, pageName = config.appName/*global config*/ }) => (
  <div className="topbar">
    <nav className="navbar-custom">
      <div className="search-wrap" id="search-wrap">
        <div className="search-bar">
          <input className="search-input" type="search" placeholder="Search" />
          <a href="#" className="close-search toggle-search" data-target="#search-wrap">
            <i className="mdi mdi-close-circle"></i>
          </a>
        </div>
      </div>
      <ul className="list-inline float-right mb-0">
      {/*
        <li className="list-inline-item dropdown notification-list">
          <a className="nav-link waves-effect toggle-search" href="#"  data-target="#search-wrap">
            <i className="mdi mdi-magnify noti-icon"></i>
          </a>
        </li>
      */}
        {accountType === 'BUSINESS' && <li className="list-inline-item dropdown notification-list">
          <a className="nav-link waves-effect">
            <button
              type="button"
              className={`btn btn-${mode ? 'teal' : 'blue-grey'} waves-effect waves-light`}
              data-toggle="button"
              aria-pressed="false"
              autoComplete="off"
              title={`Switch to ${mode ? 'test data' : 'live data'}`} onClick={() => toggleMode()}>{mode ? 'Live Data' : 'Test Data'}</button>
          </a>
        </li>}
        <li className="list-inline-item dropdown notification-list hidden-xs-down">
          <a className="nav-link waves-effect" onClick={fullScreen.bind(this)}>
            <i className="mdi mdi-fullscreen noti-icon"></i>
          </a>
        </li>
        <li className="list-inline-item dropdown notification-list hidden-xs-down">
          <a className="nav-link dropdown-toggle arrow-none waves-effect text-muted sentence-case" data-toggle="dropdown" role="button"
            aria-haspopup="false" aria-expanded="false">
            {activeAccount.name}
          </a>
          <div className="dropdown-menu dropdown-menu-right language-switch">
            <a className="dropdown-item sentence-case" onClick={() => changeAccount(user)}><span> {user.name} </span></a>
            {!!(businesses && !!businesses.length) && <div className="dropdown-divider"></div>}
            {businesses && businesses.map(business => (
              <a className="dropdown-item sentence-case" onClick={() => changeAccount(business)} key={business.id}><span> {business.name } </span></a>
            ))}
            {/*<Link to="/dashboard/business/create" className="dropdown-item"><span> Create Business </span></Link>*/}
          </div>
        </li>
        {/*
          <li className="list-inline-item dropdown notification-list">
            <a className="nav-link dropdown-toggle arrow-none waves-effect" data-toggle="dropdown" href="#" role="button"
             aria-haspopup="false" aria-expanded="false">
              <i className="ion-ios7-bell noti-icon"></i>
              <span className="badge badge-danger noti-icon-badge">3</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg">
              <div className="dropdown-item noti-title">
                <h5>Notification (3)</h5>
              </div>
              <a href="javascript:void(0);" className="dropdown-item notify-item active">
                <div className="notify-icon bg-success"><i className="mdi mdi-cart-outline"></i></div>
                <p className="notify-details"><b>Your order is placed</b><small className="text-muted">Dummy text of the printing and typesetting industry.</small></p>
              </a>
              <a href="javascript:void(0);" className="dropdown-item notify-item">
                <div className="notify-icon bg-warning"><i className="mdi mdi-message"></i></div>
                <p className="notify-details"><b>New Message received</b><small className="text-muted">You have 87 unread messages</small></p>
              </a>
              <a href="javascript:void(0);" className="dropdown-item notify-item">
                <div className="notify-icon bg-info"><i className="mdi mdi-martini"></i></div>
                <p className="notify-details"><b>Your item is shipped</b><small className="text-muted">It is a long established fact that a reader will</small></p>
              </a>
              <a href="javascript:void(0);" className="dropdown-item notify-item">
                View All
              </a>
            </div>
        </li>
        */}
        <li className="list-inline-item dropdown notification-list">
          <a className="nav-link dropdown-toggle arrow-none waves-effect nav-user" data-toggle="dropdown" href="#" role="button"
            aria-haspopup="false" aria-expanded="false">
            <img src={avatar} alt="user" className="rounded-circle" />
          </a>
          <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
            {/*<a className="dropdown-item" href="#"><i className="dripicons-user text-muted"></i> Profile</a>
            <a className="dropdown-item" href="#"><i className="dripicons-wallet text-muted"></i> My Wallet</a>
            <a className="dropdown-item" href="#"><i className="dripicons-gear text-muted"></i> Settings</a>*/}
            <Link className="dropdown-item" to="/dashboard/account/change-password"><i className="dripicons-lock text-muted"></i> Change Password</Link>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" onClick={logout} href="#"><i className="dripicons-exit text-muted"></i> Logout</a>
          </div>
        </li>
      </ul>
      <ul className="list-inline menu-left mb-0">
        <li className="list-inline-item">
          <button type="button" className="button-menu-mobile open-left waves-effect">
            <i className="ion-navicon"></i>
          </button>
        </li>
        <li className="hide-phone list-inline-item app-search">
          <h3 className="page-title">{pageName}</h3>
        </li>
      </ul>
      <div className="clearfix"></div>
    </nav>
  </div>
)