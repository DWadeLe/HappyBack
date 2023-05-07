const app = getApp()
const wxpay = require('../../utils/pay.js')
const dateUtil = require('../../utils/date.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')//获取应用实例
const date = require('../../utils/date.js')
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
    useStatus: 1,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no: 0,
    isLastPage: false,
    page_size: 10
  },
  //触底刷新
  onReachBottom() {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多的数据'
      })
      return;
    }
    var that = this;
    var { current_no, page_size, payStatus } = this.data;

    current_no = current_no + page_size;
    var param = {
      current_no,
      page_size
    }

    var userInfo = wx.getStorageSync('userInfo');
    WXAPI.queryCouponsByUser(userInfo.id, param).then(function (res) {
      var coupons = res;
      coupons.forEach(item => {
        item.expire_time = dateUtil.toDate(item.expire_time)
        item.use_time = dateUtil.toDate(item.use_time)
      })
      that.setData({
        coupons: coupons,
      });
      if (callback)
        callback()

      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  onPullDownRefresh() {
    var that = this;
    this.getMyCoupons(this.data.status, () => {
      that.setData({
        'baseRefresh.value': false
      })
    });

  },
  onScroll(e) {
    const { scrollTop } = e.detail;

    this.setData({
      backTopVisible: scrollTop > 100,
    });
  },
  onTabsClick(e) {

    var status = e.detail.value;
    this.setData({
      useStatus: status
    })
    this.getMyCoupons(status);

  },
  onLoad: function () { },
  onShow: function () {
    this.getMyCoupons(1);
  },
  getMyCoupons: function (status, callback) {
    var that = this;
    this.setData({
      current_no: 0,
      isLastPage: false
    })
    var { current_no, page_size } = this.data;
    var param = {
      current_no,
      page_size,
      status
    }
    var userInfo = wx.getStorageSync('userInfo');
    WXAPI.queryCouponsByUser(userInfo.id, param).then(function (res) {
      var coupons = res;
      coupons.forEach(item => {
        item.expire_time = dateUtil.toDate(item.expire_time)
        item.use_time = dateUtil.toDate(item.use_time)
      })
      that.setData({
        coupons: coupons,
      });
      if (callback)
        callback()

      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  goBuy: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }

})