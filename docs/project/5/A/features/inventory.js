// features/inventory.js
window.Inventory = (function(){
  const { sum } = window.Utils;

  function invForItems(items, INVENTORY, targetStoreIds){
    return items.reduce((acc,p)=> acc + sum(INVENTORY.filter(i=> i.productId===p.id && targetStoreIds.has(i.storeId)), x=>x.qty), 0);
  }

  function invPerStore(items, INVENTORY, storeId){
    return items.reduce((acc,p)=> acc + sum(INVENTORY.filter(i=> i.productId===p.id && i.storeId===storeId), x=>x.qty), 0);
  }

  return { invForItems, invPerStore };
})();
