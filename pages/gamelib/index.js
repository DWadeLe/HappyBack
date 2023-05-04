// pages/gamelib/index.js
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameList: [
      {
        "name":"马里奥奥赛德",
        "tag":["动作","剧情","单人"],
        "icon":"../../images/banner/banner1.jpg",
        "score":9.6
      },
      {
        "name":"死亡搁浅",
        "tag":["动作","剧情","射击","双人","动作"],
        "icon":"../../images/banner/banner1.jpg",
        "score":9

      }
    ],
    tagColor:['primary','warning','danger','success'],
    categoryNum:["动作","剧情","单人","双人","射击"],
    type:{
      value:"all",
      options:[{
        value: 'all',
        label: '分类',
      },
      {
        value: 'action',
        label: '动作',
      },
      {
        value: 'jq',
        label: '剧情',
      }]
    },
    sorter:{
      value:"all",
      options:[{
        value: 'all',
        label: '排序',
      },
      {
        value: 'mr',
        label: '默认',
      },
      {
        value: 'new',
        label: '新上架',
      }]
    },
    gameType:1,
    normalSearch:true,
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
  showHighSearch(){
    
    this.setData({
      normalSearch:false
    })
  },
  hideHighSearch(){
    
    this.setData({
      normalSearch:true
    })
  },
  toDetailsTap(e){
    ;
     wx.navigateTo({
       url: '/pages/game-details/index',
     })

  },
  search(){

  },
  onTypeChange(e){
    var type=this.data.type;
    type.value=e.detail.value;
     this.setData({
        type 
     });
  },
  onSorterChange(e){
    var sorter=this.data.sorter;
    sorter.value=e.detail.value;
     this.setData({
      sorter 
     });
  },
  onTabsClick(e){
    var gameType=this.data.gameType;
    gameType=e.detail.value;
     this.setData({
      gameType 
     });
     if(type<4)
     this.getGameList(gameType);
    else
    this.getNeedSaleList();
  },
  getGameList(gameType){
       
  },
  getNeedSaleList(){

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