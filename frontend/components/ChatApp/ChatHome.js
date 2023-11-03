import React, { Component } from 'react';
import ChatRoom from './Views/chatroom';
import ChatSelector from './Views/chatselector';
import SearchUsers from './Views/search_users';
import HtmlHead from './Meta/HmtlHead';
import HtmlFoot from './Meta/HtmlFoot';
import ContentLoader from '../Includes/ContentLoader';
import { api_url, getJwt } from '@/Constants';

export default class ChatHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
        uid: this.props.uid,
        chats: this.props.loggedInUserProfile.chatRooms.filter((chatRoom)=> parseInt(chatRoom.messagesCount) !== 0),
        chatRoom: null,
        hasChats: null,
        checkedChatRoom: false,
        chatSelected: this.props.chatSelected 
    }
  }

  componentDidMount() {
    console.log('for reference to user object',this.props.loggedInUserProfile)
    if(!this.props.chatSelected){ // because this.props.uid === 0
      if(this.props.loggedInUserProfile.chatRooms.length === 0){
        this.setState({
          hasChats: false
        })
      }
      else{
        this.setState({
          hasChats: true
        })
      }
    }
    else{
      this.checkChatRoomFromUid()
    }
  }

   removeChatRoomFromUser = async (user,chatRoomId)=>{
    if(user === undefined) return // cannot update an undefined user
    if(user === null) return // cannot update a null user

    const chatRoomsUpdateObject = {
      chatRooms: { disconnect: [chatRoomId] } // remove chatroom from existing chatrooms
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


  checkChatRoomFromUid = ()=>{
     let chatRoom = null
     chatRoom = this.state.chats.filter(chatRoom => {
        if(this.props.loggedInUserProfile.id === this.state.uid) return false // means it's yourself
        let haveChatWithUid = false
        if(chatRoom.participants[0] === null || chatRoom.participants[1] === null) {
           this.removeChatRoomFromUser(chatRoom.participants[0], chatRoom.id) // no need to await, since this can run in the back ground
           this.removeChatRoomFromUser(chatRoom.participants[1], chatRoom.id) // no need to await, since this can run in the back ground
           return false // means you don't have chatroom with user anymore
        }
        if(chatRoom.participants[0] === undefined || chatRoom.participants[1] === undefined) {
          this.removeChatRoomFromUser(chatRoom.participants[0], chatRoom.id) // no need to await, since this can run in the back ground
          this.removeChatRoomFromUser(chatRoom.participants[1], chatRoom.id) // no need to await, since this can run in the back ground
          return false // means you don't have chatroom with user anymore
        }
        // otherwise check for the user in any chatrooms
        haveChatWithUid =  chatRoom.participants[0].id === this.state.uid || chatRoom.participants[1].id === this.state.uid
        return haveChatWithUid
     })

     if(chatRoom !== null){
       if(chatRoom.length === 0){ // means chatRoom = []
          this.setState({
            checkedChatRoom: true, // it means u have checked the chatrooms, but have not found one with this uid,
            chatRoom: null,
            hasChats: true, // u have chats now that u will create a chatroom
            chatSelected: true // yes because we are opening a new chat room
          })
       }
       else{
        this.setState({
          checkedChatRoom: true, // also here you have checked chatrooms
          chatRoom: chatRoom[0],  // and found one, so you pass it as a prop
          hasChats: true, 
          chatSelected: true
        })
       }
       // check if the user with provided uid has a chat in the chatrooms of the loggedInUser
     }
  }

  toggleChatSelect = ()=>{
    const chatSelected = this.state.chatSelected
    this.setState({
      chatSelected: !chatSelected,
      checkedChatRoom: false
    },()=>{
      this.forceUpdate()
    })
  }

  handleChatOpen = (uid)=>{
    this.setState({
      uid: uid,
      chatSelected: true
    },()=>{
      this.checkChatRoomFromUid()
    })
  }


  renderChatScreen = ()=>{
    if(this.state.hasChats === null) return <ContentLoader text="Loading..."/>
    if(!this.state.chatSelected){ // check if user has selected a chat
      if(!this.state.hasChats){ // check if user has any chats in their chatroom
        return <SearchUsers />
      }
      return <ChatSelector 
                  loggedInUserProfile={this.props.loggedInUserProfile} 
                  chats={this.state.chats}
                  toggleChatSelect={this.handleChatOpen}/>
    }
    else{
      if(!this.state.checkedChatRoom) return <ContentLoader text="Opening chat..."/>
      return <ChatRoom 
                   {...this.props}
                   chatRoom={this.state.chatRoom} 
                   toggleChatSelect={this.toggleChatSelect}/>
    }
  }
  
  render() {
    return <><HtmlHead/>{this.renderChatScreen()}<HtmlFoot/></>
  }
}

