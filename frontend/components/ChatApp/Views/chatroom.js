import React, { Component } from 'react';
import  { sendNotification, api_url, emitEvent, getJwt, getUserProfileUid, requestNotificationPermissionAndToken } from '@/Constants';
import ContentLoader from '@/components/Includes/ContentLoader';
import { Alert, Button } from '@mui/material';
import Messages from '../Lists/Messages';
import ChatRoomFooter from '../Parts/ChatRoomFooter';
import ChatRoomHeader from '../Parts/ChatRoomHeader';
import { useRouter } from 'next/router';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
        chatRoom: this.props.chatRoom,
        errorExists: false,
        messageError: false,
        errorMessage: '',
        messageContent: null,
        messagesLoaded: false,
        userProfile: null,
        lastDiv: null,
        messages: []
    }
  }

 getNamesFromProfile = (userProfile)=>{ // used to set chat alias
    let firstname,lastname
    if(userProfile.hasOwnProperty('driverProfile')){ // driver profile then
        firstname = userProfile.driverProfile.details.firstname
        lastname = userProfile.driverProfile.details.lastname
    }
    else{
        firstname = userProfile.carOwnerProfile.details.firstname
        lastname = userProfile.carOwnerProfile.details.lastname
    }
    if(firstname === null || lastname === null) return userProfile.username
    return firstname+ ' '+ lastname
 } 

 createChatRoomNamesFromProfiles = (userProfile)=>{
   return this.props.loggedInUserProfile.username + "and" + userProfile.username
 } 

 createNewChatRoom = async (chatRoomObject)=>{
    return await fetch(api_url+'/chat-rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`
        },
        body: JSON.stringify(chatRoomObject)
      })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));
 }

 updateChatRoomWithMessage = async (messageId,latestMessageText,messagesCount)=>{
    const chatRoomsUpdateObject = {
       data: { 
            messages: { connect: [messageId] }, // add new chatroom to existing chatrooms
            recent_message_text: latestMessageText,
            messagesCount: parseInt(messagesCount)+ 1
       }
    }
    return await fetch(api_url+'/chat-rooms/'+this.state.chatRoom.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`
        },
        body: JSON.stringify(chatRoomsUpdateObject)
    })
 }

 updateUserWithChatRoom = async (user,newChatRoom)=>{
    if(newChatRoom === undefined) return
    if(newChatRoom === null) return
    if(newChatRoom.data === undefined) return
    if(newChatRoom.data === null) return
   // console.log('we are here',newChatRoom)
    const chatRoomsUpdateObject = {
          chatRooms: { connect: [newChatRoom.data.id] } // add new chatroom to existing chatrooms
    }
    return await fetch(api_url+'/users/'+user.id, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`
        },
        body: JSON.stringify(chatRoomsUpdateObject)
    })
 }
 
 loadMessages = async ()=>{
    if(this.props.uid === undefined || this.props.uid === null || this.props.uid === 0 || this.state.chatRoom === null) return
    const userProfile = await getUserProfileUid(this.props.uid) // get other user's profile  
    const messages = await fetch(api_url+'/chat-rooms/'+this.state.chatRoom.id+'?populate=messages,messages.sender',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJwt()}`
        }
       }).then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))

    if(messages.hasOwnProperty('error')){
        this.setState({
            errorExists: true,
            errorMessage: <Button onClick={()=>{this.forceUpdate()}}><strong>Sorry, failed to load messages, <br/><strong style={{color:'lightblue'}}>Reflesh Page...</strong></strong></Button>
        })
    }

    this.setState({
        messages: messages.data.attributes.messages.data,
        userProfile: userProfile, // then now you can add the other user to the state
        messagesLoaded: true,
        lastDiv: document.getElementById('messages-start')
    })
 }

  async componentDidMount(){
     if(this.props.chatRoom === null){ // then create a new chatroom with user in question
        const userProfile = await getUserProfileUid(this.props.uid) // get other user's profile  
        if(userProfile === 'not-found'){
            this.props.toggleChatSelect()
            return
        }
        if(userProfile === 'no-profile'){
            this.setState({
                errorExists: true,
                errorMessage: "You cannot open a chat with this user. Their profile is not updated enough. Visit the help page (ask) for assistance."
            })
            return
        }
        if(this.props.loggedInUserProfile.id === this.props.uid){
            this.setState({
                errorExists: true,
                errorMessage: "Sorry, the current update does not support chatting with yourself. Look to future updates"
            })
            return
        }
        
        // this means the user from uid has a profile at least
        const chatRoomName = this.createChatRoomNamesFromProfiles(userProfile)
        const chatRoomAlias = this.getNamesFromProfile(userProfile)
        const chatRoomAlias2 = this.getNamesFromProfile(this.props.loggedInUserProfile)
        const otherUserProfileDetails = userProfile.type === 'driver'? userProfile.driverProfile.details : userProfile.carOwnerProfile.details
        const loggedInUserProfileDetails = this.props.loggedInUserProfile.type === 'driver'? this.props.loggedInUserProfile.driverProfile.details : this.props.loggedInUserProfile.carOwnerProfile.details
        const chatDetails = {} // the names and icons to show on the chat list display depending on the user logged in
        chatDetails[userProfile.id] = {
            alias: chatRoomAlias,
            user_thumbnail: otherUserProfileDetails.profile_thumbnail_image
        }
        chatDetails[this.props.loggedInUserProfile.id] = {
            alias: chatRoomAlias2,
            user_thumbnail: loggedInUserProfileDetails.profile_thumbnail_image
        }
        const chatRoomObject = {
            data: {
                name: chatRoomName,
                participants: [this.props.loggedInUserProfile.id, this.props.uid],
                chatDetails: chatDetails
            }
        }
        const newChatRoom = await this.createNewChatRoom(chatRoomObject)
        if('data' in newChatRoom){
            await this.updateUserWithChatRoom(this.props.loggedInUserProfile, newChatRoom) // push newly created chatroom to current logged in user
            const updated = await this.updateUserWithChatRoom(userProfile, newChatRoom) // push newly created chatroom to uid user
            if(updated === undefined) return
            if(updated === null) return
            if(updated.ok){
                this.setState({
                    chatRoom: newChatRoom.data,
                    userProfile: userProfile, // then now you can add the other user to the state
                    messagesLoaded: true,
                    lastDiv: document.getElementById('messages-start')
                }) // no need to run load messages, coz a new chatroom has no messages
            }
        }
        // create a new chatroom and set it to state
     }
     else{
        // get the existing chatroom from props and load messages that exist from it
        this.loadMessages()
     }
  }
  

 componentDidUpdate(){
    console.log('i received a forced update',this.props.refleshChat)
    // console.log('on update', this.props,this.state)
    //  if(this.props.chatRoom !== null && !this.state.messagesLoaded) this.loadMessages() // when you select from the chat list
    if(this.state.lastDiv !== null) this.state.lastDiv.scrollIntoView()
    if(this.props.refleshChat){
        this.loadMessages()
        this.props.stopChatReflesh()
        if(this.state.lastDiv !== null) this.state.lastDiv.scrollIntoView()
    } // reload messages on a new message receptiona and emediately stop the reflesh to avoid loop
    if(this.state.userProfile !== null) return
    this.loadMessages() // when you select from the chat list
  }

  // on message sending, always update the chatroom of the uid to ensure that it's only updated on message existence
  
  submitMessage = async (messageContent)=>{
    // the messageContent object contains the "content", "type", "media_type" and "media" properties depensing on the message type
    const messageObject = {
        data: {
            sender:  this.props.loggedInUserProfile.id,
            chatRoom: this.state.chatRoom.id,
            ...messageContent
        }
    }
    return await fetch(api_url+'/messages/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getJwt()}`
        },
        body: JSON.stringify(messageObject)
    }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
  }


  createNewMessage = async (socket)=>{ // handles addition of a newly submitted message to a chatroom
    if(this.state.messageContent === null) return
    const messages = this.state.messages
    const newMessage = await this.submitMessage(this.state.messageContent)
        if(newMessage.hasOwnProperty("error")){
            this.setState({
                messageError: true,
                errorMessage: "failed to send message"
            })
        }
        else{
            const socketObject = {
                  loggedInUserId : this.props.loggedInUserProfile.id,
                  uid: this.props.uid
            }
            /* send live update to other user */
            emitEvent(socket,'msgfor',socketObject) // send live update to other user
            /* send notification on new message */
             sendNotification('new message',newMessage.data.attributes.content,this.props.uid) // send notification of a new message
            /* updates end*/
            const updateChatRoom = await this.updateChatRoomWithMessage(newMessage.data.id,newMessage.data.attributes.content,messages.length)
            if(updateChatRoom.ok){
                newMessage.data.attributes.sender = {
                    data : {
                        attributes: this.props.loggedInUserProfile,
                        id: this.props.loggedInUserProfile.id
                    }
                }
                messages.push(newMessage.data)
                this.setState({ // since you just pushed a new message to an existing chatroom, then yes, you have loaded the messages already
                    messages: messages,
                    messagesLoaded: true
                })// add new message to chatroom then
            }
        }
        // post new message // means add new message to chat room // 
  }

  sendMessage = (messageContent,socket)=>{ // socket for handling live updates
       this.setState({
          messageContent: messageContent // set the message content to state     
       },()=>{
          this.createNewMessage(socket) // actually send the message now
       })
  }

  render() {
    if(this.state.chatRoom === null && !this.state.messagesLoaded) return <ContentLoader text="Opening Chat..."/>      
    if(this.state.chatRoom === null && this.state.messagesLoaded) {
        if(this.state.chatRoom.hasOwnProperty('error')){
            if(this.state.chatRoom.error.status === 401) window.location = '/login' // you gotta be logged in to chat with users
        }
    }
   
    if(this.state.errorExists) return (<><div className="block ltr:mr-2 rtl:ml-2">
                <a href="#" onClick={this.props.toggleChatSelect} className="p-2 text-gray-500 user-chat-remove text-16"><i className="ri-arrow-left-s-line" /></a>
                </div> 
                <div className="flex-grow overflow-hidden">
                        <h5 className="mb-0 truncate text-16 ltr:block rtl:hidden"><a href="#" onClick={this.props.toggleChatSelect} className="text-gray-800 dark:text-gray-50">Select A Different User</a> <i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 " /></h5>
                </div>
                <Alert severity='warning'>{this.state.errorMessage}</Alert></>)
    return (
      <> 
      <div className="w-full overflow-hidden transition-all duration-150 bg-white dark:bg-zinc-800">
        <div className="lg:flex">
            {/* start chat conversation section */}
            <div className="relative w-full overflow-hidden ">
            {this.state.messagesLoaded? <ChatRoomHeader loggedInUserProfile={this.props.loggedInUserProfile} userProfile={this.state.userProfile} toggleChatSelect={this.props.toggleChatSelect}/> : ""}
            {/* end chat user head */}
            {/* start chat conversation */}
    
            <div className="p-4 lg:p-6 simplebar-scrollable-y" data-simplebar="init"><div className="simplebar-wrapper" style={{"margin":"-24px"}}><div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer" /></div><div className="simplebar-mask"><div className="simplebar-offset" style={{"right":"0px","bottom":"0px"}}><div className="simplebar-content-wrapper" tabIndex={0} role="region" aria-label="scrollable content" style={{"height":"100%","overflow":"hidden scroll"}}><div className="simplebar-content" style={{"padding":"24px"}}>
                       {this.state.messagesLoaded? <Messages messages={this.state.messages} loggedInUserProfile={this.props.loggedInUserProfile} userProfile={this.state.userProfile}/> :  <ContentLoader text="loading messages..."/>}
                        </div></div></div></div><div className="simplebar-placeholder" style={{"width":"991px","height":"1263px"}} /></div>
            <div className="simplebar-track simplebar-horizontal" style={{"visibility":"hidden"}}><div className="simplebar-scrollbar" style={{"width":"0px","display":"none"}} /></div><div className="simplebar-track simplebar-vertical" style={{"visibility":"visible"}}><div className="simplebar-scrollbar" style={{"height":"139px","-webkit-transform":"translate3d(0px, 0px, 0px)","-ms-transform":"translate3d(0px, 0px, 0px)","transform":"translate3d(0px, 0px, 0px)","display":"block"}} /></div></div>
            {/* end chat conversation end */}
            {/* start chat input section */}
            <ChatRoomFooter  
                socket={this.props.socket} 
                loggedInUserProfile={this.props.loggedInUserProfile} 
                sendMessage={this.sendMessage}/>
            {/* end chat input section */}
            </div>
            {/* end chat conversation section */}
            {/* start User profile detail sidebar */}
            {/* Start profile content */}
            
            {/* end User profile detail sidebar */}
        </div>
        </div>
      </>
    );
  }
}
