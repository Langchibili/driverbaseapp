import React from 'react';
import HtmlHead from '@/components/Meta/HtmlHead'
import HtmlFoot from '@/components/Meta/HtmlFoot'
import JobsAddForm from '@/components/Forms/JobsAddForm';
import ItemListAll from '@/components/Lists/ItemListAll';
import { api_url,getJwt, getLoggedInUserData } from '@/Constants';
import { useRouter } from 'next/router';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import JobView from '@/components/Includes/JobView';
import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import Alert from '@mui/material/Alert'; 
import Link from 'next/link';

function renderJobView(act,data,jid){
  if(act === 'show'){
    return <JobView 
              jid={jid} 
              api_url={api_url} 
              jwt={getJwt()} 
              loggedInUserProfile={data.loggedInUserProfile} />
  }
  else if(act === 'show-all'){
    return <ItemListAll
        loggedInUserProfile={data.loggedInUserProfile}
        itemsName='jobs'
        listType='jobs'
        listTitle='Jobs Available'
        act='show-all'
        api_url={api_url}
         />
  }
  else if(act === 'edit' || act === 'delete'){
    if(data.loggedInUserProfile === undefined) return <Alert severity="info">Nothing to show here</Alert>
    if('carOwnerProfile' in data.loggedInUserProfile){
        return <ItemListAll
        loggedInUserProfile={data.loggedInUserProfile}
        itemsName='jobs'
        listType='jobs'
        listTitle='Jobs Available'
        act={act}
        api_url={api_url}
        reqUrlPath={'/car-owner-profiles/'+data.loggedInUserProfile.carOwnerProfile.id+'?populate=jobs'}
        />
      }
      else{
          return <Alert severity="error">Your Profile Isn't updated enough</Alert>
      }
  }
  else if(act === 'add'){
    if(data.loggedInUserProfile === undefined) return <Alert severity="info"> Nothing to show here</Alert>
    if('carOwnerProfile' in data.loggedInUserProfile){
        const jobCreationPoints = data.loggedInUserProfile.carOwnerProfile.job_creation_points 
        if(jobCreationPoints < 5){
          let tip = ''
          if(data.loggedInUserProfile.profile_completion_percentage < 75) tip = ', Or try Updating your profile with more details to Earn free points'
          if(data.loggedInUserProfile.profile_completion_percentage === 75) tip = ', Or try verifying your account to Earn 20 free points!'
          return (<div><Alert severity="error">You have insuficient job creation points to post a job. Please buy more{tip}</Alert> <Link className="mt-2 btn btn-success" href="/points">Buy Points</Link></div>)
        }
        return <JobsAddForm loggedInUserProfile={data.loggedInUserProfile} api_url={api_url} jwt={getJwt()}/>
    }
   }
}

export default function jobs(props) {
    const router = useRouter();
    const { uid, act, jid } = router.query;
    const [data, setData] = React.useState({loading: true, loggedInUserProfile: null});
    
    // set loggedin user data state
      React.useEffect(() => {
        if(act === 'add' || act === 'edit' || act === 'delete' || act === 'show' || act === 'show-all'){ 
          async function fetchData() {
            const loggedInUserProfile = await getLoggedInUserData({carOwnerProfile: ',carOwnerProfile.jobs', driverProfile: ',driverProfile.jobs'}) 
            console.log('logged in user from source>',data.loggedInUserProfile)
            setData({ loading: false, loggedInUserProfile: loggedInUserProfile });
          }
          fetchData();
        } 
      }, [act]);
    
    
   // if (data.loggedInUserProfile === 'logged-out') window.location = '/login' // you should re-log in
    
    if (data.loading || data.loggedInUserProfile === null) {
        return (<> <PageLoader /><HtmlHead pageTitle='Jobs'/><ContentLoader text='loading...'/> <HtmlFoot/> </>)
    }
    
    else{
        if(act === 'add' && data.loggedInUserProfile.type !== 'car-owner'){
          return (<> <HtmlHead pageTitle='Jobs'/><UpAndBackButton/><Alert severity="info">Only Employers, such as Car Owners Can Create Jobs</Alert> <HtmlFoot/> </>)
        }
        return (
         <>
            <HtmlHead pageTitle='Jobs'/>
            <UpAndBackButton/>
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-6">
                        <div className="row no-gutters">
                            <div className="col-xl-12" style={{marginTop:10}}>
                                {renderJobView(act,data,jid)}
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
