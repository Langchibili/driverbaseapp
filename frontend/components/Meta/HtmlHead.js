import React, { Component } from 'react';
import Head from 'next/head';
import LogoArea from '../Parts/LogoArea';
import { api_url, getLoggedInUserData } from '@/Constants';
import Header from '../Parts/Header';
import PageLoader from '../Includes/PageLoader';
class HtmlHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowLoaded: false,
      linkClicked: false,
      loggedInUserProfile: 'logged-out',
      pageDescription: "DriverBase | Your number one portal for finding jobs as a driver",
      pageImage: "/DriverBaseTransparentBackground.png"
    };
  }
  async componentDidMount(){
    if(this.props.customPageDescription){ // if page has a custom description
      const pageDescription = this.props.customPageDescription
      this.setState({
        pageDescription: pageDescription
      })
    }

    if(this.props.customPageImage){ // if page has a custom description
      const pageImage = this.props.customPageImage
      this.setState({
        pageImage: pageImage
      })
    }

    const loggedInUserProfile =  await getLoggedInUserData()
    this.setState({
      windowLoaded: true,
      loggedInUserProfile: loggedInUserProfile
    })
  }
  handlePageChange = (e)=>{
    window.location = '#'
    this.setState({
      linkClicked: true
    })
  }
  renderHeader = ()=>{
    const pathname = window.location.pathname
    if(pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/profile") return '' // cannot add header to these pages
    return ( <Header 
      handlePageChange={this.handlePageChange}
      linkClicked={this.state.linkClicked} 
      api_url={api_url} 
      loggedInUserProfile={this.state.loggedInUserProfile}/>)
  }

  renderLogoArea = ()=>{
    const pathname = window.location.pathname
    if(pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/profile") return '' // cannot add header to these pages
    return <LogoArea loggedInUserProfile={this.state.loggedInUserProfile} handlePageChange={this.handlePageChange}/> 
  }

  render() {
    return (
      <>
            <Head>
              <meta charSet="utf-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="keywords" content="" />
              <meta name="author" content="" />
              <meta name="robots" content="" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="description" content={this.state.pageDescription} />
              <meta property="og:image" content={this.state.pageImage} />
              <meta name="format-detection" content="telephone=no" />
              <title>{this.props.pageTitle+' | DriverBase'}</title>
              {/* Favicon icon */}
              <link rel="icon" type="image/png" sizes="16x16" href="/DriverBaseTransparentBackground.png" />
              {/* <link href="/template/vendor/jqvmap/css/jqvmap.min.css" rel="stylesheet" /> */}
              {/* <link rel="stylesheet" href="/template/vendor/chartist/css/chartist.min.css" /> */}
              {/* Vectormap */}
              {/* <link href="/template/vendor/jqvmap/css/jqvmap.min.css" rel="stylesheet" /> */}
              <link href="/template/vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet" />
              {/* <link href="/template/vendor/owl-carousel/owl.carousel.css" rel="stylesheet" /> */}
              <link href="/cdn.lineicons.com/2.0/LineIcons.css" rel="stylesheet" />
              <link href="/template/vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet" />
              <link href="/template/css/style.css" rel="stylesheet" />
              <link rel="manifest" href="/manifest.json" />
              {/* <link href="/template/vendor/jquery-smartwizard/dist/css/smart_wizard.min.css" rel="stylesheet"/> */}
              {/* <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
              <meta http-equiv="Pragma" content="no-cache" />
              <meta http-equiv="Expires" content="0" /> */}
            </Head>
            {this.state.windowLoaded? 
            <>
             {this.state.linkClicked? <PageLoader/> : ''}
             {this.renderLogoArea()}
             {this.renderHeader()}</>
             : ''}
            </>
    );
  }
}

export default HtmlHead;
