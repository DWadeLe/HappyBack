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
    showData:[{"name":"接率道化","icon":"http://dummyimage.com/100x100","type":12,"status":1,"id":28,"desc":"occaecat cillum"},{"desc":"dolor dolore ut","icon":"http://dummyimage.com/100x100","name":"她类人元将","status":0,"id":12,"type":45},{"icon":"http://dummyimage.com/100x100","status":0,"desc":"anim labore amet nostrud deserunt","id":31,"name":"红府内","type":31},{"name":"如色治响","icon":"http://dummyimage.com/100x100","status":0,"id":65,"desc":"aliquip qui","type":68},{"icon":"http://dummyimage.com/100x100","name":"铁件回当","status":0,"id":66,"desc":"Lorem minim do","type":52}],
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