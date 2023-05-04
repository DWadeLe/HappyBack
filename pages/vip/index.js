// pages/vip/index.js
const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{"vip_id":66,"nick_name":"戴静","id":49,"vip_expire_time":"2018-03-18 11:10:49","create_time":"1977-10-04 13:26:01","vip":false,"vip_name":"军据支","wx_no":"mollit ipsum adipisicing Lorem","phone_no":"18128381845"},
      isVip:true
  },
  queryVIP(){

      let that = this;
  
      WXAPI.queryUser('').then(function(res) {
        var userInfo=res;
        that.setData({
          userInfo: userInfo,
        });
        console.log(userInfo);
          this.setData({
          isVip: (userInfo.vip_id!='' && userInfo.vip_expire_time>''),
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
           this.queryVIP();
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