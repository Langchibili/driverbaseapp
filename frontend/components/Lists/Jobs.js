import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';

export default class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       carOwnerProfileNames:{},
       gotToCarOwnerProfile: false,
       carOwnerProfileUri: ''
    }
  }
  jobBody = (body)=>{
    if(body.length > 50) return body.slice(0,50)+'...'
    return body 
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
  
  parseTodayDate = ()=>{
    let toDay = new Date().toString()
    const year = parseInt(toDay[3])
    const month = parseInt(toDay[2])
  }


   getJobNewStatus(dateInput) {
    const newJobStyles = {
      color: '#ffffff', // Text color
      backgroundColor: '#ff5722', // Background color
      padding: '4px 8px', // Padding for the text
      borderRadius: '4px', // Rounded corners
      fontWeight: 'bold', // Bold text
    }
    const jobDate = new Date(dateInput);
    const currentDate = new Date();
    const fiveDaysAgo = new Date(currentDate);
    fiveDaysAgo.setDate(currentDate.getDate() - 5);
  
    if (jobDate >= fiveDaysAgo) {
      return <span style={newJobStyles}>New</span>;
    } else {
      return <></>;
    }
  }

  renderJobStatus(status,dateInput){
       if(status === 'closed'){
         return <><span className='text text-default'>Closed</span></>
       }
       else if(status === 'open'){
         return <><span className='text text-success'>Open</span>&nbsp;{this.getJobNewStatus(dateInput)}</>
       }
       else{
         return <><span className='text text-default'>Closed</span></>
       }
  }

  showLink = (job)=>{
    const selectJobToManage = ()=>{ // pass job to be managed
      this.props.selectJobToManage(job)
    }
    const act = this.props.act
    if(act === 'edit'){
       return <Link href={this.props.loggedInUserProfile !== 'logged-out'? '/jobs_manage?type=edit&jid='+job.id : '/login'} className='btn btn-sm btn-info' onClick={this.props.handlePageChange}>Edit</Link>
    }
    else if(act === 'delete'){
      return <Link href={this.props.loggedInUserProfile !== 'logged-out'? '/jobs_manage?type=delete&jid='+job.id : '/login'} className='btn btn-sm btn-danger' onClick={this.props.handlePageChange}>Delete</Link>
    }
    else if(act === 'manage'){
      return <Button onClick={selectJobToManage}>Manage</Button> 
    }
    return <Link href={this.props.loggedInUserProfile !== 'logged-out'? '/job_application?jid='+job.id : '/login'} className='btn btn-sm btn-danger' onClick={this.props.handlePageChange}>Apply</Link> 
  }
   
  getJobCarOwnersNames = async (jobId,carOwnerProfileNames)=>{
     const carOwnerProfile = await fetch(this.props.api_url+'/jobs/'+jobId+'/?populate=car_owner_profile',{
      headers: {
        'Content-Type': 'application/json'
        }
      }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));

      if('error' in carOwnerProfile){
         return carOwnerProfileNames
      }
      else{
          if(carOwnerProfile.data.attributes.car_owner_profile.data === null) return carOwnerProfileNames
          const carOwner = await fetch(this.props.api_url+'/users/'+carOwnerProfile.data.attributes.car_owner_profile.data.attributes.userid+'?populate=carOwnerProfile,carOwnerProfile.details',{
          headers: {
            'Content-Type': 'application/json'
          }
         }).then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
        //  console.log('the car owner',carOwner)
          if(carOwner.profile_update_percentage <= 5){
            carOwnerProfileNames[jobId] = {
              firstname:'Unknown',
              lastname:'CarOwner'
            }
          }
          carOwnerProfileNames[jobId] = {
            firstname:carOwner.carOwnerProfile.details.firstname, 
            lastname:carOwner.carOwnerProfile.details.lastname
          }
          return carOwnerProfileNames
      }
  }
  componentDidMount(){
    
    async function updateCarOwnerProfileNames(jobs, ctx) { // show car owner names
      let carOwnerProfileNames = {};
      for (const job of jobs) {
        carOwnerProfileNames = await ctx.getJobCarOwnersNames(job.id, carOwnerProfileNames);
      }
      ctx.setState({
        carOwnerProfileNames: carOwnerProfileNames,
      }, () => {
        for (const job of jobs) { // add click events to car owner names
          const carOwnerProfileName = document.getElementById('job-id-'+job.id)
          carOwnerProfileName.style.textTransform = "capitalize"
          carOwnerProfileName.addEventListener('click',()=>{
            console.log(job)
              ctx.setState({
                gotToCarOwnerProfile: true, 
                carOwnerProfileUri: '/profile?uid='+parseInt(job.attributes.userid)+'&user_type=car-owner'
              })
          })
        }
      })
    }
    
    // Usage inside a Next.js method (e.g., a function within your component or a server-side API route)
    // Assuming 'this.props.jobs' contains the list of jobs and 'this' refers to the current context
    updateCarOwnerProfileNames(this.props.jobs, this);
    
  }
  renderJob = ()=> {
    const closedJObDivStyles = {
      backgroundColor: '#f2f2f2', // Use a light gray color
      opacity: 0.5, // Reduce opacity for a more subtle effect
      pointerEvents: 'none', // Disable pointer events on the content
    }; // if job is closed

    const jobs = this.props.jobs
    if(jobs.length === 0) return <p>Jobs Will Show Soon</p>
    return jobs.map((job)=>{
      let carOwnerFirstName
      let carOwnerLastName
      if(job.id in this.state.carOwnerProfileNames){
           carOwnerFirstName = this.state.carOwnerProfileNames[job.id].firstname
           carOwnerLastName = this.state.carOwnerProfileNames[job.id].lastname
           if(carOwnerFirstName === null || carOwnerLastName === null){
              carOwnerFirstName = 'Unknown'
              carOwnerLastName = 'CarOwner'
           }
      }
      else{
        carOwnerFirstName = 'Unknown'
        carOwnerLastName = 'CarOwner'
      }
      const carOwnerName = carOwnerFirstName + ' ' +carOwnerLastName
      return (
          <div key={job.id} style={job.attributes.status !== "open"? closedJObDivStyles: {}}>
            {this.state.gotToCarOwnerProfile? <RedirectUser carOwnerProfileUri={this.state.carOwnerProfileUri}/> : '' /* send a user to a car owner's profile */}
            <ListItem alignItems="flex-start" >
                <ListItemAvatar>
                <Link href={'/jobs?act=show&jid='+job.id} onClick={this.props.handlePageChange}>
                  <Avatar alt="Job" src="/job-icon.png" />
                  </Link>
                </ListItemAvatar>
                <ListItemText
                  id={'job-id-'+job.id}
                  primary={carOwnerName}
                  secondary={
                    <React.Fragment>
                      <Link href={'/jobs?act=show&jid='+job.id} onClick={this.props.handlePageChange}>
                       {this.jobBody(job.attributes.body)+" — "}
                      </Link>
                      <Link href={'/jobs?act=show&jid='+job.id} onClick={this.props.handlePageChange}>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {this.dateCreated(job.attributes.createdAt)}
                        </Typography>
                      </Link>
                      <div><small className="d-block font-w500"> {job.attributes.job_duration || 'fulltime'}: <span style={{color:'forestgreen',fontWeight:900}} className='font-w300'>{job.attributes.pay || "K1500 - K25000"}</span></small></div>
                     {this.renderJobStatus(job.attributes.status,job.attributes.createdAt)}
                    </React.Fragment>
                  }
                />
                
              {this.showLink(job)}
              </ListItem>
              <Divider variant="inset" component="li" />
        </div>
        )
    })
  }

  render() {
    return <div>{this.renderJob()}</div>
  }
}


const RedirectUser = (props)=>{
  const router = useRouter();
  router.push(props.carOwnerProfileUri)
  return <></>
}