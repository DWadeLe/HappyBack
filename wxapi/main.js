// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('./config.js')
// const API_BASE_URL = 'https://springboot-iw  k9-47591-8-1318102458.sh.run.tcloudbase.com'
const API_BASE_URL = 'http://localhost:8080'


const parseParamByJson = (param)=>{

     let returnParam='';
     for(let key in param){
         returnParam+=`${key}=${param[key]}&`
     }

     return returnParam;
}

const request = async (url, needSubDomain, method, data) => {
  // let _url = API_BASE_URL  + url
  
  const result = await wx.cloud.callContainer({
      "config": {
        "env": "prod-8g7u9tmqac56ab70"
      },
      "path": url,
      "header": {
        "X-WX-SERVICE": "springboot-iwk9"
      },
      "method": method,
      "data": data
    })
   return result.data;
    // wx.request({
    //   url: _url,
    //   method: method,
    //   data: data,
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success(request) {
    //     resolve(request.data)
    //   },
    //   fail(error) {
    //     reject(error)
    //   },
    //   complete(aaa) {
    //     // 加载完成
    //   }
    // })
  
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  queryUser:() => {
    return request('/user/', false, 'get', null)
  },
  addUser:()=>{
    return request('/user/', false, 'post', null)

  },
  queryVenue:() => {
    return request('/venue/list', false, 'get', null)
  },
  queryOrder:(user_id,param) =>{
    return request(`/order/${user_id}/list?`+parseParamByJson(param), false, 'get', null)
  },
  queryAppointment:(venue_id,date)=>{
    return request('/appointment/venue/'+venue_id+'/record',false,'get',{
      date:date
    })
  },
  queryVenuePrice:(venue_id)=>{
    return request(`/venue/${venue_id}/price/list`,false,'get',{
    })
  },
  queryAppointmentByUser:(userId,param)=>{
    return request (`/appointment/user/${userId}/record?`+parseParamByJson(param),false,'get',{
    })
  },
  queryMobileLocation: (data) => {
    return request('/common/mobile-segment/location', false, 'get', data)
  },
  queryCouponsByUser: (user_id,param) => {
    return request(`/coupon/${user_id}/list`, false, 'get', {})
  },
  queryGame(param){
    return request(`/game/list?`+parseParamByJson(param), false, 'get', {})

  },
  appoint(venue_id,param){
    return request(`/appointment/${venue_id}`+parseParamByJson(param), false, 'post', {})
  },
  startTime(venue_id){
    return request(`/venue/${venue_id}`+parseParamByJson(param), false, 'post', {})
  },
  endTime(venue_id){
    return request(`/venue/${venue_id}`+parseParamByJson(param), false, 'put', {})
  }
}