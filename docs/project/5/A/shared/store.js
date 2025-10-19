// shared/store.js
window.Store = (function(){
  const state = {
    fixtures: window.FIXTURES,   // ITEMS, PRODUCTS, P_TAXO, INVENTORY, SALES
    masters:  window.MASTERS,
  };
  return {
    getFixtures: () => state.fixtures,
    getMasters:  () => state.masters,
  };
})();
