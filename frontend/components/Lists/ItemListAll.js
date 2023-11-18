import React, { Component } from 'react';
import Drivers from './Drivers';
import CarOwners from './CarOwners';
import Jobs from './Jobs';
import PaginationLinks from './PaginationLinks';
import ContentLoader from '../Includes/ContentLoader';

class ItemListAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items:[],
      itemsToDisplay: [],
      pageCount: 1,
      itemStart: 1,
      itemsCount: 0,
      currentPage: NaN,
      itemsLimit: 10,
      contentLoaded: false,
      initialItemsLoaded: true
      // Initial state goes here
    }
  }

  getPageItems(items, currentPage, itemsPerPage) {
    console.log('user jobs',items)
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    return items.slice(startIndex, endIndex);
  }
  
  async loadNextBatch(startIndex, maxIndex, reqUrl) { 
    let urlExtension
    if(this.props.itemsName === 'jobs') urlExtension = '?pagination[start]='+startIndex+'&pagination[limit]='+maxIndex
    if(this.props.itemsName !== 'jobs') urlExtension = '&pagination[start]='+startIndex+'&pagination[limit]='+maxIndex
    const newItems = await fetch(reqUrl+urlExtension,{
      headers: {
        'Content-Type': 'application/json'
      }
     }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
    return newItems
  }
  
  getReqUrl = ()=>{
    if(this.props.itemsName === 'users'){
      if(this.props.listType === 'drivers') return this.props.api_url+this.props.reqUrlPath
      if(this.props.listType === 'car-owners') return this.props.api_url+this.props.reqUrlPath
    }
    else if(this.props.itemsName === 'jobs'){
      if(this.props.act === 'edit' || this.props.act === 'delete') return this.props.api_url+this.props.reqUrlPath
      return this.props.api_url+'/'+this.props.itemsName
     }
  }

  getInitialItems = async (reqUrl)=>{
    const itemsName = this.props.itemsName
    const items = await fetch(reqUrl,{
      headers: {
        'Content-Type': 'application/json'
      }
     }).then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
      //meta.pagination
      if('meta' in items){
        return items;
      }
      return []
  }
  getPageCount = (itemsCount,itemsPerPage)=>{
    const pageCount = itemsCount/itemsPerPage
    if (itemsCount % itemsPerPage !== 0) {
      return parseInt(pageCount) + 1
    } else {
      return parseInt(pageCount)
    }
  }

  checkListingEligibility = (user)=>{
    if(this.props.listType !== 'drivers' && this.props.listType !== 'car-owners') return true // only filtering drivers or now
    if(!user.attributes.hasOwnProperty('details'))  return false // you aren't eligible
    if(user.attributes.details === undefined )  return false // you aren't eligible
    if(user.attributes.details === null )  return false // you aren't eligible
    if(parseInt(user.attributes.userid) === 30) return true // some users who should be enlisted
    if(this.props.listType === 'drivers'){
      if(parseInt(user.attributes.userid) < 33) return false // removing users i use for tasting
    }
    if(this.props.listType === 'car-owners'){
      if(parseInt(user.attributes.userid) < 29) return false // removing users i use for tasting
    }
    return true
  }

  sortByThumbnailAdded = (users)=>{
    if(this.props.listType !== 'drivers' && this.props.listType !== 'car-owners') return
    const usersWithImages = users.filter((user)=>{
      return user.attributes.details.profile_thumbnail_image.data !== null
    })
    const usersWithoutImages = users.filter((user)=>{
      return user.attributes.details.profile_thumbnail_image.data === null
    })
    return [...usersWithImages,...usersWithoutImages]
  }

  async componentDidMount(){
    const reqUrl = this.getReqUrl()
    let items,pageCount,itemsToDisplay,itemsTotal // to be filled bellow

    let response = await this.getInitialItems(reqUrl) // get initial items
    if(response !== undefined){
      if('data' in response){ // if the response has .data property
        items = response.data
        if(this.props.listType !== 'jobs') items = items.filter((item)=>this.checkListingEligibility(item))
      }
      /* If it's a car ownwer managing posts */
      if(this.props.listType === 'jobs' && (this.props.act === 'edit' || this.props.act === 'delete')){ // if a user is editing or deleting their posts
          items = items.attributes.jobs.data 
      }
      if(items.length < 0){// if items are not found or zero
        this.setState({contentLoaded: true})
      }
      else{ 
        /* If it's a car ownwer managing posts */
        if(this.props.listType === 'jobs' && (this.props.act === 'edit' || this.props.act === 'delete')){ // if a user is editing or deleting their posts
            itemsTotal = items.length
            itemsToDisplay = this.getPageItems(items, 1, 30)// get page one elements  
            pageCount = this.getPageCount(itemsTotal,30) // get page count if it's to list a user's jobs
        }
        else{
            itemsTotal = response.meta.pagination.total
            itemsToDisplay = this.getPageItems(items, 1, 10)// get page one elements  
            pageCount = this.getPageCount(itemsTotal,10) // get page count if it's to list all 
        }
        
        if(this.props.listType !== 'jobs') items = items.filter((item)=>this.checkListingEligibility(item))

        this.setState({// add items to state
          items:items,
          pageCount: pageCount,
          itemsCount: itemsTotal,
          currentPage: 1,
          itemsToDisplay: itemsToDisplay
          //pageCount: items.meta.pagination.pageCount
        },async ()=>{
            const InitialItemsCount = this.state.items.length
            const itemsCount = this.state.itemsCount
            const itemsLeft = itemsCount - InitialItemsCount
            if(itemsLeft > 0){
              const items = this.state.items
              let newItems = await this.loadNextBatch(InitialItemsCount, itemsCount, reqUrl)
              if(newItems !== undefined) {
                  if('data' in newItems){ // if the response has .data proprty
                    newItems = newItems.data
                    if(this.props.listType !== 'jobs') newItems = newItems.filter((item)=>this.checkListingEligibility(item))
                  }
                  items.push(...newItems);
                  this.setState({
                    items:items,
                    contentLoaded: this.props.listType === 'jobs'
                  },()=>{
                    if(this.props.listType === 'jobs') return
                    this.setState({
                      items: this.sortByThumbnailAdded(this.state.items),
                      contentLoaded: true
                    })
                  })// add rest of the items
              } 
            }
            else{
              this.setState({contentLoaded: true})
            }
        })
      }
    }
    
  }
  

  renderList = ()=> {
    const items = this.state.itemsToDisplay
    const itemsName = this.props.itemsName // eg jobs, users
    const listItemBY = this.props.listItemsBy  // eg category, id
    const listType = this.props.listType // eg drivers, car-owners
    
    if(itemsName === 'users'){
        if(listType === 'drivers') return <Drivers drivers={items} {...this.props} listAll={true}/>
        if(listType === 'car-owners') return <CarOwners carOwners={items} {...this.props} listAll={true}/>     
    }
    else if(itemsName === 'jobs'){
        if(listType === 'jobs') return <Jobs jobs={items} {...this.props}  act={this.props.act}/>
    }

    return <></>
  }
  handlePageChange =(e,p)=>{
     this.setState({currentPage:p,contentLoaded: false},
        async ()=>{
          if(this.state.items.length > 0){
              const items = this.getPageItems(this.state.items, this.state.currentPage, 10)
              this.setState({// add items to show now
                itemsToDisplay: items,
                contentLoaded: true
              })
          }
  })
}
  
  render() {
    if(this.state.items === undefined) return <ContentLoader text={'Loading '+this.props.itemsName+ '...'}/>
    if(this.state.contentLoaded && this.state.items.length < 0) return <div><p>No {this.props.itemsName} available at the moment</p></div>
    return <> <div style={{minHeight: '600px'}}> {this.state.contentLoaded? this.renderList() : <ContentLoader text={'Loading '+this.props.itemsName+ '...'}/>} <div style={{minHeight:'50px'}}></div> <PaginationLinks handlePageChange={this.handlePageChange} itemsCount={this.state.pageCount} itemsName={this.props.itemsName} page={this.state.page}/></div></>
  }
}

export default ItemListAll;
