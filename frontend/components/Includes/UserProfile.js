import React, { Component } from 'react';
import HtmlHead from '../Meta/HtmlHead';
import HtmlFoot from '../Meta/HtmlFoot';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UpAndBackButton from './UpAndBackButton';
import Alert from '@mui/material/Alert'; 
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IconButton, Typography } from '@mui/material';
import { Cancel, CancelOutlined, Check, CheckBoxRounded, CheckOutlined, Close, Recommend, RecommendRounded } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import { backEndUrl, imageUrlFormat } from '@/Constants';
import { useRouter } from 'next/router';


export default class UserProfile extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
        openPhoneNumberDialog: false,
        openImageModal: false,
        showHiddenItem: false,
        openHiddenDialog: false,
        detailName: '',
        hiddenDetailsDialogMessage: '',
        hiddenDetailsDialogTitle: '',
        showCover: false,
        hideLocation: true,
        hideEmail: true,
        hideAddress: true,
        hideDriverNumber: true
     };
  }

  showDriverNumber = (mobileNumber)=>{
    if(this.props.loggedInUserProfile === "logged-out") return 'Only Visible To Car Owners'
    if(this.props.loggedInUserProfile.type === "driver"){
        return 'Only Visible To Car Owners'
    }
    return <Chip label="Click To View Number" id="chip-phone_number" onClick={this.handleHiddenDetailsDialogOpen} />
  }


  // renderDriverNumber = (phone_number,handleDialogOpen)=>{
  //   if(this.props.loggedInUserProfile.type === "driver" || this.props.loggedInUserProfile === "logged-out"){
  //     return <a className="contact-icon" href="#" onClick={handleDialogOpen}><i className="fa fa-phone" /></a>
  //   }
  //   if(this.props.loggedInUserProfile.profile_completion_percentage < 9){
  //     return <a className="contact-icon" href="#" onClick={handleDialogOpen}><i className="fa fa-phone" /></a>
  //   }
  //   return <a className="contact-icon" href={"tel://"+phone_number}><i className="fa fa-phone" /></a>
  // }
  // renderUserEmail = (email,handleDialogOpen)=>{
  //   if(this.props.loggedInUserProfile.type === "driver" || this.props.loggedInUserProfile === "logged-out"){
  //       return <a className="contact-icon" style={{marginLeft:2}} href="#" onClick={handleDialogOpen}><i className="fa la-envelope" /></a>
  //     }
  //     if(this.props.loggedInUserProfile.profile_completion_percentage < 9){
  //       return <a className="contact-icon"  style={{marginLeft:2}} href="#" onClick={handleDialogOpen}><i className="fa la-envelope" /></a>
  //     }
  //     return email === 'unset'? '':<Link className="contact-icon" style={{marginLeft:2}} href={"mailto:"+email}><i className="las la-envelope" /></Link>
  // }

  // /{"tel://"+phone_number}
  
  renderDriverNumber = (phone_number,handleDialogOpen)=>{
    if(this.props.loggedInUserProfile === "logged-out" || this.props.loggedInUserProfile.type === "driver"){
      return <a className="contact-icon" href="#" onClick={handleDialogOpen}><i className="fa fa-phone" /></a>
    }
    if(this.props.loggedInUserProfile.profile_completion_percentage < 9){
      return <a className="contact-icon" href="#" onClick={handleDialogOpen}><i className="fa fa-phone" /></a>
    }
    return <a className="contact-icon" id="phone_number"  onClick={this.handleHiddenDetailsDialogOpen} href="#"><i onClick={this.handleHiddenDetailsDialogOpen} id="icon-phone_number" className="fa fa-phone" /></a>
  }
  renderUserEmail = (email,handleDialogOpen)=>{
    if(this.props.loggedInUserProfile === "logged-out"){
        return <a className="contact-icon" style={{marginLeft:2}} href="#" onClick={handleDialogOpen}><i className="fa la-envelope" /></a>
      }

      if(this.props.loggedInUserProfile.profile_completion_percentage < 9){
        return <a className="contact-icon"  style={{marginLeft:2}} href="#" onClick={handleDialogOpen}><i className="fa la-envelope" /></a>
      }
      return email === 'unset'? '':<Link className="contact-icon" style={{marginLeft:2}} href={"mailto:"+email}><i className="las la-envelope" /></Link>
  }

  setShowNumberState = (show)=>{
    if(show){
      const userPoints = this.props.loggedInUserProfile.type === "driver"? this.props.loggedInUserProfile.driverProfile.application_points : this.props.loggedInUserProfile.carOwnerProfile.job_creation_points
      const detailName = "Phone Number"
      if(this.props.loggedInUserProfile.type === "driver"){
        this.setState({
          openHiddenDialog: true,
          detailName: detailName,
          hiddenDetailsDialogTitle: 'To see hidden details it will cost you some points',
          hiddenDetailsDialogMessage: "It will cost you 50 points to view this driver's number, and you currently have "+userPoints+" points"
       })
      }
      else{
        this.setState({
          openHiddenDialog: true,
          detailName: detailName,
          hiddenDetailsDialogTitle: 'To see hidden details it will cost you some points',
          hiddenDetailsDialogMessage: "It will cost you 20 points to view this driver's number, and you currently have "+userPoints+" points"
       })
      }
    }
    else{
        return
    }
    
  }
 
  handleDialogOpen = (e)=>{
    e.preventDefault()
    this.setState({
        openPhoneNumberDialog: true
    })
  }
  handleDialogClose = ()=>{
    this.setState({
        openPhoneNumberDialog: false
    })
  }

  handleHiddenDetailsDialogOpen = (e)=>{ // for now a driver isn't even allowed to view numbers
    e.preventDefault()
    let detailName
    const itemName  = e.target.id
    const loggedInUserProfile = this.props.loggedInUserProfile 
    const userPoints = loggedInUserProfile.type === "driver"? loggedInUserProfile.driverProfile.application_points : loggedInUserProfile.carOwnerProfile.job_creation_points
    if(itemName === "phone_number" || itemName === "icon-phone_number" || 'chip-phone_number'){
      detailName = "Phone Number"
      if(loggedInUserProfile.type === "driver"){
        this.setState({
          openHiddenDialog: true,
          detailName: detailName,
          hiddenDetailsDialogTitle: 'To see hidden details it will cost you some points',
          hiddenDetailsDialogMessage: "It will cost you 50 points to view this driver's number, and you currently have "+userPoints+" points"
       })
      }
      else{
        this.setState({
          openHiddenDialog: true,
          detailName: detailName,
          hiddenDetailsDialogTitle: 'To see hidden details it will cost you some points',
          hiddenDetailsDialogMessage: "It will cost you 20 points to view this driver's number, and you currently have "+userPoints+" points"
       })
      }
    }
    
  }
  
  showHiddenItem = ()=>{
      this.setState({
         showHiddenItem: true
      })
  }

  handleHiddenDetailsDialogClose = (e)=>{
    this.setState({
        openHiddenDialog: false
    })
  }
 
  handleImageModalOpen = ()=>{
    this.setState({
        openImageModal: true
    })
  }

  handleImageModalClose = ()=>{
    this.setState({
        openImageModal: false,
        showCover: false
    })
  }
  handleCoverPhotoModalOpen = ()=>{
    return // will only remove return statement when releasing the cover photo full view update
    this.setState({
        openImageModal: true,
        showCover: true
    })
  }

  showEmail = (email)=>{
    if(this.props.loggedInUserProfile === 'logged-out') return 'Only Visible To Car Owners'
    if(this.props.loggedInUserProfile.type === "driver" && this.props.userProfile.type === "driver"){
        return 'Only Visible To Car Owners'
    }
    return email
   }

   hidValue = (value,hide)=>{
      if(hide){
        return 'hidden'; // will add more context to this as the update rolls out
      }
      else{
        return value
      }
      
   }
   
   renderDriverCredentials = ()=>{
    if(this.props.loggedInUserProfile.type === "car-owner"){
      if(this.props.userProfile.type === "driver"){
        const badgeStyles = {
          marginTop:1,
          marginRight:2
        }
        const driverProfile = this.props.userProfile.driverProfile
        if(driverProfile === undefined || driverProfile === null){
              <><Badge color="error" badgeContent={<Close/>} sx={badgeStyles}>
              <Chip label="Licence" />
              </Badge>
              <Badge color="error" badgeContent={<Close/>} sx={badgeStyles}>
                    <Chip label="Certificate" />
              </Badge>
              <Badge color="error" badgeContent={<Close/>} sx={badgeStyles}>
                    <Chip label="Nrc" />
              </Badge>
              <Badge color="error" badgeContent={<Close/>} sx={badgeStyles}>
                    <Chip label="Address" />
              </Badge>
              <Badge color="error" badgeContent={<Close/>} sx={badgeStyles}>
                    <Chip label="Number" />
              </Badge>
              </>
        }
        else{
          const LicenceAddedColor = driverProfile.driving_license_front === null && driverProfile.drivers_license_back === null? "error" : "success"
          const CertificateAddedColor = driverProfile.driving_license_front === null && driverProfile.drivers_license_back === null? "error" : "success" 
          const NrcAddedColor = driverProfile.nrc_front === null && driverProfile.nrc_back === null? "error" : "success" 
          const LicenceAddedIcon = driverProfile.driving_license_front === null && driverProfile.drivers_license_back === null? ()=> <Close/>: ()=> <CheckOutlined/>
          const CertificateAddedIcon = driverProfile.driving_license_front === null && driverProfile.drivers_license_back === null? ()=> <Close />: ()=> <CheckOutlined/>
          const NrcAddedIcon = driverProfile.nrc_front === null && driverProfile.nrc_back === null? ()=> <Close /> : ()=> <CheckOutlined/> 
          let AddressAddedColor,NumberAddedColor,AddressAddedIcon,NumberAddedIcon
          if(driverProfile.details === null) {
            AddressAddedColor = "error"
            NumberAddedColor = "error"
            AddressAddedIcon = ()=> <Close/>
            NumberAddedIcon = ()=> <CheckOutlined/>
          }
          else{
            AddressAddedColor = driverProfile.details.address === null? "error" : "success"
            NumberAddedColor = driverProfile.details.phone_number === null? "error" : "success"
            AddressAddedIcon = driverProfile.details.address === null? ()=> <Close /> : ()=> <CheckOutlined/> 
            // NumberAddedIcon = driverProfile.details.phone_number === null? ()=> <Close /> : ()=> <CheckOutlined/> 
          } 
          const recommendationText = ()=>{ 
            return <div style={{marginTop:20}}><Badge color="warning"  badgeContent={<Recommend/>} sx={badgeStyles}>
                      <Chip label="Recommended" />
                    </Badge>
                    <Alert sx={{marginTop:1}} severity='success'>We highly recommend that you hire this user, because we have done all essential checks and verification on them</Alert>
                    </div>
          }
          const verificationText = ()=>{ 
            return <Badge color="success"  badgeContent={<CheckOutlined/>} sx={{marginTop:2}}>
                      <Chip label="This user is verified by us." />
                  </Badge>
          }

          return (
            <><p style={{color:'darkcyan'}}>Details Provided By Driver </p>
            <Badge color={LicenceAddedColor} badgeContent={LicenceAddedIcon()} sx={badgeStyles}>
                <Chip label="Licence" />
           </Badge>
           <Badge color={CertificateAddedColor} badgeContent={CertificateAddedIcon()} sx={badgeStyles}>
                <Chip label="Certificate" />
           </Badge>
           <Badge color={NrcAddedColor} badgeContent={NrcAddedIcon()} sx={badgeStyles}>
                <Chip label="Nrc" />
           </Badge>
           <Badge color={AddressAddedColor} badgeContent={AddressAddedIcon()} sx={badgeStyles}>
                <Chip label="Address" />
           </Badge>
           {/* <Badge color={NumberAddedColor} badgeContent={NumberAddedIcon()} sx={badgeStyles}>
                <Chip label="Number" />
           </Badge> */}
           <></>
           {driverProfile.premium_user?  recommendationText() : <></>}
           {driverProfile.details.verified? verificationText() : <></>}
           <Alert severity='info' sx={{marginTop:2}}>Please note that all these details are hidden, in order to get these details you have to click on the <strong>phone icon</strong> or the "<strong>Click To View Number</strong>" button. This is because these details can only be given to you by the driver themself, so you have to call them in order to get the details</Alert>
           </>)
        }
      }
      else{
        return <></>
      }
    }
    else{
      return <></>
    }
   }

  render() {
    /* HANFLING CASES WHERE USER PROFILE IS NOT YET SET */
    if(this.props.userProfile === null) return <div><UpAndBackButton /><Alert severity="warning">User Not Found</Alert></div>
    if(!(this.props.loggedInUserProfile === null || this.props.loggedInUserProfile === undefined)){
        if(this.props.userProfile.profile_completion_percentage <= 5){ // not updated enough
            if(this.props.loggedInUserProfile === 'logged-out'){
                return <div><UpAndBackButton /><Alert severity="info">User Still Making Their Profile</Alert></div>
            }
            else{
                if(this.props.userProfile.id === this.props.loggedInUserProfile.id){ // if it's logged in user account
                    window.location = '/'
                    return
                }
                return <div><UpAndBackButton /><Alert severity="info">User Still Making Their Profile</Alert></div>
            }
        } 
        
    }
    
    let profileDetails
    if(this.props.userProfile.type === 'driver') {
        profileDetails = this.props.userProfile.driverProfile.details
    }
    if(this.props.userProfile.type === 'car-owner') {
        profileDetails = this.props.userProfile.carOwnerProfile.details
    }
    
    const firstname = profileDetails.firstname || 'unknown'
    const lastname = profileDetails.lastname || ' '
    const mobileNumber = profileDetails.phone_number || 'not added'
    const age = profileDetails.age || 'not added'
    const gender = profileDetails.gender || 'not added'
    const whatsAppNumber = profileDetails.whatsapp_number || 'not added'
    const about  = profileDetails.about || 'nothing about user added'
    const nameDisplay = firstname ==='unknown'? this.props.userProfile.type : firstname+' '+lastname 
    const rating = profileDetails.average_rating? profileDetails.average_rating : '0'
    const reviewsCount = profileDetails.ratings? profileDetails.ratings.length : '0'

    let experience,availability,experience_display,availability_display,phone_number 
    if(this.props.userProfile.type === 'driver') {
        // experience and availability stuff
         experience = this.props.userProfile.driverProfile.experience || 'not added'
         availability = this.props.userProfile.driverProfile.available_for_hire
         experience_display = experience === 'not added'? 'not added' : experience.toString() + ' Years Experience'
         availability_display = availability? 'Available For Hire' : 'Unavailable At The Moment'
         //phone number
         phone_number = this.props.userProfile.driverProfile.details.phone_number? this.props.userProfile.driverProfile.details.phone_number : '' 
    }
    // profile images stuff
    let cover_photo,profileCoverSrc 
    if(profileDetails.profile_cover_image !== null){
        
        const coverPhotoUrl = imageUrlFormat(profileDetails.profile_cover_image,'large')
        cover_photo = backEndUrl+coverPhotoUrl
        profileCoverSrc = backEndUrl + profileDetails.profile_cover_image.url
    }
    else{
        cover_photo = profileCoverSrc = '/no-cover-photo.jpg' 
    }
    const coverPhotoStyles = {
        backgroundImage: 'url("'+cover_photo+'")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%'
    };

    //profile thumbnail stuff
    let profile_photo,profilePhotoSrc 

    if(profileDetails.profile_thumbnail_image !== null){
        const profilePhotoUrl = imageUrlFormat(profileDetails.profile_thumbnail_image,'thumbnail')
        profile_photo =  backEndUrl+profilePhotoUrl  
        profilePhotoSrc = backEndUrl + profileDetails.profile_thumbnail_image.url
    }
    else{
        profile_photo = profilePhotoSrc = '/default-profile.png' 
    }
  
    // address stuff
    let address, province, town, locationDisplay 
    if(profileDetails.address === null){
         address =  'not added'
         province  = 'not added'
         town  = 'not added'
         locationDisplay = 'Unknown Address' 
    }
    else{
         address = profileDetails.address.location || 'not added'
         province  = profileDetails.address.province || 'not added'
         town  = profileDetails.address.town || 'not added'
         locationDisplay = address === 'not added'? 'Unknown Address' : address 
    }
    // email stuff
    let email = this.props.userProfile.email
    if(email.split('_unset').length > 1){// it mean the email address is not set
      email = 'unset'
    }
    return (<> 
         {this.state.showHiddenItem? <RedirectUser url={"/detailspage?detailname="+this.state.detailName+"&uid="+this.props.userProfile.id}/> : ''}
         <HtmlHead pageTitle={firstname}/>
         <CheckShowNumber setShowNumberState={this.setShowNumberState}/>
         <PhoneNumberDialog openPhoneNumberDialog={this.state.openPhoneNumberDialog} handleDialogClose={this.handleDialogClose}/>
         <HiddenDetailsDialog detailName={this.state.detailName} showHiddenItem={this.showHiddenItem} hiddenDetailsDialogTitle={this.state.hiddenDetailsDialogTitle} hiddenDetailsDialogMessage={this.state.hiddenDetailsDialogMessage} showHiddenDetailsDialog={this.state.openHiddenDialog} handleHiddenDetailsDialogClose={this.handleHiddenDetailsDialogClose}/>
         <ImageViewModal showCover={this.state.showCover} profilePhotoSrc={profilePhotoSrc} profileCoverSrc={profileCoverSrc} handleImageModalClose={this.handleImageModalClose} openImageModal={this.state.openImageModal}/>
        <div className="row">
        <div className="col-lg-12">
            <div className="profile card card-body px-3 pt-3 pb-0">
            <div className="profile-head">
                <div className="photo-content">
                <div onClick={this.handleCoverPhotoModalOpen} className="cover-photo rounded" style={coverPhotoStyles} /></div>
                <div className="profile-info">
                <div className="profile-photo">
                    <img onClick={this.handleImageModalOpen} src={profile_photo} className="img-fluid rounded-circle" alt='dp' style={{width:100,height:85}}/>
                </div>
                <div className="profile-details">
                    <div className="profile-name px-3 pt-2">
                    <h4 className="text-primary mb-0">{firstname+' '+lastname}</h4>
                    <p>{this.props.userProfile.type}</p>
                    </div>
                    <div className="profile-number px-2 pt-2">
                    <h4 className="text-muted mb-0">{this.props.userProfile.type === 'car-owner'? 'hidden' : this.hidValue(this.showDriverNumber(mobileNumber,this.state.hideDriverNumber))}</h4>
                    <p>Contact</p>
                    </div>
                    <div className="dropdown ms-auto">
                    {/* <a href="#" className="btn btn-primary light sharp" data-bs-toggle="dropdown" aria-expanded="true"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 24 24" version="1.1"><g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd"><rect x={0} y={0} width={24} height={24} /><circle fill="#000000" cx={5} cy={12} r={2} /><circle fill="#000000" cx={12} cy={12} r={2} /><circle fill="#000000" cx={19} cy={12} r={2} /></g></svg></a> */}
                      {/* <ul className="dropdown-menu dropdown-menu-end">
                        <li className="dropdown-item"><i className="fa fa-user-circle text-primary me-2" /> View profile</li>
                        <li className="dropdown-item"><i className="fa fa-users text-primary me-2" /> Add to btn-close friends</li>
                        <li className="dropdown-item"><i className="fa fa-plus text-primary me-2" /> Add to group</li>
                       <li className="dropdown-item"><i className="fa fa-ban text-primary me-2" /> Block</li>
                       </ul> */}
                    </div>
                    </div>
                    </div>
                     {this.renderDriverCredentials()}
                </div>
                </div>
            </div>
        </div>
        <div className="row">
        <div className="col-xl-12">
            <div className="card d-sm-flex flex-xl-column flex-md-row">
            <div className="card-body border-bottom text-center col-xl-12 col-md-6">
                <div className="d-flex">
                <Link href={this.props.loggedInUserProfile === 'logged-out' || this.props.loggedInUserProfile === null? '/login' :'/reviews?act=add&user_type='+this.props.userProfile.type+'&uid='+this.props.userProfile.id} type="button" className="btn btn-warning me-4">Add Review<span className="btn-icon-end"><i className="fa fa-star" /></span></Link>
                {/* {this.props.userProfile.type === 'driver'? <Link className="contact-icon me-2" href={"tel://"+phone_number}><i className="fa fa-phone" aria-hidden="true" /></Link>: ''} */}
                {this.renderDriverNumber(phone_number,this.handleDialogOpen)}
                {this.renderUserEmail(email,this.handleDialogOpen)}									
                </div>
                <div className="row mt-5">
                <div className="d-flex flex-wrap col-xl-12">
                    <div className="media me-auto pr-2 mb-4">
                    <span className="me-3 bgl-warning text-warning">
                        <svg id="icon-orders" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1={16} y1={13} x2={8} y2={13} />
                        <line x1={16} y1={17} x2={8} y2={17} />
                        <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </span>
                    <div className="media-body text-left">
                        <h4 className="fs-18 mb-0 text-black font-w600">{reviewsCount}</h4>
                        <span className="fs-14">Reviews</span>
                    </div>
                    <><Link href={"/reviews?act=show&uid="+this.props.userProfile.id+"&name="+nameDisplay}><Typography sx={{color:'green',marginRight:5,fontWeight:600}}>VIEW REVIEWS: SEE WHAT PEOPLE SAY ABOUT THIS USER.</Typography></Link> </>
                    </div>
                    <div className="media mb-4">
                    <svg className="me-3 min-w46" width={46} height={46} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width={46} height={46} rx={23} fill="#FFBE17" />
                        <path d="M19.1205 30C18.9969 30.0004 18.8747 29.9732 18.7629 29.9203C18.6512 29.8674 18.5526 29.7902 18.4745 29.6944C18.3964 29.5985 18.3407 29.4865 18.3115 29.3663C18.2822 29.2462 18.2802 29.121 18.3055 29L18.9705 25.11L16.1455 22.365C16.0348 22.2569 15.9566 22.12 15.9196 21.9697C15.8826 21.8195 15.8883 21.6619 15.9362 21.5147C15.984 21.3675 16.072 21.2367 16.1903 21.1369C16.3086 21.0371 16.4524 20.9724 16.6055 20.95L20.5005 20.385L22.2455 16.845C22.3128 16.7031 22.419 16.5831 22.5518 16.4991C22.6845 16.4151 22.8384 16.3705 22.9955 16.3705C23.1526 16.3705 23.3065 16.4151 23.4393 16.4991C23.572 16.5831 23.6782 16.7031 23.7455 16.845L25.5005 20.385L29.4055 20.955C29.5586 20.9774 29.7024 21.0421 29.8207 21.1419C29.939 21.2417 30.027 21.3725 30.0749 21.5197C30.1227 21.6669 30.1284 21.8245 30.0914 21.9747C30.0545 22.125 29.9762 22.2619 29.8655 22.37L27.0405 25.125L27.6955 29C27.7216 29.1518 27.7049 29.3078 27.6474 29.4507C27.5898 29.5936 27.4937 29.7176 27.3697 29.8089C27.2457 29.9002 27.0987 29.9552 26.9452 29.9678C26.7917 29.9804 26.6377 29.95 26.5005 29.88L23.0005 28.045L19.5005 29.88C19.3856 29.9505 19.2551 29.9917 19.1205 30ZM17.0955 21.89L19.7355 24.465C19.8325 24.5586 19.9051 24.6745 19.9469 24.8027C19.9888 24.9308 19.9986 25.0672 19.9755 25.2L19.3505 28.83L22.6155 27.115C22.7343 27.0528 22.8664 27.0203 23.0005 27.0203C23.1346 27.0203 23.2667 27.0528 23.3855 27.115L26.6505 28.83L26.0255 25.195C26.0024 25.0622 26.0122 24.9258 26.0541 24.7977C26.0959 24.6695 26.1685 24.5536 26.2655 24.46L28.9055 21.885L25.2555 21.355C25.1222 21.3356 24.9957 21.284 24.8868 21.2047C24.7779 21.1255 24.69 21.0209 24.6305 20.9L23.0005 17.6L21.3705 20.905C21.3111 21.0259 21.2231 21.1305 21.1142 21.2097C21.0053 21.289 20.8788 21.3406 20.7455 21.36L17.0955 21.89Z" fill="white" />
                        <path d="M23.2958 17.065L25.0808 20.685C25.1042 20.7325 25.1387 20.7736 25.1814 20.8049C25.224 20.8362 25.2736 20.8569 25.3258 20.865L29.3258 21.445C29.3845 21.4561 29.4391 21.4828 29.4838 21.5225C29.5285 21.5621 29.5616 21.6131 29.5796 21.6701C29.5975 21.7271 29.5997 21.7879 29.5858 21.846C29.572 21.9041 29.5426 21.9573 29.5008 22L26.6108 24.815C26.5728 24.8521 26.5443 24.8979 26.5278 24.9484C26.5113 24.9989 26.5072 25.0526 26.5158 25.105L27.1958 29.105C27.2088 29.1685 27.2029 29.2343 27.1787 29.2944C27.1546 29.3545 27.1133 29.4062 27.06 29.443C27.0067 29.4797 26.9437 29.5 26.879 29.5013C26.8142 29.5025 26.7505 29.4847 26.6958 29.45L23.1258 27.57C23.0787 27.5455 23.0264 27.5327 22.9733 27.5327C22.9202 27.5327 22.8679 27.5455 22.8208 27.57L19.2758 29.435C19.2211 29.4697 19.1574 29.4875 19.0927 29.4863C19.0279 29.485 18.965 29.4647 18.9117 29.428C18.8584 29.3912 18.8171 29.3395 18.7929 29.2794C18.7688 29.2193 18.7628 29.1535 18.7758 29.09L19.4558 25.09C19.4645 25.0376 19.4604 24.9839 19.4439 24.9334C19.4273 24.8829 19.3988 24.8371 19.3608 24.8L16.5008 22C16.4576 21.9571 16.4271 21.9031 16.4127 21.844C16.3983 21.7848 16.4005 21.7228 16.4192 21.6648C16.4378 21.6069 16.4721 21.5552 16.5183 21.5155C16.5645 21.4758 16.6207 21.4497 16.6808 21.44L20.6808 20.86C20.7331 20.8519 20.7827 20.8312 20.8253 20.7999C20.8679 20.7686 20.9024 20.7275 20.9258 20.68L22.7108 17.06C22.7392 17.0068 22.7816 16.9624 22.8334 16.9316C22.8853 16.9008 22.9446 16.8848 23.0048 16.8853C23.0651 16.8858 23.1241 16.9028 23.1754 16.9345C23.2267 16.9662 23.2684 17.0113 23.2958 17.065Z" fill="white" />
                    </svg>
                    <div className="media-body text-left">
                        <h4 className="fs-18 mb-0 text-black font-w600">{rating}</h4>
                        <span className="fs-14">Ratings</span>
                    </div>
                    </div>
                </div>
                <div className="col-xl-12">
                    <div className="media">
                    <svg className="me-3 min-w46" width={46} height={46} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width={46} height={46} rx={23} fill="#ECECEC" />
                        <path d="M23 15C19.6227 15 16.875 17.7477 16.875 21.125C16.875 22.2061 17.1606 23.2689 17.701 24.1986C17.8269 24.4153 17.9677 24.6266 18.1196 24.8264L22.7339 31H23.2661L27.8804 24.8264C28.0322 24.6266 28.173 24.4154 28.299 24.1986C28.8394 23.2689 29.125 22.2061 29.125 21.125C29.125 17.7477 26.3773 15 23 15ZM23 23.1562C21.88 23.1562 20.9688 22.245 20.9688 21.125C20.9688 20.005 21.88 19.0938 23 19.0938C24.12 19.0938 25.0312 20.005 25.0312 21.125C25.0312 22.245 24.12 23.1562 23 23.1562Z" fill="#808080" />
                    </svg>
                    <div className="media-body text-left">
                        <h4 className="fs-18 text-black font-w600 mb-0">{this.hidValue(locationDisplay,true)}</h4>
                        <span className="fs-14">Location</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="card-body col-xl-12 col-md-6 border-left ">
                <h6 className="fs-16 text-black font-w600 mb-4">About <strong style={{textTransform:'capitalize'}}>{nameDisplay}</strong> </h6>
                <p className="fs-14">{about}</p>
             </div>
            </div>
        </div>
        <div className="card">
            <div className="card-body">
            <div className="profile-personal-info">
                <h6 className="fs-16 text-black font-w600 mb-4">Details</h6>
            
                <div className="row mb-2">
                <div className="col-sm-3 col-5">
                    <h5 className="f-w-500">Email <span className="pull-end">:</span>
                    </h5>
                </div>
                <div className="col-sm-9 col-7"><span>{this.props.userProfile.type === 'car-owner'? 'hidden' : this.hidValue(this.showEmail(email,this.state.hideEmail),true)}</span>
                </div>
                </div>
                {this.props.userProfile.type === 'car-owner'? '' : <div className="row mb-2"><div className="col-sm-3 col-5"><h5 className="f-w-500">Availability <span className="pull-end">:</span></h5></div><div className="col-sm-9 col-7"><span className='text-success'><strong>{availability_display}</strong></span></div></div>}
                <div className="row mb-2">
                <div className="col-sm-3 col-5">
                    <h5 className="f-w-500">Age <span className="pull-end">:</span>
                    </h5>
                </div>
                <div className="col-sm-9 col-7"><span>{age}</span>
                </div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-3 col-5">
                    <h5 className="f-w-500">gender <span className="pull-end">:</span>
                    </h5>
                </div>
                <div className="col-sm-9 col-7"><span>{gender}</span>
                </div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-3 col-5">
                    <h5 className="f-w-500">City/Town <span className="pull-end">:</span></h5>
                </div>
                <div className="col-sm-9 col-7"><span>{town}</span>
                </div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-3 col-5">
                    <h5 className="f-w-500">Province <span className="pull-end">:</span></h5>
                </div>
                <div className="col-sm-9 col-7"><span>{province}</span>
                </div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-3 col-5">
                    <h5 className="f-w-500">Address <span className="pull-end">:</span></h5>
                </div>
                <div className="col-sm-9 col-7"><span>{this.props.userProfile.type === 'car-owner'? 'hidden' : this.hidValue(address, true)}</span>
                </div>
                </div>
                {this.props.userProfile.type === 'car-owner'? '' :<div className="row mb-2"><div className="col-sm-3 col-5"> <h5 className="f-w-500">Year Experience <span className="pull-end">:</span></h5></div><div className="col-sm-9 col-7"><span>{experience_display}</span></div></div>}
             </div>
            </div>
        </div>
        </div>
        <HtmlFoot/> 
    </>
   );
}
}

