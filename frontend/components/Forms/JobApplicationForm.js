import Alert from '@mui/material/Alert';
import Link from 'next/link';
import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { getFCMToken, requestNotificationPermission } from '../Includes/firebase';
import { Checkbox, Chip, FormControlLabel, LinearProgress } from '@mui/material';
import { clientUrl, fakeStr1, fakeStr2, getJwt } from '@/Constants';
import JobsApplicationOffer from './JobsApplicationOffer';

export default class JobApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        submitting: false,
        submittingText: 'Submit Application',
        offerAddText: 'Make An Offer',
        errorExists: false,
        errorMessage: '',
        jobSubmitted: false,
        makeOffer: false,
        offer: null,
        paymentsAcknowledged: false,
        competitiveJobAcknowledged: false,
        offerAcknowledged: false,
        notificationsAllowed: false,
        hideProfileUpdateBtn: true
    };
  }

  async componentDidMount(){
    const token = await getFCMToken() // get existing token
    if(token === null || token === undefined){
      this.setState({
        errorExists: true,
        errorMessage: <><div style={{color:"forestgreen",fontWeight:900}}>You must allow notifications to proceede. Your application won't be submitted unless you do so. If you are using the mobile application, visit the web page by clicking the link below to allow notifications, then come back to the app. And we recomend that you open the web page in a google chrome browser </div><a style={{color:"cadetblue",border:"1px solid cadetblue",display:"inline-block",borderRadius:4,padding:5,marginTop:5,fontWeight:900}} href={clientUrl+"/notifications?jwt="+fakeStr1+getJwt()+fakeStr2+"&uid="+this.props.loggedInUserProfile.id} target="_blank">Allow Notifications</a></>
      },async ()=>{
          const permissionGranted = await requestNotificationPermission();
          if(permissionGranted){
              this.setState({
                notificationsAllowed: true,
                errorExists: false
              },()=>{
                getFCMToken() // upload the token to user's user object
              })
          }
        }) 
    }
    else{
      this.setState({
        notificationsAllowed: true,
        errorExists: false
      })
      getFCMToken() // upload the token again to user's user object, rerun incase the token expired so u regained it
    }
}

  handleSubmit = async (event) => {
    event.preventDefault()
    const user = this.props.loggedInUserProfile // get the job applying user data
    if(user.profile_completion_percentage === null || user.profile_completion_percentage <= 9){
      this.setState({
        errorExists: true,
        hideProfileUpdateBtn: false,
        errorMessage:'Ooops! Sorry, you cannot apply to a job without a phone number added to your profile. Update your profile with at least your first and last name, age, gender and phone number in order to apply to this or any other job.'
      })
      return
    }
    
    if(!this.state.paymentsAcknowledged || !this.state.competitiveJobAcknowledged){
      this.setState({
        errorExists: true,
        hideProfileUpdateBtn: true,
        errorMessage: 'You must click on all the boxes to show that you have acknowledged and agreed to the described Acknowledgements'
       })
      return
    }

    if(this.state.offer !== null && !this.state.offerAcknowledged){
      this.setState({
        errorExists: true,
        hideProfileUpdateBtn: true,
        errorMessage: 'You must click on all the boxes to show that you have acknowledged and agreed to the described Acknowledgements'
       })
      return
    }

    const jobId = this.props.job.data.id
    const JobApplicants = this.props.job.data.attributes.applicants.data
    JobApplicants.push(user.id)
    const jobApplicationObject = {data:{applicants:JobApplicants}}
    // firstly add a job to the jobs backend
    try {
      this.setState({submitting:true,submittingText:'Applying...'})// to disable button from re-requesting
        const updatedJob = await fetch(this.props.api_url+'/jobs/'+jobId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.jwt}`
        },
        body: JSON.stringify(jobApplicationObject)
      })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));


      if (updatedJob) {
        // for now reduce by 0 coz all jobs are paid for with cash
        const applicationPoints = user.driverProfile.application_points - 0 // reduce application points by one, coz you have applied to a job
        const jobs = user.driverProfile.jobs // grab job ids
        const driverProfileId = user.driverProfile.id // get car owner id
        jobs.push(jobId) // push new job id into car owner object
        const driverProfileJobsUpdate = {data:{jobs:  jobs,application_points:applicationPoints}}
        const response = await fetch(this.props.api_url+'/driver-profiles/'+driverProfileId, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.jwt}`
            },
            body: JSON.stringify(driverProfileJobsUpdate),
        });
        if(response.ok){
          console.log('application made')
        //sendNotification('New Applicant',"Your job has a new applicant",parseInt(this.props.job.data.attributes.userid)) // send notification of a new message
          this.setState({submittingText:'submitting application...',jobSubmitted:true})
        }
        
       } 
       else {
         console.error('Failed to submit job:');
       }
    } catch (error) {
       console.error('Error submitting job:', error);
    }
  };

  setOffer = (pay)=>{
       this.setState({
        offer: pay,
        makeOffer: false
       })
  }

  toggleOfferForm = ()=>{
       const makeOffer = this.state.makeOffer
       if(makeOffer){
        this.setState({
          offerAddText: 'Make An Offer',
          makeOffer: false
        })
       }
       else{
        this.setState({
          offerAddText: 'Remove Offer',
          makeOffer: true
        })
       }
  }
  
  handlePaymentAcknowledgement = (e)=>{
         const checked = e.target.checked
         if(checked){
             this.setState({
              errorExists: false,
              paymentsAcknowledged: true
             })
         }
         else{
             this.setState({
              paymentsAcknowledged: false
             })
         }
  }
  handleCompetitiveJobAcknowledged = (e)=>{
    const checked = e.target.checked
    if(checked){
        this.setState({
          errorExists: false,
          competitiveJobAcknowledged: true
        })
    }
    else{
        this.setState({
          competitiveJobAcknowledged: false
        })
    }
}
handleOfferAcknowledgement = (e)=>{
  const checked = e.target.checked
    if(checked){
        this.setState({
          errorExists: false,
          offerAcknowledged: true
        })
    }
    else{
        this.setState({
          offerAcknowledged: false
        })
    }
}

  render() {
    const { error } = this.state;
    return (
      <div style={{marginTop:10}}>
        {this.state.jobSubmitted? <RedirectUser url="payments"/> : ''}
        <div className="post-input">
        {this.state.errorExists && !this.state.submitting? <Alert severity="error" sx={{marginBottom:1}}>{this.state.errorMessage}</Alert>: ''}
        {this.state.errorExists && !this.state.submitting && !this.state.hideProfileUpdateBtn? <><Link href="/profile" className='btn btn-primary' style={{marginTop:10,marginBottom:10}}>Click Here To Update Profile</Link> &nbsp; </> : ''}
          {this.state.submitting? <><LinearProgress color='secondary' sx={{marginBottom:1}}/> <div>please wait...</div></> : ""}
          {!this.state.notificationsAllowed? <></> : <div style={{marginBottom:10}}><button disabled={this.state.submitting} onClick={this.toggleOfferForm} className="btn" style={{border:'2px solid lightgray'}}>{this.state.offerAddText}</button><br/></div>}
          {this.state.makeOffer? <JobsApplicationOffer job={this.props.job} loggedInUserProfile={this.props.loggedInUserProfile} setOffer={this.setOffer}/> : <></>}    
          {this.state.offer !== null? <Chip label={"You have offered to get paid: "+this.state.offer} />: <></>}
          <div>
          <FormControlLabel required control={<Checkbox onChange={this.handlePaymentAcknowledgement}/>} label="I acknowledge that a K10 fee has to be paid immediately after applying to this job in order for my application to be enlisted." />
          <FormControlLabel required control={<Checkbox onChange={this.handleCompetitiveJobAcknowledged}/>} label="I acknowledge and understand that I might or might not get employed on this job regardless of me paying the required fee." />
          {this.state.offer !== null? <FormControlLabel required control={<Checkbox  onChange={this.handleOfferAcknowledgement}/>} label="I have acknowledge and agree that in an event that I get employed, my employer is eligible to use this offer as my payment." /> : <></>}
          </div>
          {!this.state.notificationsAllowed? <button className="btn btn-primary" style={{backgroundColor:'lightgray'}}>Submit Application</button> : <button disabled={this.state.submitting || this.state.makeOffer} onClick={this.handleSubmit} className="btn btn-success">{this.state.submittingText}</button>}
        </div>
      </div>
    );
  }
}



// to redirect the user upon an application being made
function RedirectUser(props){
  const router = useRouter();
  router.push(props.url)
  return <></>
}

