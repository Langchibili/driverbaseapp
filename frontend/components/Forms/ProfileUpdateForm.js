import React, { Component } from 'react';
import ImageUploader from './ImageUploader';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Link from 'next/link';
import { textHasEmailAddress, textHasPhoneNumber } from '@/Constants';

class ProfileUpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userProfile : this.props.userProfile || null,
        profileId: null,
        refName: null,
        townText: '--Select a province--',
        errorExists: false,
        errorMessage: '',
        updating: false,
        updated: false,
        snapBackOpen: true,
        updatingProfileThumbnail: false,
        updatingProfileCover: false
    };
    this.createRefs()
}
  
  createRefs = ()=>{
    this.firstName = React.createRef();
    this.lastName = React.createRef();
    this.email = React.createRef();
    this.mobileNumber = React.createRef();
    this.whatsAppNumber = React.createRef();
    this.address = React.createRef();
    this.province = React.createRef();
    this.town = React.createRef();
    this.otherTown = React.createRef();
    this.about = React.createRef();
    this.age = React.createRef();
    this.gender = React.createRef();
    this.experience = React.createRef();
    this.category = React.createRef();
  }

  componentDidMount(){
    this.setState({
        formUpdated: false,
        submittingText: 'Update',
        updating: false
    })
  }
  
  componentDidUpdate(){
    if (this.state.formUpdated === false && this.state.userProfile !== null) { // to avoid recycles
        // set default form values 
        let profileDetails 
      
        if(this.state.userProfile.type === 'driver') profileDetails = this.state.userProfile.driverProfile.details
        if(this.state.userProfile.type === 'car-owner') profileDetails = this.state.userProfile.carOwnerProfile.details
        
        this.firstName.current.value = profileDetails.firstname
        this.lastName.current.value = profileDetails.lastname
        this.age.current.value = profileDetails.age
        this.gender.current.value = profileDetails.gender
        this.mobileNumber.current.value = profileDetails.phone_number
        this.whatsAppNumber.current.value = profileDetails.whatsapp_number
        this.address.current.value = profileDetails.address? profileDetails.address.location : ''
        this.province.current.value =profileDetails.address? profileDetails.address.province : ''
        this.town.current.value = profileDetails.address? profileDetails.address.town : ''
        this.about.current.value = profileDetails.about

        // EMAIL STUFF
        if(this.state.userProfile.email === this.state.userProfile.username+'_unset@email.com'){
            this.email.current.value = ""
        }
        else{
            this.email.current.value = this.state.userProfile.email
        }

        // DRIVER SPECIFIC STUFF
        if(this.state.userProfile.type === 'driver'){
            this.category.current.value = this.state.userProfile.driverProfile.driver_category // set the driver category
            if(this.state.userProfile.driverProfile.experience === 0){
                this.experience.current.value = ""
            }
            else{
                this.experience.current.value = this.state.userProfile.driverProfile.experience
            }
        } 
        
        this.setState({// file upload stuff, also for driver file details stuff
            formUpdated: true,
            townText:  profileDetails.address? profileDetails.address.town : '',
            profileId: this.state.userProfile.type === 'driver'? this.state.userProfile.driverProfile.id : this.state.userProfile.carOwnerProfile.id,
            refName: this.state.userProfile.type === 'driver'? "api::driver-profile.driver-profile" : "api::car-owner-profile.car-owner-profile"
        })
    }
  }



  setOtherTown = ()=>{
    const otherCityContainer = document.getElementById('other-city-container');
    if (this.town.current.value === "other") {
        otherCityContainer.style.display = "block";
    } else {
        otherCityContainer.style.display = "none";
    }
  }

  handleOtherTownSelection = ()=>{
    let userProfile = this.state.userProfile
    if(this.state.userProfile.type === 'driver') {
        userProfile.driverProfile.details.address.town = this.otherTown.current.value
        userProfile.driverProfile.details.address.city = this.otherTown.current.value
    }
    if(this.state.userProfile.type === 'car-owner') {
        userProfile.carOwnerProfile.details.address.town = this.otherTown.current.value
        userProfile.carOwnerProfile.details.address.city = this.otherTown.current.value
    }
    this.setState({
        userProfile: userProfile
    })
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
  
   updateProfileImages = async (image,image_type,userProfile,updateRequest)=>{
        let updateObject = {data:{}}
        const makeRequestAndFireUx = async (updateObject)=>{
            const updatedUser = await updateRequest(updateObject)
            if(updatedUser.ok) {
                this.setState({ 
                    errorExists: false,
                    submittingText: 'updated',
                    updating: false,
                    updated: true,
                    snapBackOpen: true
                })
            }
            else{
                this.setState({
                    errorExists: true,
                    updating: false,
                    submittingText: 'retry',
                    snapBackOpen: true,
                    errorMessage: "Couldn't update profile, please retry"
                })
            }
        }
        if(image_type === 'profile_cover_image'){
            if(userProfile.type === 'driver'){
                userProfile.driverProfile.details.profile_cover_image = image
                updateObject.data.id =  userProfile.driverProfile.id // set update id
                updateObject.data = {...userProfile.driverProfile}
            }
            if(userProfile.type === 'car-owner'){
                userProfile.carOwnerProfile.details.profile_cover_image = image
                updateObject.data.id =  userProfile.carOwnerProfile.id // set update id
                updateObject.data = {...userProfile.carOwnerProfile}
            }
            this.setState({
                updatingProfileCover: true
            },()=>{
                makeRequestAndFireUx(updateObject) // make request and fire UXs
            })
            
        }
        else if(image_type === 'profile_thumbnail_image'){
            if(userProfile.type === 'driver'){
                userProfile.driverProfile.details.profile_thumbnail_image = image
                updateObject.data.id =  userProfile.driverProfile.id // set update id
                updateObject.data = {...userProfile.driverProfile}
            }
            if(userProfile.type === 'car-owner'){
                userProfile.carOwnerProfile.details.profile_thumbnail_image = image
                updateObject.data.id =  userProfile.carOwnerProfile.id // set update id
                updateObject.data = {...userProfile.carOwnerProfile} 
            }
            this.setState({
                updatingProfileThumbnail: true
            },()=>{
                makeRequestAndFireUx(updateObject) // make request and fire UXs
            })
        }
       
  }


  handleSubmit = (e)=>{
        e.preventDefault()
        let userProfile = this.state.userProfile
        let updateObject = {data:{}}
        userProfile.email = this.email.current.value 
        if(this.state.userProfile.type === 'driver'){
            userProfile.driverProfile.details.firstname = this.firstName.current.value 
            userProfile.driverProfile.details.lastname =  this.lastName.current.value
            userProfile.driverProfile.details.age = this.age.current.value 
            userProfile.driverProfile.details.gender = this.gender.current.value 
            userProfile.driverProfile.details.phone_number = this.mobileNumber.current.value 
            userProfile.driverProfile.details.whatsapp_number = this.whatsAppNumber.current.value 
            userProfile.driverProfile.details.about = this.about.current.value 
            userProfile.driverProfile.experience = this.experience.current.value  
            userProfile.driverProfile.driver_category = this.category.current.value  
            
            /* ADDRESS  PREPARATIONS */
           if(userProfile.driverProfile.details.address === null){
                // initialize address object
                userProfile.driverProfile.details.address = {id:0, location:'',province:'',town:'',city:''}
                userProfile.driverProfile.details.address.location = this.address.current.value 
                userProfile.driverProfile.details.address.province = this.province.current.value 
                userProfile.driverProfile.details.address.town = this.town.current.value 
                userProfile.driverProfile.details.address.city = this.town.current.value 
            }
            else{
                userProfile.driverProfile.details.address.location = this.address.current.value 
                userProfile.driverProfile.details.address.province = this.province.current.value 
                userProfile.driverProfile.details.address.town = this.town.current.value 
                userProfile.driverProfile.details.address.city = this.town.current.value 
            }
            console.log('car ownwer ilegal place',updateObject)
            // setting up updateObject
            updateObject.data = {...userProfile.driverProfile}
        }
        if(this.state.userProfile.type === 'car-owner'){
            userProfile.carOwnerProfile.details.firstname = this.firstName.current.value 
            userProfile.carOwnerProfile.details.lastname =  this.lastName.current.value
            userProfile.carOwnerProfile.details.age = this.age.current.value 
            userProfile.carOwnerProfile.details.gender = this.gender.current.value  
            userProfile.carOwnerProfile.details.phone_number = this.mobileNumber.current.value 
            userProfile.carOwnerProfile.details.whatsapp_number = this.whatsAppNumber.current.value 
            userProfile.carOwnerProfile.details.about = this.about.current.value  
            
            /* ADDRESS  PREPARATIONS */
            if(userProfile.carOwnerProfile.details.address === null){
                // initialize address object
                userProfile.carOwnerProfile.details.address = {id:0, location:'',province:'',town:'',city:''}
                userProfile.carOwnerProfile.details.address.location = this.address.current.value 
                userProfile.carOwnerProfile.details.address.province = this.province.current.value 
                userProfile.carOwnerProfile.details.address.town = this.town.current.value 
                userProfile.carOwnerProfile.details.address.city = this.town.current.value 
            }
            else{
                userProfile.carOwnerProfile.details.address.location = this.address.current.value 
                userProfile.carOwnerProfile.details.address.province = this.province.current.value 
                userProfile.carOwnerProfile.details.address.town = this.town.current.value 
                userProfile.carOwnerProfile.details.address.city = this.town.current.value 
            }
            // setting up updateObject
             updateObject.data = {...userProfile.carOwnerProfile}
        }

        if(textHasPhoneNumber(this.about.current.value)){ // no phone numbers in description
            this.setState({
                errorExists: true,
                updating: false,
                submittingText: 'retry',
                snapBackOpen: true,
                errorMessage: "You cannot add a phone number into the description. Please remove the phone number to update the descrition."
            })
            return
        }
        if(textHasEmailAddress(this.about.current.value)){ // cannot add email address into description
            this.setState({
                errorExists: true,
                updating: false,
                submittingText: 'retry',
                snapBackOpen: true,
                errorMessage: "You cannot add an email address into the description. Please remove the email address to update the description."
            })
            return
        }
        
        this.setState({
            userProfile: userProfile,
            updateObject: updateObject
        },()=>{
            this.setState({
                errorExists: false,
                updating: true,
                submittingText: 'updating...'
             },async ()=>{
                const updateUserEmail = await this.updateUserEmail(userProfile.email,userProfile.id) //update email first
                if(updateUserEmail.ok){
                    const updatedUser = await this.updateRequest(updateObject) // then update other user profile details
                 
                    if(updatedUser.ok) {
                        this.setState({ 
                            errorExists: false,
                            submittingText: 'updated',
                            updating: false,
                            updated: true,
                            snapBackOpen: true
                        })
                    }
                    else{
                        this.setState({
                            errorExists: true,
                            updating: false,
                            submittingText: 'retry',
                            snapBackOpen: true,
                            errorMessage: "Couldn't update profile, please retry"
                        })
                    }
                }
                else{
                    this.setState({
                        errorExists: true,
                        updating: false,
                        submittingText: 'retry',
                        snapBackOpen: true,
                        errorMessage: "Couldn't update profile, please retry"
                    })
                }
            })
        })
  }

  updateUserEmail = async (email,userId)=>{
    if(email === ""){
        email = this.state.userProfile.username+'_unset@email.com'
    }
    return await fetch(this.props.api_url+"/users/"+userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.jwt}`
        },
        body: JSON.stringify({email:email})
      })
  }

  updateRequest = async (updateObject)=>{
     updateObject = this.cleanData(updateObject)// add values to empty required data and parse ints
     const update_url = this.state.userProfile.type === 'driver'? this.props.api_url+"/driver-profiles/"+this.state.profileId : this.props.api_url+"/car-owner-profiles/"+this.state.profileId
    
     console.log('a cleaner update object',updateObject)
     return await fetch(update_url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.jwt}`
        },
        body: JSON.stringify(updateObject)
      })
  }
  
  cleanData = (updateObject)=>{
        // driver specific property checks
        if(updateObject.data.hasOwnProperty('experience')){ 
            if(updateObject.data.experience === "") {
                updateObject.data.experience = 0
            }
            else{
                updateObject.data.experience = parseInt(updateObject.data.experience)
            }
        }

        if(updateObject.data.hasOwnProperty('driver_category')){ 
            if(updateObject.data.driver_category === "") {
                updateObject.data.driver_category = "other"
            }
        }

        // all other user types property checks
        if(updateObject.data.details.hasOwnProperty('age')){
            if(updateObject.data.details.age === ""){ // if the age is not set and equal to a string
                updateObject.data.details.age = 0
            }
            else{
                updateObject.data.details.age  = parseInt(updateObject.data.details.age)
            }
        }
        if(updateObject.data.details.address.province === ""){
           updateObject.data.details.address.province = "unset"
        }
        if(updateObject.data.details.gender === ""){
           updateObject.data.details.gender = "unset"
        }
       
        // delete data to avoid a 400 on bad data construction
        delete updateObject.data.id
        delete updateObject.data.updatedAt
        delete updateObject.data.createdAt
        delete updateObject.data.publishedAt
        // delete these coz they get updated by strapi whenever a new upload it made using refId,RefName,etc
        delete updateObject.data.driving_license_front
        delete updateObject.data.drivers_license_back
        delete updateObject.data.driving_certificate_front
        delete updateObject.data.driving_certificate_back
        delete updateObject.data.nrc_front
        delete updateObject.data.nrc_back
         
        // only delete any of the follwing when not being updated, otherwise leave to update
        if(!this.state.updatingProfileCover) delete updateObject.data.details.profile_cover_image
        if(!this.state.updatingProfileThumbnail) delete updateObject.data.details.profile_thumbnail_image
        
        delete updateObject.data.details.ratings
        delete updateObject.data.details.average_rating // coz ratings are updated elsewhere
        return updateObject // return cleaner data ready to upstream
  }

   handleUx = ()=>{
    const handleSnapBackClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({
            snapBackOpen: false
        })
      }

    if(this.state.errorExists){
        return (
            <Snackbar open={this.state.snapBackOpen} autoHideDuration={3500} onClose={handleSnapBackClose} TransitionComponent='SlideTransition' anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MuiAlert elevation={6}  variant="filled" onClose={handleSnapBackClose} severity="error" sx={{ width: '100%' }}>
                {this.state.errorMessage}
                </MuiAlert>
            </Snackbar>
            
        )
    }
    else{
        return (<Link href={"/profile?user_type="+this.state.userProfile.type+"&uid="+this.state.userProfile.id} >   
                <Snackbar TransitionComponent='SlideTransition' open={this.state.snapBackOpen} autoHideDuration={4500} onClose={handleSnapBackClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MuiAlert elevation={6}  variant="filled" onClose={handleSnapBackClose} severity="success" sx={{ width: '100%' }}>
                     profile updated, click to view changes
                </MuiAlert>
                </Snackbar>
                </Link>)
    }
   }

  renderDriverForm = ()=>{
     if(this.state.userProfile.type === 'driver'){
        return(<div className="card">
            <div className="card-header">
             <h4 className="card-title">Update Driver Details</h4>
            </div>
            <div className="card-body">
            {this.props.userProfile.type !== null? <div className="mb-5">
                    <div className="title mb-4"><span className="fs-18 text-black font-w600">Working Experience</span></div>
                     <div className="row">
                        <div className="col-xl-4 col-sm-6">
                            <div className="form-group">
                                <label>Years Of Experience</label>
                                <input ref={this.experience} type="number" className="form-control" placeholder="Enter Experience" />
                            </div>
                            <div className="form-group">
                                <label>Type Of Driver You Are &nbsp;</label>
                                <select ref={this.category} >
                                    <option value="">-- Select Category --</option>
                                    <option value="truck">Truck</option>
                                    <option value="taxi">Taxi</option>
                                    <option value="tractor">Tractor</option>
                                    <option value="canter">Canter</option>
                                    <option value="noah">Noah</option>
                                    <option value="big-bus">Big-Bus</option>
                                    <option value=" mini-bus"> Mini-Bus</option>
                                    <option value="heavy-duty">Heavy-Duty</option>
                                </select>
                            </div>
                            <Button disabled={this.state.updating} onClick={this.handleSubmit} variant="contained" component="label">
                                  {this.state.submittingText}
                            </Button> 
                            </div>
                        </div>
                    
                    <div className="title mb-4"><span className="fs-18 text-black font-w600">Profile Images</span></div>
                    <div className="row">
                         <ImageUploader
                            userProfile = {this.state.userProfile}   
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName='Nrc Front Photo'
                            fieldName="nrc_front"
                            image={this.imageThumbnail('nrc_front')}
                            jwt={this.props.jwt}/>
                    </div>
                    <div className="row">
                         <ImageUploader  
                            userProfile = {this.state.userProfile} 
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName='Nrc Back Photo'
                            fieldName="nrc_back"
                            image={this.imageThumbnail('nrc_back')}
                            jwt={this.props.jwt}/>
                    </div>
                    <div className="row">
                         <ImageUploader
                            userProfile = {this.state.userProfile}  
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName="Driving License Front"
                            fieldName="driving_license_front"
                            image={this.imageThumbnail('driving_license_front')}
                            jwt={this.props.jwt} 
                            addPhoto={this.addLicenceFrontPhoto}/>
                    </div>
                    <div className="row">
                         <ImageUploader 
                            userProfile = {this.state.userProfile}  
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName="Drivers License Back"
                            fieldName="drivers_license_back"
                            image={this.imageThumbnail('drivers_license_back')}
                            jwt={this.props.jwt}/>
                    </div>
                    <div className="row">
                         <ImageUploader
                            userProfile = {this.state.userProfile}  
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName="Driving Certificate Front"
                            fieldName="driving_certificate_front"
                            image={this.imageThumbnail('driving_certificate_front')}
                            jwt={this.props.jwt}/>
                    </div>
                    <div className="row">
                         <ImageUploader 
                            userProfile = {this.state.userProfile} 
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName="Driving Certificate Back"
                            fieldName="driving_certificate_back"
                            image={this.imageThumbnail('driving_certificate_back')}
                            jwt={this.props.jwt}/>
                    </div>
            </div>: ''}
            </div>
        </div>)
     }
     else{
        return <></>
     }
  }

  renderForm = ()=>{
    if(this.state.userProfile === null){
        return <> Loading...</>
    }
    else{
        return (<form>
                <div className="mb-5">
                    <div className="title mb-4"><span className="fs-18 text-black font-w600">Generals</span></div>
                    <div className="row">
                        <div className="col-xl-4 col-sm-6">
                            <div className="form-group">
                            <label>First Name</label>
                            <input ref={this.firstName} type="text" className="form-control" placeholder="Enter name" />
                            </div>
                        </div>
                        <div className="col-xl-4 col-sm-6">
                            <div className="form-group">
                            <label>Last Name</label>
                            <input ref={this.lastName}  type="text" className="form-control" placeholder="Last name" />
                            </div>
                        </div>
                        <div className="col-xl-4 col-sm-6">
                            <div className="form-group">
                            <label>Age</label>
                            <input ref={this.age} type="number" className="form-control" placeholder="Enter Age" />
                            </div>
                        </div>
                        <div className="col-xl-4 col-sm-6">
                            <div className="form-group">
                            <label>Gender &nbsp;</label>
                            <select ref={this.gender} >
                                <option value="">-- Select Gender --</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            </div>
                            <Button disabled={this.state.updating} onClick={this.handleSubmit} variant="contained" component="label">
                              {this.state.submittingText}
                            </Button> 
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <div className="title mb-4"><span className="fs-18 text-black font-w600">CONTACT</span></div>
                    <div className="row">
                    <div className="col-xl-4 col-sm-6">
                        <div className="form-group">
                        <label>MobilePhone</label>
                        <div className="input-group input-icon mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-number" id="basic-addon1"><i className="fa fa-phone" aria-hidden="true" /></span>
                            </div>
                            <input ref={this.mobileNumber}  type="tel" className="form-control" placeholder="Phone no." />
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-6">
                        <div className="form-group">
                        <label>Whatsapp</label>
                        <div className="input-group input-icon mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-number" id="basic-addon2"><i className="fab fa-whatsapp" aria-hidden="true" /></span>
                            </div>
                            <input ref={this.whatsAppNumber}  type="tel" className="form-control" placeholder="Phone no." />
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-6">
                        <div className="form-group">
                        <label>Email</label>
                        <div className="input-group input-icon mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon3"><i className="las la-envelope" /></span>
                            </div>
                            <input ref={this.email}  type="text" className="form-control" placeholder="Enter email" />
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-6">
                        <div className="form-group">
                        <label>Address</label>
                        <div className="input-group">
                            <input ref={this.address}  type="text" className="form-control" placeholder="Enter adress" />
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-6">
                        <div className="form-group">
                        <label>Province &nbsp;</label>
                        <select ref={this.province} >
                            <option value="">-- Select a Province --</option>
                            <option value="central">Central</option>
                            <option value="copperbelt">Copperbelt</option>
                            <option value="eastern">Eastern</option>
                            <option value="luapula">Luapula</option>
                            <option value="lusaka">Lusaka</option>
                            <option value="muchinga">Muchinga</option>
                            <option value="north-western">North-Western</option>
                            <option value="northern">Northern</option>
                            <option value="southern">Southern</option>
                            <option value="western">Western</option>
                        </select>
                        </div>
                    </div>
                    <div className="col-xl-4 col-sm-6">
                        <div className="form-group">
                        <label>City/Town &nbsp;</label>
                        <select ref={this.town} onChange={this.setOtherTown}>
                            <option value="">-- Select a city or town --</option>
                            <option value="Lusaka">Lusaka</option>
                            <option value="Ndola">Ndola</option>
                            <option value="Kitwe">Kitwe</option>
                            <option value="Kabwe">Kabwe</option>
                            <option value="Chingola">Chingola</option>
                            <option value="Mufulira">Mufulira</option>
                            <option value="Livingstone">Livingstone</option>
                            <option value="Luanshya">Luanshya</option>
                            <option value="Chipata">Chipata</option>
                            <option value="Chililabombwe">Chililabombwe</option>
                            <option value="Kafue">Kafue</option>
                            <option value="Kalulushi">Kalulushi</option>
                            <option value="Mazabuka">Mazabuka</option>
                            <option value="Mansa">Mansa</option>
                            <option value="Solwezi">Solwezi</option>
                            <option value="Choma">Choma</option>
                            <option value="Mongu">Mongu</option>
                            <option value="Kasama">Kasama</option>
                            <option value="Mpika">Mpika</option>
                            <option value="Sesheke">Sesheke</option>
                            <option value="Kapiri Mposhi">Kapiri Mposhi</option>
                            <option value="Nakonde">Nakonde</option>
                            <option value="Kawambwa">Kawambwa</option>
                            <option value="Petauke">Petauke</option>
                            <option value="Samfya">Samfya</option>
                            <option value="Kalabo">Kalabo</option>
                            <option value="Siavonga">Siavonga</option>
                            <option value="Lundazi">Lundazi</option>
                            <option value="Mwinilunga">Mwinilunga</option>
                            <option value="Kaoma">Kaoma</option>
                            <option value="Chirundu">Chirundu</option>
                            <option value="Kabompo">Kabompo</option>
                            <option value="Isoka">Isoka</option>
                            <option value="Mumbwa">Mumbwa</option>
                            <option value="Monze">Monze</option>
                            <option value="other">Other</option>
                        </select>
                        </div>
                        
                        <div id="other-city-container" style={{ display: 'none' }}>
                            <label htmlFor="other-city-input">Enter the name of the city or town:</label>
                            <input ref={this.otherTown} onChange={this.handleOtherTownSelection} type="text" id="other-city-input" name="otherCity" />
                        </div>
                        <Button disabled={this.state.updating} onClick={this.handleSubmit} variant="contained" component="label">
                              {this.state.submittingText}
                        </Button> 
                        {this.state.errorExists || this.state.updated? this.handleUx() : '' /*this is some basic ux stuff */}
                    </div>            
                    </div>
                </div>
               
                {this.props.userProfile.type !== null? <div className="mb-5">
                    <div className="title mb-4"><span className="fs-18 text-black font-w600">Profile Images</span></div>
                    <div className="row">
                         <ImageUploader 
                            userProfile = {this.state.userProfile}
                            updateRequest={this.updateRequest} 
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            updateProfileImages={this.updateProfileImages}
                            fieldName="profile_thumbnail_image"
                            image={this.imageThumbnail('profile_thumbnail_image')}
                            imageName='Profile Photo'
                            jwt={this.props.jwt}/>
                    </div>
                    <div className="row">
                         <ImageUploader
                            userProfile = {this.state.userProfile}
                            updateRequest={this.updateRequest}  
                            api_url={this.props.api_url}
                            refName={this.state.refName}
                            refId={this.state.profileId}
                            imageName='Cover Photo'
                            updateProfileImages={this.updateProfileImages}
                            fieldName="profile_cover_image"
                            image={this.imageThumbnail('profile_cover_image')}
                            jwt={this.props.jwt}/>
                    </div>
                </div>: ''}
                <div className="mb-4">
                    <div className="title mb-4"><span className="fs-18 text-black font-w600">About me</span></div>
                    <div className="row">
                    <div className="col-xl-12">
                        <div className="form-group">
                        <label>About You</label>
                        <textarea ref={this.about} className="form-control" rows={6} />
                        </div>
                    </div>
                    </div>
                    <Button disabled={this.state.updating} onClick={this.handleSubmit} variant="contained" component="label">
                            {this.state.submittingText}
                    </Button> 
                </div>
                {this.renderDriverForm()}
        </form> )
    }
  }
  
  render() {
    return (
        <div className="container">
            <div className="col-xl-9 col-xxl-8 col-lg-12">
                <div className="row">
                <div className="col-xl-12">
                    <div className="card profile-card">
                    <div className="card-body pt-2">
                        {this.renderForm()}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
   );
}
}

export default ProfileUpdateForm;