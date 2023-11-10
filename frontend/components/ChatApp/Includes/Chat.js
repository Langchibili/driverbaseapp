import { backEndUrl, imageUrlFormat } from '@/Constants';
import Link from 'next/link';
import React, { Component } from 'react';
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  timeUpdated = (dateInput)=>{
    let date = new Date(dateInput)
    date = date.toLocaleString('en-US',{timeZone:'Africa/Harare'})
    date = new Date(date)
    let datePart = date.toDateString()
    let timePart = date.toTimeString()
    timePart = timePart.split(':')
    return timePart[0]+ ':'+ timePart[1]
  }
  dateUpdated = (dateInput)=>{
    let date = new Date(dateInput)
    date = date.toLocaleString('en-US',{timeZone:'Africa/Harare'})
    date = new Date(date)
    let datePart = date.toDateString()
    let timePart = date.toTimeString()
    timePart = timePart.split(':')
    return datePart
  }

  getUidFromParticipants = ()=>{
    let uid 
    this.props.chat.participants.forEach(participant => {
      if(participant.id !== this.props.loggedInUserProfile.id) {
         uid = participant.id
      } 
    })
    return uid
  }

  renderChat = ()=>{
    const chat = this.props.chat
    if(this.props.type === "fav"){
      return (
        <div className="owl-item active" style={{"width":"98.8px","margin-right":"16px"}}><div className="text-center">
          <Link href={"/chat?uid="+this.getUidFromParticipants()} onClick={()=>{this.props.toggleChatSelect(this.getUidFromParticipants())}} className="block p-2 mt-4 rounded group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
            <div className="absolute inset-0 text-center">
              <img src={backEndUrl + imageUrlFormat(chat.chatDetails[this.getUidFromParticipants()].user_thumbnail,'thumbnail')} alt="user-img" className="mx-auto rounded-full w-9 h-9" />
              <span className="absolute w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full top-7 lg:right-5 dark:border-zinc-600" />
            </div>
            <h5 className="mt-4 mb-0 truncate text-13 dark:text-gray-50">{chat.chatDetails[this.getUidFromParticipants()].alias}</h5>
          </Link>
        </div>
       </div>
      )
    }
    else{
      return (
        <li className="unread px-5 py-[15px] group-data-[theme-color=violet]:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 dark:hover:border-zinc-700">
        <Link href={"/chat?uid="+this.getUidFromParticipants()} onClick={()=>{this.props.toggleChatSelect(this.getUidFromParticipants())}}>
          <div className="relative flex ">
            <div className="relative self-center ltr:mr-3 rtl:ml-3">
              <div className="flex items-center justify-center rounded-full w-9 h-9 group-data-[theme-color=violet]:bg-violet-500/20 group-data-[theme-color=green]:bg-green-500/20 group-data-[theme-color=red]:bg-red-500/20">
                <span className="group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500">
                <img src={backEndUrl + imageUrlFormat(chat.chatDetails[this.getUidFromParticipants()].user_thumbnail,'thumbnail')} alt="user-img" className="mx-auto rounded-full w-9 h-9" />
                </span>
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              <h5 className="mb-1 text-base truncate dark:text-gray-50">{chat.chatDetails[this.getUidFromParticipants()].alias}</h5>
              <p className="mb-0 text-gray-800 truncate dark:text-gray-300 text-14">{chat.recent_message_text}</p>
            </div>
            <div className="text-gray-500 text-11 dark:text-gray-300">{this.timeUpdated(chat.updatedAt)}</div> 
            <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
            <div className="text-gray-500 text-11 dark:text-gray-300">{this.dateUpdated(chat.updatedAt)}</div> 
              {/* <span className="px-2 py-1 text-red-500 rounded-full bg-red-500/20 text-11">01</span> */}
            </div>
            
          </div>
        </Link>
      </li>
      )
    }
  }
  render() {
    return this.renderChat()
  }
}


