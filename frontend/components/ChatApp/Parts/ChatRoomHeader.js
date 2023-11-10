import { backEndUrl, imageUrlFormat } from '@/Constants';
import Link from 'next/link';
import React from 'react';

export default class ChatRoomHeader extends React.Component{
    constructor(props){
     super(props)
     this.state = {
        profileDetails: null
     }
    }

    componentDidMount(){
        const userProfile = this.props.userProfile
        const profileDetails = userProfile.type === 'driver'? userProfile.driverProfile.details : userProfile.carOwnerProfile.details
        this.setState({
            profileDetails: profileDetails
        })
    }

    getNamesFromProfile = (profileDetails)=>{
        let firstname = this.state.profileDetails.firstname
        let lastname = this.state.profileDetails.lastname
        if(firstname === null || lastname === null) return this.props.userProfile.username
        return <span style={{textTransform:'capitalize'}}>{firstname + " " + lastname}</span>
      } 
     
     renderNumberOrPoints = ()=>{
        if(this.props.loggedInUserProfile.type === "car-owner"){
            //PHONE LINK
            const profile_url = '/profile?uid='+this.props.userProfile.id+'&user_type='+this.props.userProfile.type
            return <Link type="button" href={profile_url+'&showNum'} style={{color:"green"}} className="text-xl text-gray-500 border-0 btn dark:text-gray-300 lg:block" data-tw-toggle="modal" data-tw-target="#audiCallModal"><i className="ri-phone-line" /></Link>
        }
        else{
            return <span id="chatpointsdisplay" style={{color:'forestgreen'}}>{this.props.loggedInUserProfile.chatpoints === null? '0 CPs' : this.props.loggedInUserProfile.chatpoints+" CPs"}</span>
        }
        
     } 

    render(){
     if(this.state.profileDetails === null) return <></>
     return (
        <div className="p-4 border-b border-gray-100 lg:p-6 dark:border-zinc-600" style={{position:"fixed",maxWidth:"800px",margin:'0 auto',top:"0px",left:"0",right:"0",zIndex:"1",backgroundColor: "#262E35"}}>
        <div className="grid items-center grid-cols-12">
        <div className="col-span-8 sm:col-span-4">
            <div className="flex items-center">
            <div className="block ltr:mr-2 rtl:ml-2">
                <Link href="/chat?uid=0" onClick={this.props.toggleChatSelect} className="p-2 text-gray-500 user-chat-remove text-16"><i className="ri-arrow-left-s-line" /></Link>
            </div>
            <div className="rtl:ml-3 ltr:mr-3">
                <img src={backEndUrl + imageUrlFormat(this.state.profileDetails.profile_thumbnail_image,'thumbnail')} className="rounded-full h-9 w-9" alt />
            </div>
            <div className="flex-grow overflow-hidden">
                <h5 className="mb-0 truncate text-16 ltr:block rtl:hidden">
                    <a href="#" className="text-gray-800 dark:text-gray-50">
                        {this.getNamesFromProfile(this.state.profileDetails)}</a> 
                        {/* <i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 " /> */}
                        </h5>
                {/* <h5 className="mb-0 truncate text-16 rtl:block ltr:hidden"><i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 " /> <a href="#" className="text-gray-800 dark:text-gray-50">Doris Brown</a></h5> */}
            </div>
            </div>
        </div>
        <div className="col-span-4 sm:col-span-8">
            <ul className="flex items-center justify-end lg:gap-4">
                <li>
                {this.renderNumberOrPoints()}
                </li>
            </ul>
        </div>
        </div>
    </div>
     )
    }
}