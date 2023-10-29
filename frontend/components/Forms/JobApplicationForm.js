import Alert from '@mui/material/Alert';
import Link from 'next/link';
import React, { Component, useReducer } from 'react';
import { useRouter } from 'next/router';

class JobApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        submitting: false,
        submittingText: 'Submit Application',
        errorExists: false,
        errorMessage: '',
        jobSubmitted: false
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const user = this.props.loggedInUserProfile // get the job applying user data
    if(user.profile_completion_percentage === null || user.profile_completion_percentage <= 9){
      this.setState({
        errorExists: true,
        errorMessage:'Ooops! Sorry, you cannot apply to a job without a phone number added to your profile. Update your profile with at least your first and last name, age, gender and phone number in order to apply to this or any other job.'
      })
      return
    }
    const jobId = this.props.job.data.id
    const JobApplicants = this.props.job.data.attributes.applicants.data
    JobApplicants.push(user.id)
    const jobApplicationObject = {data:{applicants:JobApplicants}}
    console.log('these are the applicants',jobApplicationObject)
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
        if(response.ok) console.log('Job submitted successfully!');
        this.setState({submittingText:'Finalizing, please wait...',jobSubmitted:true})
       } 
       else {
         console.error('Failed to submit job:');
       }
    } catch (error) {
       console.error('Error submitting job:', error);
    }
  };

  render() {
    const { error } = this.state;
    return (
      <div style={{marginTop:5}}>
        {this.state.jobSubmitted? <RedirectUser url="payments"/> : ''}
        <div className="post-input">
        {this.state.errorExists? <Alert severity="error">{this.state.errorMessage}</Alert>: ''}
          {this.state.errorExists? <Link href="/profile" className='btn btn-primary' style={{marginTop:10,marginBottom:10}}>Click Here To Update Profile</Link>&nbsp: ''}
          <button disabled={this.state.submitting} onClick={this.handleSubmit} className="btn btn-success">{this.state.submittingText}</button>
          
        </div>
      </div>
    );
  }
}

export default JobApplicationForm;

function RedirectUser(props){
  const router = useRouter();
  router.push(props.url)
  return <></>
}