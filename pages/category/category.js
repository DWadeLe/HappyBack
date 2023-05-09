// pages/category/category.js

const WXAPI = require('../../wxapi/main')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [{
      "name":"包间",
      "scrollId":"1"
    },{
      "name":"大厅",
      "scrollId":"2"
    }],
    goodsWrap: [],
    categorySelected: 1,
    goodsToView: "",
    categoryToView: "",
    hall:[],
    privateRoom:[],
    showData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },
  initData() {

    wx.showNavigationBarLoading();
    this.getGoodsList()
  },
  getGoodsList: function() {
    let that = this;
    WXAPI.queryVenue({
    }).then(function(res) {
      var venueList=res;
      var hall=[];
      var privateRoom=[];
      venueList.forEach((element,index) => {
           
          if(element.type==1){
            hall.push(element);
          }else{
            privateRoom.push(element)
          }
          
     
      });
      that.setData({
        hall: hall,
        privateRoom: privateRoom,
        showData:that.data.categorySelected==2?hall:privateRoom,
      })
      wx.hideNavigationBarLoading();
    }).catch((e) => {

      wx.hideNavigationBarLoading();
    });
  },
  toDetailsTap: function(e) {
    
    wx.navigateTo({
      url: "/pages/venue-details/index?data=" + JSON.stringify(e.currentTarget.dataset.data)
    })
  },
  onCategoryClick: function(e) {
    
    let type = e.detail.value;
    console.log(e)
    this.setData({
      goodsToView: type,
      categorySelected: type,
      showData:type==1?this.data.privateRoom:this.data.hall
    })
    

  },
  
})