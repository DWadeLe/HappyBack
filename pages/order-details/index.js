// pages/order/index.js
const app = getApp()
const wxpay = require('../../utils/pay.js')
const dateUtil = require('../../utils/date.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:{},
    userInfo:{},
    orderMethodMap:{
       1:"现金",
       2:"用券抵扣",
       3:"现金+券"
    },
    paymentVenueMap: {
      "1": "开通会员",
      "2": "预约",
      "3": "机位结算"
    },

  },
  
  onPullDownRefresh() {
    var that=this;
    this.queryOrder(this.data.payStatus,()=>{
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
      var payStatus=e.detail.value;
       this.setData({
           payStatus
       })
       this.queryOrder(payStatus);
  },

 
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    this.setData({
      orderDetail: JSON.parse(e.data),
      userInfo:wx.getStorageSync("userInfo")

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})