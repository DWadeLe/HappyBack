const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    swiperCurrent: 0, //当前banner所在位置
    bannerList: [],
    shopDetail:{
      latitude:30.530243,
      longitude:104.089588,
      name:"HappyBack主机游戏社",
      address:"四川成都市双流区观东一街666号4栋1单元213",
      bussinessTime:"12:00-22:00",
      contractPhone:"18512321654"
    }
  },
  onShow(){
    

  },
  swiperchange: function(e) { // banner滚动事件
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onCopyText() {
    wx.setClipboardData({     
       data: this.data.shopDetail.contractPhone,      
       success(res) {
        wx.showToast({         
          title: '复制成功',          
          icon: 'success'
        })
      }})
    },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function(e) {
    
    this.setData({
       "bannerList":[
           {
             "businessId":"1",
             "picUrl":"../../images/banner/banner1.jpg"
           },
           {
            "businessId":"2",
            "picUrl":"../../images/banner/banner2.jpg"
          },
          {
            "businessId":"3",
            "picUrl":"../../images/banner/banner3.jpg"
          }

       ]
    })
    
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  getCoupons: function() {
    var that = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        that.setData({
          coupons: res.data
        });
      }
    })
  },
  goGamelib(e){
      // const aid='200376800'
      // const timestamp=new Date().getTime()
      // const path=`pages/video/video?__preload_=${timestamp*10+3}&__key_=${timestamp*10+4}&avid=${aid}`
      // wx.navigateToMiniProgram({
      //   appId: 'wx7564fd5313d24844',
      //   path,
      //   success: res => {
      //     console.log('跳转成功')
      //   }
      // })

      wx.navigateTo({
        url: '/pages/gamelib/index',
      })
    
    Toast({
      context: this,
      selector: '#t-toast',
      message: '游戏库暂未建设完成',
      theme: 'warning',
      direction: 'column',
    });
  },
  goMap(e){ // 打开地图
    var item=this.data.shopDetail
    wx.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      address: item.address,
    })
  },
  callPhone(e){
    const tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})