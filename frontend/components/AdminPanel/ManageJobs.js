import React, { Component } from 'react';
import ItemListAll from '../Lists/ItemListAll';
import { api_url } from '@/Constants';
import JobView from './JobView';

export default class ManageJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job: null
    }
  }

  setJobToManage = (job)=>{
      this.setState({
        job: job
      })
  }
  
  render() {
      return this.state.job === null? <ItemListAll 
            loggedInUserProfile="logged-out"
            itemsName='jobs'
            listType='jobs'
            listTitle='Jobs Available'
            api_url={api_url}
            act="manage" 
            selectJobToManage={this.setJobToManage}/>  : <JobView jwt={this.props.jwt} jid={this.state.job.id} loggedInUserProfile="logged-out"/>
  }
}
