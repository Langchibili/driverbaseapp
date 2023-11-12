import Link from 'next/link';
import React, { Component } from 'react';
import { Alert } from '@mui/material';
import CopyAndWhatsAppButtons from '../Includes/CopyAndWhatsAppButtons';
import { fakeStr1, fakeStr2 } from '@/Constants';
  
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: <></>,
        errorExists: false,
        submitting: false,
        submittingText: 'Login'
    };
    this.username = React.createRef();
    this.password = React.createRef();
}
  

 handleSubmit = async (e)=>{
    e.preventDefault()
    let user = {}
    const username = this.username.current.value;
    const password = this.password.current.value;
    this.setState({submitting:true,submittingText:'Checking credentials...'})// to disable button from re-requesting
    if(username.length < 1 || password.length < 1){
        this.setState({
            error: <span className='text-danger'>username or password empty!</span>,
            errorExists: true,
            submittingText: 'Login'
        })
    }
    else{
        user.identifier = username
        user.password = password
        this.setState({submitting:true,submittingText:'Login you in...'})// to disable button from re-requesting
        const response = await this.submitRequest(this.props.api_url,user) 
        const jwt = localStorage.getItem('jwt')
        if(jwt === undefined || jwt === null){
            localStorage.setItem("jwt", fakeStr1+response.jwt+fakeStr2)
        }
        else{
            localStorage.removeItem('jwt')
            localStorage.setItem("jwt", fakeStr1+response.jwt+fakeStr2)
        }
        if(response){
            if('user' in response){
                const user = response.user
                if(user.profile_completion_percentage === null || user.profile_completion_percentage === 0){
                    window.location = '/profile'
                }
                else{
                   //  window.location = '/profile?user_type='+user.type+'&uid='+user.id
                   window.location = '/'
                }
            }
            else{
                this.setState({ submitting: false, errorExists: true, error: <span className="text-danger">Failed to log you in, read the directions below</span> })
            }
        }
    }
 }
 handleChange = ()=>{
    this.setState({
        error: <></>,
        errorExists: false,
        submittingText: 'Login',
        submitting: false
    })
 }

  async submitRequest(url,user){
    return await fetch(url+'/auth/local',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(data => data)
      .catch(error => {
        console.error('Error:', error);
      });
      
  }

  render() {
    return (
        <div className="auth-form">
                <div className="text-center mb-3">
                <Link href="/"><img style={{width:60,height:60}} src="/DriverBaseTransparentBackground.png" alt /></Link>
                </div>
                <h4 className="text-center mb-4 text-white">Log Into Your Account</h4>
                <form>
                <div className="form-group">
                    <label className="mb-1 text-white"><strong>Username</strong></label>
                    <input onChange={this.handleChange} type="text" ref={this.username} className="form-control" placeholder="username" />
                </div>
                <div className="form-group">
                    <label className="mb-1 text-white"><strong>Password</strong></label>
                    <input onChange={this.handleChange} type="password" ref={this.password} className="form-control"/>
                </div>
                <div className="text-center mt-4">
                    <button disabled={this.state.submitting} onClick={this.handleSubmit} className="btn bg-white text-primary btn-block">{this.state.submitting? this.state.submittingText : 'Login'}</button>
                </div>
                </form>
                <div className="new-account mt-3">
                <p className="text-white">Don't have an account? <Link className="text-white" href="/signup">Sign Up</Link></p>
                </div>
                <div>{this.state.error}</div>
                <div style={{minHeight:5}}></div> {/* space */}
                {this.state.errorExists? <><Alert severity='warning'>
                            This is how to log in successfully<br/>
                            1. Add your username and password<br/>
                            2. Make sure you have opened an account with this username<br/>
                            3. Do not add spaces at the end or start of your password if you didn't include them when signing up<br/>
                            4. Make sure the password is exactly what you entered on sign up<br/>
                            5. If any letter is capital, it should be entered as capital<br/>
                            5. If you have forgotten your passwor, text us on whatsapp providing your username<br/>
                        </Alert>
                        <div style={{minHeight:5}}></div> {/* space */}
                         <div style={{backgroundColor:'wheat'}}><CopyAndWhatsAppButtons buttonText="Text Us On WhatsApp" info={<><strong>Contact <span id="copyNumber">+260954816277</span> on WhatsApp; to reset your password, if you still fail to log in</strong></>}/>
                        </div></>: ''}
            </div>
   );
}
}

export default LoginForm;

