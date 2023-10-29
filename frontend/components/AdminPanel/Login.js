import { api_url } from '@/Constants';
import Link from 'next/link';
import React, { Component } from 'react';
        
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: <></>,
        errorExists: false,
        submitting: false,
        submittingText: 'Login'
    };
    this.password = React.createRef();
}
  

 handleSubmit = async (e)=>{
    e.preventDefault()
    let user = {}
    const password = this.password.current.value;
    this.setState({submitting:true,submittingText:'Checking credentials...'})// to disable button from re-requesting
    if(password.length < 1){
        this.setState({
            error: <span className='text-danger'>username or password empty!</span>,
            errorExists: true,
            submittingText: 'Login'
        })
    }
    else{
        user.identifier = 'Admin'
        user.password = password
        this.setState({submitting:true,submittingText:'Login you in...'})// to disable button from re-requesting
        const response = await this.submitRequest(api_url,user) 
        if(response){
            if('jwt' in response){
                this.props.setJwt(response.jwt) // log admin in
            }
            else{
                this.setState({ submitting: false, errorExists: true, error: <span className="text-danger">Failed to log you in </span> })
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
                <h4 className="text-center mb-4 text-white">Log Into The Admin Panel</h4>
                <form>
                <div className="form-group">
                    <label className="mb-1 text-white"><strong>Password</strong></label>
                    <input onChange={this.handleChange} type="password" ref={this.password} className="form-control"/>
                </div>
                <div className="text-center mt-4">
                    <button disabled={this.state.submitting} onClick={this.handleSubmit} className="btn bg-white text-primary btn-block">{this.state.submitting? this.state.submittingText : 'Login'}</button>
                </div>
                </form>
                <div>{this.state.error}</div>
            </div>
   );
}
}
