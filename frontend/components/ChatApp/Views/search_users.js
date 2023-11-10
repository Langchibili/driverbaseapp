import React from 'react';
import Link from 'next/link';
export default function SearchUsers(props) {
    return (
    <div style={{width:'100%',margin:'0 auto',textAlign:'center',padding:5}}>
      Search for users to chat with
      <p><strong><Link style={{border:'1px solid cadetblue',color:'cadetblue',padding:5,display:'inline-block',margin:5,borderRadius:5}} href="/drivers">Drivers</Link></strong></p> 
      or 
      <p><strong><Link style={{border:'1px solid cadetblue',color:'cadetblue',padding:5,display:'inline-block',margin:5,borderRadius:5}} href="/car_owners">Car Owners</Link></strong></p>
      {!props.hasChats? "": <>or <p><Link onClick={props.toggleSelectUsers} style={{border:'1px solid lightgreen',color:'lightgreen',padding:5,display:'inline-block',margin:5,borderRadius:5}} href="/chat?uid=0">Return To Chat Home</Link></p></>}
    </div>
  )
}