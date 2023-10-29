import React, { Component } from 'react';
import CopyAndWhatsAppButtons from '../Includes/CopyAndWhatsAppButtons';
import Login from './Login';
import ManageJobs from './ManageJobs';
import HtmlHead from '../Meta/HtmlHead';
import HtmlFoot from '../Meta/HtmlFoot';
        
export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        jwt: null
    }
}


setJwt = (jwt)=>{
    this.setState({
        jwt: jwt
    })
}
  
renderAdminPanel = ()=>{
    const jwt = this.state.jwt
    if(jwt === null){
        return <><HtmlHead pageTitle="Admin"/><Login setJwt={this.setJwt}/><HtmlFoot/></>
    }
    else{
        return <><HtmlHead pageTitle="Admin"/><ManageJobs jwt={jwt}/><HtmlFoot/></>
    }
}

  render() {
    return this.renderAdminPanel()
}
}
