import React, { Component } from 'react';
import { api_url, getJwt, textHasEmailAddress, textHasPhoneNumber } from '@/Constants';
import { Alert } from '@mui/material';

export default class JobsApplicationOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverLetter: '',
      newOffer: null,
      pay:'',
      error: null,
      submitting: false,
      submittingText:'Add Offer',
      loggedInUserProfile: this.props.loggedInUserProfile
    };
  }

  setPay = (event) => {
    this.setState({ pay: event.target.value, error: null });
  };

  handleChange = (event) => {
    this.setState({ coverLetter: event.target.value, error: null });
  };

   // add a new job to the user(car-owner) jobs array
 updateUserAndJObWIthNewOffer = async (user,newOffer)=>{
     const driverProfileId = user.driverProfile.id // get driverprofile id
     const jobOfferObject = { data:{job_applications: {connect: [newOffer.data.id]} }}
     await fetch(api_url+'/driver-profiles/'+driverProfileId, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getJwt()}`
            },
            body: JSON.stringify(jobOfferObject),
     })
     return await fetch(api_url+'/jobs/'+this.props.job.data.id, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getJwt()}`
            },
            body: JSON.stringify(jobOfferObject),
     })
  }
  handleSubmit = async (event) => {
    event.preventDefault()
    const coverLetter = this.state.coverLetter;
    const pay = this.state.pay;
    const user = this.state.loggedInUserProfile // get the job creating user data
    const initialPay = parseInt(this.props.job.data.attributes.pay.replace(/[a-zA-Z]/g, ''))

    if(pay.length === 0){
      this.setState({
        error: "Add An Amount You Are Offering To Be Paid."
      })
      return
    } 

    if(parseInt(pay.replace(/[a-zA-Z]/g, '')) < (initialPay * 0.75) || parseInt(pay.replace(/[a-zA-Z]/g, '')) > initialPay){
      this.setState({
        error: "Add An Offer Within the Range Of "+initialPay * 0.75+" and "+initialPay // already parsed into number, the initialPay variable
      })
      return
    } 

    if(textHasPhoneNumber(coverLetter)){
      this.setState({
        error: "You cannot add a phone number into the Cover LLetter. Please remove the phone number to add the offer."
      })
      return
    } 

    if(textHasEmailAddress(coverLetter)){
      this.setState({
        error: "You cannot add an email address into the Cover Letter. Please remove the email address to add the offer."
      })
      return
    }

    const offerObject = {
      data: {
        cover_letter: coverLetter,
        payment_offer: pay,
        driver_profile : user.driverProfile.id,
        job: this.props.job.data.id,
        jobId: this.props.job.data.id,
        driverProfileId: user.driverProfile.id
      }
    }
   
    // firstly add a job to the jobs backend
    try {
        this.setState({submitting:true,submittingText:'Adding Offer...'}) // to disable button from re-requesting
        const newOffer = await fetch(api_url+'/job-applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`
        },
        body: JSON.stringify(offerObject)
      })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));


      if (newOffer) {
        const response = await this.updateUserAndJObWIthNewOffer(user,newOffer) // update user object
        if(response.ok) console.log('Job offer submitted successfully!')
        
        this.setState({newOffer:newOffer,submittingText:'Done'})// to disable button from re-requesting
        this.props.setOffer(pay)
      } else {
        console.error('Failed to submit offer:');
      }
    } catch (error) {
       console.error('Error submitting offer:', error);
    }
  };
  
  

  render() {
    const { error } = this.state;
    const pay = this.props.job.data.attributes.pay
    if(this.props.job.data.attributes.pay === "K2500 to K5000") return <Alert severity='warning'>You cannot add an offer to this job. It has no fixed price set to it.</Alert>
    if(!parseInt(this.props.job.data.attributes.pay.replace(/[a-zA-Z]/g, ''))) return <Alert severity='warning'>You cannot add an offer to this job. It has no fixed price set to it.</Alert>
    return (
      <div>
        <div className="post-input">
          <div className='text' id="demo-simple-select-label"><strong><p>This job's owner offers to pay: <span className='text text-success'>{pay}</span></p></strong></div>
          <div id="demo-simple-select-label" className='text'><strong><span className='text text-primary'>How much are you willing to be paid for this job?</span> <br/> <span>Make your offer within the range of <span className='text text-success'>{parseInt(pay.replace(/[a-zA-Z]/g, '')) * 0.75 }</span> to <span className='text text-success'>{pay}</span></span></strong></div>
          <div id="demo-simple-select-label" className='text'><small><small className='text text-info'>Tip:</small> Make a lower offer than {pay} in order to stand a higher chance of getting the job</small></div>
          <input type='text' onChange={this.setPay} className='form-control sm-transparent' placeholder='Your Offer Of Pay'/>
          <div id="demo-simple-select-label" className='text'><strong><p className='text text-primary'>Why should this job owner choose you for this job? (Optional) </p></strong></div>
          <div id="demo-simple-select-label" className='text'><small><small className='text text-info'>Tip:</small> Add some experience you have on this job type, and how much value you can provide if you were selected beyond everyone else, in order to stand a higher chance of getting the job, make sure you write a very good and short cover letter.</small></div>
          <textarea
            name="jobBody"
            id="jobBody"
            cols={50}
            rows={5}
            className="form-control"
            placeholder="Add A Cover Letter...(optional)"
            onChange={this.handleChange}
          />
          {error !== null && <div className="text-warning" style={{marginBottom:'5px'}}>{error}</div>}
           <button disabled={this.state.submitting} onClick={this.handleSubmit} className="btn btn-primary">{this.state.submittingText}</button>
        </div>
      </div>
    )
  }
}
