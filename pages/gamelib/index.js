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
        "tag_list":["动作","剧情","单人"],
        "icon":"../../images/banner/banner1.jpg",
        "score":9.6
      },
      {
        "name":"死亡搁浅",
        "tag_list":["动作","剧情","射击","双人","动作"],
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
    current_no:1,
    page_size:10,
    isLastPage:false,
  },
  onPullDownRefresh() {
    var that=this;
    this.getGameList(this.data.gameType,()=>{
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
    wx.navigateTo({
      url: "/pages/game-details/index?data=" + JSON.stringify(e.currentTarget.dataset.data)
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
      gameType, 
      current_no:1,
      page_size:10,
      isLastPage:false
     });
     this.getGameList(gameType);
  },
 
  getGameList(gameType){
    var {current_no,page_size}=this.data;


    WXAPI.queryGame(gameType,{current_no,page_size}).then(function(res) {
      
      var gameList=res;
      if(orderList.length>0){
        var newList=that.data.gameList.concat(gameList);
         that.setData({
          gameList: newList,
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
  onReachBottom(){
    if(this.data.isLastPage){
      wx.showToast({
        title: '没有更多的数据',
      })
      return
    }
    var gameType=this.data.gameType;
    var that=this;
    var {current_no,page_size}=this.data;
   
    this.setData({
      current_no:current_no+1
    })
      this.getGameList(gameType);
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