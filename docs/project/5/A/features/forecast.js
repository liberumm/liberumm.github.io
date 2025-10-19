// features/forecast.js
window.Forecast = (function(){
  const { ymd, toDate } = window.Utils;

  function last28Daily(items, idx, targetStoreIds, range, sumUnitsFn, sumUnitsByStoreFn){
    const last28Start = ymd(new Date(toDate(range.end).getTime() - 27*86400000));
    let lastUnits=0;
    items.forEach(p=>{
      if(targetStoreIds._all){
        lastUnits += sumUnitsFn(idx.idxByProductDate, p.id, last28Start, range.end);
      } else {
        Array.from(targetStoreIds).forEach(sid=> lastUnits += sumUnitsByStoreFn(idx.idxByProductStoreDate, p.id, sid, last28Start, range.end));
      }
    });
    return lastUnits/28;
  }

  function forecastEnd(inv, daily, rangeEnd){
    if(daily<=0) return null;
    const daysLeft = Math.floor(inv/daily);
    const d = new Date(rangeEnd + 'T00:00:00'); d.setDate(d.getDate()+daysLeft);
    return ymd(d);
  }

  return { last28Daily, forecastEnd };
})();
