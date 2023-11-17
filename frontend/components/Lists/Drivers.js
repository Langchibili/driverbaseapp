import React, { Component } from 'react';
import { api_url, backEndUrl, imageUrlFormat } from '@/Constants';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import RatingDisplay from '../Includes/RatingDisplay';
import { Chip } from '@mui/material';

export default class Drivers extends Component {
  constructor(props) {
    super(props);
    this.state = {
       openPhoneNumberDialog: false,
       currentDriverOffer: null
    }
  }

  dateCreated = (dateInput)=>{
    let date = new Date(dateInput)
    date = date.toLocaleString('en-US',{timeZone:'Africa/Harare'})
    date = new Date(date)
    return date.toDateString()
  }

  showDriverOffer = (driverProfileId)=>{
    if(this.props.loggedInUserProfile.type === "driver") return <></> // only car owners can see drivers offers on jobs
    if(this.props.listingType === "applicants"){
      
      let offer = this.props.job.job_applications.data.filter((job_application)=>{
        return parseInt(job_application.attributes.driverProfileId) === parseInt(driverProfileId)
      })
      if(offer.length === 1){
          return <OfferDisplay offer={offer[0].attributes}/>
      }
      else{
        return <></>
      }
    }
    else{
      return <></>
    }
  }

  
  checkEligibility = (driver)=>{
    let eligibleForListing = false
    let driverProfile
    if(this.props.listAll) { // if on list all page
        driverProfile = driver.attributes // the profile
        if(driverProfile.details === null || driverProfile.details === undefined) { 
          return false // you aren't eligible
        }
        if(driverProfile.details.firstname === null || driverProfile.details.lastname === null){
          eligibleForListing = false
        }
        eligibleForListing = true
    }
    else{ // if a shorter list
        driverProfile = driver.driverProfile // the profile
        if(driver.profile_completion_percentage < 9){
          eligibleForListing = false
        }
        else{
          eligibleForListing = true
      }
    }
    return eligibleForListing
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

  renderDriverNumber = (profileUrl,handleDialogOpen)=>{
    if(this.props.loggedInUserProfile.type === "driver" || this.props.loggedInUserProfile === "logged-out"){
      return <a style={{color:"green"}} className="contact-icon" href="#" onClick={handleDialogOpen}><i className="fa fa-phone" /></a>
    }
    if(this.props.loggedInUserProfile.profile_completion_percentage < 9){
      return <a style={{color:"green"}} className="contact-icon" href="#" onClick={handleDialogOpen}><i className="fa fa-phone" /></a>
    }
    return <Link style={{color:"green"}} className="contact-icon" href={profileUrl+'&showNum'} onClick={this.props.handlePageChange}><i className="fa fa-phone" /></Link>
  }

  renderDriverCategory = (driverCategory)=>{
    if(driverCategory === null) driverCategory = "other"
    if(driverCategory === "truck" || driverCategory === "canter" || driverCategory === "heavy-duty"){
      return <Link style={{color:"cadetblue"}} className="contact-icon me-3" href={'/drivers/'+driverCategory} onClick={this.props.handlePageChange}><i className="fa fa-truck" aria-hidden="true" /></Link>
    }
    if(driverCategory === "taxi"){
      return <Link style={{color:"cadetblue"}} className="contact-icon me-3" href={'/drivers/'+driverCategory} onClick={this.props.handlePageChange}><i className="fa fa-car" aria-hidden="true" /></Link>
    }
    if(driverCategory === "tractor"){
      return <Link style={{color:"cadetblue"}} className="contact-icon me-3" href={'/drivers/'+driverCategory} onClick={this.props.handlePageChange}><i className="fa fa-truck" aria-hidden="true" /></Link>
    }
    if(driverCategory === "mini-bus" || driverCategory === "big-bus" || driverCategory === "noah" ){
      return <Link style={{color:"cadetblue"}} className="contact-icon me-3" href={'/drivers/'+driverCategory} onClick={this.props.handlePageChange}><i className="fa fa-bus" aria-hidden="true" /></Link>
    }
    return <Link style={{color:"cadetblue"}} className="contact-icon me-3" href={'/drivers/'+driverCategory} onClick={this.props.handlePageChange}><i className="fa fa-truck" aria-hidden="true" /></Link>
  }

  renderChatLink = (userId)=>{
    return <Link style={{color:"darkcyan"}} className="contact-icon me-3" href={'/chat?uid='+userId} onClick={this.props.handlePageChange}><i className="fa fa-comment" aria-hidden="true" /></Link>
  }

  enlistDriverButtons = (userId)=>{
    return (<div>
            <Button disabled={this.props.submitting} onClick={()=>{ this.props.enlistDriver(userId)}}>Enlist Driver</Button>
            <Button disabled={this.props.submitting} onClick={()=>{ this.props.enlistDriverAsRecommended(userId)}} color='secondary'>Enlist Driver As Recommended</Button>
          </div>)
  }

  renderDriversList = ()=>{
    const listFormat = this.props.listFormat;
    const drivers = this.props.drivers
    if(drivers.length === 0) return <p>No Drivers Registered Yet</p>
    if(listFormat === 'grid'){
        return <></>;
    }
    else{
        let userId,fullname,phone_number,thumbnail,thumbnailUrl,profile_url,rating,ratingsCount,eligibleForListing,driverProfile
    
        return drivers.map((driver)=>{
            if(this.props.listAll) { // set userId for user profiles
              userId = parseInt(driver.attributes.userid) // the userid
              driverProfile = driver.attributes // the profile if attributes property exists
            }
            else{
              if(driver === undefined) return // if it's undefined, no need showing it
              userId = driver.id // the userid
              driverProfile = driver.driverProfile // the profile no attribute property
            }

            eligibleForListing = this.checkEligibility(driver) // check driver listing eligibility
            if(eligibleForListing){ // check if user has a profile 
                // FULLNAME  
                fullname = driverProfile.details.firstname? driverProfile.details.firstname +' '+ driverProfile.details.lastname || '' : ''
                // THUMBNAIL
                if(driverProfile.details.profile_thumbnail_image !== null){ // check if thumbnail exists
                    if(this.props.listAll) {
                        if(driverProfile.details.profile_thumbnail_image.data === null) { 
                          thumbnail = '/default-profile.png' 
                        }
                        else{
                          thumbnailUrl = imageUrlFormat(driverProfile.details.profile_thumbnail_image.data.attributes,'thumbnail')
                        }
                    }
                    else{
                        thumbnailUrl = imageUrlFormat(driverProfile.details.profile_thumbnail_image,'thumbnail')
                    }
                    // adding an api url path to the image source
                    if(driverProfile.details.profile_thumbnail_image.data === null) { 
                       thumbnail = '/default-profile.png' 
                    }
                    else{
                       thumbnail = backEndUrl+thumbnailUrl
                    }
                    
                }    
                else{
                  thumbnail = '/default-profile.png' 
                } 

                //PHONE NUMBER
                phone_number = driverProfile.details.phone_number? driverProfile.details.phone_number : '' 
                //PROFILE URL
                profile_url = '/profile?uid='+userId+'&user_type=driver'
                //RATING 
                rating = driverProfile.details.average_rating? driverProfile.details.average_rating : ''
                //RATINGs COUNT
                ratingsCount = driverProfile.details.ratings? driverProfile.details.ratings.length : ''
             }
             else{
                return
             }
            return ( 
              <div className="card-body" key={userId}> 
                <PhoneNumberDialog openPhoneNumberDialog={this.state.openPhoneNumberDialog} handleDialogClose={this.handleDialogClose}/>
                <div id="DZ_W_Todo1" className="widget-media dz-scroll ps ps--active-y">
                  <ul className="timeline">
                    <li>
                      <div className="timeline-panel">
                        <div className="media me-2">
                          <Link href={profile_url}><img alt="image" width={50} src={thumbnail} /></Link>
                        </div>
                        <div className="media-body">
                          <Link href={profile_url}><h5 className="mb-1" style={{textTransform:'capitalize'}}>{fullname}</h5></Link>
                          <small className="d-block">{rating+' '}<span className='fa fa-star text-danger'></span><small>
                          &nbsp;&nbsp;{ratingsCount+' '}<span class="fa fa-comment-alt text-success"></span></small></small>
                        {/* <RatingDisplay rating={rating}/> */}
                        </div>
                        <div className="d-flex">
                          {/* {this.renderDriverCategory(driverProfile.driver_category)} */}
                          {this.renderChatLink(userId)}
                          {this.renderDriverNumber(profile_url,this.handleDialogOpen)}
                        </div>
                      </div>
                    </li>
                  </ul>
                  {this.props.actionTotake === "activate"? <>{this.enlistDriverButtons(driverProfile.id)} <div>Driver Profile Id: <strong>{driverProfile.id}</strong></div><div>Driver Usernname: <strong>{driver.username}</strong></div></>: ""}
                  {this.showDriverOffer(driver.driverProfile.id)}
                  </div>
              </div>
            )
        })
    }
  }

  render() {
    return this.renderDriversList()
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
            Phone numbers for drivers are only accessible to registered car owners, 
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

class OfferDisplay extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        showMore: false,
        showMoreText: "View More"
    }
  }
  handleShowCoverLetter = ()=>{
       const showMore = this.state.showMore
       if(showMore){
          this.setState({
            showMore: false,
            showMoreText: "View More"
          })
       }
       else{
        this.setState({
          showMore: true,
          showMoreText: "Hide"
        })
       }
  }
  render(){
    return (<>
      <small style={{display:"inline-block",marginRight:"4px"}}>this driver has offered to be paid: <strong style={{color:'forestgreen'}}>{this.props.offer.payment_offer}</strong></small>
      {this.props.offer.cover_letter.length > 0? <>
      <Chip label={this.state.showMoreText} variant="outlined" onClick={this.handleShowCoverLetter} />
      {this.state.showMore? <div>{this.props.offer.cover_letter}</div> : <></>} </> : <></>}
      </>)
  }
}