// features/productTaxonomy.js
window.ProductTaxonomy = (function(){
  const { itemCodeFromSku } = window.Utils;

  /** ラベル → SKU配列にグルーピング */
  function groupByAxis(products, axis, P_TAXO){
    const map = new Map();
    products.forEach(p=>{
      let key='—';
      if(axis==='全部門') key = '全部門';
      else if(axis==='部門') key = p.dept;
      else if(axis==='コーナー') key = P_TAXO[p.id]?.corner || '—';
      else if(axis==='ライン')  key = P_TAXO[p.id]?.line || '—';
      else if(axis==='カテゴリ')key = P_TAXO[p.id]?.category || '—';
      else if(axis==='アイテム'){
        const itemCode8 = itemCodeFromSku(p.sku);
        const itemName  = p.itemName || P_TAXO[p.id]?.item || p.name || '';
        key = `${itemCode8}｜${itemName}`;
      } else {
        key = `${p.sku}｜${p.name}`; // SKU
      }
      if(!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return Array.from(map.entries()).map(([label, items])=>({label, items}));
  }

  const AXIS_ORDER = ['全部門','部門','コーナー','ライン','カテゴリ','アイテム','SKU'];
  const nextAxis = (axis)=>{ const i=AXIS_ORDER.indexOf(axis); return (i>=0 && i<AXIS_ORDER.length-1) ? AXIS_ORDER[i+1] : null; };

  return { groupByAxis, AXIS_ORDER, nextAxis };
})();
