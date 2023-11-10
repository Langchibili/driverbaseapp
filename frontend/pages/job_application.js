import React, { Component } from 'react';
import { useRouter } from 'next/router';
import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import JobApplicationForm from '@/components/Forms/JobApplicationForm';
import { api_url,getJwt } from '@/Constants';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import Alert from '@mui/material/Alert';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Link from 'next/link';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';


function checkIfHasAppliedBefore(job,user){
         const jobId = job.data.id
         const jobs = user.driverProfile.jobs
         if(jobs.length === 0 || jobs === null){
            return false // this means u haven't applied for anything
         }
         const jobFound = jobs.filter((job)=>{ // check for job in users applied to jobs
                return job.id === jobId
         })
         if(jobFound.length >= 1) return true
         return false // means u have applied before
}

async function getJob(jid) {
    let job
    if(jid){ // this is mainly for purposes of applying to a job not making a job
       job = await fetchData(api_url+'/jobs/'+jid+'/?populate=applicants');
    }
    if('error' in job) return 'not-found' 
    return job // return data as props object
}

async function fetchData(url){
    return fetch(url,{
      headers: {
        'Content-Type': 'application/json'
      }
     }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));
  }

async function getLoggedInUserData(){ 
    if(getJwt() === null) return 'logged-out' // you are looged out
    const user = await fetch(api_url+'/users/me?populate=driverProfile,driverProfile.jobs',{
    headers: {
    'Authorization': `Bearer ${getJwt()}`,
    'Content-Type': 'application/json'
    }
    }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
      return user
}


export default function jobs_application(props) {
    const router = useRouter()
    const { jid } = router.query
    const [data, setData] = React.useState({ loading: true, job: null, loggedInUserProfile: null });
    
    React.useEffect(() => {
      if (jid && jid !== undefined) {
        async function fetchData() {
          const job = await getJob(jid)
          const loggedInUserProfile = await getLoggedInUserData() 
          setData({ loading: false, job: job, loggedInUserProfile: loggedInUserProfile });
        }
        fetchData();
      }
    }, [jid]);
    
    if (data.loggedInUserProfile === 'logged-out') { 
      window.location = '/login' // you should re-log in
      return
    }

    if (data.loading || data.job === null || data.loggedInUserProfile === null) {
        return (<><PageLoader /> <HtmlHead pageTitle='Jobs | Application'/><ContentLoader text='loading job...'/><HtmlFoot/> </>)
    }
    else{
        //const applicants = job.applicants
        if(data.loggedInUserProfile.type !== 'driver'){
          return (<> <HtmlHead pageTitle='Jobs | Application'/>
                        <UpAndBackButton/>
                        <div style={{maxWidth:500,margin:'auto'}}><Alert severity="info">Only Workers, such as Drivers Can Apply To Jobs!</Alert></div> 
                        <div style={{maxWidth:100,textAlign:'center',margin:'auto'}}><KeyboardDoubleArrowDownIcon color='primary'/></div>
                        <div style={{margin:10,textAlign:'center'}}><Link href="/signup" className="btn btn-primary light btn-rounded me-auto">You Can SingUp For A Driver Account</Link></div>
                        <div style={{margin:10,textAlign:'center'}}><Link href="/login" className="btn btn-primary light btn-rounded me-auto">Or Login Into an Existing Driver Account</Link></div>
                     <HtmlFoot/> </>)
        }
        if(data.job === 'not-found'){
            return (<> <HtmlHead pageTitle='Jobs | Application'/>
                         <UpAndBackButton/>
                         <Alert severity="warning">The Job You Are Looking For Doesn't Exist. It could be that the owner closed it or it got cancelled.</Alert> 
                       <HtmlFoot/> </>)
        }
        if(checkIfHasAppliedBefore(data.job, data.loggedInUserProfile)) return <Alert severity="error"><UpAndBackButton />You have already applied to this Job</Alert>
        // if(data.loggedInUserProfile.driverProfile.application_points < 2){ 
        //     return (<> <HtmlHead pageTitle='Jobs | Application'/>
        //                  <UpAndBackButton/> 
        //                  <div><Alert severity="error">You Have No Application Points To Apply To This or any other job, get your account verified or subscribe as a premium user to be able to apply to more jobs.</Alert> <Link className="mt-2 btn btn-success" href="/points">Buy Points</Link></div>
        //                 <HtmlFoot/> </>)
        // }  // AT the moment, all users can apply without points, because are paid for with a fee
        
        return (
         <> 
            <HtmlHead pageTitle='Jobs | Application'/>
            <UpAndBackButton/>
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-6">
                        <div className="row no-gutters">
                            <div className="col-xl-12" >
                               <Alert severity="info">
                                Before You apply, make sure you have updated your profile enough to stand out from other applicants when the job owner views your profile.
                                {/* And note that when you apply to this job, your Job Application Points(JAPs) will reduce by one */}
                                </Alert>

                               <div style={{marginTop:5, textAlign: 'center'}}><Alert severity="warning">Are You Sure You Want To Apply To This Job?</Alert>
                                    <JobApplicationForm 
                                        jwt={getJwt()}
                                        api_url={api_url} 
                                        job={data.job} 
                                        loggedInUserProfile={data.loggedInUserProfile} />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            <HtmlFoot/>
            </>   
        )
     }
}
