import React from 'react';
import { useRouter } from 'next/router';
import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import JobApplicationForm from '@/components/Forms/JobApplicationForm';
import { api_url,getJwt } from '@/Constants';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import JobsEditForm from '@/components/Forms/JobsEditForm';
import JobDeleteForm from '@/components/Forms/JobDeleteForm';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import Alert from '@mui/material/Alert'; 

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

function showForm(type,data){
    if(type==='edit'){
        return <JobsEditForm
            jwt={getJwt()}
            api_url={api_url} 
            job={data.job} 
            loggedInUserProfile={data.loggedInUserProfile} />
    }
    else if(type==='delete'){
        return <JobDeleteForm
            jwt={getJwt()}
            api_url={api_url} 
            job={data.job} 
            loggedInUserProfile={data.loggedInUserProfile} />
    }
} 

export default function jobs_manage(props) {
    const router = useRouter()
    const { type,jid } = router.query
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
    
    if (data.loggedInUserProfile === 'logged-out') window.location = '/login' // you should re-log in

    if (data.loading || data.job === null || data.loggedInUserProfile === null) {
        return (<><PageLoader /> <HtmlHead pageTitle='Jobs | Application'/><ContentLoader text='loading job...'/><HtmlFoot/> </>)
    }
    else{
        //const applicants = job.applicants
        if(data.loggedInUserProfile.type === 'driver'){
          return (<> <HtmlHead pageTitle='Jobs | Application'/><UpAndBackButton/><Alert severity="error">Only Employers, such as CarOwners Have Jobs</Alert> <HtmlFoot/> </>)
        }
        if(data.job === 'not-found'){
            return (<> <HtmlHead pageTitle='Jobs | Application'/><UpAndBackButton/><Alert severity="error">The Job You Are Looking For Doesn't Exist. It could be that the owner closed it or it got cancelled.</Alert> <HtmlFoot/> </>)
        }
        // if(data.loggedInUserProfile.driverProfile.application_points <= 0){
        //     return (<> <HtmlHead pageTitle='Jobs | Application'/><div>You Have No Application Points To Apply To This or any other job, get your account verified or subscribe as a premium user to be able to apply to more jobs.</div> <HtmlFoot/> </>)
        // }
        
        return (
         <>
            <HtmlHead pageTitle='Jobs | Application'/>
            <UpAndBackButton/>
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-6">
                        <div className="row no-gutters">
                            <div className="col-xl-12" >
                               {showForm(type,data)}
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
