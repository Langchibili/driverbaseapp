import { api_url, backEndUrl, imageUrlFormat } from '@/Constants';
import ContentLoader from '@/components/Includes/ContentLoader';
import { Alert } from '@mui/material';
import Link from 'next/link';
import React, { Component } from 'react';
export default class ImagesForUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userProfile: this.props.loggedInUserProfile,
        images: {
              nrc_front: null,
              nrc_back: null,
              driving_license_front: null,
              drivers_license_back: null
        },
        noImages: false,
        imagesLoading: true
    }
  }
  imageThumbnail = (image_type)=>{
    const image = null
    if(image_type === 'profile_cover_image'){
        if(this.state.userProfile.type === 'car-owner') {
            if(this.state.userProfile.carOwnerProfile.details.profile_cover_image === null) return image
            return this.state.userProfile.carOwnerProfile.details.profile_cover_image
        }   
        else{
            if(this.state.userProfile.driverProfile.details.profile_cover_image === null) return image
            return this.state.userProfile.driverProfile.details.profile_cover_image
        }
    }
    else if(image_type === 'profile_thumbnail_image'){
        if(this.state.userProfile.type === 'car-owner') {
            if(this.state.userProfile.carOwnerProfile.details.profile_thumbnail_image === null) return image
            return this.state.userProfile.carOwnerProfile.details.profile_thumbnail_image
        }
        else{
            if(this.state.userProfile.driverProfile.details.profile_thumbnail_image === null) return image
            return this.state.userProfile.driverProfile.details.profile_thumbnail_image
        }
    }
    else if(image_type === 'nrc_front'){
        if(this.state.userProfile.driverProfile.nrc_front === null) return image
        return this.state.userProfile.driverProfile.nrc_front
    }
    else if(image_type === 'nrc_back'){
        if(this.state.userProfile.driverProfile.nrc_back === null) return image
        return this.state.userProfile.driverProfile.nrc_back
    }
    else if(image_type === 'driving_license_front'){
        if(this.state.userProfile.driverProfile.driving_license_front === null) return image
        return this.state.userProfile.driverProfile.driving_license_front
    }
    else if(image_type === 'drivers_license_back'){
        if(this.state.userProfile.driverProfile.drivers_license_back === null) return image
        return this.state.userProfile.driverProfile.drivers_license_back
        
    }
    else if(image_type === 'driving_certificate_front'){
        if(this.state.userProfile.driverProfile.driving_certificate_front === null) return image
        return this.state.userProfile.driverProfile.driving_certificate_front
        
    }
    else if(image_type === 'driving_certificate_back'){
        if(this.state.userProfile.driverProfile.driving_certificate_back === null) return image
        return this.state.userProfile.driverProfile.driving_certificate_back
    }
  }

  componentDidMount(){
    console.log(this.props.loggedInUserProfile)
    if(this.props.loggedInUserProfile.type === "driver"){
        this.setState({ // just add images to state for purposes of checking
            images: {
                nrc_front: this.imageThumbnail('nrc_front'),
                nrc_back:  this.imageThumbnail('nrc_back'),
                driving_license_front: this.imageThumbnail('driving_license_front'),
                drivers_license_back: this.imageThumbnail('drivers_license_back')
            }
        },()=>{ // check images if they exist
            let noImages = true
            const images = this.state.images
            if(images.nrc_front !== null || images.nrc_back !== null || images.driving_license_front !== null || images.drivers_license_back !== null) noImages = false
            this.setState({
                noImages: noImages
            },()=>{
                const noImages = this.state.noImages
                if(noImages) return // don't add any images if no image exist
                this.setState({  // add images if at least one image exist
                    imagesLoading: false,
                    images: {
                        nrc_front: imageUrlFormat(this.imageThumbnail('nrc_front','thumbnail')),
                        nrc_back: imageUrlFormat(this.imageThumbnail('nrc_back','thumbnail')),
                        driving_license_front: imageUrlFormat(this.imageThumbnail('driving_license_front','thumbnail')),
                        drivers_license_back: imageUrlFormat(this.imageThumbnail('drivers_license_back','thumbnail'))
                    }
                })
            })
        })
    }
  }
  
  render() {
    const thumbnailStyle = {
      width: '100%',      // Adjust the width as needed
      height: '100%',     // Adjust the height as needed
      margin: '5px',       // Add some margin for spacing
      cursor: 'pointer',  // Change the cursor to a pointer on hover
      margin: '0 auto'
    }
    const imageBoxStyles = {
        border: '1px solid gray',
        padding: '5px',
        margin: '0 auto 5px auto',
        width : '90px', 
        height:'90px',
    }
    const renderImages = ()=>{
        if(this.state.noImages){
            return (
                <Alert severity='warning'>
                    You don't have any images available to send. Please update your profile with images you want to send, example, "<strong>NRC</strong>, <strong>DRIVING LICENCE</strong>, Etc." <br />
                    <Link href="/profile" style={{ color: 'blue', textDecoration: 'underline' }}>
                        Click To Go And Update Now
                    </Link>
                </Alert>
            )
        }
        else{
            if(this.state.imagesLoading) return <ContentLoader />
            return (
                <div style={{overflowY:'scroll', height:'600px', margin:'0 auto', textAlign:'center'}}>
                    <h3>Select Image to send</h3>
                    {this.state.images.nrc_front !== null? <><h4> Nrc Front</h4>
                    <div style={imageBoxStyles} onClick={()=>{ this.props.selectMedia(this.imageThumbnail('nrc_front'), 'nrc_front',backEndUrl + this.state.images.nrc_front)}}>
                        <img
                        src={backEndUrl + this.state.images.nrc_front}
                        alt="NRC Front"
                        style={thumbnailStyle}
                        />
                    </div> </>: ''}   
                   {this.state.images.nrc_back !== null?<> <h4>Nrc Back</h4>
                    <div style={imageBoxStyles} onClick={()=>{ this.props.selectMedia(this.imageThumbnail('nrc_back'), 'nrc_back',backEndUrl + this.state.images.nrc_back)}}>
                        <img
                        src={backEndUrl + this.state.images.nrc_back}
                        alt="NRC Back"
                        style={thumbnailStyle}
                        />
                    </div></> : ''}
                   {this.state.images.driving_license_front !== null? <> <h4>Licence Front</h4>
                    <div style={imageBoxStyles} onClick={()=>{ this.props.selectMedia(this.imageThumbnail('driving_license_front'), 'driving_license_front',backEndUrl + this.state.images.driving_license_front)}}>
                        <img
                        src={backEndUrl + this.state.images.driving_license_front}
                        alt="License Front"
                        style={thumbnailStyle}
                        />
                    </div></> : ''}
                    {this.state.images.drivers_license_back !== null? <> <h4>Licence Back</h4>
                    <div style={imageBoxStyles} onClick={()=>{ this.props.selectMedia(this.imageThumbnail('drivers_license_back'), 'drivers_license_back',backEndUrl + this.state.images.drivers_license_back)}}>
                        <img
                        src={backEndUrl + this.state.images.drivers_license_back}
                        alt="License Back"
                        style={thumbnailStyle}
                        />
                    </div></> : ''}
                    <Alert severity='info' sx={{marginTop:2}}>
                    If you do not see the image you want to send, ensure that you update your profile with images you want to send, e.g., "<strong>NRC FRONT and BACK</strong>, <strong>DRIVING LICENCE FRONT and BACK</strong> images, Etc." <br />
                    <Link href="/profile" style={{ color: 'blue', textDecoration: 'underline' }}>
                        Click To Go And Update Now
                    </Link>
                </Alert>
                </div>
            )
        }
    }
      return this.props.loggedInUserProfile.type === "driver"? renderImages() : <><Alert severity='info'>
      <p>This is a feature used by drivers to send you documents you request like, "<strong>NRC</strong>, <strong>DRIVING LICENCE</strong>, Etc." </p>
      <h4>To ask for the details, simply text this user to send them, assuming they are a driver and not a fellow car owner like you.</h4>
  </Alert></>
  }
  
}
