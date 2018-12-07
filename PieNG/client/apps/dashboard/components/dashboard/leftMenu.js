import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const summary = '/dashboard'
const walletHistory = '/dashboard/payments'
const fundWallet = '/dashboard/fund'
const transfer = '/dashboard/transfer'
const settings = '/dashboard/settings'

const getClassName = (path, cPath) => {
  path = path
  return path === cPath ? 'active' : ''
}

export default ({ logoSm, accountType, currentPath }) => (
  <div className="left side-menu">
    <div className="topbar-left">
      <div className="">
        <Link to="/" className="logo"><img src={logoSm} height="36" alt="logo" /></Link>
      </div>
    </div>
    <div className="sidebar-inner slimscrollleft">
      <div id="sidebar-menu">
        <ul>
          <li className="menu-title">Main</li>
          <li className={getClassName(currentPath, summary)}>
            <NavLink to="/dashboard" className={`waves-effect ${getClassName(currentPath, summary)}`}><i className="mdi mdi-view-dashboard"></i> <span> Summary </span> </NavLink>
          </li>
          <li className={getClassName(currentPath, walletHistory)}>
            <NavLink to="/dashboard/payments" className="waves-effect"><i className="mdi mdi-cube-outline"></i><span> Transaction History </span></NavLink>
          </li>
          {accountType === 'USER' && <li className={getClassName(currentPath, fundWallet)}>
            <NavLink to="/dashboard/fund" className="waves-effect"><i className="mdi mdi-wallet"></i><span> Wallet Operations</span></NavLink>
          </li>}
          {accountType === 'USER' && <li className={getClassName(currentPath, transfer)}>
            <NavLink to="/dashboard/transfer" className="waves-effect"><i className="mdi mdi-bank"></i><span> Transfer Money </span></NavLink>
          </li>}
          {accountType === 'BUSINESS' && <li className={getClassName(currentPath, settings)}>
            <NavLink to="/dashboard/settings" className="waves-effect" activeClassName="active"><i className="mdi mdi-settings"></i><span> Settings </span></NavLink>
          </li>}
          {/*
          <li className="menu-title"></li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-buffer"></i> <span> User Interface <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span> </a>
            <ul className="list-unstyled">
              <li><a href="ui-buttons.html">Buttons</a></li>
              <li><a href="ui-colors.html">Colors</a></li>
              <li><a href="ui-cards.html">Cards</a></li>
              <li><a href="ui-tabs-accordions.html">Tabs &amp; Accordions</a></li>
              <li><a href="ui-modals.html">Modals</a></li>
              <li><a href="ui-images.html">Images</a></li>
              <li><a href="ui-alerts.html">Alerts</a></li>
              <li><a href="ui-progressbars.html">Progress Bars</a></li>
              <li><a href="ui-dropdowns.html">Dropdowns</a></li>
              <li><a href="ui-lightbox.html">Lightbox</a></li>
              <li><a href="ui-navs.html">Navs</a></li>
              <li><a href="ui-pagination.html">Pagination</a></li>
              <li><a href="ui-popover-tooltips.html">Popover & Tooltips</a></li>
              <li><a href="ui-badge.html">Badge</a></li>
              <li><a href="ui-carousel.html">Carousel</a></li>
              <li><a href="ui-video.html">Video</a></li>
              <li><a href="ui-typography.html">Typography</a></li>
              <li><a href="ui-sweet-alert.html">Sweet-Alert</a></li>
              <li><a href="ui-grid.html">Grid</a></li>
              <li><a href="ui-animation.html">Animation</a></li>
              <li><a href="ui-highlight.html">Highlight</a></li>
              <li><a href="ui-rating.html">Rating</a></li>
              <li><a href="ui-nestable.html">Nestable</a></li>
              <li><a href="ui-alertify.html">Alertify</a></li>
              <li><a href="ui-rangeslider.html">Range Slider</a></li>
              <li><a href="ui-sessiontimeout.html">Session Timeout</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-clipboard-outline"></i><span> Forms <span className="badge badge-pill badge-success pull-right">9</span> </span></a>
            <ul className="list-unstyled">
              <li><a href="form-elements.html">Form Elements</a></li>
              <li><a href="form-validation.html">Form Validation</a></li>
              <li><a href="form-advanced.html">Form Advanced</a></li>
              <li><a href="form-wizard.html">Form Wizard</a></li>
              <li><a href="form-editors.html">Form Editors</a></li>
              <li><a href="form-uploads.html">Form File Upload</a></li>
              <li><a href="form-mask.html">Form Mask</a></li>
              <li><a href="form-summernote.html">Summernote</a></li>
              <li><a href="form-xeditable.html">Form Xeditable</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-chart-line"></i><span> Charts <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span></a>
            <ul className="list-unstyled">
              <li><a href="charts-morris.html">Morris Chart</a></li>
              <li><a href="charts-chartist.html">Chartist Chart</a></li>
              <li><a href="charts-chartjs.html">Chartjs Chart</a></li>
              <li><a href="charts-flot.html">Flot Chart</a></li>
              <li><a href="charts-c3.html">C3 Chart</a></li>
              <li><a href="charts-sparkline.html">Sparkline Chart</a></li>
              <li><a href="charts-other.html">Jquery Knob Chart</a></li>
              <li><a href="charts-peity.html">Peity Chart</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-format-list-bulleted-type"></i><span> Tables <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span></a>
            <ul className="list-unstyled">
              <li><a href="tables-basic.html">Basic Tables</a></li>
              <li><a href="tables-datatable.html">Data Table</a></li>
              <li><a href="tables-responsive.html">Responsive Table</a></li>
              <li><a href="tables-editable.html">Editable Table</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-album"></i> <span> Icons  <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span></span> </a>
            <ul className="list-unstyled">
              <li><a href="icons-material.html">Material Design</a></li>
              <li><a href="icons-ion.html">Ion Icons</a></li>
              <li><a href="icons-fontawesome.html">Font Awesome</a></li>
              <li><a href="icons-themify.html">Themify Icons</a></li>
              <li><a href="icons-dripicons.html">Dripicons</a></li>
              <li><a href="icons-typicons.html">Typicons Icons</a></li>
              <li><a href="icons-weather.html">Weather Icons</a></li>
              <li><a href="icons-mobirise.html">Mobirise Icons</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-google-maps"></i><span> Maps <span className="badge badge-pill badge-danger pull-right">2</span> </span></a>
            <ul className="list-unstyled">
              <li><a href="maps-google.html"> Google Map</a></li>
              <li><a href="maps-vector.html"> Vector Map</a></li>
            </ul>
          </li>
          <li className="menu-title">Extras</li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-account-location"></i><span> Authentication <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span></a>
            <ul className="list-unstyled">
              <li><a href="pages-login.html">Login</a></li>
              <li><a href="pages-register.html">Register</a></li>
              <li><a href="pages-recoverpw.html">Recover Password</a></li>
              <li><a href="pages-lock-screen.html">Lock Screen</a></li>
              <li><a href="pages-login-2.html">Login 2</a></li>
              <li><a href="pages-register-2.html">Register 2</a></li>
              <li><a href="pages-recoverpw-2.html">Recover Password 2</a></li>
              <li><a href="pages-lock-screen-2.html">Lock Screen 2</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-google-pages"></i><span> Extra Pages <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span></a>
            <ul className="list-unstyled">
              <li><a href="pages-timeline.html">Timeline</a></li>
              <li><a href="pages-invoice.html">Invoice</a></li>
              <li><a href="pages-directory.html">Directory</a></li>
              <li><a href="pages-blank.html">Blank Page</a></li>
              <li><a href="pages-404.html">Error 404</a></li>
              <li><a href="pages-500.html">Error 500</a></li>
              <li><a href="pages-pricing.html">Pricing</a></li>
              <li><a href="pages-gallery.html">Gallery</a></li>
              <li><a href="pages-maintenance.html">Maintenance</a></li>
              <li><a href="pages-coming-soon.html">Coming Soon</a></li>
            </ul>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-cart-outline"></i><span> Ecommerce <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span></a>
            <ul className="list-unstyled">
              <li><a href="ecommerce-product-list.html">Product List</a></li>
              <li><a href="ecommerce-product-grid.html">Product Grid</a></li>
              <li><a href="ecommerce-order-history.html">Order History</a></li>
              <li><a href="ecommerce-customers.html">Customers</a></li>
              <li><a href="ecommerce-product-edit.html">Product Edit</a></li>
            </ul>
          </li>
          <li>
            <a href="../frontend/" className="waves-effect" target="_blank"><i className="mdi mdi-airplane"></i><span> Front End </span></a>
          </li>
          <li className="has_sub">
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-flask-outline"></i><span> Email Templates <span className="pull-right"><i className="mdi mdi-chevron-right"></i></span> </span></a>
            <ul className="list-unstyled">
              <li><a href="email-templates-basic.html">Basic Action Email</a></li>
              <li><a href="email-templates-alert.html">Alert Email</a></li>
              <li><a href="email-templates-billing.html">Billing Email</a></li>
            </ul>
          </li>
          <li className="menu-title">Help & Support</li>
          <li>
            <a href="faq.html" className="waves-effect"><i className="mdi mdi-help-circle"></i><span> FAQ </span></a>
          </li>
          <li>
            <a href="contact.html" className="waves-effect"><i className="mdi mdi-headset"></i><span> Contact <span className="badge badge-pill badge-warning pull-right">3</span> </span></a>
          </li>
          <li>
            <a href="javascript:void(0);" className="waves-effect"><i className="mdi mdi-file-document-box"></i><span> Documentation </span></a>
          </li>
          */}
        </ul>
      </div>
      <div className="clearfix"></div>
    </div>
  </div>
)