import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import React from 'react';
import Alert from '@mui/material/Alert'; 
import { useRouter } from 'next/router';
import { api_url, getJwt, getLoggedInUserData, minimal_driver_populate_url } from '@/Constants';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import HtmlHead from '@/components/Meta/HtmlHead';
import HtmlFoot from '@/components/Meta/HtmlFoot';
import { Button } from '@mui/material';


export default function DetailsPage() {
    const router = useRouter();
    const { uid } = router.query
    const [data, setData] = React.useState({ loading: true, loggedInUserProfile: null });
    
    React.useEffect(() => {
      if (uid && uid !== undefined) {
        async function fetchData() {
          const loggedInUserProfile = await getLoggedInUserData() 
          setData({ loading: false, loggedInUserProfile: loggedInUserProfile });
        }
        fetchData();
      }
    }, [uid]);
    if(data.loading  || data.loggedInUserProfile === null) {
        return (<><PageLoader /> <HtmlHead pageTitle='Jobs | Application'/><ContentLoader text='loading job...'/><HtmlFoot/> </>)
    }
    if(data.loggedInUserProfile === 'logged-out' || data.loggedInUserProfile.type === "driver") {
        window.location = '/login' // you should re-log in
        return
    }
    
    return (<>
    <UpAndBackButton/>
    <UnlockDetails uid={uid} loggedInUserProfile={data.loggedInUserProfile}/>
    </>
  )
}

class UnlockDetails extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            enoughPoints: null,
            driverNumber: '',
            goBack: false,
            gotToPointsPage: false,
            errorExists: false
        }
    }
    async componentDidMount(){ //Langson Chibili account to test
        const uid = this.props.uid // the userid who's number we ought to get
        const loggedInUserProfile = this.props.loggedInUserProfile
        console.log(uid,loggedInUserProfile)

        const userProfile = await fetch(api_url+'/users/'+uid+'/?'+minimal_driver_populate_url,{ // get driver's object
            headers: {
              'Content-Type': 'application/json'
            }
           }).then(response => response.json())
            .then(data => data)
            .catch(error => console.error(error));
             
        if('error' in userProfile){
            this.setState({
                 errorExists: true
            })
        }

        if(loggedInUserProfile.carOwnerProfile.job_creation_points < 20){ // check if JCPs are enough for carowner
            this.setState({
                enoughPoints: false
            })
        }
        else{ // if enough, update the JCP first before redirecting user to driver number
            const newJobCreationPoints = loggedInUserProfile.carOwnerProfile.job_creation_points - 20 // reduce JCPs
            const carOwnerProfileId = loggedInUserProfile.carOwnerProfile.id
            const carOwnerProfileJcpUpdate = {id : carOwnerProfileId, data:{job_creation_points:newJobCreationPoints}}
            const updated = await fetch(api_url+'/car-owner-profiles/'+carOwnerProfileId, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getJwt()}`
                    },
                    body: JSON.stringify(carOwnerProfileJcpUpdate),
            })
            if(updated.ok){
                this.setState({
                    enoughPoints: true,
                    driverNumber: userProfile.driverProfile.details.phone_number
                })
            }
        }
    }
    goBack = ()=>{
        this.setState({
            goBack: true
        })
    }
    gotToPointsPage = ()=>{
        this.setState({
            gotToPointsPage: true
        })
    }

    render(){
        if(this.state.goBack)  return <GoBack/>
        if(this.state.gotToPointsPage)  return <RedirectUser url={"/points"}/>
        if(this.state.enoughPoints === null) return <Alert>Processing...</Alert>
        if(this.state.errorExists) {
            return (<div>
                        <Alert severity='error'>An error occured, check your connection, or reflesh page</Alert>
                        <Button onClick={this.goBack}>Go Back</Button>
                    </div>)
        }
        if(!this.state.enoughPoints){ 
            return (<div>
                        <Alert severity='warning'>You don't have enough points to view this driver's number...</Alert>
                        <Button onClick={this.goBack}>Go Back</Button>
                        <Button onClick={this.gotToPointsPage} sx={{color:'red'}}>Buy Points</Button>
                    </div>)
        }
        if(this.state.enoughPoints) return <RedirectUser url={"tel://"+this.state.driverNumber}/>
    }
}

function RedirectUser(props){
    const router = useRouter();
    router.push(props.url)
    return <></>
  }

function GoBack(){
    const router = useRouter();
    router.back()
}