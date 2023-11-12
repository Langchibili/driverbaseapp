import React from 'react';
import Message from '../Includes/Message';

export default function Messages(props){
  return (
    <ul style={{marginTop:'60px'}}>
    {
       props.messages.map((message,index)=>{
             if(index === props.messages.length-1){
               return <Message key={message.id} id="last-message" message={message} {...props} />
             }
             return <Message key={message.id} message={message} {...props} />
       })
    }
    <div id="messages-start" style={{minHeight:'50px',marginBottom:"250px"}}></div>
 </ul>
  )
}
