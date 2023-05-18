// 时间字符串
//const timeStr = '2023-05-04T00:04:38.000+0800';
function toDate(timeStr){


// 将时间字符串转换成 Date 对象
const date = new Date(timeStr);

// 获取年、月、日、小时、分钟、秒
const year = date.getFullYear();
const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

// 格式化日期字符串
const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

 return formattedTime;
}

function toDateShort(timeStr){


  // 将时间字符串转换成 Date 对象
  const date = new Date(timeStr);
  
  // 获取年、月、日、小时、分钟、秒
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  
  // 格式化日期字符串
  const formattedTime = `${year}-${month}-${day}`;
  
   return formattedTime;
  }


function isNowNear(timeStr,day){

  const now=new Date().getTime();
  const thatDay=new Date(timeStr).getTime();
  const dayTime=day * 3600 * 1000;
  if(thatDay-now <= dayTime)
    return true;

  return false;


}


module.exports = {
    toDate: toDate,
    toDateShort:toDateShort,
    isNowNear:isNowNear
  }