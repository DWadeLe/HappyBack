// pages/category/category.js

const WXAPI = require('../../wxapi/main')
const app = getApp();
import Toast from 'tdesign-miniprogram/toast/index';

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
    itemWidth:"",
    buttonMarginTop:"",
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
      
    const systemInfo = wx.getSystemInfoSync();
    var screenWidth = systemInfo.screenWidth;
    var margin = screenWidth * 20 / 750;
    var itemWidth = (screenWidth - 4 * margin) / 4;
    var buttonMarginTop=(itemWidth * 1.5-margin *2)/3
    

    this.setData({
       itemWidth,
       buttonMarginTop
    })
    this.initData();
  },
  startTime(e) {
    var that = this;

    WXAPI.startTime(e.currentTarget.dataset.id).then(res => {
      if (res.code == 200) {
        Toast({
          context: that,
          selector: '#t-toast',
          message: "开机成功",
          theme: 'success',
          direction: 'column',
        });
      } else {
        Toast({
          context: that,
          selector: '#t-toast',
          message: '开机失败:' + (res.msg || res.message),
          theme: 'error',
          direction: 'column',
        });
      }
      that.initData();

    })
  },
  confirmEndtime(e) {
    var that = this;

    WXAPI.endTime(e.currentTarget.dataset.id).then(res => {
      if (res.order_no) {
        Toast({
          context: that,
          selector: '#t-toast',
          message: "关机成功",
          theme: 'success',
          direction: 'column',
        });

        setTimeout(() => {
              wx.navigateTo({
                url: `/pages/settlement/index?order_no=${res.order_no}`
              })
        }, 500)
      } else {
        Toast({
          context: that,
          selector: '#t-toast',
          message: '开机失败:' + (res.msg || res.message),
          theme: 'error',
          direction: 'column',
        });
      }
      that.initData();
    })
  },
  async endTime(e) {
    var that = this;
    try {
      const res = await wx.showModal({
        title: '确认',
        content: '是否结束当前机位'
      })
      if (res.confirm) {
        that.confirmEndtime(e)
      } else if (res.cancel) {
        return;
      }
    } catch (e) {
      console.error(e)
    }
    
  },
  initData() {
    let that = this;
    wx.showNavigationBarLoading();
    this.getGoodsList();
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/venue-details/index?data=" + JSON.stringify(e.currentTarget.dataset.data)
    })
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