// pages/vip/index.js
const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const dateUtil = require('../../utils/date.js')
import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{},
      vipList:[]
  },
  queryVIPList(){

      let that = this;
  
      WXAPI.queryVIPList().then(function(res) {
        var vipList=res;
        
        that.setData({
          vipList
        });
        wx.hideNavigationBarLoading();
      }).catch((e) => {
        wx.hideNavigationBarLoading();
      });
  },
  goBuy(e){

    let that = this;
     
    WXAPI.buyVip(e.currentTarget.dataset.id,{
       user_id:this.data.userInfo.id
    }).then(function(res) {
      
      if(res.code==200){
         wx.showToast({
           title: '会员订购成功',
         })
         setTimeout(function () {
          wx.navigateTo({
            url: "/pages/my/index"
          })
        }, 1000)
      }else{
        Toast({
          context: that,
          selector: '#t-toast',
          message: "会员订购失败:"+res.message,
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
           this.setData({
            userInfo:wx.getStorageSync("userInfo")

           })
           this.queryVIPList();
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