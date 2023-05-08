const app = getApp()
const wxpay = require('../../utils/pay.js')
const dateUtil = require('../../utils/date.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')//获取应用实例
const date = require('../../utils/date.js')
Page({
  data: {
    coupons: [],
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
    var {current_no,page_size}=this.data;
   
    this.setData({
      current_no:current_no+page_size
    })
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
      useStatus: status,
      coupons:[]
    })
    this.getMyCoupons(status);

  },
  onLoad: function () { },
  onShow: function () {
    this.setData({
      coupons:[]
   })
    this.getMyCoupons(1);
  },
  getMyCoupons: function (status, callback) {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多的数据'
      })
      return;
    }
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