function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
module.exports ={
  url:'https://mall.qszhuang.com/backstage/',
  // url: 'http://192.168.100.172:8085/backstage/',
  debounce:debounce
}
