import { backEndUrl, imageUrlFormat } from '@/Constants';
import Link from 'next/link';
import React, { Component } from 'react';

class CarOwners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initial state goes here
    }
  }

  dateCreated = (dateInput)=>{
    let date = new Date(dateInput)
    date = date.toLocaleString('en-US',{timeZone:'Africa/Harare'})
    date = new Date(date)
    return date.toDateString()
  }
  
  // checkEligibility = (carOwner)=>{
  //   let eligibleForListing = false
  //   let carOwnerProfile
  //   if(this.props.listAll) { // if on list all page
  //       carOwnerProfile = carOwner.attributes // the profile
  //       if(carOwnerProfile.details === null || carOwnerProfile.details === undefined) { 
  //         return false // you aren't eligible
  //       }
  //       if(carOwnerProfile.details.firstname === null || carOwnerProfile.details.lastname === null){
  //         eligibleForListing = false
  //       }
  //       else{
  //         eligibleForListing = true
  //     }
  //   }
  //   else{ // if a shorter list
  //       carOwnerProfile = carOwner.carOwnerProfile // the profile
  //       if(carOwner.profile_completion_percentage < 9){
  //         eligibleForListing = false
  //       }
  //       else{
  //         eligibleForListing = true
  //     }
  //   }
  //   return eligibleForListing
  // }
  checkEligibility = (driver)=>{
    let eligibleForListing = false
    if(this.props.listAll) { // if on list all  page - coz we already filter in the itemslistall page
        eligibleForListing = true
    }
    else{ // if a shorter list
       // driverProfile = driver.driverProfile // the profile
        if(driver.profile_completion_percentage < 9){
          eligibleForListing = false
        }
        else{
          eligibleForListing = true
      }
    }
    return eligibleForListing
  }


  rendercarOwnersList = ()=>{
    const listFormat = this.props.listFormat;
    const carOwners = this.props.carOwners
    if(carOwners.length === 0) return <p>No Car Owners Registered Yet</p>
    if(listFormat === 'grid'){
        return <></>;
    }
    else{
        let userId, fullname, rating, ratingsCount, thumbnail, thumbnailUrl, profile_url,eligibleForListing,carOwnerProfile
        return carOwners.map((carOwner)=>{
          if(this.props.listAll) { // set userId for user profiles
            userId = parseInt(carOwner.attributes.userid) // the userid
            carOwnerProfile = carOwner.attributes // the profile if attributes property exists
          }
          else{
            userId = carOwner.id // the userid
            carOwnerProfile = carOwner.carOwnerProfile // the profile no attribute property
          }

           eligibleForListing = this.checkEligibility(carOwner) // check carOwner listing eligibility
           if(carOwnerProfile === undefined) return
           if(eligibleForListing){ //check if profile has got details to it
              if(carOwnerProfile.details.firstname === null || carOwnerProfile.details.lastname === null){
                fullname = "UnNamed Car Owner"
              }
              else{
                fullname = carOwnerProfile.details.firstname? carOwnerProfile.details.firstname +' '+ carOwnerProfile.details.lastname || '' : ''
              }
               // thumbnail stuff
               if(carOwnerProfile.details.profile_thumbnail_image !== null){ // check if thumbnail exists
                if(this.props.listAll) {
                    if(carOwnerProfile.details.profile_thumbnail_image.data === null) { 
                      thumbnail = '/default-profile.png' 
                    }
                    else{
                      thumbnailUrl = imageUrlFormat(carOwnerProfile.details.profile_thumbnail_image.data.attributes,'thumbnail')
                    }
                }
                else{
                    thumbnailUrl = imageUrlFormat(carOwnerProfile.details.profile_thumbnail_image,'thumbnail')
                }
                // adding an api url path to the image source
                if(carOwnerProfile.details.profile_thumbnail_image.data === null) { 
                   thumbnail = '/default-profile.png' 
                }
                else{
                   thumbnail = backEndUrl+thumbnailUrl
                }
                
            }    
            else{
              thumbnail = '/default-profile.png' 
            } 
               // PROFILE URL
               profile_url = '/profile?uid='+userId+'&user_type=car-owner'
               //RATING 
               rating = carOwnerProfile.details.average_rating? carOwnerProfile.details.average_rating : ''
               //RATINGs COUNT
               ratingsCount = carOwnerProfile.details.ratings? carOwnerProfile.details.ratings.length : ''
            }
          else{
            return
          }
          return ( 
            <div className="card-body" key={userId}> 
            <div id="DZ_W_Todo1" className="widget-media dz-scroll ps ps--active-y">
              <ul className="timeline">
                <li>
                  <div className="timeline-panel">
                   <div className="media me-2">
                      <Link href={profile_url} onClick={this.props.handlePageChange}><img alt="image" width={50} src={thumbnail} /></Link>
                    </div>
                    <div className="media-body">
                      <Link href={profile_url} onClick={this.props.handlePageChange}><h5 className="mb-1" style={{textTransform:'capitalize'}}>{fullname}</h5></Link>
                      <small className="d-block">{rating+' '}<span className='fa fa-star text-danger'></span><small>
                      &nbsp;&nbsp;{ratingsCount+' '}<span class="fa fa-comment-alt text-success"></span></small></small>
                    </div>
                    <div className="d-flex">
                      {/* <a className="contact-icon me-3" href="#"><i className="fa fa-car" aria-hidden="true" /></a> */}
                      <Link style={{color:"darkcyan"}} className="contact-icon me-3" href={'/chat?uid='+userId} onClick={this.props.handlePageChange}><i className="fa fa-comment" aria-hidden="true" /></Link>
                      <Link href={profile_url} className="contact-icon" onClick={this.props.handlePageChange}><i className="fa fa-info text-info" /></Link>
                    </div>
                  </div>
                </li>
              </ul>
              </div>
          </div>
          )
        })
    }
  }

  render() {
    return this.rendercarOwnersList()
  }
}

export default CarOwners;

