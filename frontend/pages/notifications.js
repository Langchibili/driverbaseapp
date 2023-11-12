import React from "react";
import  {  getLoggedInUserData, getUserFromUid } from "@/Constants";
import ContentLoader from "@/components/Includes/ContentLoader";
import Link from "next/link";
import { getFCMToken, requestNotificationPermission } from "@/components/Includes/firebase";
import { Alert } from "@mui/material";
import HtmlHead from "@/components/Meta/HtmlHead";
import HtmlFoot from "@/components/Meta/HtmlFoot";
import { useRouter } from "next/router";

export default function Notifications() {
    const router = useRouter();
    let { uid,jwt } = router.query
    const [data, setData] = React.useState({ loading: true, user: 'not-found' });
    
    React.useEffect(() => {
      if (uid && uid !== undefined) {
        async function fetchData() {
          const user = await getUserFromUid(uid) 
          setData({ loading: false, user: user });
        }
        fetchData();
      }
    }, [uid]);

    return (
        <Notify user={data.user} jwt={jwt} uid={uid}/>
    )
}

class Notify extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          notificationsAllowed: false,
          unsuportedBrowser: false,
          loggedInUser: this.props.loading? null : null
        }
      }

    async componentDidMount(){
        if('Notification' in window){
            if(this.props.user !== 'not-found'){
                this.setState({
                    loggedInUser: this.props.user
                }, async ()=>{
                    if(this.state.loggedInUser !== 'logged-out' && this.state.loggedInUser !== null){
                        const permissionGranted = await requestNotificationPermission();
                        if(permissionGranted) {
                            getFCMToken(this.props.jwt,this.props.uid) // upload the token to user's user object
                            this.setState({
                                notificationsAllowed: true
                            })
                        }
                    return
                    }
                })
            }
            else{
                const loggedInUser = await getLoggedInUserData()
                this.setState({
                    loggedInUser: loggedInUser
                }, async ()=>{
                    if(this.state.loggedInUser !== 'logged-out' && this.state.loggedInUser !== null){
                        const permissionGranted = await requestNotificationPermission();
                        if(permissionGranted) {
                            getFCMToken() // upload the token to user's user object
                            this.setState({
                                notificationsAllowed: true
                            })
                        }
                    return
                    }
                })
            }
        }
        else{
            this.setState({
                unsuportedBrowser: true
            })
        }
    }
    renderContent = ()=>{
       if(this.state.loggedInUser === null) return <ContentLoader text="checking browser..."/>
       if(this.state.loggedInUser === 'logged-out') return <><div>You are logged out</div><div><Link style={{color:"cadetblue",border:"1px solid cadetblue",display:"inline-block",borderRadius:4,padding:5,marginTop:5,fontWeight:900}} href="/login">Login First</Link></div></>
       if(!this.state.notificationsAllowed) return <><div style={{color:"forestgreen"}}>Please allow notifications to be able to chat with other users or get notifications on new postings. However if you are using the mobile application, visit the web page. And we recomend that you open the web page in a google chrome browser .</div><Link style={{color:"cadetblue",border:"1px solid cadetblue",display:"inline-block",borderRadius:4,padding:5,marginTop:5,fontWeight:900}} href="driverbase.app/notifications">Allow Notifications</Link></>
       if(this.state.notificationsAllowed) return <Alert severity="success">Great! You are now all set...</Alert>
    }
    render(){
        return <><HtmlHead pageTitle="Notifications Permission" /><div style={{padding:10,width:'100%',margin:'0 auto',textAlign:'center'}}>{!this.state.unsuportedBrowser? this.renderContent() : <>This browser cannot set notifications, please copy the url and paste in another browser, <strong>Google Chrome</strong> is recommended</> }</div><HtmlFoot/></>
    }
}