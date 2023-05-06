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
    appointmentList: [],
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no: 1,
    isLastPage: false,
    page_size: 10,
    status: 2,
    qrCodeVisible:false,

  },
  closeQrCode(){
    this.setData({
      qrCodeVisible:false
    })
  },
  async showQrcode(e) {
    var that = this
    var id = e.currentTarget.dataset.id

    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: "https://www.llkkk.fun/",
      _this: that
    })
    this.setData({
      qrCodeVisible:true
    })

    
  },
  onPullDownRefresh() {
    var that = this;
    this.queryAppointmentByUser(this.data.status, () => {
      that.setData({
        'baseRefresh.value': false
      })
    });

  },
  onScroll(e) {
    const {
      scrollTop
    } = e.detail;

    this.setData({
      backTopVisible: scrollTop > 100,
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
    var that = this;
    this.queryAppointmentByUser(this.data.status);
  },

  queryAppointmentByUser(status) {
    var that = this;
    var {
      current_no,
      page_size
    } = this.data;
    WXAPI.queryAppointmentByUser(4, {
      status,
      current_no,
      page_size
    }).then(function (res) {
      var info = res;
      if (info && info.length > 0) {
        info.forEach(item => {

          item.date = dateUtil.toDate(item.date)
        })
        that.setData({
          appointmentList: info
        })

      } else {
        that.setData({
          isLastPage: true
        })
      }


    })
  },
  onReachBottom() {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多的数据',
      })
      return
    }
    var status = this.data.status;
    var that = this;
    var {
      current_no,
      page_size
    } = this.data;

    this.setData({
      current_no: current_no + 1
    })
    this.queryAppointmentByUser(status);
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