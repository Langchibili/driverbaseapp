import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import LogoArea from './LogoArea';
import SideNav from './SideNav';
import List from '../Lists/List';
import { car_owner_populate_url, minimal_driver_populate_url} from '@/Constants';
import PageLoader from '../Includes/PageLoader';
import ProfileUpdatePercent from '../Includes/ProfileUpdatePercent';
import DriversCount from '../Includes/CountsDisplay/DriversCount';
import CarOwnersCount from '../Includes/CountsDisplay/CarOwnersCount';
import JobsCounts from '../Includes/CountsDisplay/JobsCounts';
import FeaturedCarOwners from '../Includes/FeaturedContent/FeaturedCarOwners';
import LocalAds from '../Includes/Ads/LocalAds';
import GoogleAd from '../Includes/Ads/GoogleAd';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
       linkClicked: false
    };
  }

  handlePageChange = (e)=>{
    window.location = '#'
    this.setState({
      linkClicked: true
    })
  }
  // componentDidMount{
  //   document.body.
  // }
  render() {
  return( 
  <>

  {/***********************************
  Main wrapper start
    ************************************/}
  <div id="main-wrap">
  {this.state.linkClicked? <PageLoader/> : ''}
    {/***********************************
      Nav header start
  ************************************/}
   <LogoArea loggedInUserProfile={this.props.loggedInUserProfile} handlePageChange={this.handlePageChange}/>
    {/***********************************
      Nav header end
  ************************************/}
    {/***********************************
    
      Chat box End
  ************************************/}
    {/***********************************
      Header start
  ************************************/}
    <Header 
    handlePageChange={this.handlePageChange}
    linkClicked={this.state.linkClicked} 
    api_url={this.props.api_url} 
    loggedInUserProfile={this.props.loggedInUserProfile}/>
    {/***********************************
      Header end ti-comment-alt
  ************************************/}
    {/***********************************
      Sidebar start
  ************************************/}
    <SideNav loggedInUserProfile={this.props.loggedInUserProfile} handlePageChange={this.handlePageChange}/>
    {/***********************************
      Sidebar end
  ************************************/}
    {/***********************************
      Content body start
  ************************************/}
    <div className="content-body pt-4">
      {/* row */}
      <div className="container-fluid">
        <LocalAds title="gotriips"/>
        <div className="row">
           {this.props.loggedInUserProfile !== 'logged-out'?<ProfileUpdatePercent 
               loggedInUserProfile={this.props.loggedInUserProfile}
               handlePageChange={this.handlePageChange}
               api_url={this.props.api_url}
               jwt={this.props.jwt}/>:''}
               
          <div className="col-xl-4 col-xxl-6 col-lg-6">
              <List 
              loggedInUserProfile={this.props.loggedInUserProfile}
              handlePageChange={this.handlePageChange}
              itemsName ='jobs'
              reqUrlPath='/jobs?populate=car_owner_profile&pagination[limit]=8&sort=id%3Adesc&meta=true'
              api_url={this.props.api_url}
              listType='jobs' 
              listTitle='Latest Jobs'/>
              {/* <GoogleAd adClient="your-ad-client-id" adSlot="your-ad-slot-id" /> */}
          </div>
          <div className="col-xl-4 col-xxl-6 col-lg-6">
              <List 
              loggedInUserProfile={this.props.loggedInUserProfile}
              handlePageChange={this.handlePageChange}
              itemsName ='users'
              reqUrlPath={'/users?'+minimal_driver_populate_url+'&sort=id%3Adesc'}
              api_url={this.props.api_url}
              listType="drivers" 
              listTitle='Top Drivers'/>
           </div> 

           <div className="col-xl-4 col-xxl-6 col-lg-6">
              <List 
              loggedInUserProfile={this.props.loggedInUserProfile}
              handlePageChange={this.handlePageChange}
              itemsName ='users'
              reqUrlPath={'/users?'+car_owner_populate_url+'&sort=id%3Adesc'}
              api_url={this.props.api_url}
              listType='car-owners' 
              listTitle='Car Owners'/>
           </div>
          <DriversCount  api_url={this.props.api_url} handlePageChange={this.handlePageChange}/>
          <CarOwnersCount api_url={this.props.api_url} handlePageChange={this.handlePageChange}/>
          <JobsCounts api_url={this.props.api_url} handlePageChange={this.handlePageChange}/>
          <FeaturedCarOwners api_url={this.props.api_url} handlePageChange={this.handlePageChange}/>
        </div>
      </div>
    </div>
    {/***********************************
      Content body end
  ************************************/}
    {/***********************************
      Footer start
  ************************************/}
    <Footer />
    {/***********************************
      Footer end
  ************************************/}
    {/***********************************
      ticket button start
  ************************************/}
    {/***********************************
     Support ticket button end
  ************************************/}
  </div>
  {/***********************************
  Main wrapper end
    ************************************/}
  </>
      )
  }
}

export default Content;
