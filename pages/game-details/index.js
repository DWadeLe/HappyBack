// pages/game-details/index.js
const colorUtil = require('../../utils/color')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameDetail:{
      },
      colorMap:{

      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    this.setData({
      gameDetail:JSON.parse(e.data),
      colorMap:JSON.parse(e.colorMap)
    })

    const context1 = wx.createCanvasContext('preview1', this)
    const context2 = wx.createCanvasContext('preview2', this)
    context1.setFillStyle('#ff0000') // 设置颜色
    context1.fillRect(0, 0, 100, 100) // 绘制矩形
    context2.setFillStyle('#bb0000') // 设置颜色
    context2.fillRect(0, 0, 100, 100) // 绘制矩形
    context1.draw(false, () => {
      // wx.canvasToTempFilePath({
      //   x: 0,
      //   y: 0,
      //   width: 100,
      //   height: 100,
      //   canvasId: 'preview',
      //   success(result) {
      //     console.log(result.tempFilePath) // 将生成的图片路径输出到控制台
      //   },
      //   fail(error) {
      //     console.error(error)
      //   }
      // }, this)
    })
    context2.draw(false, () => {
      // wx.canvasToTempFilePath({
      //   x: 0,
      //   y: 0,
      //   width: 100,
      //   height: 100,
      //   canvasId: 'preview',
      //   success(result) {
      //     console.log(result.tempFilePath) // 将生成的图片路径输出到控制台
      //   },
      //   fail(error) {
      //     console.error(error)
      //   }
      // }, this)
    })
  },
  getRandomColor(){
    var color=colorUtil.getRandomColor();
    
    return {
      backgroundColor:color
    };
    
  },
  goUrl(e){
      var url=e.currentTarget.dataset.url;
      let lastIndex;
      let bvid;
      try{
        lastIndex= url.lastIndexOf("/");
        bvid=url.substring(lastIndex + 1);
      }catch(e){
        console.log(url,e)
        wx.showToast({
          title: '地址异常，跳转失败',
        })
        return;
      }
      const timestamp=new Date().getTime()
      // path: '/index?bvid=BV1hE411k7Ae', // 要跳转的小程序页面路径（可选）

      const path=`pages/video/video?__preload_=${timestamp*10+3}&__key_=${timestamp*10+4}&bvid=${bvid}`
      wx.navigateToMiniProgram({
        appId: 'wx7564fd5313d24844',
        path,
        success: res => {
          console.log('跳转成功')
        }
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