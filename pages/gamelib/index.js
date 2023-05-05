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
        "score":9.6,
        "desc":`《马里奥奥赛德》（英语：Death Stranding），是由小岛工作室开发，索尼互动娱乐发行的一款动作冒险游戏，于2019年11月8日在PlayStation 4平台发售，并于2020年7月14日在Windows平台发售。本作是小岛秀夫成立新工作室后的第一部作品。
       2022年8月19日，经过前两天连续的社交网络造势以后，微软正式宣布与本作游戏PC版发行商505 Games[1]及小岛工作室[2]达成合作，2019年PC原版《死亡搁浅》将于同年8月23日加入PC Game Pass游戏库。[3]（现已加入，但并未提供导演剪辑版升级包供玩家购买）
       阅读更多：死亡搁浅（https://zh.moegirl.org.cn/%E6%AD%BB%E4%BA%A1%E6%90%81%E6%B5%85 ）
       本文引自萌娘百科(https://zh.moegirl.org.cn )，文字内容默认使用《知识共享 署名-非商业性使用-相同方式共享 3.0 中国大陆》协议。`,
      },
      {
        "name":"死亡搁浅",
        "tag_list":["动作","剧情","射击","双人","动作"],
        "icon":"../../images/banner/banner1.jpg",
        "score":9,
        "desc":`《死亡搁浅》（英语：Death Stranding），是由小岛工作室开发，索尼互动娱乐发行的一款动作冒险游戏，于2019年11月8日在PlayStation 4平台发售，并于2020年7月14日在Windows平台发售。本作是小岛秀夫成立新工作室后的第一部作品。
        2022年8月19日，经过前两天连续的社交网络造势以后，微软正式宣布与本作游戏PC版发行商505 Games[1]及小岛工作室[2]达成合作，2019年PC原版《死亡搁浅》将于同年8月23日加入PC Game Pass游戏库。[3]（现已加入，但并未提供导演剪辑版升级包供玩家购买）
        阅读更多：死亡搁浅（https://zh.moegirl.org.cn/%E6%AD%BB%E4%BA%A1%E6%90%81%E6%B5%85 ）
        本文引自萌娘百科(https://zh.moegirl.org.cn )，文字内容默认使用《知识共享 署名-非商业性使用-相同方式共享 3.0 中国大陆》协议。`,
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