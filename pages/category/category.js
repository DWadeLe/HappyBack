// pages/category/category.js

const WXAPI = require('../../wxapi/main')

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
    categorySelected: "",
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
    this.getGoodsList(1)
  },
  getGoodsList: function(type) {
    let that = this;
    WXAPI.queryVenue({
    }).then(function(res) {
      var venueList=res;
      var hall=[];
      var privateRoom=[];
      venueList.forEach(element => {
          if(element.type==0){
            hall.push(element);
          }else{
            privateRoom.push(element)
          }
      });
      that.setData({
        hall: hall,
        privateRoom: privateRoom,
        showData:type==0?hall:privateRoom,
        categorySelected:type
      })
      wx.hideNavigationBarLoading();
    }).catch((e) => {

      wx.hideNavigationBarLoading();
    });
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onCategoryClick: function(e) {

    let id = e.currentTarget.dataset.id;
    this.categoryClick = true;
    this.setData({
      goodsToView: id,
      categorySelected: id,
    })
    this.getGoodsList(id)


  },
  
})