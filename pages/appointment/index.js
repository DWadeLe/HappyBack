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
  closeQrCode(){
    this.setData({
      qrCodeVisible:false
    })
  },
  async showQrcode(e) {
    var that = this
    var data = e.currentTarget.dataset.data
    var content="/pages/check-appointment/index?id="+data.id;
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: content,
      _this: that
    })
    this.setData({
      qrCodeVisible:true
    })

    
  },
  onPullDownRefresh() {
    var that = this;
    var {current_no,page_size}=this.data;
   
    this.setData({
      current_no:current_no+page_size
    })
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
    this.setData({
       appointmentList:[]
    })
    this.queryAppointmentByUser(this.data.status);
  },

  queryAppointmentByUser(status) {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多的数据',
      })
      return
    }
    var that = this;
    var {
      current_no,
      page_size
    } = this.data;
    
    var param={
      current_no,
      page_size
    }
    if(status!="-1")
      param.status=status

    
    var userInfo=wx.getStorageSync('userInfo');
    that.setData({
      appointmentList: []
    })
    WXAPI.queryAppointmentByUser(userInfo.id, param).then(function (res) {
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
  onTabsClick(e){
    var status=e.detail.value;
    this.setData({
      status,
      current_no: 0,
      page_size: 10,
      appointmentList:[],
      isLastPage:false
    })
    this.queryAppointmentByUser(status);
  },
  onReachBottom() {
    var status = this.data.status;
    var that = this;
    var {
      current_no,
      page_size
    } = this.data;

    this.setData({
      current_no: current_no + page_size
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