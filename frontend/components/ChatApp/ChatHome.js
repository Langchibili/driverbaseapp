import React, { Component } from 'react';
import ChatRoom from './Views/chatroom';
import ChatSelector from './Views/chatselector';
import SearchUsers from './Views/search_users';
import HtmlHead from './Meta/HmtlHead';
import HtmlFoot from './Meta/HtmlFoot';
import ContentLoader from '../Includes/ContentLoader';
import { api_url, clientUrl, fakeStr1, fakeStr2, getJwt, getLoggedInUserWithChatData, socketUrl } from '@/Constants';
import { io } from "socket.io-client";
import { getFCMToken, requestNotificationPermission } from '../Includes/firebase';
const socket = io(socketUrl); // SOCKET STUFF

export default class ChatHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
        uid: this.props.uid,
        chats: this.props.loggedInUserProfile.chatRooms.filter((chatRoom)=> parseInt(chatRoom.messagesCount) !== 0),
        chatRooms: this.props.loggedInUserProfile.chatRooms, // for filtering to check if user has chat with certain uid
        chatRoom: null,
        hasChats: null,
        checkedChatRoom: false,
        selectUsers: false,
        refleshChat: false,
        notificationsAllowed: false,
        chatSelected: this.props.chatSelected 
    }
  }

  async componentDidMount(){
    const token = await getFCMToken() // get existing token
    if(token === null || token === undefined){
      const permissionGranted = await requestNotificationPermission();
      if(permissionGranted){
          this.setState({
            notificationsAllowed: true,
            errorExists: false
          },()=>{
            this.initialSetUp() // run initial setups
            getFCMToken() // upload the token to user's user object
          })
      } 
    }
    else{
      this.setState({
        notificationsAllowed: true
      },()=>{
        this.initialSetUp() // run initial setups
        getFCMToken() // upload the token again to user's user object, rerun incase the token expired so u regained it
      })
    }
}

  initialSetUp = () =>{
    // emitEvent(socket,'new-deposit', 1)
    socket.on('msgfor'+this.props.loggedInUserProfile.id, async (data)=>{ // handle message reception stuff
     console.log('a new message arrived',data)
     const loggedInUserProfile = await getLoggedInUserWithChatData() 
     if(loggedInUserProfile === 'logged-out') return // means either you have a connection problem or your token has expired
     this.setState({ // new data
       chats: loggedInUserProfile.chatRooms.filter((chatRoom)=> parseInt(chatRoom.messagesCount) !== 0),
       chatRooms: loggedInUserProfile.chatRooms, 
       refleshChat: true
     })
   })
  //this.getCall(socket) // the the client

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
     chatRoom = this.state.chatRooms.filter(chatRoom => {
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

  toggleSelectUsers = ()=>{
    const selectUsers = this.state.selectUsers
    this.setState({
      selectUsers: !selectUsers
    },()=>{
      this.forceUpdate()
    })
  }
  stopChatReflesh = ()=>{
    this.setState({
      refleshChat: false
    })
  }

  renderChatScreen = ()=>{
  
    if(!this.state.notificationsAllowed) return <div style={{width:'100%',margin:'0 auto',textAlign:'center'}}><div style={{color:"forestgreen",fontWeight:600,padding:10}}>You must allow notifications to proceede. You cannot open any chat with anyone unless you do so. If you are using the mobile application, visit the web page by clicking the link below to allow notifications, then come back to the app. And we recomend that you open the web page in a google chrome browser </div><a style={{color:"cadetblue",border:"1px solid cadetblue",display:"inline-block",borderRadius:4,padding:5,marginTop:5,fontWeight:900}} href={clientUrl+"/notifications?jwt="+fakeStr1+getJwt()+fakeStr2+"&uid="+this.props.loggedInUserProfile.id} target="_blank">Allow Notifications</a></div>
    if(this.state.hasChats === null) return <ContentLoader text="Loading..."/>
    if(this.state.selectUsers) return <SearchUsers  toggleSelectUsers={this.toggleSelectUsers} hasChats={true}/>
    if(!this.state.chatSelected){ // check if user has selected a chat
      if(!this.state.hasChats){ // check if user has any chats in their chatroom
        return <SearchUsers  toggleSelectUsers={this.toggleSelectUsers} hasChats={false}/>
      }
      return <ChatSelector 
                  loggedInUserProfile={this.props.loggedInUserProfile} 
                  chats={this.state.chats}
                  toggleChatSelect={this.handleChatOpen}
                  toggleSelectUsers={this.toggleSelectUsers}
                  refleshChat={this.state.refleshChat}
                  stopChatReflesh={this.stopChatReflesh}
                  />
    }
    else{
      if(!this.state.checkedChatRoom) return <ContentLoader text="Opening chat..."/>
      return <ChatRoom 
                   socket={socket}
                   {...this.props}
                   chatRoom={this.state.chatRoom} 
                   toggleChatSelect={this.toggleChatSelect}
                   refleshChat={this.state.refleshChat}
                   stopChatReflesh={this.stopChatReflesh}
                   />
    }
  }
  
  render() {
    return <><HtmlHead/>{this.renderChatScreen()}<HtmlFoot/></>
  }
}
