const fmtYen = (n)=> n.toLocaleString('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0});
const sum = (a,sel=x=>x)=> a.reduce((p,c)=> p + sel(c), 0);
