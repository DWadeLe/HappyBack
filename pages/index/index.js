const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    swiperCurrent: 0, //当前banner所在位置
    bannerList: [],
    shopDetail: {
      latitude: 30.530243,
      longitude: 104.089588,
      name: "HappyBack主机游戏社",
      address: "四川成都市双流区观东一街666号4栋1单元213",
      bussinessTime: "12:00-22:00",
      contractPhone: "18512321654",
     
      
    },
    itemWidth:null,
    itemHeight:null,
    parentWidth:null,
    parentHeight:null,
    activityList:[
      {
       "id":1,
       "name":"会员专区",
       "pic":"https://7072-prod-8g7u9tmqac56ab70-1318102458.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230516102005.jpg?sign=42fe58f8fd1b4b2f59d26cb580a94ac6&t=1684203675",
       "jumpUrl":"/pages/buy-vip/index"
      },
 ],
  },
  onShow() {

    const systemInfo = wx.getSystemInfoSync();
    var screenHeight = systemInfo.screenHeight;
    var screenWidth = systemInfo.screenWidth;
    var margin = screenWidth * 20 / 750;
    var itemWidth = (screenWidth - 3 * margin) / 2;
    var swiperHeight=475 * screenWidth /750;
    const windowHeight = systemInfo.windowHeight; // 可视区域高度
    const statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度
    const navBarHeight = 44; // 顶部导航栏高度
    const tabBarHeight = 50; // 底部导航栏高度，注意这个值是固定的
    /**
     * 当我们自定义custiom的时候，底部导航栏不在可视区里面
     * https://blog.csdn.net/qq_46199553/article/details/126030693
     */
    const contentHeight = windowHeight  - navBarHeight - statusBarHeight;
    const fontSize= 48 * screenWidth /750

    var itemHeight = (contentHeight - margin * 4 -swiperHeight) / 4;
    var parentWidth= screenWidth / 2 ;
    var parentHeight= contentHeight - swiperHeight;
    this.setData({
       itemWidth,
       itemHeight,
       parentWidth,
       parentHeight,
       margin,
       fontSize
    })
    console.log(itemWidth,itemHeight)

  },
  swiperchange: function (e) { // banner滚动事件
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
      }
    })
  },
  jumpToUrl(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  goBuyVip(){
    wx.navigateTo({
      url: "/pages/buy-vip/index"
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function (e) {

    this.setData({
      "bannerList": [
        {
          "businessId": "1",
          "picUrl": "../../images/banner/banner1.jpg"
        },
        {
          "businessId": "2",
          "picUrl": "../../images/banner/banner2.jpg"
        },
        {
          "businessId": "3",
          "picUrl": "../../images/banner/banner3.jpg"
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
  getCoupons: function () {
    var that = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        that.setData({
          coupons: res.data
        });
      }
    })
  },
  goGamelib(e) {


    wx.switchTab({
      url: '/pages/gamelib/index',
    })

    // Toast({
    //   context: this,
    //   selector: '#t-toast',
    //   message: '游戏库暂未建设完成',
    //   theme: 'warning',
    //   direction: 'column',
    // });
  },
  goMap(e) { // 打开地图
    var item = this.data.shopDetail
    wx.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      address: item.address,
    })
  },
  callPhone(e) {
    const tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})