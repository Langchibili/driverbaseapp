import React, { Component } from 'react';
import Chats from '../Lists/Chats';
import { Button, IconButton } from '@mui/material';
import { Add, PlusOne } from '@mui/icons-material';
export default class ChatSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidUpdate(){
    if(this.props.refleshChat) this.props.stopChatReflesh() // avoid reflesh loop after chat update
  }
  render() {
    return (
    <div style={{height:'1000px'}} className="chat-leftsidebar lg:w-[100%] group-data-[theme-color=violet]:bg-slate-50 group-data-[theme-color=green]:bg-green-50/20 group-data-[theme-color=red]:bg-red-50/20 shadow overflow-y-hidden mb-[80px] lg:mb-0 group-data-[theme-color=violet]:dark:bg-zinc-700 group-data-[theme-color=green]:dark:bg-zinc-700 group-data-[theme-color=red]:dark:bg-zinc-700">
      {/* Start chat content */}
      <div>
        <div className="px-6 pt-6">
          <h4 className="mb-0 text-gray-700 dark:text-gray-50">Chats</h4>
          <div className="py-1 mt-5 mb-5 rounded group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
            <span className="group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 pe-1 ps-3 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600" id="basic-addon1">
              <i className="text-lg text-gray-400 ri-search-line search-icon dark:text-gray-200" />
            </span>
            <input type="text" className="border-0 group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 placeholder:text-[14px] focus:ring-offset-0 focus:outline-none focus:ring-0 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600 placeholder:text-gray-400" placeholder="Search messages or users" aria-label="Search messages or users" aria-describedby="basic-addon1" />
          </div>
        </div>
        {/* Start user status */}
        {/* <div className="px-6 pb-6" dir="ltr">
          <div className="owl-carousel owl-theme owl-loaded owl-drag" id="user-status-carousel">
            <div className="owl-stage-outer">
              <div className="owl-stage" style={{"WebkitTransform":"translate3d(0px, 0px, 0px)","-ms-transform":"translate3d(0px, 0px, 0px)","transform":"translate3d(0px, 0px, 0px)","-webkit-transition":"all 0s ease 0s","transition":"all 0s ease 0s","width":"574px"}}>
                       <Chats type="fav"
                              chats={this.props.loggedInUserProfile.chatRooms} 
                              loggedInUserProfile={this.props.loggedInUserProfile}
                              toggleChatSelect={this.props.toggleChatSelect} />
     </div>
      </div>
                <div className="owl-nav disabled"><button type="button" role="presentation" className="owl-prev"><span aria-label="Previous">‹</span></button><button type="button" role="presentation" className="owl-next"><span aria-label="Next">›</span></button></div><div className="owl-dots disabled" /></div>
         
        </div> */}
        {/* end user status */}
        {/* Start chat-message-list */}
        <div>
          {/* <h5 className="px-6 mb-4 text-16 dark:text-gray-50">Recent</h5> */}
          <div className="h-[610px] px-2" data-simplebar="init">
            <div className="simplebar-wrapper" style={{"margin":"0px -8px"}}>
              <div className="simplebar-height-auto-observer-wrapper">
                <div className="simplebar-height-auto-observer" />
                </div><div className="simplebar-mask">
                  <div className="simplebar-offset" style={{"right":"0px","bottom":"0px"}}>
                    <div className="simplebar-content-wrapper" tabIndex={0} role="region" aria-label="scrollable content" style={{"height":"100%","overflow":"scroll"}}>
                      <div className="simplebar-content" style={{"padding":"0px 8px"}}>
                        <ul class="chat-user-list">
                          <Chats chats={this.props.chats} 
                                 loggedInUserProfile={this.props.loggedInUserProfile}
                                 toggleChatSelect={this.props.toggleChatSelect}/>
                        </ul>
                        <div style={{width:'100%',margin:'0 auto', textAlign:'center'}}>
                            <span style={{color:'white'}} onClick={this.props.toggleSelectUsers}>New Chat &nbsp;</span>
                            <IconButton style={{backgroundColor:"white"}} onClick={this.props.toggleSelectUsers}><Add/></IconButton>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="simplebar-placeholder" style={{"width":"491px","height":"0px"}} />
                </div>
                <div className="simplebar-track simplebar-horizontal" style={{"visibility":"hidden"}}>
                <div className="simplebar-scrollbar" style={{"width":"0px","display":"none"}} /></div>
                <div className="simplebar-track simplebar-vertical" style={{"visibility":"hidden"}}>
               <div className="simplebar-scrollbar" style={{"height":"0px","WebkitTransform":"translate3d(0px, 134px, 0px)","-ms-transform":"translate3d(0px, 134px, 0px)","transform":"translate3d(0px, 134px, 0px)","display":"none"}} /></div></div>
            </div>
      </div>  
   </div>
    )
  }
}
