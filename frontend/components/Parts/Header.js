import React, { Component } from 'react';
import { Search } from '@material-ui/icons';
import Link from 'next/link';
import { Fab } from '@mui/material';
import { LoginRounded, PersonAdd } from '@mui/icons-material';
import { backEndUrl, imageUrlFormat } from '@/Constants';
//import { SearchOutlined } from '@mui/icons-material';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initial state goes here
    };
  }
  
  showPoints = ()=>{
    let pointsDisplay
    if(this.props.loggedInUserProfile.type === 'driver') {
        pointsDisplay = <><strong>{this.props.loggedInUserProfile.driverProfile.application_points}</strong>  JAPs<br/>(Job Application Points)</>
    }
    else{
        pointsDisplay = <><strong>{this.props.loggedInUserProfile.carOwnerProfile.job_creation_points}</strong>  JCPs<br/>(Job Creation Points)</>
    }
    return <>You have: {pointsDisplay}</>
  }

  loggedInUserProfileIconSrc = ()=>{
    let profileDetails,profile_photo
    if(this.props.loggedInUserProfile.type === 'driver') {
        if(this.props.loggedInUserProfile.profile_completion_percentage <= 5){
          return '/default-profile.png' 
        }
        profileDetails = this.props.loggedInUserProfile.driverProfile.details
    }
    if(this.props.loggedInUserProfile.type === 'car-owner') {
        if(this.props.loggedInUserProfile.profile_completion_percentage <= 5){
          return '/default-profile.png' 
        }
        profileDetails = this.props.loggedInUserProfile.carOwnerProfile.details
    }
    if(profileDetails.profile_thumbnail_image !== null){
        profile_photo =  backEndUrl+imageUrlFormat(profileDetails.profile_thumbnail_image,'thumbnail')   
    }
    else{
        profile_photo = '/default-profile.png' 
    }
    return profile_photo
  }

  renderLoggedInHeaderData = ()=>{
    const loggedInUserProfile = this.props.loggedInUserProfile
    if(loggedInUserProfile === 'logged-out'){
       return (
       <><Fab variant="extended"  sx={{marginRight: '10px !important', borderRadius: '10px !important'}}><Link  href="/signup"><PersonAdd sx={{ mr: 1,color:"#ff6746" }}/><span style={{color:"#ff6746"}}>SingUp</span></Link></Fab>
       <Fab variant="extended" sx={{marginRight: '10px !important', borderRadius: '10px !important'}}><Link href="/login">  <LoginRounded sx={{ mr: 1, color:"#ff6746"}} /><span style={{color:"#ff6746"}}>Login</span></Link></Fab></>)
    }
    else{
       return (<><a className="nav-link" href="#" role="button" data-bs-toggle="dropdown">
                     <Fab size="small"  aria-label="add" sx={{marginRight:1}}><img style={{border:'2px solid lightgrey'}} src={this.loggedInUserProfileIconSrc()} width={20} alt /></Fab>
                    <div style={{ borderLeft:'none',paddingLeft:10,marginRight:20}} className="header-info">
                    <span className="text-black">{loggedInUserProfile.username}</span>
                     <p className="fs-12 mb-0" style={{textTransform:'capitalize'}}>{loggedInUserProfile.type}</p>
                    
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link onClick={this.props.handlePageChange} href={"/profile?user_type="+loggedInUserProfile.type+"&uid="+loggedInUserProfile.id} className="dropdown-item ai-icon">
                      <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
                      <span className="ms-2">Profile </span>
                    </Link>
                    <Link onClick={this.props.handlePageChange} href="/profile" className="dropdown-item ai-icon">
                      <svg id="icon-edit" xmlns="http://www.w3.org/2000/svg" className="text-success" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      <span className="ms-2">Edit Profile </span>
                    </Link>
                    <Link onClick={this.props.handlePageChange} href="/logout" className="dropdown-item ai-icon">
                      <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" className="text-danger" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1={21} y1={12} x2={9} y2={12} /></svg>
                      <span className="ms-2">Logout </span>
                    </Link>
                    <Link onClick={this.props.handlePageChange} href="/about_points" className="dropdown-item ai-icon">
                          {this.showPoints()}
                    </Link>
                  </div>
                </>
       )
    }
  }

  render() {
    return (
        <div className={"header"+this.props.linkClicked? ' mt-1':''}>
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                {/* <div className="dashboard_bar">
                  Dashboard
                </div> */}
              </div>
              <ul className="navbar-nav header-right">
               
                <li className="nav-item dropdown notification_dropdown">
                <Fab size="small"  aria-label="add">
                <Link href='/search' onClick={this.props.handlePageChange}><Search color='secondary'/></Link>  
                </Fab>
                </li>
                <li className="nav-item dropdown header-profile">
                  {this.renderLoggedInHeaderData()}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
   );
}
}

export default Header;