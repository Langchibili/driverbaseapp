import Link from 'next/link';
import React, { Component } from 'react';

class SideNav extends Component {
  constructor(props) {
    super(props);
  }

  renderDashBoard = ()=>{
    if(this.props.loggedInUserProfile === 'logged-out') {
      return <span className="nav-text">Dashboard</span> // supposed to be link
    }
    return <span className="nav-text">Dashboard</span>
  }
 
  renderLoggedInLinks  = ()=>{
          if(this.props.loggedInUserProfile === 'logged-out') return <></>
          if(this.props.loggedInUserProfile.type === 'driver'){
             return (<>
                <li><Link onClick={this.props.handlePageChange} href="/points">Buy Points(JAPs)</Link></li>
                <li><Link onClick={this.props.handlePageChange} href="/chat?uid=0">Chat</Link></li>  
                </>)
          }
          return (
            <><li><Link onClick={this.props.handlePageChange} href="/jobs?act=add">Create Job</Link></li>
            <li><Link onClick={this.props.handlePageChange} href="/jobs?act=edit">Edit Jobs</Link></li>
            <li><Link onClick={this.props.handlePageChange} href="/jobs?act=delete">Delete Jobs</Link></li> 
            <li><Link onClick={this.props.handlePageChange} href="/points">Buy Points(JCPs)</Link></li> 
            <li><Link onClick={this.props.handlePageChange} href="/chat?uid=0">Chat</Link></li> 
          </>
          )
  }

  render() {
    return (
        <div className="deznav">
        <div className="deznav-scroll mm-active ps ps--active-y">
          <ul className="metismenu" id="menu">
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-networking" />
                {this.renderDashBoard()}
              </a>
              <ul aria-expanded="false">
                <li><Link onClick={this.props.handlePageChange} href="/jobs?act=show-all">Jobs</Link></li>
                <li><Link onClick={this.props.handlePageChange} href="/drivers">All Drivers</Link></li>
                <li><Link onClick={this.props.handlePageChange} href="/car_owners">All CarOwners</Link></li>
                {this.renderLoggedInLinks()} 
                <li><Link onClick={this.props.handlePageChange} href="/ask">Help</Link></li>
                <li><Link onClick={this.props.handlePageChange} href="/about">About Us</Link></li>
              </ul>
            </li>
            {/* <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-television" />
                <span className="nav-text">Apps</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="app-profile.html">Profile</a></li>
                <li><a className="has-arrow" href="#" aria-expanded="false">Email</a>
                  <ul aria-expanded="false">
                    <li><a href="email-compose.html">Compose</a></li>
                    <li><a href="email-inbox.html">Inbox</a></li>
                    <li><a href="email-read.html">Read</a></li>
                  </ul>
                </li>
                <li><a href="app-calender.html">Calendar</a></li>
                <li><a className="has-arrow" href="#" aria-expanded="false">Shop</a>
                  <ul aria-expanded="false">
                    <li><a href="ecom-product-grid.html">Product Grid</a></li>
                    <li><a href="ecom-product-list.html">Product List</a></li>
                    <li><a href="ecom-product-detail.html">Product Details</a></li>
                    <li><a href="ecom-product-order.html">Order</a></li>
                    <li><a href="ecom-checkout.html">Checkout</a></li>
                    <li><a href="ecom-invoice.html">Invoice</a></li>
                    <li><a href="ecom-customers.html">Customers</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-controls-3" />
                <span className="nav-text">Charts</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="chart-flot.html">Flot</a></li>
                <li><a href="chart-morris.html">Morris</a></li>
                <li><a href="chart-chartjs.html">Chartjs</a></li>
                <li><a href="chart-chartist.html">Chartist</a></li>
                <li><a href="chart-sparkline.html">Sparkline</a></li>
                <li><a href="chart-peity.html">Peity</a></li>
              </ul>
            </li>
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-internet" />
                <span className="nav-text">Bootstrap</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="ui-accordion.html">Accordion</a></li>
                <li><a href="ui-alert.html">Alert</a></li>
                <li><a href="ui-badge.html">Badge</a></li>
                <li><a href="ui-button.html">Button</a></li>
                <li><a href="ui-modal.html">Modal</a></li>
                <li><a href="ui-button-group.html">Button Group</a></li>
                <li><a href="ui-list-group.html">List Group</a></li>
                <li><a href="ui-media-object.html">Media Object</a></li>
                <li><a href="ui-card.html">Cards</a></li>
                <li><a href="ui-carousel.html">Carousel</a></li>
                <li><a href="ui-dropdown.html">Dropdown</a></li>
                <li><a href="ui-popover.html">Popover</a></li>
                <li><a href="ui-progressbar.html">Progressbar</a></li>
                <li><a href="ui-tab.html">Tab</a></li>
                <li><a href="ui-typography.html">Typography</a></li>
                <li><a href="ui-pagination.html">Pagination</a></li>
                <li><a href="ui-grid.html">Grid</a></li>
              </ul>
            </li>
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-heart" />
                <span className="nav-text">Plugins</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="uc-select2.html">Select 2</a></li>
                <li><a href="uc-nestable.html">Nestedable</a></li>
                <li><a href="uc-noui-slider.html">Noui Slider</a></li>
                <li><a href="uc-sweetalert.html">Sweet Alert</a></li>
                <li><a href="uc-toastr.html">Toastr</a></li>
                <li><a href="map-jqvmap.html">Jqv Map</a></li>
                <li><a href="uc-lightgallery.html">Light Gallery</a></li>
              </ul>
            </li>
            <li><a href="widget-basic.html" className="ai-icon" aria-expanded="false">
                <i className="flaticon-381-settings-2" />
                <span className="nav-text">Widget</span>
              </a>
            </li>
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-notepad" />
                <span className="nav-text">Forms</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="form-element.html">Form Elements</a></li>
                <li><a href="form-wizard.html">Wizard</a></li>
                <li><a href="form-editor-summernote.html">Summernote</a></li>
                <li><a href="form-pickers.html">Pickers</a></li>
                <li><a href="form-validation-jquery.html">Jquery Validate</a></li>
              </ul>
            </li>
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-network" />
                <span className="nav-text">Table</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="table-bootstrap-basic.html">Bootstrap</a></li>
                <li><a href="table-datatable-basic.html">Datatable</a></li>
              </ul>
            </li>
            <li className="has-menu"><a className="has-arrow ai-icon" href="#" aria-expanded="false">
                <i className="flaticon-381-layer-1" />
                <span className="nav-text">Pages</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="page-register.html">Register</a></li>
                <li><a href="page-login.html">Login</a></li>
                <li><a className="has-arrow" href="#" aria-expanded="false">Error</a>
                  <ul aria-expanded="false">
                    <li><a href="page-error-400.html">Error 400</a></li>
                    <li><a href="page-error-403.html">Error 403</a></li>
                    <li><a href="page-error-404.html">Error 404</a></li>
                    <li><a href="page-error-500.html">Error 500</a></li>
                    <li><a href="page-error-503.html">Error 503</a></li>
                  </ul>
                </li>
                <li><a href="page-lock-screen.html">Lock Screen</a></li>
              </ul>
            </li> */}
          </ul>
          <div className="copyright">
            <p><strong>DriverBase</strong>  © 2023~ All Rights Reserved</p>
            <p>by <a href='https://langtechdev.com' target='_blank'>LangTechDev</a></p>
          </div>
        </div>
      </div>
   );
}
}

export default SideNav;