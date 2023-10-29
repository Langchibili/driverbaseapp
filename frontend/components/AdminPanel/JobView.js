import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Alert from '@mui/material/Alert'; 
import { api_url, imageUrlFormat, minimal_car_owner_populate_url, minimal_driver_populate_url } from '@/Constants';
import List from '../Lists/List';
import ContentLoader from '../Includes/ContentLoader';

export default class JobView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requesting: true,
      submitting: false,
      applicants:[],
      premiumApplicants:[],
      activatedApplicants:[],
      activatedApplicantIds : [],
      premiumApplicantIds: [],
      carOwner: null,
      carOwnerProfile: null,
      carOwnerId: null,
      job: null,
      noCarOwner: false
    }
  }
  dateCreated = (dateInput)=>{
     let date = new Date(dateInput)
     date = date.toLocaleString('en-US',{timeZone:'Africa/Harare'})
     date = new Date(date)
     let datePart = date.toDateString()
     let timePart = date.toTimeString()
     timePart = timePart.split(':')
     return datePart+' '+timePart[0]+ ':'+ timePart[1]
  }
  

  getJob = async (jid)=> {
    return fetch(api_url+'/jobs/'+jid+'/?populate=applicants,premium_applicants,activated_applicants',{
        headers: {
          'Content-Type': 'application/json'
        }
       }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error));
  }

  getCarOwner = async (jid)=> {
      return fetch(api_url+'/jobs/'+jid+'/?populate=car_owner_profile',{
          headers: {
            'Content-Type': 'application/json'
          }
         }).then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error));
  }

  getCarOwnerProfile = async (profileId)=> {
    return fetch(api_url+'/car-owner-profiles/'+profileId+'/'+minimal_car_owner_populate_url,{
        headers: {
          'Content-Type': 'application/json'
        }
       }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error));
}
     
  getApplicants = async (uid)=> {
    return fetch(api_url+'/users/'+uid+'/?'+minimal_driver_populate_url,{
        headers: {
          'Content-Type': 'application/json'
        }
       }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error));
    }

 async componentDidMount(){
    const jid  = this.props.jid
    let job = await this.getJob(jid) // get job then... 
    job = job.data.attributes
    this.setState({
        job:job
    },async ()=>{
      const carOwner = await this.getCarOwner(jid) // get carowner
      if(carOwner.data.attributes.car_owner_profile.data === null) {
        this.setState({
          noCarOwner: true,
          requesting: false
        })
        return
      }
      const carOwnerProfile = await this.getCarOwnerProfile(carOwner.data.attributes.car_owner_profile.data.id) // get the carowner profile details
      this.setState({ // get care owner, from which get the carownerprofile and then the applicants and use the userid to get the users and display em
        carOwner: carOwner,
        carOwnerProfile: carOwnerProfile.data.attributes.details,
        carOwnerId: parseInt(carOwner.data.attributes.userid)
      }, async () => { // get the users, use promise.all to furfill the array of promises that are returned
            let applicants = await Promise.all(job.applicants.data.map(async (applicant) => {
              return await this.getApplicants(applicant.attributes.userid);
            })) 
            const premiumApplicants = await Promise.all(job.premium_applicants.data.map(async (premiumApplicant) => {
              return await this.getApplicants(premiumApplicant.attributes.userid);
            }))
            const activatedApplicants = await Promise.all(job.activated_applicants.data.map(async (activatedApplicant) => {
              return await this.getApplicants(activatedApplicant.attributes.userid);
            }))
          
            this.setState({
              applicants: applicants, 
              premiumApplicants: premiumApplicants,
              activatedApplicants: activatedApplicants,
              requesting: false
            },()=>{
                // Create an array of userids from premiumApplicants and activatedApplicants
                const premiumApplicantIds = this.state.premiumApplicants.map(applicant => { 
                    if(applicant === undefined) return
                    if(applicant === null) return
                    if(applicant.type === 'car-owner') return // applicant cannot be a car-owner 
                    if(applicant.driverProfile === undefined) return
                    if(applicant.driverProfile === null) return 
                    if(applicant.driverProfile.details === undefined) return 
                    if(applicant.driverProfile.details === null) return 
                    return applicant.driverProfile.id
                }) 
                const activatedApplicantIds = this.state.activatedApplicants.map(applicant => { 
                    if(applicant === undefined) return
                    if(applicant === null) return
                    if(applicant.type === 'car-owner') return // applicant cannot be a car-owner 
                    if(applicant.driverProfile === undefined) return
                    if(applicant.driverProfile === null) return 
                    if(applicant.driverProfile.details === undefined) return 
                    if(applicant.driverProfile.details === null) return 
                    return applicant.driverProfile.id
                })
                let applicants = this.state.applicants
                // Filter the applicants and keep only those whose userid is not in premiumUserIds or activatedUserIds
                const filteredApplicants = applicants.filter(applicant => {
                    if(applicant === undefined) return
                    if(applicant === null) return
                    if(applicant.type === 'car-owner') return // applicant cannot be a car-owner 
                    if(applicant.driverProfile === undefined) return
                    if(applicant.driverProfile === null) return 
                    if(applicant.driverProfile.details === undefined) return 
                    if(applicant.driverProfile.details === null) return 
                    return !premiumApplicantIds.includes(applicant.driverProfile.id) && !activatedApplicantIds.includes(applicant.driverProfile.id)
                })
                this.setState({
                    applicants: filteredApplicants,
                    activatedApplicantIds: activatedApplicantIds,
                    premiumApplicantIds: premiumApplicantIds
                },()=>{
                    this.forceUpdate()
                })
            })
      })
    })
    
 }

 enListDriver = async (userId)=>{
    if(this.state.premiumApplicantIds.includes(userId)) return
    const jobId = this.props.jid
    let activatedApplicants = this.state.activatedApplicantIds
    activatedApplicants.push(userId)
    activatedApplicants = activatedApplicants.filter((applicant)=>{ // removing undefined ids
        if(applicant === undefined) return false
        if(applicant === null) return false
        return true
    })
    const jobActivationObject = {
        data:{
           activated_applicants:{ connect: activatedApplicants }
        }
    }
    
    this.setState({submitting:true,submittingText:'Activating...'})// to disable button from re-requesting
    const updatedJob = await fetch(api_url+'/jobs/'+jobId, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.jwt}`
    },
    body: JSON.stringify(jobActivationObject)
    })
    if(updatedJob.ok){
        this.setState({
            submitting: false
        })
    }
 }
 enlistDriverAsRecommended = async (userId)=>{
    if(this.state.activatedApplicantIds.includes(userId)) return
    const jobId = this.props.jid
    let premiumApplicants = this.state.premiumApplicantIds
    premiumApplicants.push(userId)
    premiumApplicants = premiumApplicants.filter((applicant)=>{ // removing undefined ids+
        if(applicant === undefined) return false
        if(applicant === null) return false
        return true
    })
    const jobActivationObject = { 
            data:{
                premium_applicants:{ connect: premiumApplicants  }
           }
    }
    this.setState({submitting:true,submittingText:'Activating...'})// to disable button from re-requesting
    const updatedJob = await fetch(api_url+'/jobs/'+jobId, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.jwt}`
    },
    body: JSON.stringify(jobActivationObject)
    })
    if(updatedJob.ok){
        this.setState({
            submitting: false
        })
    }
 }

 renderApplicants = ()=>{
      return (<>
               {this.state.premiumApplicants.length >= 1?
              <List
              loggedInUserProfile={this.props.loggedInUserProfile}
              handlePageChange={this.props.handlePageChange}
              itemsName ='users'
              items={this.state.premiumApplicants}
              api_url={api_url}
              listType='drivers' 
              hideViewMoreButton={true}
              listTitle='Recommended Drivers' /> : <></>}
               
              {this.state.activatedApplicants.length >= 1?
              <List
              loggedInUserProfile={this.props.loggedInUserProfile}
              handlePageChange={this.props.handlePageChange}
              itemsName ='users'
              items={this.state.activatedApplicants}
              api_url={api_url}
              listType='drivers' 
              hideViewMoreButton={true}
              listTitle='Activated Applicants' />: <></>} 

            {this.state.applicants.length >= 1? <List
              loggedInUserProfile={this.props.loggedInUserProfile}
              handlePageChange={this.props.handlePageChange}
              itemsName ='users'
              items={this.state.applicants}
              api_url={api_url}
              listType='drivers'
              hideViewMoreButton={true}
              actionTotake="activate"
              enlistDriver={this.enListDriver}
              submitting={this.state.submitting}
              enlistDriverAsRecommended={this.enlistDriverAsRecommended}
              listTitle='Inactivated Applicants' /> : <Alert severity="info" sx={{marginBottom:2}}>No Inactivated applicants to this job yet</Alert>}    
        </>)    
 }

  render() {
    if(this.state.requesting) return <ContentLoader text='loading job...'/>
    if(this.state.noCarOwner) return <Alert severity="warning">The Job You Are Looking For Either Doesn't Exist Or The Owner Has Drafted It.</Alert>
    const job = this.state.job
    const carOwnerProfile = this.state.carOwnerProfile
    const rating = carOwnerProfile.average_rating? carOwnerProfile.average_rating : ''
    let thumbnail,thumbnailUrl // to be filled later
    // the thumbnail stuff
     const backEndUrl = api_url.replace('driverbase.app/api','driverbase.app')
    if(carOwnerProfile.profile_thumbnail_image.data === null) { 
      thumbnail = '/default-profile.png' 
    }
    else{
      thumbnailUrl = imageUrlFormat(carOwnerProfile.profile_thumbnail_image.data.attributes,'thumbnail')
    }
    thumbnail = backEndUrl+thumbnailUrl
   return(<div>
        <div className="card shadow">
            <div className="card-body">
              <div className="media">
                <div className="media-body">
                    <Link href={'/profile?uid='+this.state.carOwnerId+'&user_type=car-owner'}>
                    <p className="mb-1" style={{textTransform:'capitalize'}}>{carOwnerProfile.firstname + ' ' + carOwnerProfile.lastname}</p>
                    </Link>
                    <h4 className="fs-20">{carOwnerProfile.verified? <strong><span className="text-green">Verified&#x2714; </span></strong>: <span className="text-orange">unverified</span>}</h4></div>
                    <Link href={'/profile?uid='+this.state.carOwnerId+'&user_type=car-owner'}><img src={thumbnail} alt='image' style={{width:60,height:60}}/></Link>
                </div>
                 <div><small className="d-block font-w500"> Pays: <span style={{color:'forestgreen',fontWeight:900}} className='font-w300'>{job.pay || "K1500 - K25000"}</span></small></div>
                 <p className="fs-14">JOB ID: {this.props.jid}</p>
                 <div style={{height:1,backgroundColor:'lightgray',opacity:0.5}} className='mt-1 mb-2'></div>{/* line break */}
                 <p className="fs-14">{job.body}</p>
                </div>
             
        </div>
        {this.renderApplicants()}
    </div>)
  }
}