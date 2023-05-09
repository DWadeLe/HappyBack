// pages/appointment/index.js
const WXAPI = require('../../wxapi/main')
const dateUtil = require('../../utils/date.js')

const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
import drawQrcode from '../../utils/weapp.qrcode.min.js'

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

  },
 
  onLoad(e) {
      var data=e.data;
      this.data.appointment=data;
  },
  /**
   * 核销确认
   */
  toConfirm(){
      //TODO 
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