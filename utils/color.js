// 计算哈希值
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
  
  // 生成颜色值
  function intToRGB(i) {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  }
  
  // 计算唯一颜色值
  function getUniqueColor(str) {
    const hash = hashCode(str);
    return intToRGB(hash);
  }
  
  module.exports = {
    getUniqueColor: getUniqueColor
  }