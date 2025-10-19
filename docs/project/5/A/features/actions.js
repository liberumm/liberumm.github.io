// features/actions.js
window.RecommendedActions = (function(){
  const { sum } = window.Utils;

  function decide({forecastEnd, eol, byStore28}) {
    if(!forecastEnd || !eol) return {label:'—', color:'default', reason:'判定データ不足'};
    const f=new Date(forecastEnd), p=new Date(eol);
    const daysDiff = Math.round((f - p)/86400000);
    const vals = Object.values(byStore28);
    const mean = vals.length ? sum(vals)/vals.length : 0;
    const variance = vals.length ? sum(vals, v=>(v-mean)*(v-mean))/vals.length : 0;
    const std = Math.sqrt(variance);
    const cv = mean>0 ? std/mean : 0;
    const hasZero = vals.some(v=>v===0);
    const hasHigh = vals.some(v=>v>=Math.max(3, mean*1.5));
    if (f < p) return {label:'発注', color:'primary', reason:`在庫が${Math.abs(daysDiff)}日早く尽きる見込み`};
    if (f > p && cv>=0.6 && hasZero && hasHigh) return {label:'移管', color:'warning', reason:'店舗間の販売偏差が大（CV≥0.6）'};
    if (daysDiff >= 14) return {label:'値下', color:'error', reason:`計画より${daysDiff}日以上延びる見込み`};
    return {label:'—', color:'default', reason:'軽微な超過/様子見'};
  }

  return { decide };
})();
