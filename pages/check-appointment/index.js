// pages/appointment/index.js
const WXAPI = require('../../wxapi/main.js')
const dateUtil = require('../../utils/date.js')

const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */

  data: {
    appointment: {},
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no: 0,
    isLastPage: false,
    page_size: 10,
    status: "-1",
    qrCodeVisible:false,
    sessionMap:{
      "1":"下午场",
      "2":"夜晚场"
    }
  },
 
  onLoad(e) {
      var id=e.id;
      this.setData({
       userInfo: wx.getStorageSync('userInfo'),
      })
      this.queryItem(id);
  },
  queryItem(id){
    WXAPI.queryAppointmentById(id).then(function(res) {
         
      this.setData({
        appointment:res
      })
       
      wx.hideNavigationBarLoading();
    }).catch((e) => {

      wx.hideNavigationBarLoading();
    });
  },
  /**
   * 核销确认
   */
  toConfirm(e){
      //TODO 

      WXAPI.verifAppointment(this.data.appointment.id).then(function(res) {
         
        if(res.code==200){
          wx.showToast({
            title: '核销成功',
          })
        }else{
          wx.showToast({
            title: '核销失败:'+res.msg,

          })
        }
         
        wx.hideNavigationBarLoading();
      }).catch((e) => {
  
        wx.hideNavigationBarLoading();
      });
      
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