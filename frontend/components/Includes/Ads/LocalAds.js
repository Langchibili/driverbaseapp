import { api_url, backEndUrl, imageUrlFormat } from "@/Constants";
import Link from "next/link";
import React from "react"

export default class LocalAds extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            type: null,
            image: null,
            images: null,
            video: null,
            videos: null
        }
    }
   fetchAd = async ()=>{
        try {
            const ad = await fetch(api_url+'/ads?title='+this.props.title+'&populate=image,images,video,videos', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
            })
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.error(error));
            return ad.data[0].attributes
          } catch (error) {
             console.error('Error loading ad:', error);
          }
    }
    async componentDidMount(){
        const ad = await this.fetchAd()
        console.log(ad)
        if(ad !== null && ad !== undefined){
            this.setState({
                ...ad
            },()=>{
                let type = 'image'
                if(this.state.images.data !== null) type = 'images'
                if(this.state.video.data !== null) type = 'video'
                if(this.state.videos.data !== null) type = 'videos'
                this.setState({
                    type: type
                })
            })
        }
        
    }
    renderAd = ()=>{
           if(this.state.type === null) return <></> // means either still loading or not found
           if(this.state.type === 'image'){
              return <Link href={this.state.link}><img src={backEndUrl + imageUrlFormat(this.state.image.data.attributes)} style={{width:'100%'}}/></Link>
           }
           else if(this.state.type === 'images'){ // a carousel
            return <></>
           }
           else if(this.state.type === 'video'){ // a video ad
            return <></>
           }
           else if(this.state.type === 'videos'){ // a video carousel
            return <></>
           }
    }
    render(){
       return <div style={{width:'100%',marginBottom:10}}><small>Ad</small>{this.renderAd()}</div>
    }
}