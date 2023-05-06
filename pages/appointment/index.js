// pages/appointment/index.js
const WXAPI = require('../../wxapi/main')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
import drawQrcode from '../../utils/weapp.qrcode.min.js'

Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    appointmentList:[],
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
    status:2,

  },
  showQrcode(e){
    var that=this
    var id=e.currentTarget.dataset.id
    console.log(e)
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: id,
      _this: that
    })
    wx.previewImage({
      urls: [id],
      current: 0
    })
  },
  onPullDownRefresh() {
    var that=this;
    this.queryAppointmentByUser(this.data.status,()=>{
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
    var that=this;
    this.queryAppointmentByUser(this.data.status);
  },

  queryAppointmentByUser(status){
    var that=this;
    var {current_no,page_size}=this.data;
    WXAPI.queryAppointmentByUser(4,{
      status,
      current_no,
      page_size
    }).then(function(res) {
      var info=res;
      if(info && info.length>0){
            
             that.setData({
                appointmentList:info
             })
          
          }
          else{
            that.setData({
               isLastPage:true
            })
          }
            
        
      })
  },
  onReachBottom(){
    if(this.data.isLastPage){
      wx.showToast({
        title: '没有更多的数据',
      })
      return
    }
    var status=this.data.status;
    var that=this;
    var {current_no,page_size}=this.data;
   
    this.setData({
      current_no:current_no+1
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