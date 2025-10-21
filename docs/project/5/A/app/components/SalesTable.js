// app/SalesTable.js
(function(){
  const { ymd, sum, fmtYen } = window.Utils;
  const { Tooltip, TextField, Button, Chip, Checkbox } = MaterialUI;

  // ─────────────────────────────
  // 推奨対応ロジック（移管判定を含む）
  // ─────────────────────────────
  // ・目的：店舗ごとの「在庫配分」と「直近販売実績」のミスマッチが大きい場合に「移管」を推奨。
  // ・基本方針：
  //    - 直近28日販売シェア（salesShare）と現在庫シェア（invShare）を比較
  //    - invShare - salesShare が閾値(±8%)を超えていれば、過剰（ドナー）/不足（レシーバ）と判定
  //    - 在庫が過剰な店舗から不足店舗へ「移管」アクションを作成
  // ・副次ルール（簡易版）：
  //    - 在庫尽き予測日が近い（≤14日）：『発注』
  //    - EOL超過または過剰在庫で販売弱い：『値下』
  window.RecommendedActions = window.RecommendedActions || (function(){
    /**
     * @param {Object} args
     * @param {string|null} args.forecastEnd - 在庫尽き予測日(YYYY-MM-DD) or null
     * @param {string|null} args.eol         - 計画終了日(YYYY-MM-DD) or null
     * @param {Object} args.byStore28        - {storeId: units} 直近28日の販売点数
     * @param {Object} args.invByStore       - {storeId: qty}   現在庫数量
     * @param {Array}  args.stores           - 店舗マスタ
     * @param {string} args.today            - 画面の集計終端日(YYYY-MM-DD)
     * @returns {{label:string,color?:'default'|'primary'|'secondary'|'error'|'info'|'success'|'warning', detail?:any}}
     */
    function decide({forecastEnd, eol, byStore28, invByStore, stores, today}){
      const parseYmd = (s)=> (s? new Date(s+'T00:00:00'): null);
      const dToday   = parseYmd(today);
      const dForecast= parseYmd(forecastEnd);
      const dEol     = parseYmd(eol);

      // === 1) 店舗間の在庫バランスをチェック（移管判定） ===
      const storeList = Object.keys(invByStore||{});
      if(storeList.length===0) return { label:'—', color:'default' };

      const totalInv   = storeList.reduce((a,s)=> a + (invByStore[s]||0), 0);
      const totalSales = storeList.reduce((a,s)=> a + (byStore28[s]||0), 0);

      // 直近販売実績がまったく無い or 在庫がゼロ → 判定不可
      if(totalSales===0 || totalInv===0) return { label:'—', color:'default' };

      // シェア計算と乖離チェック
      const GAP_TH = 0.15; // 15%以上の乖離で移管候補
      const imbalance = storeList.some(sid => {
        const invShare = (invByStore[sid]||0) / totalInv;
        const salesShare = (byStore28[sid]||0) / totalSales;
        return Math.abs(invShare - salesShare) > GAP_TH;
      });

      if(imbalance) {
        const shareGap = storeList.map(s=>{
          const invShare   = (invByStore[s]||0) / totalInv;
          const salesShare = (byStore28[s]||0)  / totalSales;
          const gap       = invShare - salesShare;
          return { storeId:s, inv:invByStore[s]||0, sales:byStore28[s]||0, invShare, salesShare, gap };
        });

        // 移管計画作成
        const MIN_MOVE = 5;
        const donors   = shareGap.filter(x=> x.gap >  GAP_TH && x.inv >= MIN_MOVE);
        const takers   = shareGap.filter(x=> x.gap < -GAP_TH);

        if(donors.length && takers.length){
          const transfers = [];
          donors.forEach(d => {
            const excess = Math.floor(d.inv * 0.5); // 在庫の50%まで移管可能
            if(excess >= MIN_MOVE) {
              const toStore = takers[0];
              transfers.push({
                from: stores.find(s=> String(s.id)===String(d.storeId))?.name || d.storeId,
                to: stores.find(s=> String(s.id)===String(toStore.storeId))?.name || toStore.storeId,
                qty: excess
              });
            }
          });

          if(transfers.length) {
            return {
              label: '移管',
              color: 'warning',
              detail: {
                reason: '在庫配分と直近販売シェアの乖離',
                transfers
              }
            };
          }
        }
      }

      // === 2) 在庫切れリスク（発注判定） ===
      if(dForecast && dEol){
        // 計画終了日より前に在庫が尽きる場合
        const daysToForecast = Math.round((dForecast - dToday)/86400000);
        const daysToEol = Math.round((dEol - dToday)/86400000);
        if(daysToForecast < daysToEol) {
          return { label:'発注', color:'info', detail:{reason:'計画終了前の在庫切れリスク'} };
        }
      }

      // === 3) 過剰在庫（値下判定） ===
      if(dForecast && dEol && dToday){
        const daysToForecast = Math.round((dForecast - dToday)/86400000);
        const daysToEol = Math.round((dEol - dToday)/86400000);
        if(daysToForecast > daysToEol + 21) { // 計画終了日より21日以上後まで在庫が余る
          return { label:'値下', color:'error', detail:{reason:'計画終了後の過剰在庫'} };
        }
      }

      // どれにも当てはまらなければ「—」
      return { label:'—', color:'default' };
    }

    return { decide };
  })();

  // ─────────────────────────────
  // ヘルパ
  // ─────────────────────────────
  const AXIS_ORDER = ['全部門','部門','コーナー','ライン','カテゴリ','アイテム','SKU'];
  const nextAxis = (axis) => {
    const i = AXIS_ORDER.indexOf(axis);
    return (i >= 0 && i < AXIS_ORDER.length - 1) ? AXIS_ORDER[i+1] : null;
  };
  const itemCodeFromSku = (sku)=>{
    if(!sku) return '';
    const d = sku.replace(/-/g,'');
    if(d.length < 8) return sku;
    return d.slice(0,4) + '-' + d.slice(4,8);
  };
  const shiftYear = (dateStr, deltaYears=-1)=>{
    const d = new Date(dateStr+'T00:00:00');
    d.setFullYear(d.getFullYear()+deltaYears);
    return ymd(d);
  };
  const formatRate = (curr, prev)=>{
    if(prev === 0){
      if(curr === 0) return '—';
      return '∞';
    }
    const r = (curr/prev - 1) * 100;
    const sign = r>0 ? '+' : '';
    return `${sign}${r.toFixed(1)}%`;
  };
  const safeNorm = (v,{min,max}) => (v==null||!isFinite(v)||max===min)?0: (v-min)/(max-min);

  function groupItemsByAxis(items, axis, P_TAXO){
    const map = new Map();
    items.forEach(p=>{
      let key='—';
      if(axis==='全部門') key='全部門';
      else if(axis==='部門') key=p.dept;
      else if(axis==='コーナー') key=P_TAXO[p.id]?.corner || '—';
      else if(axis==='ライン')  key=P_TAXO[p.id]?.line || '—';
      else if(axis==='カテゴリ')key=P_TAXO[p.id]?.category || '—';
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

  // ─────────────────────────────
  // メトリクス算出（今年・前年・30日効率）
  // ─────────────────────────────
  function computeGroupMetrics({items, buckets, metric, targetStoreIds, range, idx, STORES, P_TAXO}){
    // 在庫（現在）
    const inv = items.reduce((acc,p) =>
      acc + window.FIXTURES.INVENTORY.filter(i=> i.productId===p.id && targetStoreIds.has(i.storeId))
              .reduce((a,c)=>a+c.qty,0)
    ,0);

    // ===== 店舗別・直近28日販売 =====
    const last28Start = ymd(new Date(new Date(range.end+'T00:00:00').getTime()-27*86400000));
    const byStore28={};
    STORES.forEach(s=>{ if(targetStoreIds.has(s.id)) byStore28[s.id]=0; });
    items.forEach(p=>{
      Array.from(targetStoreIds).forEach(sid=>{
        const v = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, last28Start, range.end);
        byStore28[sid] = (byStore28[sid]||0) + v;
      });
    });

    // ===== 店舗別・現在庫 =====
    const invByStore = {};
    STORES.forEach(s=>{
      if(!targetStoreIds.has(s.id)) return;
      invByStore[s.id] = items.reduce((acc,p)=>
        acc + window.FIXTURES.INVENTORY
          .filter(i=> i.productId===p.id && i.storeId===s.id)
          .reduce((a,c)=>a+c.qty,0)
      ,0);
    });

    // ===== バケット別（今年）=====
    const byUnits = buckets.map(b=>{
      let tot=0;
      items.forEach(p=>{
        if(targetStoreIds.size===STORES.length){
          tot += window.Sales.sumUnits(idx.idxByProductDate, p.id, b.start, b.end);
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            tot += window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, b.start, b.end);
          });
        }
      });
      return tot;
    });

    const byRevenue = buckets.map(b=>{
      let tot=0;
      items.forEach(p=>{
        if(targetStoreIds.size===STORES.length){
          tot += window.Sales.sumRevenue(idx.idxByProductDate, p.id, b.start, b.end);
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            const u = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, b.start, b.end);
            tot += u * p.price;
          });
        }
      });
      return tot;
    });

    const byProfit = buckets.map(b=>{
      let tot=0;
      items.forEach(p=>{
        const c = Math.round(p.price*0.6);
        if(targetStoreIds.size===STORES.length){
          const r = window.Sales.sumRevenue(idx.idxByProductDate, p.id, b.start, b.end);
          const u = window.Sales.sumUnits(idx.idxByProductDate, p.id, b.start, b.end);
          tot += (r - u*c);
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            const u = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, b.start, b.end);
            tot += u*(p.price - c);
          });
        }
      });
      return tot;
    });

    // 合計（今年）
    const totalUnits   = byUnits.reduce((a,b)=>a+b,0);
    const totalRevenue = byRevenue.reduce((a,b)=>a+b,0);
    const totalProfit  = byProfit.reduce((a,b)=>a+b,0);

    // 代表価格・原価（グループ代表値）
    const prices = Array.from(new Set(items.map(p=>p.price)));
    const priceMean = prices.length===1 ? prices[0] : Math.round(sum(prices)/prices.length);
    const cost = Math.round(priceMean*0.6);

    // EOL（グループ内で同一なら表示）
    const eols = Array.from(new Set(items.map(p=>p.eol || null)));
    const eol = (eols.length===1) ? eols[0] : null;

    // 予測在庫尽き日（直近28日）
    let lastUnits28 = 0;
    items.forEach(p=>{
      if(targetStoreIds.size===STORES.length) lastUnits28 += window.Sales.sumUnits(idx.idxByProductDate, p.id, last28Start, range.end);
      else Array.from(targetStoreIds).forEach(sid=> lastUnits28 += window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, last28Start, range.end));
    });
    const daily28 = lastUnits28/28;
    let forecastEnd = null;
    if(daily28>0){
      const daysLeft = Math.floor(inv/daily28);
      const d = new Date(range.end+'T00:00:00'); d.setDate(d.getDate()+daysLeft);
      forecastEnd = ymd(d);
    }

    // ★ 推奨対応（移管を含む）判定
    const action = window.RecommendedActions.decide({
      forecastEnd, eol,
      byStore28,
      invByStore,
      stores: STORES,
      today: range.end
    });

    // 現在の表示用（今年）
    const byBucket = (metric==='units')? byUnits : (metric==='revenue')? byRevenue : byProfit;

    // ===== 前年（各バケット）=====
    const prevByUnits = buckets.map(b=>{
      const ps = shiftYear(b.start, -1);
      const pe = shiftYear(b.end, -1);
      let tot=0;
      items.forEach(p=>{
        if(targetStoreIds.size===STORES.length){
          tot += window.Sales.sumUnits(idx.idxByProductDate, p.id, ps, pe);
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            tot += window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, ps, pe);
          });
        }
      });
      return tot;
    });

    const prevByRevenue = buckets.map(b=>{
      const ps = shiftYear(b.start, -1);
      const pe = shiftYear(b.end, -1);
      let tot=0;
      items.forEach(p=>{
        if(targetStoreIds.size===STORES.length){
          tot += window.Sales.sumRevenue(idx.idxByProductDate, p.id, ps, pe);
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            const u = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, ps, pe);
            tot += u * p.price;
          });
        }
      });
      return tot;
    });

    const prevByProfit = buckets.map(b=>{
      const ps = shiftYear(b.start, -1);
      const pe = shiftYear(b.end, -1);
      let tot=0;
      items.forEach(p=>{
        const c = Math.round(p.price*0.6);
        if(targetStoreIds.size===STORES.length){
          const r = window.Sales.sumRevenue(idx.idxByProductDate, p.id, ps, pe);
          const u = window.Sales.sumUnits(idx.idxByProductDate, p.id, ps, pe);
          tot += (r - u*c);
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            const u = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, ps, pe);
            tot += u*(p.price - c);
          });
        }
      });
      return tot;
    });

    const prevTotalUnits   = prevByUnits.reduce((a,b)=>a+b,0);
    const prevTotalRevenue = prevByRevenue.reduce((a,b)=>a+b,0);
    const prevTotalProfit  = prevByProfit.reduce((a,b)=>a+b,0);

    // === 直近30日効率指標 ===
    const lastN = 30;
    const endD = new Date(range.end + 'T00:00:00');
    const startD = new Date(endD); startD.setDate(startD.getDate() - (lastN-1));
    const lastStart = ymd(startD);

    let units30 = 0, revenue30 = 0;
    items.forEach(p=>{
      if(targetStoreIds.size===STORES.length){
        units30   += window.Sales.sumUnits(idx.idxByProductDate, p.id, lastStart, range.end);
        revenue30 += window.Sales.sumRevenue(idx.idxByProductDate, p.id, lastStart, range.end);
      } else {
        Array.from(targetStoreIds).forEach(sid=>{
          const u = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, lastStart, range.end);
          units30   += u;
          revenue30 += u * p.price;
        });
      }
    });
    const asp30    = units30>0 ? (revenue30/units30) : null;
    const profit30 = revenue30 - units30 * cost;
    const invUnits = inv;
    const invCost  = invUnits * cost;
    const gmroi30  = invCost>0 ? (profit30 / invCost) : null; // ROI(30)
    const uTurn30  = invUnits>0 ? (units30 / invUnits) : null;

    // 在庫回転日数（直近30日平均日販から）
    const daily30 = units30/lastN;
    const invDays = daily30>0 ? Math.round(invUnits/daily30) : null;

    return {
      inv,
      byUnits, byRevenue, byProfit, byBucket,
      totalUnits, totalRevenue, totalProfit,
      price: priceMean, cost, eol, forecastEnd, action, byStore28, invByStore,
      // 前年
      prevByUnits, prevByRevenue, prevByProfit,
      prevTotalUnits, prevTotalRevenue, prevTotalProfit,
      // 30日効率
      units30, asp30, profit30, invUnits, invCost, gmroi30, uTurn30, invDays
    };
  }

  // ─────────────────────────────
  // コンポーネント
  // ─────────────────────────────
  window.SalesTable = function SalesTable(props){
    const {
      range, deptFilter, prodAxis, buckets, metric, viewMode,
      compareMode, setCompareMode, targetStoreIds,
      selectedRow, setSelectedRow, openActionModal,
      yoyShow, yoyRateShow, yoyDiffShow,
      // アクションパネル連携（App側）
      filterAction, searchTerm, columnFilters,
      checkedRows, setCheckedRows,
      roiVisible,
      // AxisSelectorの選択情報
      selectedProdItems, selectedStoreItems
    } = props;

    const STORES   = window.MASTERS.STORES;
    const PRODUCTS = window.FIXTURES.PRODUCTS;
    const P_TAXO   = window.FIXTURES.P_TAXO;

    const { buildIndexes } = window.Sales;
    const idx = React.useMemo(()=> buildIndexes(window.FIXTURES.SALES, PRODUCTS), [window.FIXTURES.SALES, PRODUCTS]);

    // 展開
    const [expandedRows, setExpandedRows] = React.useState(new Set());
    const [localColumnFilters, setLocalColumnFilters] = React.useState({});
    const [tempColumnFilters, setTempColumnFilters] = React.useState({});

    // ユーザーが手動でソートしたか（初期自動同期の上書き防止）
    const userSortedRef = React.useRef(false);

    // 並び替え（初期値は軸に応じて）
    const initialSort = React.useMemo(()=>{
      const lowAxes = ['全部門','部門','コーナー','ライン','カテゴリ'];
      if (lowAxes.includes(prodAxis)) {
        return { key:'label', asc:true }; // コード昇順
      } else {
        // アイテム / SKU → いったん最左列（後で最新列に同期）
        return { key:'col0', asc:false };
      }
    }, [prodAxis]);

    const [sortKey, setSortKey]   = React.useState(initialSort.key);
    const [sortAsc, setSortAsc]   = React.useState(initialSort.asc);

    const showBuckets = (viewMode==='detail');
    const displayBuckets = showBuckets ? buckets : buckets.slice(-2);
    const metricHeader = metric==='units'?'販売点数': metric==='revenue'?'売上高':'粗利高';
    const formatCell = (v)=> metric==='units' ? v.toLocaleString() : fmtYen(v);

    // === 行データ構築 ===
    const baseRows = React.useMemo(()=>{
      const map = new Map();
      const ensure = (key)=>{ if(!map.has(key)) map.set(key,{label:key, items:[]}); return map.get(key); };

      const productsInScope = (deptFilter==='全部門') ? PRODUCTS : PRODUCTS.filter(p=>p.dept===deptFilter);
      productsInScope.forEach(p=>{
        const labelGroup = (() => {
          if (prodAxis==='全部門') return '全部門';
          if (prodAxis==='部門')   return p.dept;
          if (prodAxis==='コーナー')return P_TAXO[p.id]?.corner || '—';
          if (prodAxis==='ライン')  return P_TAXO[p.id]?.line   || '—';
          if (prodAxis==='カテゴリ')return P_TAXO[p.id]?.category|| '—';
          if (prodAxis==='アイテム'){
            const itemCode8 = itemCodeFromSku(p.sku);
            const itemName  = p.itemName || P_TAXO[p.id]?.item || p.name || '';
            return `${itemCode8}｜${itemName}`;
          }
          return `${p.sku}｜${p.name}`; // SKU
        })();
        ensure(labelGroup).items.push(p);
      });

      // 今年＋前年＋30日効率
      map.forEach(g=>{
        const m = computeGroupMetrics({
          items: g.items, buckets, metric, targetStoreIds, range, idx, STORES, P_TAXO
        });
        Object.assign(g, m);
      });

      // 行配列
      let rows = [...map.values()].map(g=>{
        const byBucket = (metric==='units'? g.byUnits : metric==='revenue'? g.byRevenue : g.byProfit);
        const total    = (metric==='units'? g.totalUnits : metric==='revenue'? g.totalRevenue : g.totalProfit);
        const prevBy   = (metric==='units'? g.prevByUnits : metric==='revenue'? g.prevByRevenue : g.prevByProfit);
        const prevTot  = (metric==='units'? g.prevTotalUnits : metric==='revenue'? g.prevTotalRevenue : g.prevTotalProfit);

        return {
          label: g.label, items: g.items,
          inv: g.inv, byBucket, total,
          byUnits: g.byUnits, byRevenue: g.byRevenue, byProfit: g.byProfit,
          totalUnits: g.totalUnits, totalRevenue: g.totalRevenue, totalProfit: g.totalProfit,
          price: g.price, cost: g.cost,
          eol: g.eol, forecastEnd: g.forecastEnd, action: g.action,
          byStore28: g.byStore28, invByStore: g.invByStore,
          // 前年
          prevByBucket: prevBy,
          prevTotal: prevTot,
          // 30日効率
          units30: g.units30, asp30: g.asp30, profit30: g.profit30,
          invUnits: g.invUnits, invCost: g.invCost,
          gmroi30: g.gmroi30, uTurn30: g.uTurn30, invDays: g.invDays
        };
      });

      // 検索・アクション絞り
      if(filterAction && filterAction!=='all') rows = rows.filter(r=> r.action?.label===filterAction);
      if(searchTerm){
        const q = (searchTerm||'').toLowerCase();
        rows = rows.filter(r=> r.label.toLowerCase().includes(q));
      }

      // AxisSelectorの選択でフィルタリング
      if(selectedProdItems && selectedProdItems.size > 0){
        rows = rows.filter(r => {
          // 行のラベルで直接マッチング
          if(selectedProdItems.has(r.label)) return true;
          
          // 各アイテムでマッチングをチェック
          return r.items.some(item => {
            // SKU、商品名、アイテム名、部門で直接マッチング
            if(selectedProdItems.has(item.sku) || 
               selectedProdItems.has(item.name) || 
               selectedProdItems.has(item.itemName) ||
               selectedProdItems.has(item.dept)) return true;
            
            // P_TAXOデータでマッチング
            const taxo = P_TAXO[item.id];
            if(taxo) {
              if(selectedProdItems.has(taxo.corner) ||
                 selectedProdItems.has(taxo.line) ||
                 selectedProdItems.has(taxo.category)) return true;
            }
            
            // アイテムコード形式でのマッチング（アイテム軸の場合）
            if(prodAxis === 'アイテム') {
              const itemCode8 = itemCodeFromSku(item.sku);
              const itemName = item.itemName || taxo?.item || item.name || '';
              const itemLabel = `${itemCode8}｜${itemName}`;
              if(selectedProdItems.has(itemLabel)) return true;
              
              // アイテムコード+名前形式でもチェック
              selectedProdItems.forEach(selected => {
                if(selected.includes(' ')) {
                  const selectedCode = selected.split(' ')[0];
                  if(itemCode8.startsWith(selectedCode)) return true;
                }
              });
            }
            
            // 階層関係マッピングを使用したマッチング
            const CORNER_LINE_MAP = window.MASTERS.CORNER_LINE_MAP || {};
            const CATEGORY_ITEM_MAP = window.MASTERS.CATEGORY_ITEM_MAP || {};
            
            // 選択されたアイテムがコーナーの場合、関連ラインをチェック
            selectedProdItems.forEach(selected => {
              if(CORNER_LINE_MAP[selected] && taxo?.line) {
                if(CORNER_LINE_MAP[selected].includes(taxo.line)) return true;
              }
              
              // 選択されたアイテムがラインの場合、関連カテゴリをチェック
              const lineCategories = window.MASTERS.getRelatedCategories?.(selected);
              if(lineCategories && taxo?.category) {
                if(lineCategories.includes(taxo.category)) return true;
              }
              
              // 選択されたアイテムがカテゴリの場合、関連アイテムをチェック
              const categoryCode = selected.split(' ')[0];
              if(CATEGORY_ITEM_MAP[categoryCode]) {
                const relatedItems = CATEGORY_ITEM_MAP[categoryCode];
                if(relatedItems.includes(item.itemName) || relatedItems.includes(item.name)) {
                  return true;
                }
              }
            });
            
            return false;
          });
        });
      }

      // 列フィルタ
      const allFilters = {...columnFilters, ...localColumnFilters};
      if (allFilters && Object.keys(allFilters).length){
        rows = rows.filter(r=>{
          for(const k in allFilters){
            const v = String(allFilters[k]||'').trim();
            if(!v) continue;
            if(k==='inv' && String(r.inv).indexOf(v)===-1) return false;
            if(k==='price' && String(r.price||'').indexOf(v)===-1) return false;
            if(k==='cost' && String(r.cost||'').indexOf(v)===-1) return false;
            if(k==='planEnd' && String(r.eol||'').indexOf(v)===-1) return false;
            if(k==='forecastEnd' && String(r.forecastEnd||'').indexOf(v)===-1) return false;
            if(k==='code'){
              const code = (()=>{
                if(prodAxis==='SKU') return r.items?.[0]?.sku || r.items?.[0]?.id || r.label;
                if(prodAxis==='アイテム') return itemCodeFromSku(r.items?.[0]?.sku) || r.items?.[0]?.itemId || r.label;
                return r.label;
              })();
              if(String(code).indexOf(v)===-1) return false;
            }
            if(k==='name'){
              const name = getRowNameByAxis(r);
              if(String(name).toLowerCase().indexOf(v.toLowerCase())===-1) return false;
            }
          }
          return true;
        });
      }

      // 総合効率スコア（総評）
      const vals = (key)=> rows.map(r => r[key]).filter(v => v!=null && isFinite(v));
      const stat = (arr)=>({min: Math.min(...arr), max: Math.max(...arr)});
      const aspList = vals('asp30').sort((a,b)=>a-b);
      const mid = aspList.length ? aspList[Math.floor(aspList.length/2)] : null;

      const gStats = stat(vals('gmroi30').length? vals('gmroi30') : [0,1]);
      const uStats = stat(vals('uTurn30').length? vals('uTurn30') : [0,1]);

      rows.forEach(r=>{
        const priceIdx  = (r.asp30!=null && mid) ? (r.asp30 / mid) : null;
        const priceCenter = (priceIdx!=null) ? (1 / Math.max(0.01, Math.abs(priceIdx - 1))) : 0;
        const gScore = safeNorm(r.gmroi30, gStats);
        const uScore = safeNorm(r.uTurn30, uStats);
        r.mixScore = 0.45*gScore + 0.35*uScore + 0.20*priceCenter/(1+priceCenter);
      });

      return rows;
    }, [deptFilter, prodAxis, buckets, metric, targetStoreIds, range, idx, STORES,
        searchTerm, JSON.stringify(columnFilters), filterAction, 
        Array.from(selectedProdItems || []).join(','), Array.from(selectedStoreItems || []).join(',')]);

    // 合計行（ヘッダー直下に表示）＆ “最新列” 判定
    const summaryRow = React.useMemo(()=>{
      if(!baseRows.length) return null;
      const total = (arrKey, mapFn) => baseRows.reduce((a,r)=> a + mapFn(r), 0);
      const sumBuckets = (pick)=> displayBuckets.map((_,i)=> baseRows.reduce((a,r)=> a + (pick(r)[i]||0), 0));

      const metricPick = (r)=> r.byBucket || [];
      const totalsByCol = sumBuckets(metricPick);
      // 合計が 1 以上の最も右の列
      let latestColIndex = displayBuckets.length - 1;
      for (let i = displayBuckets.length - 1; i >= 0; i--) {
        if ((totalsByCol[i]||0) > 0) { latestColIndex = i; break; }
      }

      return {
        label:'合計',
        inv: total('inv', r=>r.inv),
        invDays: null,
        units30: total('units30', r=>r.units30||0),
        asp30: (()=>{
          const u = total('units30', r=>r.units30||0);
          const rev30 = baseRows.reduce((a,r)=> a + (r.asp30 ? r.asp30*(r.units30||0) : 0), 0);
          return u>0 ? (rev30/u) : null;
        })(),
        profit30: baseRows.reduce((a,r)=> a + (r.profit30||0), 0),
        gmroi30: null, uTurn30: null, mixScore: null,
        total: baseRows.reduce((a,r)=> a + (r.total||0), 0),
        byBucket: totalsByCol,
        eol: '—', forecastEnd: '—',
        latestColIndex
      };
    }, [baseRows, displayBuckets.length]);

    // “最新列”への初期同期（ユーザー未操作時のみ）
    React.useEffect(()=>{
      const lowAxes = ['全部門','部門','コーナー','ライン','カテゴリ'];
      if (lowAxes.includes(prodAxis)) return;
      if (!summaryRow) return;
      if (userSortedRef.current) return;
      const wantKey = `col${summaryRow.latestColIndex ?? (displayBuckets.length-1)}`;
      if (sortKey !== wantKey || sortAsc !== false){
        setSortKey(wantKey);
        setSortAsc(false);
      }
    }, [summaryRow?.latestColIndex, prodAxis]); // eslint-disable-line react-hooks/exhaustive-deps

    // 並び替えを適用
    const tableRows = React.useMemo(()=>{
      const rows = [...baseRows];
      rows.sort((a,b)=>{
        let av,bv;
        if(sortKey==='label'){ av=a.label; bv=b.label; }
        else if(sortKey==='price'){ av=a.price||0; bv=b.price||0; }
        else if(sortKey==='cost'){ av=a.cost||0; bv=b.cost||0; }
        else if(sortKey==='inv'){ av=a.inv||0; bv=b.inv||0; }
        else if(sortKey==='invDays'){ av=a.invDays==null?Infinity:a.invDays; bv=b.invDays==null?Infinity:b.invDays; }
        else if(sortKey==='gmroi30'){ av=a.gmroi30==null? -Infinity : a.gmroi30; bv=b.gmroi30==null? -Infinity : b.gmroi30; }
        else if(sortKey==='units30'){ av=a.units30||0; bv=b.units30||0; }
        else if(sortKey==='asp30'){ av=a.asp30||0; bv=b.asp30||0; }
        else if(sortKey==='profit30'){ av=a.profit30||0; bv=b.profit30||0; }
        else if(sortKey==='uTurn30'){ av=a.uTurn30==null? -Infinity : a.uTurn30; bv=b.uTurn30==null? -Infinity : b.uTurn30; }
        else if(sortKey==='mixScore'){ av=a.mixScore||0; bv=b.mixScore||0; }
        else if(sortKey.startsWith('col')){
          const i = parseInt(sortKey.replace('col',''), 10);
          av = a.byBucket[i]||0; bv = b.byBucket[i]||0;
        } else { // 'total'
          av = a.total||0; bv = b.total||0;
        }
        if(typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        return sortAsc ? av - bv : bv - av;
      });
      return rows;
    }, [baseRows, sortKey, sortAsc]);

    // UI部品スタイル
    const th = { textAlign:'left', padding:8, border:'1px solid #eee' };
    const td = { padding:8, border:'1px solid #eee' };
    const showMoneyCols = true;

    const markUserSorted = ()=>{ userSortedRef.current = true; };
    const clickSort = (key)=>{ markUserSorted(); setSortAsc(key===sortKey ? !sortAsc : (key==='label')); setSortKey(key); };

    const toggleExpand = (label)=>{
      setExpandedRows(prev=>{
        const s=new Set(prev);
        if(s.has(label)) s.delete(label); else s.add(label);
        return s;
      });
    };

    const getRowCodeByAxis = (row) => {
      if (prodAxis === 'SKU') return row.items?.[0]?.sku || row.items?.[0]?.id || row.label;
      if (prodAxis === 'アイテム') {
        const sku = row.items?.[0]?.sku;
        return sku ? itemCodeFromSku(sku) : (row.items?.[0]?.itemId || row.label);
      }
      return row.label;
    };
    const getRowNameByAxis = (row) => {
      if (prodAxis === 'SKU') return row.items?.[0]?.name || row.label;
      if (prodAxis === 'アイテム') return row.items?.[0]?.itemName || row.label;
      return row.label;
    };

    // ツールチップ
    const TT = {
      code: 'コード体系：SKU=4桁-4桁-2桁 / アイテム=4桁-4桁',
      price: '売価（定価基準）',
      cost: '原価（売価×0.6 を採用）',
      inv: '現在庫合計（対象店舗の総和）',
      invDays: '在庫回転日数 = 在庫数量 ÷ (直近30日販売数 / 30)',
      total: `${metricHeader}の期間累計（行の全バケット合計）`,
      bucket: `${metricHeader}（バケット単位集計）`,
    planEnd: '計画終了日（EOL）',
    forecastEnd: '在庫尽き予測日（直近28日ペースから算出）',
    action: '推奨対応（発注/移管/値下 等）',
    // 推奨対応の基準を簡潔に示すツールチップ
    actionCriteria: '移管: 店舗の在庫シェアと直近28日販売シェアの乖離が15%以上 → 移管候補。\n発注: 予測在庫尽きが計画終了日より早い場合。\n値下: 予測在庫尽きが計画終了日の21日より後に到達する場合。',
    // 30日効率
      units30: '直近30日 販売点数',
      asp30: '直近30日 平均販売単価 = 売上高30 / 販売点数30',
      profit30: '直近30日 粗利高 = 売上高30 - (原価×販売点数30)',
      gmroi30: 'ROI(30) = 粗利高30 / 在庫原価（在庫数量×原価）',
      uTurn30: '数量回転効率 U-Turn30 = 販売点数30 / 在庫数量',
      mixScore: '総評（0〜1）：正規化(GMROI30)×0.45 + 正規化(U-Turn30)×0.35 + 価格中庸性×0.20'
    };

    // ─────────────────────────────
    // レンダリング
    // ─────────────────────────────
    return (
      <div>
        <div className="tableWrap compactTable" style={{maxHeight:'800px',overflowY:'auto'}}>
          <table className="dense">
            <thead>
              {/* フィルタ入力行 */}
              <tr>
                <th style={th}></th>
                <th style={th}></th>
                <th style={th}><TextField size="small" placeholder="コード" value={tempColumnFilters.code||localColumnFilters.code||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, code:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, code:e.target.value}))} /></th>
                <th style={th}><TextField size="small" placeholder="商品名" value={tempColumnFilters.name||localColumnFilters.name||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, name:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, name:e.target.value}))} /></th>
                {showMoneyCols && <th style={th}><TextField size="small" placeholder="売価" value={tempColumnFilters.price||localColumnFilters.price||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, price:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, price:e.target.value}))} /></th>}
                {showMoneyCols && <th style={th}><TextField size="small" placeholder="原価" value={tempColumnFilters.cost||localColumnFilters.cost||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, cost:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, cost:e.target.value}))} /></th>}
                <th style={th}><TextField size="small" placeholder="在庫" value={tempColumnFilters.inv||localColumnFilters.inv||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, inv:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, inv:e.target.value}))} /></th>
                <th style={th}><TextField size="small" placeholder="在庫回転日数" /></th>
                {roiVisible && (
                  <>
                    <th style={th}><TextField size="small" placeholder="#Units30" /></th>
                    <th style={th}><TextField size="small" placeholder="ASP30" /></th>
                    <th style={th}><TextField size="small" placeholder="Profit30" /></th>
                    <th style={th}><TextField size="small" placeholder="ROI(30)" /></th>
                    <th style={th}><TextField size="small" placeholder="U-Turn30" /></th>
                  </>
                )}
                <th style={th}><TextField size="small" placeholder="総評" /></th>
                <th style={th}><TextField size="small" placeholder="累計" /></th>
                {displayBuckets.map((b,i)=>(<th key={i} style={th}><TextField size="small" placeholder={showBuckets?b.label:(i===0?'直近-1':'直近')} /></th>))}
                <th style={th}><TextField size="small" placeholder="計画終了日" value={tempColumnFilters.planEnd||localColumnFilters.planEnd||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, planEnd:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, planEnd:e.target.value}))} /></th>
                <th style={th}><TextField size="small" placeholder="予測終了日" value={tempColumnFilters.forecastEnd||localColumnFilters.forecastEnd||''} onChange={(e)=>setTempColumnFilters(prev=>({...prev, forecastEnd:e.target.value}))} onBlur={(e)=>setLocalColumnFilters(prev=>({...prev, forecastEnd:e.target.value}))} /></th>
                <th style={th}></th>
                <th style={th}></th>
              </tr>

              {/* 見出し行 */}
              <tr>
                <th style={th}></th>
                <th style={th}>No</th>

                <th style={th}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('label')}>
                    <Tooltip title={TT.code} arrow>
                      <span>コード {sortKey==='label' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                <th style={th}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('name')}>
                    商品名 {sortKey==='name' ? (sortAsc?'▲':'▼') : '▽'}
                  </span>
                </th>

                {showMoneyCols && (
                  <th style={{...th,textAlign:'right'}}>
                    <span style={{cursor:'pointer'}} onClick={()=>clickSort('price')}>
                      <Tooltip title={TT.price} arrow>
                        <span>売価 {sortKey==='price' ? (sortAsc?'▲':'▼') : '▽'}</span>
                      </Tooltip>
                    </span>
                  </th>
                )}
                {showMoneyCols && (
                  <th style={{...th,textAlign:'right'}}>
                    <span style={{cursor:'pointer'}} onClick={()=>clickSort('cost')}>
                      <Tooltip title={TT.cost} arrow>
                        <span>原価 {sortKey==='cost' ? (sortAsc?'▲':'▼') : '▽'}</span>
                      </Tooltip>
                    </span>
                  </th>
                )}

                <th style={{...th,textAlign:'right'}}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('inv')}>
                    <Tooltip title={TT.inv} arrow>
                      <span>在庫 {sortKey==='inv' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                <th style={{...th,textAlign:'right'}}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('invDays')}>
                    <Tooltip title={TT.invDays} arrow>
                      <span>在庫回転日数 {sortKey==='invDays' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                {roiVisible && (
                  <>
                    <th style={{...th,textAlign:'right'}}>
                      <span style={{cursor:'pointer'}} onClick={()=>clickSort('units30')}>
                        <Tooltip title={TT.units30} arrow>
                          <span>#Units30 {sortKey==='units30' ? (sortAsc?'▲':'▼') : '▽'}</span>
                        </Tooltip>
                      </span>
                    </th>

                    <th style={{...th,textAlign:'right'}}>
                      <span style={{cursor:'pointer'}} onClick={()=>clickSort('asp30')}>
                        <Tooltip title={TT.asp30} arrow>
                          <span>ASP30 {sortKey==='asp30' ? (sortAsc?'▲':'▼') : '▽'}</span>
                        </Tooltip>
                      </span>
                    </th>

                    <th style={{...th,textAlign:'right'}}>
                      <span style={{cursor:'pointer'}} onClick={()=>clickSort('profit30')}>
                        <Tooltip title={TT.profit30} arrow>
                          <span>Profit30 {sortKey==='profit30' ? (sortAsc?'▲':'▼') : '▽'}</span>
                        </Tooltip>
                      </span>
                    </th>

                    <th style={{...th,textAlign:'right'}}>
                      <span style={{cursor:'pointer'}} onClick={()=>clickSort('gmroi30')}>
                        <Tooltip title={TT.gmroi30} arrow>
                          <span>ROI(30) {sortKey==='gmroi30' ? (sortAsc?'▲':'▼') : '▽'}</span>
                        </Tooltip>
                      </span>
                    </th>

                    <th style={{...th,textAlign:'right'}}>
                      <span style={{cursor:'pointer'}} onClick={()=>clickSort('uTurn30')}>
                        <Tooltip title={TT.uTurn30} arrow>
                          <span>U-Turn30 {sortKey==='uTurn30' ? (sortAsc?'▲':'▼') : '▽'}</span>
                        </Tooltip>
                      </span>
                    </th>
                  </>
                )}

                <th style={{...th,textAlign:'right'}}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('mixScore')}>
                    <Tooltip title={TT.mixScore} arrow>
                      <span>総評 {sortKey==='mixScore' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                <th style={{...th,textAlign:'right'}}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('total')}>
                    <Tooltip title={TT.total} arrow>
                      <span>累計 {sortKey==='total' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                {displayBuckets.map((b,i)=>(
                  <th key={i} style={{...th,textAlign:'right'}} onClick={()=>clickSort('col'+i)}>
                    <Tooltip title={`${TT.bucket}\n${b.start}〜${b.end}`} arrow>
                      <span style={{cursor:'pointer'}}>{showBuckets?b.label:(i===0?'直近-1':'直近')} {sortKey==='col'+i ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                    {showBuckets && (<span className="mini" style={{ display: 'block' }}>{b.start}〜{b.end}</span>)}
                  </th>
                ))}

                <th style={th}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('planEnd')}>
                    <Tooltip title={TT.planEnd} arrow>
                      <span>計画終了日 {sortKey==='planEnd' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                <th style={th}>
                  <span style={{cursor:'pointer'}} onClick={()=>clickSort('forecastEnd')}>
                    <Tooltip title={TT.forecastEnd} arrow>
                      <span>予測終了日 {sortKey==='forecastEnd' ? (sortAsc?'▲':'▼') : '▽'}</span>
                    </Tooltip>
                  </span>
                </th>

                <th style={{...th,textAlign:'center'}}>
                  <Tooltip title={TT.action} arrow><span>推奨対応</span></Tooltip>
                </th>
                <th style={{...th,textAlign:'center'}}>対応</th>
              </tr>
            </thead>

            <tbody>
              {/* 合計行（ヘッダー直下） */}
              {summaryRow && (
                <tr style={{background:'#f7fafc', fontWeight:700}}>
                  <td></td><td></td>
                  <td colSpan={2}>合計</td>
                  {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                  {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                  <td style={{...td,textAlign:'right'}}>{summaryRow.inv.toLocaleString()}</td>
                  <td style={{...td,textAlign:'right'}}>—</td>
                  {roiVisible && (
                    <>
                      <td style={{...td,textAlign:'right'}}>{(summaryRow.units30||0).toLocaleString()}</td>
                      <td style={{...td,textAlign:'right'}}>{summaryRow.asp30==null?'—':fmtYen(Math.round(summaryRow.asp30))}</td>
                      <td style={{...td,textAlign:'right'}}>{fmtYen(summaryRow.profit30||0)}</td>
                      <td style={{...td,textAlign:'right'}}>—</td>
                      <td style={{...td,textAlign:'right'}}>—</td>
                    </>
                  )}
                  <td style={{...td,textAlign:'right'}}>—</td>
                  <td style={{...td,textAlign:'right'}}>{formatCell(summaryRow.total)}</td>
                  {summaryRow.byBucket.map((v,i)=>(
                    <td key={i} style={{...td,textAlign:'right', backgroundColor:i===summaryRow.latestColIndex?'#fff0f0':'#f9fbff'}}>
                      {formatCell(v||0)}
                    </td>
                  ))}
                  <td style={td}>—</td>
                  <td style={td}>—</td>
                  <td style={{...td,textAlign:'center'}}>—</td>
                  <td style={{...td,textAlign:'center'}}>—</td>
                </tr>
              )}

              {/* データ行 */}
              {tableRows.map((row, rowIndex)=>{
                const priceCell = showMoneyCols ? (row.price!=null ? fmtYen(row.price) : '—') : '—';
                const costCell  = showMoneyCols ? (row.cost!=null  ? fmtYen(row.cost)  : '—') : '—';
                const planEnd   = row.eol || '—';
                const opened    = expandedRows.has(row.label);

                // 前年/今年
                const prevTotal   = row.prevTotal || 0;
                const prevBy      = row.prevByBucket || [];
                const curTotal    = row.total || 0;
                const curBy       = row.byBucket || [];

                return (
                  <React.Fragment key={row.label}>
                    {/* メイン行（今年） */}
                    <tr className="rowHover"
                        onClick={(e)=>{ 
                          setSelectedRow(row); 
                          const child = nextAxis(prodAxis); 
                          if(child || compareMode){ toggleExpand(row.label); }
                        }}
                        style={{background: selectedRow && selectedRow.label===row.label? '#eef8ff': undefined}}>
                      <td style={td}><Checkbox size="small" checked={checkedRows?.has?.(row.label)}
                        onChange={(e)=>{ e.stopPropagation(); setCheckedRows(prev=>{ const s=new Set(prev||new Set()); if(s.has(row.label)) s.delete(row.label); else s.add(row.label); return s; }); }}
                      /></td>
                      <td style={td}>{rowIndex+1}</td>
                      <td style={td}><b>{getRowCodeByAxis(row)}</b></td>
                      <td style={td}>{getRowNameByAxis(row)}{prodAxis!=='SKU' ? ` ${prodAxis!=='アイテム' ? `(${row.items.length}件)` : ''}` : ''}</td>

                      {showMoneyCols && <td style={{...td,textAlign:'right'}}>{priceCell}</td>}
                      {showMoneyCols && <td style={{...td,textAlign:'right'}}>{costCell}</td>}

                      <td style={{...td,textAlign:'right'}}>{row.inv.toLocaleString()}</td>
                      <td style={{...td,textAlign:'right'}}>{row.invDays==null ? '—' : row.invDays.toLocaleString()}</td>

                      {roiVisible && (
                        <>
                          <td style={{...td,textAlign:'right'}}>{(row.units30||0).toLocaleString()}</td>
                          <td style={{...td,textAlign:'right'}}>{row.asp30==null ? '—' : fmtYen(Math.round(row.asp30))}</td>
                          <td style={{...td,textAlign:'right'}}>{fmtYen(row.profit30||0)}</td>
                          <td style={{...td,textAlign:'right'}}>{row.gmroi30==null ? '—' : row.gmroi30.toFixed(3)}</td>
                          <td style={{...td,textAlign:'right'}}>{row.uTurn30==null ? '—' : row.uTurn30.toFixed(3)}</td>
                        </>
                      )}

                      <td style={{...td,textAlign:'right'}}>{row.mixScore==null ? '—' : row.mixScore.toFixed(3)}</td>

                      <td style={{...td,textAlign:'right'}}>{formatCell(curTotal)}</td>
                      {displayBuckets.map((_,i)=>(
                        <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#fffbe6' }}>
                          {formatCell(curBy[i]||0)}
                        </td>
                      ))}

                      <td style={td} className="nowrap">{planEnd}</td>
                      <td style={td} className="nowrap">{row.forecastEnd || '—'}</td>
                      <td style={{...td,textAlign:'center'}}>
                        {/* 推奨対応の詳細（移管ペア）をツールチップで表示 */}
                        <Tooltip
                          title={
                            row.action?.label==='移管' && Array.isArray(row.action?.detail?.transfers)
                              ? row.action.detail.transfers.map(t=>`${t.from} → ${t.to}: ${t.qty}`).join('\n')
                              : (row.action?.detail?.reason || '')
                          }
                          arrow
                          disableHoverListener={!row.action || row.action.label==='—'}
                        >
                            <span style={{display:'inline-flex',gap:6,alignItems:'center'}}>
                              <Chip
                                label={row.action?.label || '—'}
                                color={row.action?.color || 'default'}
                                variant={row.action?.label==='—'?'outlined':'filled'}
                                size="small"
                                onClick={(e)=>{ e.stopPropagation(); openActionModal(row.action?.label,row); }}
                                style={{cursor:'pointer'}}
                              />
                              <Tooltip title={TT.actionCriteria} arrow>
                                <span className="mini" style={{color:'#666',cursor:'help'}}>i</span>
                              </Tooltip>
                            </span>
                        </Tooltip>
                      </td>
                      <td style={{...td,textAlign:'center'}}>
                        <Button size="small" variant="contained" disabled={prodAxis!=='SKU'}
                          onClick={(e)=>{ e.stopPropagation(); openActionModal('対応',row); }}>
                          {prodAxis==='SKU'?'対応':'SKUで表示'}
                        </Button>
                      </td>
                    </tr>

                    {/* 前年サブ行 */}
                    {yoyShow && (
                      <tr className="mini" style={{background:'#f9fbff', color:'#344'}}>
                        <td></td>
                        <td style={td}></td>
                        <td style={td}><b>前年</b></td>
                        <td style={td}>—</td>
                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                        <td style={{...td,textAlign:'right'}}>—</td>
                        <td style={{...td,textAlign:'right'}}>—</td>
                        {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                        <td style={{...td,textAlign:'right'}}>—</td>
                        <td style={{...td,textAlign:'right'}}>{formatCell(prevTotal)}</td>
                        {displayBuckets.map((_,i)=>(
                          <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#eef3ff' }}>
                            {formatCell(prevBy?.[i] || 0)}
                          </td>
                        ))}
                        <td style={td}>—</td>
                        <td style={td}>—</td>
                        <td style={{...td,textAlign:'center'}}>—</td>
                        <td style={{...td,textAlign:'center'}}>—</td>
                      </tr>
                    )}

                    {/* 差（今年-前年） */}
                    {yoyDiffShow && (
                      <tr className="mini" style={{background:'#eafbe5', color:'#224'}}>
                        <td></td><td style={td}></td>
                        <td style={td}><b>前年差</b></td>
                        <td style={td}>—</td>
                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                        <td style={{...td,textAlign:'right'}}>—</td>
                        <td style={{...td,textAlign:'right'}}>—</td>
                        {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                        <td style={{...td,textAlign:'right'}}>—</td>
                        <td style={{...td,textAlign:'right'}}>{formatCell(curTotal - prevTotal)}</td>
                        {displayBuckets.map((_,i)=>(
                          <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#eafbe5' }}>
                            {formatCell((curBy[i]||0) - (prevBy?.[i]||0))}
                          </td>
                        ))}
                        <td style={td}>—</td><td style={td}>—</td><td style={{...td,textAlign:'center'}}>—</td><td style={{...td,textAlign:'center'}}>—</td>
                      </tr>
                    )}

                    {/* 前年比(%) */}
                    {yoyRateShow && (
                      <tr className="mini" style={{background:'#fffef5', color:'#444'}}>
                        <td></td><td style={td}></td>
                        <td style={td}><b>前年比(%)</b></td>
                        <td style={td}>—</td>
                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                        <td style={{...td,textAlign:'right'}}>—</td>
                        <td style={{...td,textAlign:'right'}}>—</td>
                        {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                        <td style={{...td,textAlign:'right'}}>—</td>
                        <td style={{...td,textAlign:'right'}}>{formatRate(curTotal, prevTotal)}</td>
                        {displayBuckets.map((_,i)=>(
                          <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#fff7e6' }}>
                            {formatRate(curBy[i]||0, prevBy?.[i]||0)}
                          </td>
                        ))}
                        <td style={td}>—</td><td style={td}>—</td><td style={{...td,textAlign:'center'}}>—</td><td style={{...td,textAlign:'center'}}>—</td>
                      </tr>
                    )}

                    {/* 展開：店舗間比較（ON） */}
                    {opened && compareMode && (
                      window.MASTERS.STORES.filter(s=>targetStoreIds.has(s.id)).map(st=>{
                        const byUnitsStore = displayBuckets.map(b=>
                          row.items.reduce((acc,p)=> acc + window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, p.id, st.id, b.start, b.end), 0)
                        );
                        const storeInv = row.items.reduce((acc,p)=>
                          acc + window.FIXTURES.INVENTORY
                            .filter(i=>i.productId===p.id && i.storeId===st.id)
                            .reduce((a,c)=>a+c.qty,0)
                        ,0);
                        const price0 = row.items[0]?.price||0;
                        const cost0  = Math.round(price0*0.6);
                        const byMetric = (metric==='units')? byUnitsStore :
                                         (metric==='revenue')? byUnitsStore.map(u=>u*price0) :
                                         byUnitsStore.map(u=>u*(price0 - cost0));
                        const storeTotal = byMetric.reduce((a,b)=>a+b,0);
                        const fmt = (v)=> metric==='units' ? v.toLocaleString() : fmtYen(v);
                        return (
                          <tr className="storeRow" key={`${row.label}::store::${st.id}`}>
                            <td></td>
                            <td className="mini">内訳</td>
                            <td className="storeCell">{st.name}</td>
                            <td className="mini">—</td>
                            {showMoneyCols && <td style={{...td,textAlign:'right'}} className="mini">—</td>}
                            {showMoneyCols && <td style={{...td,textAlign:'right'}} className="mini">—</td>}
                            <td style={{...td,textAlign:'right'}}>{storeInv.toLocaleString()}</td>
                            <td style={{...td,textAlign:'right'}}>—</td>
                            {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                            <td style={{...td,textAlign:'right'}}>—</td>
                            <td style={{...td,textAlign:'right'}}>{fmt(storeTotal)}</td>
                            {displayBuckets.map((_,i)=>(
                              <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#fffbe6' }}>{fmt(byMetric[i]||0)}</td>
                            ))}
                            <td className="mini">—</td>
                            <td className="mini">—</td>
                            <td className="mini" style={{textAlign:'center'}}>—</td>
                            <td className="mini" style={{textAlign:'center'}}>—</td>
                          </tr>
                        );
                      })
                    )}

                    {/* 展開：子階層（店舗比較OFF、再帰） */}
                    {opened && !compareMode && (() => {
                      const child = nextAxis(prodAxis);
                      if (!child) return null;

                      const groups = groupItemsByAxis(row.items, child, P_TAXO);

                      const renderGroupTable = (parentKey, levelAxis, groups) => {
                        const toggleExpandKey = (key) => {
                          setExpandedRows(prev=>{
                            const s=new Set(prev);
                            if(s.has(key)) s.delete(key); else s.add(key);
                            return s;
                          });
                        };
                        return (
                          <table className="dense">
                            <thead>
                              <tr>
                                <th style={th}></th>
                                <th style={th}>No</th>
                                <th style={th}>コード</th>
                                <th style={th}>商品名</th>
                                {showMoneyCols && <th style={{...th,textAlign:'right'}}>売価</th>}
                                {showMoneyCols && <th style={{...th,textAlign:'right'}}>原価</th>}
                                <th style={{...th,textAlign:'right'}}>在庫</th>
                                <th style={{...th,textAlign:'right'}}>在庫回転日数</th>
                                {roiVisible && (
                                  <>
                                    <th style={{...th,textAlign:'right'}}>#Units30</th>
                                    <th style={{...th,textAlign:'right'}}>ASP30</th>
                                    <th style={{...th,textAlign:'right'}}>Profit30</th>
                                    <th style={{...th,textAlign:'right'}}>ROI(30)</th>
                                    <th style={{...th,textAlign:'right'}}>U-Turn30</th>
                                  </>
                                )}
                                <th style={{...th,textAlign:'right'}}>総評</th>
                                <th style={{...th,textAlign:'right'}}>累計</th>
                                {displayBuckets.map((b,i)=>(<th key={i} style={{...th,textAlign:'right'}}>{showBuckets?b.label:(i===0?'直近-1':'直近')}</th>))}
                                <th style={th}>計画終了日</th>
                                <th style={th}>予測終了日</th>
                                <th style={{...th,textAlign:'center'}}>推奨対応</th>
                                <th style={{...th,textAlign:'center'}}>対応</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groups.map((g,gi)=>{
                                const m = computeGroupMetrics({
                                  items: g.items, buckets, metric, targetStoreIds, range, idx, STORES, P_TAXO
                                });
                                const total = (metric==='units'? m.totalUnits : metric==='revenue'? m.totalRevenue : m.totalProfit);
                                const by = (metric==='units'? m.byUnits : (metric==='revenue'? m.byRevenue : m.byProfit));
                                const prevBy = (metric==='units'? m.prevByUnits : (metric==='revenue'? m.prevByRevenue : m.prevByProfit));
                                const prevTot = (metric==='units'? m.prevTotalUnits : (metric==='revenue'? m.prevTotalRevenue : m.prevTotalProfit));

                                const code = (levelAxis==='SKU') ? g.items[0].sku : (levelAxis==='アイテム' ? itemCodeFromSku(g.items[0].sku) : g.label);
                                const name = (levelAxis==='SKU') ? g.items[0].name : (levelAxis==='アイテム' ? g.items[0].itemName : g.label);

                                const childKey = `${parentKey}>>${g.label}`;
                                const childOpened = expandedRows.has(childKey);

                                const diffT = total - prevTot;

                                return (
                                  <React.Fragment key={`${parentKey}::${g.label}`}>
                                    <tr
                                      className="rowHover"
                                      onClick={()=> {
                                        const grand = nextAxis(levelAxis);
                                        if (grand) toggleExpandKey(childKey);
                                      }}
                                      style={{cursor: nextAxis(levelAxis) ? 'pointer' : 'default'}}
                                    >
                                      <td style={td}></td>
                                      <td style={td}>{gi+1}</td>
                                      <td style={td}><b>{code}</b></td>
                                      <td style={td}>{name}{levelAxis!=='SKU' && levelAxis!=='アイテム' ? ` (${g.items.length}件)` : ''}</td>
                                      {showMoneyCols && <td style={{...td,textAlign:'right'}}>{m.price!=null? fmtYen(m.price):'—'}</td>}
                                      {showMoneyCols && <td style={{...td,textAlign:'right'}}>{m.cost!=null ? fmtYen(m.cost) : '—'}</td>}
                                      <td style={{...td,textAlign:'right'}}>{m.inv.toLocaleString()}</td>
                                      <td style={{...td,textAlign:'right'}}>{m.invDays==null?'—':m.invDays.toLocaleString()}</td>
                                      {roiVisible && (
                                        <>
                                          <td style={{...td,textAlign:'right'}}>{(m.units30||0).toLocaleString()}</td>
                                          <td style={{...td,textAlign:'right'}}>{m.asp30==null ? '—' : fmtYen(Math.round(m.asp30))}</td>
                                          <td style={{...td,textAlign:'right'}}>{fmtYen(m.profit30||0)}</td>
                                          <td style={{...td,textAlign:'right'}}>{m.gmroi30==null?'—':m.gmroi30.toFixed(3)}</td>
                                          <td style={{...td,textAlign:'right'}}>{m.uTurn30==null?'—':m.uTurn30.toFixed(3)}</td>
                                        </>
                                      )}
                                      <td style={{...td,textAlign:'right'}}>—</td>
                                      <td style={{...td,textAlign:'right'}}>{(metric==='units'? m.totalUnits.toLocaleString(): fmtYen(metric==='revenue'?m.totalRevenue:m.totalProfit))}</td>
                                      {displayBuckets.map((_,i)=>(
                                        <td key={i} style={{...td,textAlign:'right', backgroundColor:'#fffbe6'}}>
                                          {metric==='units'? (by[i]||0).toLocaleString() : fmtYen(by[i]||0)}
                                        </td>
                                      ))}
                                      <td style={td} className="nowrap">{m.eol || '—'}</td>
                                      <td style={td} className="nowrap">{m.forecastEnd || '—'}</td>
                                      <td style={{...td,textAlign:'center'}}>
                                        <Tooltip
                                          title={
                                            m.action?.label==='移管' && Array.isArray(m.action?.detail?.transfers)
                                              ? m.action.detail.transfers.map(t=>`${t.from} → ${t.to}: ${t.qty}`).join('\n')
                                              : (m.action?.detail?.reason || '')
                                          }
                                          arrow
                                          disableHoverListener={!m.action || m.action.label==='—'}
                                        >
                                          <Chip
                                            label={m.action.label}
                                            color={m.action.color}
                                            variant={m.action.label==='—'?'outlined':'filled'}
                                            size="small"
                                            style={{cursor:'pointer'}}
                                            onClick={(e)=>{ e.stopPropagation(); const childRow = Object.assign({}, m, { items: g.items, label: g.label }); openActionModal(m.action?.label, childRow); }}
                                          />
                                        </Tooltip>
                                      </td>
                                      <td style={{...td,textAlign:'center'}}>
                                        <Button size="small" variant="contained" disabled={levelAxis!=='SKU'}>{levelAxis==='SKU'?'対応':'SKUで表示'}</Button>
                                      </td>
                                    </tr>

                                    {/* 子：前年 */}
                                    {yoyShow && (
                                      <tr className="mini" style={{background:'#f1f6ff', color:'#344'}}>
                                        <td></td><td style={td}></td>
                                        <td style={td}><b>前年</b></td>
                                        <td style={td}>—</td>
                                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        <td style={{...td,textAlign:'right'}}>{metric==='units'? prevTot.toLocaleString(): fmtYen(prevTot)}</td>
                                        {displayBuckets.map((_,i)=>(
                                          <td key={i} style={{...td,textAlign:'right', backgroundColor:'#eef3ff'}}>
                                            {metric==='units'? (prevBy?.[i]||0).toLocaleString() : fmtYen(prevBy?.[i]||0)}
                                          </td>
                                        ))}
                                        <td style={td}>—</td><td style={td}>—</td><td style={{...td,textAlign:'center'}}>—</td><td style={{...td,textAlign:'center'}}>—</td>
                                      </tr>
                                    )}

                                    {/* 子：前年差 */}
                                    {yoyDiffShow && (
                                      <tr className="mini" style={{background:'#eafbe5', color:'#224'}}>
                                        <td></td><td style={td}></td>
                                        <td style={td}><b>前年差</b></td>
                                        <td style={td}>—</td>
                                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        <td style={{...td,textAlign:'right'}}>{(metric==='units'? (total - prevTot).toLocaleString() : fmtYen(total - prevTot))}</td>
                                        {displayBuckets.map((_,i)=>(
                                          <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#eafbe5' }}>
                                            {metric==='units'? ((by[i]||0)-(prevBy?.[i]||0)).toLocaleString() : fmtYen((by[i]||0)-(prevBy?.[i]||0))}
                                          </td>
                                        ))}
                                        <td style={td}>—</td><td style={td}>—</td><td style={{...td,textAlign:'center'}}>—</td><td style={{...td,textAlign:'center'}}>—</td>
                                      </tr>
                                    )}

                                    {/* 子：前年比(%) */}
                                    {yoyRateShow && (
                                      <tr className="mini" style={{background:'#fffef5', color:'#444'}}>
                                        <td></td><td style={td}></td>
                                        <td style={td}><b>前年比(%)</b></td>
                                        <td style={td}>—</td>
                                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                                        {showMoneyCols && <td style={{...td,textAlign:'right'}}>—</td>}
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        {roiVisible && (<><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td><td style={{...td,textAlign:'right'}}>—</td></>)}
                                        <td style={{...td,textAlign:'right'}}>—</td>
                                        <td style={{...td,textAlign:'right'}}>{
                                          (prevTot===0 && total===0) ? '—' :
                                          (prevTot===0 && total!==0) ? '∞' :
                                          `${(((total/prevTot)-1)*100>=0?'+':'')+(((total/prevTot)-1)*100).toFixed(1)}%`
                                        }</td>
                                        {displayBuckets.map((_,i)=>(
                                          <td key={i} style={{ ...td, textAlign:'right', backgroundColor:'#fff7e6' }}>
                                            {(() => {
                                              const c = by[i]||0, p = prevBy?.[i]||0;
                                              if(p===0 && c===0) return '—';
                                              if(p===0 && c!==0) return '∞';
                                              const r = (c/p - 1) * 100;
                                              return `${r>=0?'+':''}${r.toFixed(1)}%`;
                                            })()}
                                          </td>
                                        ))}
                                        <td style={td}>—</td><td style={td}>—</td><td style={{...td,textAlign:'center'}}>—</td><td style={{...td,textAlign:'center'}}>—</td>
                                      </tr>
                                    )}

                                    {/* 孫階層（再帰展開） */}
                                    {childOpened && (() => {
                                      const grand = nextAxis(levelAxis);
                                      if(!grand) return null;
                                      const gGroups = groupItemsByAxis(g.items, grand, P_TAXO);
                                      return (
                                        <tr>
                                          <td colSpan={
                                            (showMoneyCols? 6:4) + 2 /*inv+invDays*/ + (roiVisible?5:0) + 1 /*総評*/ + 1 /*total*/ + (displayBuckets.length) + 4
                                          } style={{ padding: 0, border: 'none' }}>
                                            <div style={{ padding: 8, paddingLeft: 24 }}>
                                              {renderGroupTable(childKey, grand, gGroups)}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })()}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        );
                      };

                      return (
                        <tr>
                          <td colSpan={
                            (showMoneyCols? 6:4) + 2 /*inv+invDays*/ + (roiVisible?5:0) + 1 /*総評*/ + 1 /*total*/ + (displayBuckets.length) + 4
                          } style={{ padding: 0, border: 'none' }}>
                            <div style={{ padding: 8 }}>
                              {renderGroupTable(row.label, child, groups)}
                            </div>
                          </td>
                        </tr>
                      );
                    })()}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
})();
