const app = getApp()
const wxpay = require('../../utils/pay.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')//获取应用实例
Page({
  data: {
    coupons: [
      {
        "coupon_name": "2小时抵扣券",
        "coupon_type": 1,
        "discount": 0,
        "expire": true,
        "expire_time": "2019-08-24T14:15:22Z",
        "hour": 0,
        "id": 0,
        "status": 1,
        "use_time": "2023-05-24T14:15:22Z",
        "user_id": 0,
        "venue_type": 0,
        "wx_no": "string"
      },
      {
        "coupon_name": "大包间包场券",
        "coupon_type": 2,
        "discount": 0,
        "expire": true,
        "expire_time": "2019-05-24T14:15:22Z",
        "hour": 0,
        "id": 0,
        "status": 2,
        "use_time": "2019-08-24T14:15:22Z",
        "user_id": 0,
        "venue_type": 0,
        "wx_no": "string"
      }
    ],
    useStatus:1,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no:1,
    isLastPage:false,
    page_size:10
  },
  onPullDownRefresh() {
    var that=this;
    this.getMyCoupons(this.data.status,()=>{
        that.setData({
          'baseRefresh.value':false
        })
    });

  },
  onScroll(e) {
    const { scrollTop } = e.detail;

    this.setData({
      backTopVisible: scrollTop > 100,
    });
  },
  onTabsClick(e){
        
        var status=e.detail.value;
        this.setData({
          useStatus:status
        })
        this.getMyCoupons(status);

  },
  onLoad: function() {},
  onShow: function() {
    this.getMyCoupons(1);
  },
  getMyCoupons: function(status,callback) {
    var that = this;
    WXAPI.queryCouponsByUser("3").then(function(res) {
      var coupons=res;
      that.setData({
        coupons: coupons,
      });
      if(callback)
          callback()
        
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  goBuy: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }

})