import React, { Component } from 'react';
import RatingForm from './RatingForm';
import { api_url, getJwt, textHasEmailAddress, textHasPhoneNumber } from '@/Constants';
import { Alert } from '@mui/material';

class ReviewsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewBody: '',
      rating: 0,
      error: null,
      submitting: false,
      submittingText: 'Post',
      alreadyReviewed: false,
      userProfile: this.props.userProfile
    };
  }

  getRating = (rating) => {
    this.setState({ rating: rating, error: null });
  };

  handleChange = (event) => {
    this.setState({ reviewBody: event.target.value, error: null });
  };

  avgRating = (ratingsArray) =>{
    if (!Array.isArray(ratingsArray) || ratingsArray.length === 0) return 0;  
    const sum = ratingsArray.reduce((total, num) => total + num, 0);
    const average = sum / ratingsArray.length;
    return parseFloat(average.toFixed(1)); 
  }
  checkIfHasBeenReviewedBefore = (user_reviews)=>{
    const loggedInUserProfile = this.props.loggedInUserProfile
    if(user_reviews === null || user_reviews.length === 0){
      return false // this means u have no reviews whatsoever
    }
    const reviewFound = user_reviews.filter((review)=>{ // check for job in users applied to jobs
            return parseInt(review.userid) === loggedInUserProfile.id
    })
    if(reviewFound.length >= 1) return true
    return false // means u have reviewd user before
  }

   // add a new review to the user reviews array
 updateUserWIthNewReview = async (newReview,userProfile)=>{
     const user = this.state.userProfile 
     const review = newReview.data.attributes // get review data
     review.id = newReview.data.id // add review id
     user.user_reviews.push(review) // update old user_reviews object
     const updatedUser =  await fetch(api_url+'/users/'+user.id, {
     method: 'PUT',
     headers: {
      'Content-Type': 'application/json',
     Authorization: `Bearer ${getJwt()}`
     },
     body: JSON.stringify(user),
   });
   
   const ratingsUpdateUrl = user.type === 'driver'? api_url+'/driver-profiles/'+userProfile.id : api_url+'/car-owner-profiles/'+userProfile.id  
   const ratingsUpdate = {id: userProfile.id, data:{details: userProfile.details}}
   return await fetch(ratingsUpdateUrl, {
    method: 'PUT',
    headers: {
     'Content-Type': 'application/json',
    Authorization: `Bearer ${getJwt()}`
    },
    body: JSON.stringify(ratingsUpdate),
  });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { reviewBody, rating } = this.state;
    const  userid  = this.props.loggedInUserProfile.id;
    
    if (!reviewBody) {
      this.setState({ error: "Write something about the user, Eg, 'Good employee'" });
      return
    }
    if(textHasPhoneNumber(reviewBody)){
      this.setState({
        error: "You cannot add a phone number into the review. Please remove the phone number to post the review."
      })
      return
    }
    if(textHasEmailAddress(reviewBody)){
      this.setState({
        error: "You cannot add an email address into the review. Please remove the email address to post the review."
      })
      return
    }
    
    if (rating === 0) {
      this.setState({ error: 'Pick a rating, from 1 to 5 stars' });
      return
    }

    const reviewObject = {
      data: {
        userid,
        submitting: false,
        review_body: reviewBody,
        rating:rating
     }
   };
    const user = this.state.userProfile // get the being_rated user data
    const profileDetailsPropName = user.type === 'driver'? 'driverProfile' : 'carOwnerProfile'
    let ratingsArray = user[profileDetailsPropName].details.ratings
    // update the ratingsArray and average array
    if(ratingsArray === null){ ratingsArray = [rating] } else{ ratingsArray.push(parseInt(rating)) }  // add new rating selected
    user[profileDetailsPropName].details.ratings = ratingsArray // updated array
    user[profileDetailsPropName].details.average_rating = this.avgRating(ratingsArray)
  
    // update state, coz it's what we shall use to send to backend
    this.setState({ userProfile: user },()=>{
        this.setState({
          alreadyReviewed: this.checkIfHasBeenReviewedBefore(this.state.userProfile.user_reviews)
        },async ()=>{ 
          if(this.state.alreadyReviewed){ // then u cannot re-review this user
            return
          }
          else{
             // firstly add a review to the reviews backend then later to user's reviews
                try {  
                  this.setState({submitting:true,submittingText:'Posting...'})// to disable button from re-requesting
                  const newReview = await fetch(api_url+'/user-reviews', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${getJwt()}`
                  },
                  body: JSON.stringify(reviewObject)
                })
                .then(response => response.json())
                .then(data => data)
                .catch(error => console.error(error));
          
          
                if (newReview) {
                  const response = await this.updateUserWIthNewReview(newReview,user[profileDetailsPropName]) // update user object
                  if(response.ok) console.log('Review submitted successfully!');
                  this.setState({submittingText:'Done'})// to disable button from re-requesting
                } else {
                  console.error('Failed to submit review:');
                }
              } catch (error) {
                console.error('Error submitting review:', error);
              }
          }
        })
    })
    
    
  };

  render() {
    const { error } = this.state;
    if(this.state.alreadyReviewed) return <>You have already reviewed this {this.state.userProfile.type} you cannot review them twice.</>
    if(this.props.loggedInUserProfile.id === this.state.userProfile.id) return <Alert severity='warning'>You cannot rate yourself.</Alert>
    return (
      <div>
        <RatingForm getRating={this.getRating} />
        <div className="post-input">
          <textarea
            name="reviewBody"
            id="reviewBody"
            cols={30}
            rows={5}
            className="form-control bg-transparent"
            placeholder="Write Your review here...."
            value={this.state.reviewBody}
            onChange={this.handleChange}
          />
          {error && <div className="text-danger">{error}</div>}
          <button disabled={this.state.submitting} onClick={this.handleSubmit} className="btn btn-primary">{this.state.submittingText}</button>
        </div>
      </div>
    );
  }
}

export default ReviewsForm;
