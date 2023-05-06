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
    orderList:[],
    payStatus:2,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no:1,
    isLastPage:false,
    page_size:10,

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

  queryOrder(payStatus,callback){
    var that=this;
    var user_id=wx.getStorageSync('user_id'); 
    this.setData({
        current_no:1,
        isLastPage:false
    })
    var {current_no,page_size}=this.data;
    var param={
        current_no,
        page_size
    }
    
    if(Number(payStatus)<2)
        param.status=payStatus
    
    WXAPI.queryOrder(user_id,param).then(function(res) {
      
      var orderList=res;
      orderList.forEach(item=>{
        item.order_time=dateUtil.toDate(item.order_time);
        item.payment_time=dateUtil.toDate(item.payment_time);
      })
      that.setData({
        orderList: orderList,
      });
      if(callback){
          callback()
      }
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  //触底刷新
  onReachBottom(){
    if(this.data.isLastPage){
      wx.showToast({
        title: '没有更多的数据'
      })
      return;
    }
    var that=this;
    var user_id=wx.getStorageSync('user_id'); 
    var {current_no,page_size,payStatus}=this.data;
    
    current_no++;
    var param={
      current_no,
      page_size
  }
  if(payStatus)
      param.status=payStatus
    WXAPI.queryOrder(user_id,param).then(function(res) {
      
      var orderList=res;

      if(orderList.length>0){
        orderList.forEach(item=>{
          item.order_time=dateUtil.toDate(item.order_time);
          item.payment_time=dateUtil.toDate(item.payment_time);
        })
        var newList=that.data.orderList.concat(orderList);
         that.setData({
          orderList: newList,
          current_no
         });
      }else{
        that.setData({
          isLastPage: true,
         });
      }
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
    wx.setStorageSync('user_id',4);
      this.queryOrder(this.data.payStatus);
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