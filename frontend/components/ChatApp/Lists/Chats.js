import React from 'react';
import Chat from '../Includes/Chat';

export default function Chats(props){
  return props.chats.map((chat)=>{
      return <Chat key={chat.id} chat={chat} {...props} />
    })
}
