const WXAPI = require('../../wxapi/main')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const regeneratorRuntime = require('../../utils/runtime')
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    goodsDetail: {
       name:"马里奥主题包间",
       desc:"",
       icon:"../../images/banner/banner3.jpg",
       orginalPrice:120.00,
       realPrice:"100.00"
    },
    fabButton: {
      icon: 'call',
      openType: 'getPhoneNumber',
    },
    isYYNightOrder:false,
    isAfterNoomOrder:false,
    isOrderType:1,
    visible:false,
    YDTipVisible:false,
    isReadTip:false,
  },
  goPay(){
    let isReadTip=this.data.isReadTip;
    if(!isReadTip){
      this.setData({
        YDTipVisible:true
       });
       return;
    }

    //TODO 调用微信支付接口
       

  },
 
  closeYDTip(){
    this.setData({
      YDTipVisible:false,
      isReadTip:true
     });
  },
  onTabsChange(event) {
    console.log(event.detail)
    console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
    this.setData({
      isOrderType:event.detail.value
    })
  },

  onTabsClick(event) {
    
    console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
    this.setData({
      isOrderType:event.detail.value
    })
  },
   onLoad(e) {
    this.data.goodsId = e.id
    var that=this
    const now = new Date();

      // 转换为 yyyy-mm-dd 的格式
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    WXAPI.queryAppointment(this.data.goodsId,formattedDate).then(function(res) {
      var info=res;
      if(info && info.length>0){
            info.forEach(item=>{
              if(item.session==1){
                that.setData({
                  isAfterNoomOrder: true,
                });
              }else{
                that.setData({
                  isYYNightOrder: true,
                });
              }
             
            })
            if(that.data.isAfterNoomOrder && that.data.isYYNightOrder){
              Toast({
                context: this,
                selector: '#t-toast',
                message: '明日已预约满了，请下次再来',
                theme: 'warning',
                direction: 'column',
              });
            }
            
        
      }
     
      
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
    
  },
  onShow (){
    
      
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  goYY: function() {
    
     this.setData({
       visible:true
     })
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function(e) {
    const that = this;
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.goodsDetail.properties.length; i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":" + childs[j].id + ",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":" + childs[j].name + "  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      WXAPI.goodsPrice({
        goodsId: that.data.goodsDetail.basicInfo.id,
        propertyChildIds: propertyChildIds
      }).then(function(res) {
        that.setData({
          selectSizePrice: res.data.price,
          propertyChildIds: propertyChildIds,
          propertyChildNames: propertyChildNames,
          buyNumMax: res.data.stores,
          buyNumber: (res.data.stores > 0) ? 1 : 0
        });
      })
    }


    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })
  },
  /**
   * 加入购物车
   */
  addShopCar: function() {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          content: '请选择商品具体规格',
          showCancel: false
        })
      }
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo
    })
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success'
    })
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function() {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    shopCarInfo.kjId = this.data.kjId;
    return shopCarInfo;
  },
  onShareAppMessage: function() {
    let _data = {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
    if (this.data.kjJoinUid) {
      _data.title = this.data.curKanjiaprogress.joiner.nick + '邀请您帮TA砍价'
      _data.path += '&kjJoinUid=' + this.data.kjJoinUid
    }
    return _data
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
})