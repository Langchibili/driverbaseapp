import React, { Component } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import ImageUploader from './ImageUploader';

class JobsEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: this.props.job.data.attributes,
      title: '',
      jobDuration: '',
      pay: '',
      error: null,
      submitting: false,
      submittingText:'Update',
      loggedInUserProfile: this.props.loggedInUserProfile
    };
  }

  getTitle = (event) => {
    const job = this.state.job
    job.title = event.target.value
    this.setState({ job: job, error: null });
  };
  setPay = (event) => {
    const job = this.state.job
    job.pay = event.target.value
    this.setState({ job: job, error: null });
  };

  handleChange = (event) => {
    const job = this.state.job
    job.body = event.target.value
    this.setState({ job: job, error: null });
  };

  handleFullTimeChange = (event) => {
    const job = this.state.job
    job.job_duration = event.target.value;
    this.setState({ job: job, error: null })
 };

  handleSubmit = async (event) => {
    event.preventDefault()
    const job = this.state.job
    const jobId = this.props.job.data.id // from props cause job has no id
    const jobUpdateObject = {id: jobId, data:job}
    delete job.applicants// remove applicants, not needed here
   
    // firstly add a job to the jobs backend
    try {
        this.setState({submitting:true,submittingText:'Updating...'})// to disable button from re-requesting
        const updatedJob = await fetch(this.props.api_url+'/jobs/'+jobId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.jwt}`
        },
        body: JSON.stringify(jobUpdateObject)
      })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));
      if(updatedJob){
        this.setState({submitting:false,submittingText:'Done'})// to disable button from re-requesting
      }
    }
    catch (error) {
      console.error('Error submitting job:', error);
    }
 }

  render() {
    const { error } = this.state;
    const job = this.state.job
    
    if(this.props.loggedInUserProfile === 'logged-out') window.location = '/login'
    return (
      <div>
        <div className="post-input">
          <input type='text' onChange={this.getTitle} className='form-control sm-transparent' value={job.title || 'untitled'}/>
          <textarea
            name="jobBody"
            id="jobBody"
            cols={30}
            rows={5}
            className="form-control bg-transparent"
            value={job.body}
            onChange={this.handleChange}
          />
          <Select
          sx={{marginBottom:2}}
          labelId="job-duration-simple-select-label"
          id="job-duration-simple-select"
          value={job.job_duration}
          label="job-uration"
          onChange={this.handleFullTimeChange}
        >
          <MenuItem value="fulltime">FullTIme</MenuItem>
          <MenuItem value="part-time">PartTime</MenuItem>
        </Select>
        <input type='text' onChange={this.setPay} className='form-control sm-transparent' placeholder={job.pay}/>
        {/* <ImageUploader  
                  userProfile = {this.state.userProfile} 
                  api_url={this.props.api_url}
                  refName="api::job.job"
                  refId={this.props.job.data.id}
                  imageName='Job Ad Image'
                  fieldName="job_image"
                  image={this.imageThumbnail('nrc_back')}
                  jwt={this.props.jwt}/>  */}
         {error && <div className="text-danger">{error}</div>}
          <button disabled={this.state.submitting} onClick={this.handleSubmit} className="btn btn-primary">{this.state.submittingText}</button>
        </div>
      </div>
    );
  }
}

export default JobsEditForm;

    