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
    categorySelected: 1,
    goodsToView: "",
    categoryToView: "",
    hall:[],
    privateRoom:[],
    showData:[],
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
      venueList.forEach((element,index) => {
          if(element.type==0){
            hall.push(element);
          }else{
            privateRoom.push(element)
          }
          
          //mock 数据
          element.icon="../../images/banner/banner"+(index%3+1)+".jpg";
     
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

    let id = e.detail.value;
    console.log(e)
    this.setData({
      goodsToView: id,
      categorySelected: id,
    })
    this.getGoodsList(id)


  },
  
})