function PhoneNumberDialog(props) {
    return (
      <div>
        <Dialog
          fullScreen={false}
          open={props.openPhoneNumberDialog}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"!Sorry. Only Car Owners Can View Drivers' Contact Details"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Contact Details Like Phone numbers ad Emails for drivers are only accessible to registered car owners, 
              in order to view this driver's phone number, 
              create an account as a car owner or log into an already existing car owner account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={props.handleDialogClose}>
              Close
            </Button>
            <Link className='btn btn-sm btn-primary' href="/signup" autoFocus>
              SignUp
            </Link>
            <Link className='btn btn-sm btn-primary' href="/login" autoFocus>
              Login
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  function HiddenDetailsDialog(props) {
    return (
      <div>
        <Dialog
          fullScreen={false}
          open={props.showHiddenDetailsDialog}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {props.hiddenDetailsDialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.hiddenDetailsDialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={props.handleHiddenDetailsDialogClose}>
              Close
            </Button>
            <Link className='btn btn-sm btn-success' href="/points" autoFocus>
              Buy Points
            </Link>
            <Link className='btn btn-sm btn-warning' onClick={props.showHiddenItem} href="#" autoFocus>
              View {props.detailName}
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


function ImageViewModal(props) {
    const ModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '95%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 3,
      };
  return (
    <div onClick={props.handleImageModalClose}>
      <Modal
        open={props.openImageModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          {/*props.showCover? <img src={props.profileCoverSrc}/>: <img src={props.profilePhotoSrc}/>*/} {/* This code allows full view of cover photos, to be released later as an update */} 
          <img src={props.profilePhotoSrc} width='100%'/>
          <IconButton onClick={props.handleImageModalClose} aria-label="cancel">
            <Cancel />
        </IconButton>
        </Box>
      </Modal>
    </div>
  );
}

function RedirectUser(props){
  const router = useRouter();
  router.push(props.url)
  return <></>
}

class CheckShowNumber extends React.Component{  
     componentDidMount(){
        const paths = window.location.search.split('&')
        if(paths[paths.length - 1] === 'showNum'){
            this.props.setShowNumberState(true)
        }
        else{
            this.props.setShowNumberState(false)
        }
     }
     render(){
         return <></>
     }
}