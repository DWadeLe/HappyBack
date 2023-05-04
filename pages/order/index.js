// pages/order/index.js
const app = getApp()
const wxpay = require('../../utils/pay.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[{"status":85,"ext":{},"need_pay":true,"wx_no":"reprehenderit dolor sit","order_time":"2017-07-30 08:03:38","id":79,"goods_desc":"exercitation Duis esse officia qui","business_no":8,"payment_method":56,"amount":21,"goods_name":"器铁根业克民动","user_id":67,"payment_time":"1987-11-03 21:40:30","payment_venue":77,"origin_amount":82,"order_no":"Duis"},{"goods_name":"工她高八别复","order_time":"2015-05-05 11:15:43","payment_venue":94,"origin_amount":44,"ext":{},"business_no":18,"amount":28,"goods_desc":"minim cillum","payment_time":"1979-08-19 19:23:05","wx_no":"dolore laboris elit aliquip do","user_id":4,"need_pay":false,"payment_method":35,"status":38,"id":64,"order_no":"occaecat aliquip minim"},{"order_no":"Excepteur in cupidatat labore","goods_desc":"veniam fugiat Excepteur esse","payment_time":"2017-10-30 01:40:29","status":17,"id":22,"goods_name":"自格阶解层型大","need_pay":true,"payment_method":96,"payment_venue":48,"wx_no":"do qui mollit","ext":{},"amount":11,"origin_amount":23,"order_time":"2021-10-28 12:14:01","user_id":77,"business_no":49},{"wx_no":"dolore deserunt consequat","need_pay":false,"ext":{},"user_id":8,"payment_time":"2018-07-11 16:34:23","id":96,"payment_venue":37,"goods_name":"导则准里","payment_method":22,"order_no":"in consectetur proident commodo","origin_amount":16,"status":29,"amount":75,"business_no":78,"order_time":"1987-03-27 13:54:20","goods_desc":"proident reprehenderit non"}],
    payStatus:1,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    pageNo:1,
    totalNum:null,
    pageSize:10
  },
  onTabsClick(e){
      var payStatus=e.detail.value;
       this.setData({
           payStatus
       })
       this.queryOrder(payStatus);
  },

  queryOrder(payStatus){
    var that=this;
    var wx_no=wx.getStorageSync('wx_no'); 
    WXAPI.queryOrder(wx_no).then(function(res) {
      
      var orderList=res;
      that.setData({
        orderList: orderList,
      });
      
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

      this.queryOrder();
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