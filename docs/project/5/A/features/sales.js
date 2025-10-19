// features/sales.js
window.Sales = (function(){
  const { sum } = window.Utils;

  function buildIndexes(SALES, PRODUCTS){
    const idxByProductDate = new Map();
    const idxByProductStoreDate = new Map();
    const prodPriceCache = new Map(PRODUCTS.map(p=>[p.id, p.price]));

    SALES.forEach(r=>{
      // product-date
      let m = idxByProductDate.get(r.productId);
      if(!m){ m = new Map(); idxByProductDate.set(r.productId, m); }
      const d = m.get(r.date) || {units:0, revenue:0, markdown:0};
      d.units += r.units;
      const pprice = r.salePrice || prodPriceCache.get(r.productId) || 0;
      d.revenue += r.units * pprice;
      d.markdown += r.markdown || 0;
      m.set(r.date, d);

      // product-store-date
      let ms = idxByProductStoreDate.get(r.productId);
      if(!ms){ ms = new Map(); idxByProductStoreDate.set(r.productId, ms); }
      let sd = ms.get(r.storeId);
      if(!sd){ sd = new Map(); ms.set(r.storeId, sd); }
      const sdv = sd.get(r.date) || {units:0}; sdv.units += r.units; sd.set(r.date, sdv);
    });

    return { idxByProductDate, idxByProductStoreDate };
  }

  function sumUnits(idxByProductDate, productId, start, end){
    const m=idxByProductDate.get(productId); if(!m) return 0;
    let s=0; for(const [date,agg] of m){ if(date>=start && date<=end) s += agg.units; } return s;
  }
  function sumRevenue(idxByProductDate, productId, start, end){
    const m=idxByProductDate.get(productId); if(!m) return 0;
    let s=0; for(const [date,agg] of m){ if(date>=start && date<=end) s += agg.revenue; } return s;
  }
  function sumUnitsByStore(idxByProductStoreDate, productId, storeId, start, end){
    const ms=idxByProductStoreDate.get(productId); if(!ms) return 0;
    const sd=ms.get(storeId); if(!sd) return 0;
    let s=0; for(const [date,agg] of sd){ if(date>=start && date<=end) s += agg.units; } return s;
  }

  return { buildIndexes, sumUnits, sumRevenue, sumUnitsByStore };
})();
