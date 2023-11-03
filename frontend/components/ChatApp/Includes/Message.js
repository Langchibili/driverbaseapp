import { api_url, backEndUrl, getJwt, imageUrlFormat } from '@/Constants';
import { Alert } from '@mui/material';
import Link from 'next/link';
import React, { Component } from 'react';
export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
        canReadMessageChecked: false,
        canReadMessage: false,
        message: null,
        sentBy: "me",
        userProfile: null,
        profileDetails: null
    }
  }
  updateReadStatus = ()=>{
    fetch(api_url+'/messages/'+this.props.message.id,{ 
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJwt()}`
      },
      body: JSON.stringify({data:{status:'read'}})
    })
    const chatpointsdisplay = document.getElementById('chatpointsdisplay')
    if(chatpointsdisplay !== null){
      const currentPoints = Math.abs(parseInt(chatpointsdisplay.textContent)) - 2
      chatpointsdisplay.textContent = currentPoints+" CPs"
    }
  }

  async componentDidMount(){
    const loggedInUserProfile = this.props.loggedInUserProfile
    const otherUserProfile = this.props.userProfile
    const message = this.props.message.attributes
    const sender = message.sender.data
    const sentBy = loggedInUserProfile.id === sender.id? "me": "other" 
    const userProfile = loggedInUserProfile.id === sender.id? loggedInUserProfile : otherUserProfile 
    const profileDetails = userProfile.type === 'driver'? userProfile.driverProfile.details : userProfile.carOwnerProfile.details
    
    // update read status and reduce chat points if loggedInUser is a driver
   if(sentBy === "other" && loggedInUserProfile.type === "driver"){
          if(message.status === "unread"){ // which initially a message would be
              if(loggedInUserProfile.chatpoints === null || loggedInUserProfile.chatpoints < 2){ // every message view by a driver costs them 2 points
                  this.setState({
                    canReadMessageChecked: true,
                    canReadMessage: false,
                    message: message, // still gotta show that the user who sent this message is the other one, even though you cannot read it
                    sentBy: sentBy,
                    userProfile: userProfile,
                    profileDetails: profileDetails
                 })
                 return
              }
              else{
                  // otherwise you can view the message as a driver
                  this.setState({
                        canReadMessageChecked: true,
                        canReadMessage: true,
                        message: message,
                        sentBy: sentBy,
                        userProfile: userProfile,
                        profileDetails: profileDetails
                  })
                  fetch(api_url+'/users/'+loggedInUserProfile.id,{ // if it's a driver, reduce their chatpoints by 2
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${getJwt()}`
                      },
                      body: JSON.stringify({chatpoints: loggedInUserProfile.chatpoints - 2})
                  })
                  this.updateReadStatus()
                  return
              }
        } 
        this.setState({
          canReadMessageChecked: true,
          canReadMessage: true,
          message: message, // still gotta show that the user who sent this message is the other one, even though you cannot read it
          sentBy: sentBy,
          userProfile: userProfile,
          profileDetails: profileDetails
        })
        return
   }
   else{ // it means you an employer, so yes you can view messages without any point deductions
     this.setState({
        canReadMessageChecked: true,
        canReadMessage: true,
        message: message,
        sentBy: sentBy,
        userProfile: userProfile,
        profileDetails: profileDetails
      })
   }
   // if you can read the message, coz you probably a car owner, let's update that you have read the message, since it's intended for u
   if(message.status === "unread" && sentBy === "other") this.updateReadStatus()
   // send a socket message that you have read the message
  
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

  getNamesFromProfile = ()=>{
    let firstname = this.state.profileDetails.firstname
    let lastname = this.state.profileDetails.lastname
    const profile_url = '/profile?uid='+this.state.userProfile.id+'&user_type='+this.state.userProfile.type
    if(firstname === null || lastname === null) return <Link href={profile_url}><span style={{textTransform:'capitalize'}}>{this.state.userProfile.username}</span></Link>
    return <Link href={profile_url}><span style={{textTransform:'capitalize'}}>{firstname + " " + lastname}</span></Link>
  } 

  
  errorMessage = (errorMessage) =>{
    const message = this.state.message
    const profile_url = '/profile?uid='+this.state.userProfile.id+'&user_type='+this.state.userProfile.type
    return (
      <li className="clear-both py-4">
      <div className="flex items-end gap-3">
        <div>
        <Link href={profile_url}><img src={backEndUrl + imageUrlFormat(this.state.profileDetails.profile_thumbnail_image,'thumbnail')} alt className="rounded-full h-9 w-9" /></Link>
        </div>
        <div>
          <div className="flex gap-2 mb-2">
            <div className="relative px-5 py-3 text-white rounded-lg ltr:rounded-bl-none rtl:rounded-br-none group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500">
              <p className="mb-0">
                {errorMessage}
              </p>
              <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line" /> <span className="align-middle">{this.dateCreated(message.createdAt)}</span></p>
              <div className="before:content-[''] before:absolute before:border-[5px] before:border-transparent group-data-[theme-color=violet]:ltr:before:border-l-violet-500 group-data-[theme-color=violet]:ltr:before:border-t-violet-500 group-data-[theme-color=green]:ltr:before:border-l-green-500 group-data-[theme-color=green]:ltr:before:border-t-green-500 group-data-[theme-color=red]:ltr:before:border-l-red-500 group-data-[theme-color=red]:ltr:before:border-t-red-500 group-data-[theme-color=violet]:rtl:before:border-r-violet-500 group-data-[theme-color=violet]:rtl:before:border-t-violet-500 group-data-[theme-color=green]:rtl:before:border-r-green-500 group-data-[theme-color=green]:rtl:before:border-t-green-500 group-data-[theme-color=red]:rtl:before:border-r-red-500 group-data-[theme-color=red]:rtl:before:border-t-red-500 ltr:before:left-0 rtl:before:right-0 before:-bottom-2" />
            </div>
            <div className="hidden relative self-start dropdown">
              <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton12">
                <i className="ri-more-2-fill" />
              </a>
              <div className="absolute z-50 hidden w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:left-auto ltr:right-0 xl:ltr:left-0 xl:ltr:right-auto rtl:left-0 rtl:right-auto xl:rtl:right-0 xl:rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton12">
                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-file-copy-line" /></a>
                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
              </div>
            </div>
          </div>
          <div className="font-medium text-gray-700 text-14 dark:text-gray-300">{this.getNamesFromProfile()}</div>
        </div>
      </div>
    </li>
    )
  }

  renderMessage = ()=>{
     if(!this.state.canReadMessageChecked) return <></> // only go forward if you have checked whether this user can read this sent message
     if(!this.state.canReadMessage) return this.errorMessage(<div><Alert severity='warning'>You don't have enough chat points to view this message...</Alert> <br/><Link href="/points" style={{color:'red'}}>Buy Points</Link></div>)
      const message = this.state.message
      const profile_url = '/profile?uid='+this.state.userProfile.id+'&user_type='+this.state.userProfile.type

      if(this.state.sentBy === "me"){
        if(message.type === "media"){
            return (
              <li className="clear-both py-4">
                  <div className="relative inline-flex items-end mb-6 text-right ltr:rtl:float-left ltr:float-right rtl:float-left">
                      <div>
                      <Link href={profile_url}><img src={backEndUrl + imageUrlFormat(this.state.profileDetails.profile_thumbnail_image,'thumbnail')} alt className="rounded-full h-9 w-9" /></Link>
                      </div>
                      <div>
                      <div className="flex gap-2 mb-2">
                          <div className="relative px-5 py-3 text-white rounded-lg ltr:rounded-bl-none rtl:rounded-br-none group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500">
                          <div className="before:content-[''] before:absolute before:border-[5px] before:border-transparent group-data-[theme-color=violet]:ltr:before:border-l-violet-500 group-data-[theme-color=violet]:ltr:before:border-t-violet-500 group-data-[theme-color=green]:ltr:before:border-l-green-500 group-data-[theme-color=green]:ltr:before:border-t-green-500 group-data-[theme-color=red]:ltr:before:border-l-red-500 group-data-[theme-color=red]:ltr:before:border-t-red-500 group-data-[theme-color=violet]:rtl:before:border-r-violet-500 group-data-[theme-color=violet]:rtl:before:border-t-violet-500 group-data-[theme-color=green]:rtl:before:border-r-green-500 group-data-[theme-color=green]:rtl:before:border-t-green-500 group-data-[theme-color=red]:rtl:before:border-r-red-500 group-data-[theme-color=red]:rtl:before:border-t-red-500 ltr:before:left-0 rtl:before:right-0 before:-bottom-2" />
                          <ul className="relative mb-0">
                              <li className="relative inline-block mr-2">
                              <div>
                                  <a className="inline-block m-1 popup-img" href={backEndUrl + imageUrlFormat(message.media)} title="Project 1">
                                  <img src={backEndUrl + imageUrlFormat(message.media,'thumbnail')} alt className="border rounded h-28" />
                                  </a>
                              </div>
                              <div className="absolute right-[10px] left-auto bottom-[10px]">
                                  <ul>
                                  <li className="inline-block p-2">
                                      <a download={message.media.name? message.media.name : 'file.jpg'} href={backEndUrl + imageUrlFormat(message.media)} className="font-medium">
                                      <i className="text-lg ri-download-2-line" />
                                      </a>
                                  </li>
                                  <li className="relative self-start inline-block p-2 dropdown">
                                      <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton17">
                                      <i className="text-lg text-white ri-more-2-fill" />
                                      </a>
                                      <div className="absolute z-50 hidden w-40 py-2 my-10 text-left list-none bg-white border-none rounded shadow-lg ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton19">
                                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-100 ri-file-copy-line" /></a>
                                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
                                      </div>
                                  </li>
                                  </ul>
                              </div>
                              </li>
                          </ul>
                          <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line" /> <span className="align-middle">{this.dateCreated(message.createdAt)}</span></p>
                          </div>
                          <div className="hidden relative self-start dropdown">
                          <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-300" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton19">
                              <i className="ri-more-2-fill" />
                          </a>
                          <div className="absolute z-50 hidden w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:left-auto ltr:right-0 xl:ltr:left-0 xl:ltr:right-auto rtl:left-0 rtl:right-auto xl:rtl:right-0 xl:rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton19">
                              <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-100 ri-file-copy-line" /></a>
                              <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                              <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                              <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
                          </div>
                          </div>
                      </div>
                      <div className="font-medium text-gray-700 text-14 dark:text-gray-300">{this.getNamesFromProfile()}</div>
                      </div>
                  </div>
                  </li>
            )
        }
        else{
            return (
                <li className="clear-both py-4">
                      <div className="relative inline-flex items-end mb-6 text-right ltr:rtl:float-left ltr:float-right rtl:float-left">
                          <div className="order-3 mr-0 ltr:ml-4 rtl:mr-4">
                          <Link href={profile_url}><img src={backEndUrl + imageUrlFormat(this.state.profileDetails.profile_thumbnail_image,'thumbnail')} alt className="rounded-full h-9 w-9" /></Link>
                          </div>
                          <div>
                          <div className="flex gap-2 mb-2 ltr:justify-end rtl:justify-start">
                              <div className="relative order-2 px-5 py-3 text-gray-700 rounded-lg ltr:rounded-br-none rtl:rounded-bl-none bg-gray-50 dark:bg-zinc-700 dark:text-gray-50">
                              <p className="mb-0">
                                  {message.content}
                              </p>
                              <p className="mt-1 mb-0 text-xs text-left text-gray-500 dark:text-gray-300"><i className="align-middle ri-time-line" /> <span className="align-middle">{this.dateCreated(message.createdAt)}</span></p>
                              <div className="before:content-[''] before:absolute before:border-[5px] before:border-transparent ltr:before:border-r-gray-50 ltr:before:border-t-gray-50 rtl:before:border-l-gray-50 rtl:before:border-t-gray-50 ltr:before:right-0 rtl:before:left-0 before:-bottom-2 ltr:dark:before:border-t-zinc-700 ltr:dark:before:border-r-zinc-700 rtl:dark:before:border-t-zinc-700 rtl:dark:before:border-l-zinc-700" />
                              </div>
                              <div className="hidden relative self-start order-1 dropstart">
                              <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton13">
                                  <i className="ri-more-2-fill" />
                              </a>
                              <div className="absolute z-50 hidden py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:right-auto ltr:left-0 xl:ltr:right-0 xl:ltr:left-auto rtl:right-0 rtl:left-auto xl:rtl:left-0 xl:rtl:right-auto dropdown-menu w-36 bg-clip-padding dark:bg-zinc-700" aria-labelledby="dropdownMenuButton13">
                                  <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-file-copy-line" /></a>
                                  <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                                  <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                                  <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
                              </div>
                              </div>
                          </div>
                          <div className="font-medium text-gray-700 rtl:text-left text-14 dark:text-gray-300">{this.getNamesFromProfile()}</div>
                          </div>
                      </div>
                </li>
            )
        }
      }
      else{
        if(message.type === "media"){
          return (
            <li className="clear-both py-4">
                <div className="flex items-end gap-3">
                    <div>
                    <Link href={profile_url}><img src={backEndUrl + imageUrlFormat(this.state.profileDetails.profile_thumbnail_image,'thumbnail')} alt className="rounded-full h-9 w-9" /></Link>
                    </div>
                    <div>
                    <div className="flex gap-2 mb-2">
                        <div className="relative px-5 py-3 text-white rounded-lg ltr:rounded-bl-none rtl:rounded-br-none group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500">
                        <div className="before:content-[''] before:absolute before:border-[5px] before:border-transparent group-data-[theme-color=violet]:ltr:before:border-l-violet-500 group-data-[theme-color=violet]:ltr:before:border-t-violet-500 group-data-[theme-color=green]:ltr:before:border-l-green-500 group-data-[theme-color=green]:ltr:before:border-t-green-500 group-data-[theme-color=red]:ltr:before:border-l-red-500 group-data-[theme-color=red]:ltr:before:border-t-red-500 group-data-[theme-color=violet]:rtl:before:border-r-violet-500 group-data-[theme-color=violet]:rtl:before:border-t-violet-500 group-data-[theme-color=green]:rtl:before:border-r-green-500 group-data-[theme-color=green]:rtl:before:border-t-green-500 group-data-[theme-color=red]:rtl:before:border-r-red-500 group-data-[theme-color=red]:rtl:before:border-t-red-500 ltr:before:left-0 rtl:before:right-0 before:-bottom-2" />
                        <ul className="relative mb-0">
                            <li className="relative inline-block mr-2">
                            <div>
                                <a className="inline-block m-1 popup-img" href={backEndUrl + imageUrlFormat(message.media)} title="Project 1">
                                <img src={backEndUrl + imageUrlFormat(message.media,'thumbnail')} alt className="border rounded h-28" />
                                </a>
                            </div>
                            <div className="absolute right-[10px] left-auto bottom-[10px]">
                                <ul>
                                <li className="inline-block p-2">
                                    <a download={message.media.name? message.media.name : 'file.jpg'} href={backEndUrl + imageUrlFormat(message.media)} className="font-medium">
                                    <i className="text-lg ri-download-2-line" />
                                    </a>
                                </li>
                                <li className="hidden relative self-start inline-block p-2 dropdown">
                                    <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton17">
                                    <i className="text-lg text-white ri-more-2-fill" />
                                    </a>
                                    <div className="absolute z-50 hidden w-40 py-2 my-10 text-left list-none bg-white border-none rounded shadow-lg ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton19">
                                    <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-100 ri-file-copy-line" /></a>
                                    <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                                    <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                                    <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
                                    </div>
                                </li>
                                </ul>
                            </div>
                            </li>
                        </ul>
                        <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line" /> <span className="align-middle">{this.dateCreated(message.createdAt)}</span></p>
                        </div>
                        <div className="hidden relative self-start dropdown">
                        <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-300" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton19">
                            <i className="ri-more-2-fill" />
                        </a>
                        <div className="absolute z-50 hidden w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:left-auto ltr:right-0 xl:ltr:left-0 xl:ltr:right-auto rtl:left-0 rtl:right-auto xl:rtl:right-0 xl:rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton19">
                            <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-100 ri-file-copy-line" /></a>
                            <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                            <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                            <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
                        </div>
                        </div>
                    </div>
                    <div className="font-medium text-gray-700 text-14 dark:text-gray-300">{this.getNamesFromProfile()}</div>
                    </div>
                </div>
                </li>
          )
      }
      else{
          return (
            <li className="clear-both py-4">
            <div className="flex items-end gap-3">
              <div>
              <Link href={profile_url}><img src={backEndUrl + imageUrlFormat(this.state.profileDetails.profile_thumbnail_image,'thumbnail')} alt className="rounded-full h-9 w-9" /></Link>
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  <div className="relative px-5 py-3 text-white rounded-lg ltr:rounded-bl-none rtl:rounded-br-none group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500">
                    <p className="mb-0">
                      {message.content}
                    </p>
                    <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line" /> <span className="align-middle">{this.dateCreated(message.createdAt)}</span></p>
                    <div className="before:content-[''] before:absolute before:border-[5px] before:border-transparent group-data-[theme-color=violet]:ltr:before:border-l-violet-500 group-data-[theme-color=violet]:ltr:before:border-t-violet-500 group-data-[theme-color=green]:ltr:before:border-l-green-500 group-data-[theme-color=green]:ltr:before:border-t-green-500 group-data-[theme-color=red]:ltr:before:border-l-red-500 group-data-[theme-color=red]:ltr:before:border-t-red-500 group-data-[theme-color=violet]:rtl:before:border-r-violet-500 group-data-[theme-color=violet]:rtl:before:border-t-violet-500 group-data-[theme-color=green]:rtl:before:border-r-green-500 group-data-[theme-color=green]:rtl:before:border-t-green-500 group-data-[theme-color=red]:rtl:before:border-r-red-500 group-data-[theme-color=red]:rtl:before:border-t-red-500 ltr:before:left-0 rtl:before:right-0 before:-bottom-2" />
                  </div>
                  <div className="hidden relative self-start dropdown">
                    <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton12">
                      <i className="ri-more-2-fill" />
                    </a>
                    <div className="absolute z-50 hidden w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:left-auto ltr:right-0 xl:ltr:left-0 xl:ltr:right-auto rtl:left-0 rtl:right-auto xl:rtl:right-0 xl:rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton12">
                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-file-copy-line" /></a>
                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line" /></a>
                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line" /></a>
                      <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line" /></a>
                    </div>
                  </div>
                </div>
                <div className="font-medium text-gray-700 text-14 dark:text-gray-300">{this.getNamesFromProfile()}</div>
              </div>
            </div>
          </li>
          )
       }
      }
  }
  render() {
    return this.props.id?  <div style={{marginBottom:'5px'}} id={this.props.id}>{this.renderMessage()}</div> : this.renderMessage()
  }
}
