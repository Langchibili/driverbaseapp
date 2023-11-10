import UpAndBackButton from '@/components/Includes/UpAndBackButton';
import React from 'react';
import Alert from '@mui/material/Alert'; 
import { useRouter } from 'next/router';
import { api_url, getJwt, getLoggedInUserData, minimal_driver_populate_url } from '@/Constants';
import PageLoader from '@/components/Includes/PageLoader';
import ContentLoader from '@/components/Includes/ContentLoader';
import HtmlHead from '@/components/Meta/HtmlHead';
import HtmlFoot from '@/components/Meta/HtmlFoot';
import { Button, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import Link from 'next/link';
import ReviewsForm from '@/components/Forms/ReviewsForm';

async function getUserProfile(act,uid,user_type) {
  if(act === "show") return
  let url,userProfile
  if(uid && user_type){ // if queries object empty
    if(user_type === 'driver') url = api_url+'/users/'+uid+'/?populate=user_reviews,driverProfile,driverProfile.details'
    if(user_type === 'car-owner') url = api_url+'/users/'+uid+'/?populate=user_reviews,carOwnerProfile,carOwnerProfile.details'
      userProfile = await fetchData(url);
  }
  if('error' in userProfile) return 'not-found' 
  return userProfile
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

export default function Reviews() {
    const router = useRouter();
    const { act,uid,user_type,name } = router.query
    const [data, setData] = React.useState({ loading: true, loggedInUserProfile: null });
    
    React.useEffect(() => {
      if (act && act !== undefined) {
        async function fetchData() {
          const loggedInUserProfile = await getLoggedInUserData() 
          const userProfile = await getUserProfile(act,uid,user_type)
          setData({ loading: false, userProfile: userProfile, loggedInUserProfile: loggedInUserProfile });
        }
        fetchData();
      }
    }, [act]);
    if(data.loading  || data.loggedInUserProfile === null) {
        return (<><PageLoader /> <HtmlHead pageTitle='User | Reviews'/><ContentLoader text='loading reviews...'/><HtmlFoot/> </>)
    }
    if(data.loggedInUserProfile === 'logged-out') {
      window.location = '/login' // you should re-log in
      return
    }
    // console.log(data.loggedInUserProfile, data.userProfile)
    return (<>
    <UpAndBackButton/>
    {act === "show"?<><HtmlHead pageTitle={name+' | Reviews'}/>
                          <ReviewsDisplay uid={uid} name={name} loggedInUserProfile={data.loggedInUserProfile}/>
                    <HtmlFoot/></> : <><HtmlHead pageTitle='Add | Reviews'/>
                                      <div style={{marginTop:20,padding:10}}><ReviewsForm loggedInUserProfile={data.loggedInUserProfile} userProfile={data.userProfile}/></div>
                                      <HtmlFoot/> </>}
    
    
    </>
  )
}

class ReviewsDisplay extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            enoughPoints: null,
            goBack: false,
            gotToPointsPage: false,
            errorExists: false,
            reviews: []
        }
    }
    async componentDidMount(){ //Langson Chibili account to test
        const uid = this.props.uid // the userid who's number we ought to get
        const loggedInUserProfile = this.props.loggedInUserProfile

        const userProfile = await fetch(api_url+'/users/'+uid+'/?populate=user_reviews',{ // get driver's object
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

        if(loggedInUserProfile.type === "driver"){
            if(loggedInUserProfile.driverProfile.application_points < 5){ // check if JCPs are enough for carowner
              this.setState({
                  enoughPoints: false
              })
            }
            else{ // if enough, update the JCP first before redirecting user to driver number
                const newApplicationPoints = loggedInUserProfile.driverProfile.application_points - 5 // reduce JCPs
                const driverProfileId = loggedInUserProfile.driverProfile.id
                const driverProfileJAPUpdate = {id : driverProfileId, data:{application_points:newApplicationPoints}}
                const updated = await fetch(api_url+'/driver-profiles/'+driverProfileId, {
                        method: 'PUT',
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getJwt()}`
                        },
                        body: JSON.stringify(driverProfileJAPUpdate),
                })
                if(updated.ok){
                    this.setState({
                        enoughPoints: true,
                        reviews: userProfile.user_reviews
                    })
                }
            }
        }
        else if(loggedInUserProfile.type === "car-owner"){
           if(loggedInUserProfile.carOwnerProfile.job_creation_points < 5){ // check if JCPs are enough for carowner
              this.setState({
                  enoughPoints: false
              })
            }
            else{ // if enough, update the JCP first before redirecting user to driver number
                const newJobCreationPoints = loggedInUserProfile.carOwnerProfile.job_creation_points - 5 // reduce JCPs
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
                        reviews: userProfile.user_reviews
                    })
                }
            }
        }
        else{
          return;
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
    
    renderReviews = (reviews)=>{
        return reviews.map((review)=> <Review key={review.id} review={review}/> )
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
                        <Alert severity='warning'>You don't have enough points to view this user's reviews...</Alert>
                        <Button onClick={this.goBack}>Go Back</Button>
                        <Button onClick={this.gotToPointsPage} sx={{color:'red'}}>Buy Points</Button>
                    </div>)
        }
        if(this.state.enoughPoints) return (<> 
              <div style={{width:'100%',textAlign:'center'}}>
                  <h3>Reviews for: {this.props.name}</h3>
                  <Alert severity='info' sx={{maxWidth:500,margin:"0 auto"}}>Note that viewing these reviews has cost you 5 points</Alert>
              </div>
              {this.renderReviews(this.state.reviews)}</>)
    }
}

class Review extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        reviewerPath: null
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

  async componentDidMount(){
      const userProfile = await fetch(api_url+'/users/'+parseInt(this.props.review.userid),{ // get driver's object
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error));
        
      if('error' in userProfile){
          return
      }
      else{
        this.setState({
          reviewerPath: ()=> <Link style={{color:'blue'}} href={'/profile?uid='+userProfile.id+'&user_type='+userProfile.type}>Reviewer's Profile</Link>
        })
      }
  }
  render(){
    const review  = this.props.review
    return (
         <div style={{width:'100%',textAlign:'center'}}>
         <div><Typography component="legend">{review.review_body}</Typography></div>
         <div><Typography component="legend">{this.dateCreated(review.createdAt)}</Typography></div>
         <div><Typography component="legend">{review.rating} stars rating</Typography></div>
         <div><Rating name="read-only" value={review.rating} readOnly /></div>
         <>{this.state.reviewerPath !== null? this.state.reviewerPath() : <></>}</>
        <hr/>
         </div>
    )
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