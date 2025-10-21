// components/TransferPlanner.js
(function(){
  const {
    Button, Paper, Grid, TextField, Select, MenuItem, InputLabel, FormControl,
    Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
  } = MaterialUI;

  const { ymd } = window.Utils || {
    ymd: (d)=> {
      const z = (n)=> String(n).padStart(2,'0');
      return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
    }
  };

  // ─────────────────────────────
  // 共通：28日販売・在庫・理想在庫の計算
  // ─────────────────────────────
  function calcLast28Start(endYmd){
    const d = new Date(endYmd+'T00:00:00');
    d.setDate(d.getDate()-27);
    return ymd(d);
  }

  function sumUnitsByStore28({idx, productId, storeIds, start, end}){
    const res = {};
    storeIds.forEach(sid=>{
      const u = window.Sales.sumUnitsByStore(idx.idxByProductStoreDate, productId, sid, start, end);
      res[sid] = (res[sid]||0) + u;
    });
    return res;
  }

  function sumInvByStore({productId, storeIds}){
    const inv = {};
    storeIds.forEach(sid=>{
      inv[sid] = window.FIXTURES.INVENTORY
        .filter(i=> i.productId===productId && i.storeId===sid)
        .reduce((a,c)=>a+c.qty,0);
    });
    return inv;
  }

  function computeIdeal({invByStore, salesByStore, roundTo=1}){
    const storeIds = Object.keys(invByStore);
    const totalInv = storeIds.reduce((a,s)=> a + (invByStore[s]||0), 0);
    const totalSales = storeIds.reduce((a,s)=> a + (salesByStore[s]||0), 0);
    const share = {};
    if(totalSales>0){
      storeIds.forEach(s=> share[s] = (salesByStore[s]||0) / totalSales);
    }else{
      const eq = storeIds.length ? 1/storeIds.length : 0;
      storeIds.forEach(s=> share[s] = eq);
    }
    let ideal = {};
    let acc = 0;
    storeIds.forEach((s)=>{
      let v = Math.round((totalInv * share[s]) / roundTo) * roundTo;
      ideal[s] = v;
      acc += v;
    });
    const diff = totalInv - acc;
    if(diff !== 0 && storeIds.length){
      const order = [...storeIds].sort((a,b)=>{
        const ga = (invByStore[a]||0) - ideal[a];
        const gb = (invByStore[b]||0) - ideal[b];
        return Math.abs(gb) - Math.abs(ga);
      });
      let remain = Math.abs(diff);
      for(let i=0; i<order.length && remain>0; i++){
        const s = order[i];
        ideal[s] += (diff>0 ? 1 : -1) * roundTo;
        remain -= roundTo;
      }
    }
    return { idealByStore: ideal, salesShare: share };
  }

  function makeTransfers({invByStore, idealByStore, gapThreshold=0.08, minMove=5, stores, limitRatio=0.5}){
    const storeIds = Object.keys(invByStore);
    const totalInv = storeIds.reduce((a,s)=>a+(invByStore[s]||0),0);
    if(totalInv<=0) return {transfers:[], donors:[], takers:[]};

    const rows = storeIds.map(s=>{
      const cur  = invByStore[s]||0;
      const idea = idealByStore[s]||0;
      const gapQty = cur - idea; // 正=過剰
      const curShare  = totalInv? (cur/totalInv):0;
      const idealShare= totalInv? (idea/totalInv):0;
      const gapShare  = curShare - idealShare;
      return {storeId:s, cur, ideal:idea, gapQty, gapShare};
    });

    const donors = rows.filter(r=> r.gapShare >  gapThreshold && r.cur >= minMove)
                       .map(d=>{
                         const maxMove = Math.max(0, d.cur - d.ideal);
                         const plan    = Math.floor(maxMove * limitRatio);
                         return {...d, plan: plan>=minMove?plan:0};
                       })
                       .filter(d=> d.plan>=minMove);
    const takers = rows.filter(r=> r.gapShare < -gapThreshold)
                       .map(t=>{
                         const need = Math.max(0, t.ideal - t.cur);
                         return {...t, need};
                       })
                       .filter(t=> t.need>=minMove);

    const transfers = [];
    donors.forEach(d=>{
      let remain = d.plan;
      for(const t of takers){
        if(remain<=0) break;
        if(t.need<=0) continue;
        const qty = Math.min(remain, t.need);
        if(qty >= minMove){
          transfers.push({
            from: stores.find(s=> String(s.id)===String(d.storeId))?.name || d.storeId,
            fromId: d.storeId,
            to  : stores.find(s=> String(s.id)===String(t.storeId))?.name || t.storeId,
            toId: t.storeId,
            qty
          });
          remain -= qty;
          t.need -= qty;
        }
      }
    });

    return {transfers, donors, takers};
  }

  // ─────────────────────────────
  // 画面本体：TransferPlanner
  // ─────────────────────────────
  window.TransferPlanner = function TransferPlanner(props){
    const {
      range,
      targetStoreIds,
      gapThreshold: initGap=0.08,
      minMove: initMin=5,
      skuFilter: initQuery='',
      // 新しいフィルタ props
      storeNameFilter: initStoreNameFilter = '',
      windowStart: initWindowStart = '',
      windowEnd: initWindowEnd = '',
      onApplyPlan
    } = props;

    const STORES = window.MASTERS.STORES || [];
    const PRODUCTS = window.FIXTURES.PRODUCTS || [];
    const { buildIndexes } = window.Sales;
    const idx = React.useMemo(()=> buildIndexes(window.FIXTURES.SALES, PRODUCTS), [window.FIXTURES.SALES, PRODUCTS]);

    const [gapThreshold, setGapThreshold] = React.useState(initGap);
    const [minMove, setMinMove] = React.useState(initMin);
    const [onlyActionable, setOnlyActionable] = React.useState(true);
  const [query, setQuery] = React.useState(initQuery);
  const [storeNameFilter, setStoreNameFilter] = React.useState(initStoreNameFilter);
  const [windowStart, setWindowStart] = React.useState(initWindowStart);
  const [windowEnd, setWindowEnd] = React.useState(initWindowEnd);
    const [selected, setSelected] = React.useState(new Set());
    const [detail, setDetail] = React.useState(null);
    const [planEdits, setPlanEdits] = React.useState({});
    const [globalPlan, setGlobalPlan] = React.useState([]);
    const [showPreview, setShowPreview] = React.useState(false);
    
    // プレビュー用フィルター・ソート・チェック
    const [previewFilters, setPreviewFilters] = React.useState({
      sku: '', itemName: '', price: '', fromStore: '', invQty: '', qty: '', toStore: ''
    });
    const [sortField, setSortField] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState('asc');
    const [previewChecked, setPreviewChecked] = React.useState(new Set());
    const [previewAllChecked, setPreviewAllChecked] = React.useState(true);

    const storeIds = React.useMemo(()=>{
      const q = (storeNameFilter||'').trim().toLowerCase();
      return STORES
        .filter(s=> {
          if(targetStoreIds && !targetStoreIds.has(s.id)) return false;
          if(q){
            return (s.name||'').toLowerCase().includes(q) || (String(s.id||'')).includes(q);
          }
          return true;
        })
        .map(s=>s.id);
    }, [STORES, targetStoreIds, storeNameFilter]);

  const effectiveStart = windowStart || calcLast28Start(range.end);
  const effectiveEnd = windowEnd || range.end;
  const last28Start = effectiveStart;

    const rows = React.useMemo(()=>{
      const list = [];
      PRODUCTS.forEach(p=>{
        if(query){
          const q = query.trim().toLowerCase();
          const hit = (p.sku||'').toLowerCase().includes(q) ||
                      (p.name||'').toLowerCase().includes(q) ||
                      (p.itemName||'').toLowerCase().includes(q);
          if(!hit) return;
        }
        const invByStore = sumInvByStore({productId:p.id, storeIds});
        const salesByStore = sumUnitsByStore28({
          idx, productId:p.id, storeIds, start:last28Start, end:effectiveEnd
        });

        const { idealByStore } = computeIdeal({invByStore, salesByStore});
        const { transfers } = makeTransfers({
          invByStore, idealByStore, gapThreshold, minMove, stores:STORES
        });

        const totalInv = Object.values(invByStore).reduce((a,b)=>a+b,0);
        const totalSales = Object.values(salesByStore).reduce((a,b)=>a+b,0);
        const actionable = transfers.length>0;

        if(onlyActionable && !actionable) return;

        const total = Math.max(1, totalInv);
        const gaps = Object.keys(invByStore).map(s=>{
          const curShare   = (invByStore[s]||0)/total;
          const idealShare = (idealByStore[s]||0)/total;
          return Math.abs(curShare-idealShare);
        });
        const maxGap = gaps.length? Math.max(...gaps):0;

        list.push({
          sku: p.sku, name: p.name || p.itemName || '',
          productId: p.id,
          totalInv, totalSales, actionable, maxGap,
          invByStore, salesByStore, idealByStore,
          transfers
        });
      });

      list.sort((a,b)=> b.maxGap - a.maxGap);
      return list;
    }, [PRODUCTS, storeIds.join(','), last28Start, range.end, gapThreshold, minMove, onlyActionable, query, idx, STORES]);

    const toggleSelect = (sku)=>{
      setSelected(prev=>{
        const s = new Set(prev);
        if(s.has(sku)) s.delete(sku); else s.add(sku);
        return s;
      });
    };

    const calcToBeInv = (perStore, transfers)=>{
      const tobe = {};
      perStore.forEach(s=> tobe[s.id] = s.inv);
      transfers.forEach(t=>{
        tobe[t.fromId] = (tobe[t.fromId]||0) - t.qty;
        tobe[t.toId] = (tobe[t.toId]||0) + t.qty;
      });
      return tobe;
    };

    const autoGenerateTransfers = (perStore)=>{
      const donors = perStore.filter(s=> s.diff > 0).sort((a,b)=> b.diff - a.diff);
      const takers = perStore.filter(s=> s.diff < 0).sort((a,b)=> a.diff - b.diff);
      const transfers = [];
      donors.forEach(d=>{
        let remain = d.diff;
        for(const t of takers){
          if(remain<=0) break;
          const need = Math.abs(t.diff);
          if(need<=0) continue;
          const qty = Math.min(remain, need);
          if(qty>=1){
            transfers.push({
              from: d.name,
              fromId: d.id,
              to: t.name,
              toId: t.id,
              qty
            });
            remain -= qty;
            t.diff += qty;
          }
        }
      });
      return transfers;
    };

    const openDetail = (row)=>{
      const edits = planEdits[row.sku];
      const transfers = edits ? edits.map(e=>({...e})) : row.transfers.map(t=>({...t}));
      const perStore = storeIds.map(sid=>{
        return {
          id: sid,
          name: STORES.find(s=>String(s.id)===String(sid))?.name || String(sid),
          inv: row.invByStore[sid]||0,
          sales: row.salesByStore[sid]||0,
          ideal: row.idealByStore[sid]||0,
          diff: (row.invByStore[sid]||0) - (row.idealByStore[sid]||0),
          transferQty: 0,
          transferTo: ''
        };
      }).sort((a,b)=> b.diff - a.diff);

      // keep inv/ideal maps to enable smarter auto-generation later
      setDetail({
        sku: row.sku,
        name: row.name,
        productId: row.productId,
        perStore,
        transfers,
        invByStore: row.invByStore || {},
        idealByStore: row.idealByStore || {}
      });
    };

    const closeDetail = ()=> setDetail(null);

    const changeTransferQty = (idx, qty)=>{
      setDetail(prev=>{
        const d = {...prev};
        d.transfers = d.transfers.map((t,i)=> i===idx? {...t, qty:Number(qty)||0 }: t);
        return d;
      });
    };

    const removeTransfer = (idx)=>{
      setDetail(prev=>{
        const d = {...prev};
        d.transfers = d.transfers.filter((t,i)=> i!==idx);
        return d;
      });
    };

    const addTransfer = ()=>{
      if(!detail || !detail.newFrom || !detail.newTo || detail.newQty<=0) return;
      const fromStore = STORES.find(s=> String(s.id)===String(detail.newFrom));
      const toStore = STORES.find(s=> String(s.id)===String(detail.newTo));
      if(!fromStore || !toStore) return;
      
      setDetail(prev=>{
        const d = {...prev};
        d.transfers = [...d.transfers, {
          from: fromStore.name,
          fromId: detail.newFrom,
          to: toStore.name,
          toId: detail.newTo,
          qty: detail.newQty
        }];
        d.newFrom = '';
        d.newTo = '';
        d.newQty = 0;
        return d;
      });
    };

    const updateNewTransferField = (field, value)=>{
      setDetail(prev=> ({...prev, [field]: value}));
    };

    const autoGenerate = ()=>{
      if(!detail) return;
      const invByStore = detail.invByStore || detail.perStore.reduce((a,c)=>{a[c.id]=c.inv; return a;},{});
      const idealByStore = detail.idealByStore || detail.perStore.reduce((a,c)=>{a[c.id]=c.ideal; return a;},{});
      
      // 過剰在庫店舗と不足在庫店舗を抽出
      const donors = [];
      const takers = [];
      detail.perStore.forEach(s=>{
        if(s.diff > 0) donors.push({...s, available: s.diff});
        else if(s.diff < 0) takers.push({...s, need: Math.abs(s.diff)});
      });
      
      donors.sort((a,b)=> b.available - a.available);
      takers.sort((a,b)=> b.need - a.need);
      
      // 各過剰在庫店舗に移管先と数量を設定
      const perStore = detail.perStore.map(s=> ({...s, transferQty:0, transferTo:''}));
      const transfers = [];
      
      donors.forEach(d=>{
        let remain = d.available;
        for(const t of takers){
          if(remain<=0) break;
          if(t.need<=0) continue;
          const qty = Math.min(remain, t.need);
          if(qty>=1){
            // perStoreに反映
            const fromStore = perStore.find(p=> String(p.id)===String(d.id));
            if(fromStore){
              if(!fromStore.transferTo){
                fromStore.transferTo = t.id;
                fromStore.transferQty = qty;
              } else {
                // 既に移管先がある場合は数量を加算
                fromStore.transferQty += qty;
              }
            }
            
            transfers.push({
              from: d.name,
              fromId: d.id,
              to: t.name,
              toId: t.id,
              qty
            });
            remain -= qty;
            t.need -= qty;
          }
        }
      });

      setDetail(prev=> ({...prev, transfers, perStore}));
    };

    // 全商品に対して自動生成するロジック
    function generateTransfersForProduct({invByStore, idealByStore, minMove=1}){
      // Build donor and taker lists with integer quantities
      const donors = [];
      const takers = [];
      Object.keys(invByStore).forEach(sid=>{
        const cur = Math.floor(invByStore[sid]||0);
        const ideal = Math.floor(idealByStore[sid]||0);
        const diff = cur - ideal; // positive => donor
        if(diff >= minMove) donors.push({storeId:sid, available: diff});
        else if(diff <= -minMove) takers.push({storeId:sid, need: -diff});
      });

      // sort donors desc by available, takers desc by need
      donors.sort((a,b)=> b.available - a.available);
      takers.sort((a,b)=> b.need - a.need);

      const transfers = [];

      // If there are no donors or takers, return early
      if(donors.length===0 || takers.length===0) return transfers;

      // Greedy match: try to assign large donors to large takers to avoid splitting donors.
      // Track donor remaining to avoid oversubscription.
      for(const d of donors){
        let remain = d.available;
        // iterate takers sorted by remaining need (largest first)
        for(const t of takers){
          if(remain < minMove) break; // donor cannot supply meaningful amount
          if(t.need < minMove) continue; // taker need too small
          const qty = Math.min(remain, t.need);
          // ensure qty respects minMove; if qty < minMove, skip
          if(qty >= minMove){
            transfers.push({ fromId: d.storeId, toId: t.storeId, qty });
            remain -= qty;
            t.need -= qty;
          }
        }
      }

      // Post-process: there may be small residual needs/availabilities (< minMove) on both sides.
      // Try to consolidate small taker needs by pulling from donors that still have some remainder
      const smallTakers = takers.filter(t=> t.need>0 && t.need < minMove);
      if(smallTakers.length>0){
        for(const st of smallTakers){
          // find donor with enough remainder (>= minMove + st.need) or largest remainder
          let candidate = null;
          let candidateRemain = 0;
          for(const d of donors){
            // compute consumed amount from this donor in transfers so far
            const consumed = transfers.filter(x=> String(x.fromId)===String(d.storeId)).reduce((a,c)=> a + (c.qty||0), 0);
            const availLeft = d.available - consumed;
            if(availLeft >= minMove){
              // prefer donor with largest availLeft
              if(availLeft > candidateRemain){ candidate = d; candidateRemain = availLeft; }
            }
          }
          if(candidate){
            // allocate if possible (we may allocate less than minMove if it's the only way to satisfy a taker)
            const consumed = transfers.filter(x=> String(x.fromId)===String(candidate.storeId)).reduce((a,c)=> a + (c.qty||0), 0);
            const availLeft = candidate.available - consumed;
            const give = Math.min(availLeft, st.need);
            if(give>0){
              // if give < minMove and candidate has no way to provide minMove to anyone else, still allow to avoid leaving tiny needs
              transfers.push({ fromId: candidate.storeId, toId: st.storeId, qty: give });
              st.need -= give;
            }
          }
        }
      }

      // Final safety: ensure total outflow from donors never exceeds their available
      // (should be guaranteed by construction but add check to adjust if needed)
      const adjusted = [];
      const donorTotals = {};
      donors.forEach(d=> donorTotals[d.storeId] = 0);
      for(const tr of transfers){
        const sid = String(tr.fromId);
        donorTotals[sid] = (donorTotals[sid]||0) + tr.qty;
      }
      // If any donor exceeded its available (due to roundups), truncate last allocations
      for(const d of donors){
        const sid = String(d.storeId);
        const allowed = d.available;
        if(donorTotals[sid] > allowed){
          // need to reduce allocations from this donor proportionally (or trim smallest allocations)
          let over = donorTotals[sid] - allowed;
          // collect allocations from this donor (last-first to reduce splitting)
          const fromAlloc = transfers.filter(t=> String(t.fromId)===sid).slice().reverse();
          for(const fa of fromAlloc){
            if(over<=0) break;
            const take = Math.min(fa.qty, over);
            fa.qty -= take;
            over -= take;
          }
        }
      }

      // return transfers with qty>0
      const result = transfers.filter(t=> t.qty>0);

      // Fallbacks: if no transfers found, try the core makeTransfers (threshold-based) or a relaxed greedy
      if(result.length === 0){
        try{
          // try core makeTransfers with relaxed threshold and minMove=1
          const mt = makeTransfers({ invByStore, idealByStore, gapThreshold: Math.max(0, (gapThreshold||0)/2), minMove: 1, stores: STORES });
          if(mt && mt.transfers && mt.transfers.length){
            console.debug('[TransferPlanner] generateTransfersForProduct: fallback makeTransfers produced', mt.transfers.length);
            return mt.transfers.map(x=> ({ fromId: x.fromId, toId: x.toId, qty: x.qty }));
          }
        }catch(e){ console.debug('[TransferPlanner] makeTransfers fallback failed', e); }

        // final fallback: relaxed greedy with unit granularity
        const donors2 = [];
        const takers2 = [];
        Object.keys(invByStore).forEach(sid=>{
          const cur = Math.floor(invByStore[sid]||0);
          const ideal = Math.floor(idealByStore[sid]||0);
          const diff = cur - ideal;
          if(diff > 0) donors2.push({ storeId: sid, available: diff });
          else if(diff < 0) takers2.push({ storeId: sid, need: -diff });
        });
        donors2.sort((a,b)=> b.available - a.available);
        takers2.sort((a,b)=> b.need - a.need);
        const r2 = [];
        for(const d of donors2){
          let remain = d.available;
          for(const t of takers2){
            if(remain<=0) break;
            if(t.need<=0) continue;
            const qty = Math.min(remain, t.need);
            if(qty>0){ r2.push({ fromId: d.storeId, toId: t.storeId, qty }); remain -= qty; t.need -= qty; }
          }
        }
        if(r2.length) {
          console.debug('[TransferPlanner] generateTransfersForProduct: fallback relaxed greedy produced', r2.length);
          return r2;
        }
      }

      return result;
    }

    const autoGenerateAll = ()=>{
      // For each product in PRODUCTS (ignore current UI filters) compute inv/sales/ideal and generate transfers
      // Use all stores (STORES) rather than filtered storeIds to ensure full coverage
      const allPlan = [];
      const allStoreIds = STORES.map(s=> s.id);
      PRODUCTS.forEach(p=>{
        const invByStore = sumInvByStore({productId: p.id, storeIds: allStoreIds});
        const salesByStore = sumUnitsByStore28({ idx, productId: p.id, storeIds: allStoreIds, start: last28Start, end: effectiveEnd });
        const { idealByStore } = computeIdeal({invByStore, salesByStore});
        const transfers = generateTransfersForProduct({invByStore, idealByStore, minMove});
        // enrich with store names
        const enriched = transfers.map(t=>({
          sku: p.sku,
          productId: p.id,
          fromStoreId: t.fromId,
          fromStore: STORES.find(s=>String(s.id)===String(t.fromId))?.name || t.fromId,
          toStoreId: t.toId,
          toStore: STORES.find(s=>String(s.id)===String(t.toId))?.name || t.toId,
          qty: t.qty
        }));
        if(enriched.length){
          allPlan.push(...enriched);
          console.debug('[TransferPlanner] autoGenerateAll', p.sku, 'generated', enriched.length, 'rows');
        }
      });
      setGlobalPlan(allPlan);
      // also set planEdits per SKU
      setPlanEdits(prev=>{
        const next = {...prev};
        // group by sku
        const bySku = {};
        allPlan.forEach(p=>{ (bySku[p.sku] = bySku[p.sku]||[]).push({...p, from:p.fromStore, to:p.toStore, fromId:p.fromStoreId, toId:p.toStoreId}); });
        Object.keys(bySku).forEach(sku=> next[sku] = bySku[sku].map(x=>({from:x.from, fromId:x.fromId, to:x.to, toId:x.toId, qty:x.qty}))); 
        return next;
      });
    };

    const updateStoreTransfer = (storeId, field, value)=>{
      setDetail(prev=>{
        const d = {...prev};
        d.perStore = d.perStore.map(s=> s.id===storeId ? {...s, [field]: value} : s);
        d.transfers = generateTransfersFromStores(d.perStore);
        return d;
      });
    };

    const generateTransfersFromStores = (perStore)=>{
      const transfers = [];
      perStore.forEach(s=>{
        if(s.transferQty > 0 && s.transferTo){
          const toStore = perStore.find(t=> String(t.id)===String(s.transferTo));
          if(toStore){
            transfers.push({
              from: s.name,
              fromId: s.id,
              to: toStore.name,
              toId: toStore.id,
              qty: s.transferQty
            });
          }
        }
      });
      return transfers;
    };

    const submitTransferRequest = (storeData)=>{
      if(!detail || !storeData.transferTo || storeData.transferQty<=0) return;
      const toStore = detail.perStore.find(s=> String(s.id)===String(storeData.transferTo));
      if(!toStore) return;

      const planItem = {
        sku: detail.sku,
        productId: detail.productId,
        fromStoreId: storeData.id,
        fromStore: storeData.name,
        toStoreId: storeData.transferTo,
        toStore: toStore.name,
        qty: storeData.transferQty
      };

      // push to in-memory fixture list for backward compatibility
      if(window.FIXTURES && window.FIXTURES.TASKS){
        const task = {
          id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
          type: '移管',
          title: `移管申請: ${detail.sku} ${storeData.name}→${toStore.name}`,
          description: `商品: ${detail.sku} ${detail.name}\n払出元: ${storeData.name}\n受入先: ${toStore.name}\n数量: ${storeData.transferQty}`,
          status: 'pending',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
          assignee: '商品部',
          metadata: planItem
        };
        window.FIXTURES.TASKS.push(task);
      }

      // If parent provided onApplyPlan, send single-item plan so App can create a task in its list
      if(typeof onApplyPlan === 'function'){
        onApplyPlan([planItem]);
      }

      console.log(`[TransferPlanner] 移管申請を登録: ${storeData.name} → ${toStore.name} (${storeData.transferQty}個)`);
    };

    const saveDetailEdits = ()=>{
      if(!detail) return;
      setPlanEdits(prev=>{
        const next = {...prev};
        next[detail.sku] = detail.transfers.filter(t=> t.qty>0);
        return next;
      });
      closeDetail();
    };

    const applyPlan = (onlySelected)=>{
      const pick = rows.filter(r=> onlySelected? selected.has(r.sku) : true);
      const plan = [];
      pick.forEach(r=>{
        const items = (planEdits[r.sku] || r.transfers || []).filter(t=> t.qty>0);
        items.forEach(t=>{
          plan.push({
            sku: r.sku,
            productId: r.productId,
            fromStoreId: t.fromId,
            fromStore: t.from,
            toStoreId: t.toId,
            toStore: t.to,
            qty: t.qty
          });
        });
      });
      if(typeof onApplyPlan === 'function'){
        onApplyPlan(plan);
      } else {
        console.log('[TransferPlanner] applyPlan', plan);
      }
    };

    const exportCSV = ()=>{
      const plan = [];
      rows.forEach(r=>{
        const items = (planEdits[r.sku] || r.transfers || []).filter(t=> t.qty>0);
        items.forEach(t=>{
          plan.push([r.sku, r.name, r.productId, t.fromId, t.from, t.toId, t.to, t.qty]);
        });
      });
      const header = ['SKU','商品名','ProductId','FromStoreId','FromStore','ToStoreId','ToStore','Qty'];
      const csv = [header, ...plan].map(a=> a.map(v=>{
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
      }).join(',')).join('\n');

      const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transfer-plan_${range.end}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const transferCount = (row)=>{
      const items = planEdits[row.sku] || row.transfers || [];
      return items.filter(t=> t.qty>0).length;
    };

    const th = { borderBottom:'1px solid #eee', fontWeight:700 };
    const td = { borderBottom:'1px solid #f4f4f4' };

    return (
      <div>
        <Paper variant="outlined" sx={{p:1, mb:1}}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm="auto">
              <TextField
                label="検索（SKU/名称）"
                size="small"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm="auto">
              <TextField
                label="乖離しきい値(%)"
                size="small"
                type="number"
                value={(gapThreshold*100).toFixed(1)}
                onChange={(e)=> setGapThreshold(Math.max(0, Number(e.target.value||0)/100))}
                helperText="在庫シェアと販売シェアの乖離で判定"
              />
            </Grid>
            <Grid item xs={6} sm="auto">
              <TextField
                label="最小移管数量"
                size="small"
                type="number"
                value={minMove}
                onChange={(e)=> setMinMove(Math.max(1, parseInt(e.target.value||'1',10)))}
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Checkbox
                size="small"
                checked={onlyActionable}
                onChange={(e)=> setOnlyActionable(e.target.checked)}
              />
              <span className="mini">移管候補のみ表示</span>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Button variant="outlined" onClick={exportCSV}>CSV出力</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={autoGenerateAll}>全件自動生成</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={()=> setShowPreview(true)} disabled={globalPlan.length===0}>プレビュー</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={()=>applyPlan(true)} disabled={selected.size===0}>
                選択SKUのみ適用
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={()=>applyPlan(false)}>
                全件適用
              </Button>
            </Grid>
          </Grid>
          <div className="mini" style={{marginTop:4, color:'#666'}}>
            対象期間：{last28Start}〜{effectiveEnd}（販売シェアで理想在庫を配分／販売ゼロ時は均等配分）
          </div>
        </Paper>

        <div className="tableWrap compactTable" style={{maxHeight:'70vh', overflowY:'auto'}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell style={th}>SKU</TableCell>
                <TableCell style={th}>商品名</TableCell>
                <TableCell style={th} align="right">総在庫</TableCell>
                <TableCell style={th} align="right">直近28日販売</TableCell>
                <TableCell style={th} align="right">
                  乖離指数
                  <Tooltip title="在庫シェアと理想シェアの最大乖離（大きいほどミスマッチ）" arrow>
                    <span style={{marginLeft:6, color:'#999'}}>ⓘ</span>
                  </Tooltip>
                </TableCell>
                <TableCell style={th} align="center">推奨</TableCell>
                <TableCell style={th} align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r=>(
                <TableRow key={r.sku} hover>
                  <TableCell padding="checkbox">
                    <Checkbox size="small" checked={selected.has(r.sku)} onChange={()=>toggleSelect(r.sku)} />
                  </TableCell>
                  <TableCell>{r.sku}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell align="right">{r.totalInv.toLocaleString()}</TableCell>
                  <TableCell align="right">{r.totalSales.toLocaleString()}</TableCell>
                  <TableCell align="right">{r.maxGap.toFixed(3)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={r.actionable? `移管候補(${transferCount(r)}件)` : '—'}
                      color={r.actionable? 'warning' : 'default'}
                      variant={r.actionable? 'filled':'outlined'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" onClick={()=>openDetail(r)}>詳細</Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow><TableCell colSpan={8} align="center" style={{color:'#888'}}>該当なし</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

  <Dialog open={!!detail} onClose={closeDetail} fullWidth maxWidth="xl">
          <DialogTitle>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span>移管詳細 — {detail?.sku} {detail?.name}</span>
              <Button variant="outlined" size="small" onClick={autoGenerate}>
                自動プラン生成
              </Button>
            </div>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div style={{marginBottom:8, fontWeight:700}}>店舗別在庫状況（AsIs → ToBe）</div>
                <div style={{maxHeight:'500px', overflowY:'auto'}}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={th}>店舗</TableCell>
                        <TableCell style={th} align="right">現在庫</TableCell>
                        <TableCell style={th} align="right">直近28日販売</TableCell>
                        <TableCell style={th} align="right">回転日数</TableCell>
                        <TableCell style={th} align="right">理想</TableCell>
                        <TableCell style={th} align="right">乖離</TableCell>
                        <TableCell style={th}>移管先</TableCell>
                        <TableCell style={th} align="right">移管数</TableCell>
                        <TableCell style={th} align="right">ToBe</TableCell>
                        <TableCell style={th} align="right">ToBe回転</TableCell>
                        <TableCell style={th} align="right">残差</TableCell>
                        <TableCell style={th} align="center">操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail?.perStore?.map(s=>{
                        const tobeInv = calcToBeInv(detail.perStore, detail.transfers||[]);
                        const tobe = tobeInv[s.id]||s.inv;
                        const remaining = tobe - s.ideal;
                        const suggestedQty = s.diff > 0 ? s.diff : 0;
                        const dailySales = (s.sales||0) / 28;
                        const turnoverDays = dailySales > 0 ? (s.inv / dailySales) : (s.inv > 0 ? 999 : 0);
                        const tobeTurnoverDays = dailySales > 0 ? (tobe / dailySales) : (tobe > 0 ? 999 : 0);
                        return (
                          <TableRow key={s.id} style={{backgroundColor: s.diff>0 ? '#fff3e0' : s.diff<0 ? '#e3f2fd' : 'transparent'}}>
                            <TableCell style={{fontWeight:600}}>{s.name}</TableCell>
                            <TableCell align="right">{s.inv.toLocaleString()}</TableCell>
                            <TableCell align="right">{(s.sales||0).toLocaleString()}</TableCell>
                            <TableCell align="right" style={{fontSize:'0.85em'}}>
                              {turnoverDays >= 999 ? '—' : turnoverDays.toFixed(1)}日
                            </TableCell>
                            <TableCell align="right">{s.ideal.toLocaleString()}</TableCell>
                            <TableCell align="right" style={{fontWeight:700, color: s.diff>0?'#e65100':s.diff<0?'#0277bd':'#666'}}>
                              {s.diff>0?'+':''}{s.diff.toLocaleString()}
                            </TableCell>
                            <TableCell style={{width:140}}>
                              {s.diff > 0 ? (
                                <FormControl size="small" fullWidth>
                                  <Select
                                    value={s.transferTo||''}
                                    onChange={(e)=>updateStoreTransfer(s.id, 'transferTo', e.target.value)}
                                    displayEmpty
                                  >
                                    <MenuItem value="">—</MenuItem>
                                    {detail?.perStore?.filter(t=>t.diff<0 && t.id!==s.id).map(t=>(
                                      <MenuItem key={t.id} value={t.id}>
                                        {t.name} ({t.diff})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : <span style={{color:'#999', fontSize:'0.85em'}}>—</span>}
                            </TableCell>
                            <TableCell align="right" style={{width:80}}>
                              {s.diff > 0 ? (
                                <TextField
                                  size="small"
                                  type="number"
                                  value={s.transferQty||0}
                                  onChange={(e)=>updateStoreTransfer(s.id, 'transferQty', Number(e.target.value)||0)}
                                  inputProps={{min:0, max:s.inv, step:1}}
                                  placeholder={suggestedQty.toString()}
                                  fullWidth
                                  sx={{input:{textAlign:'right', fontSize:'0.85em'}}}
                                />
                              ) : <span style={{color:'#999', fontSize:'0.85em'}}>—</span>}
                            </TableCell>
                            <TableCell align="right" style={{fontWeight:600, backgroundColor:'#f0f9ff'}}>
                              {tobe.toLocaleString()}
                            </TableCell>
                            <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#f0f9ff'}}>
                              {tobeTurnoverDays >= 999 ? '—' : tobeTurnoverDays.toFixed(1)}日
                            </TableCell>
                            <TableCell align="right" style={{fontSize:'0.85em', color: Math.abs(remaining)<Math.abs(s.diff)?'#2e7d32':'#666'}}>
                              {remaining>0?'+':''}{remaining.toLocaleString()}
                            </TableCell>
                            <TableCell align="center" style={{width:80}}>
                              {s.diff > 0 && s.transferTo && s.transferQty > 0 ? (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={()=>submitTransferRequest(s)}
                                >
                                  登録
                                </Button>
                              ) : <span style={{color:'#999', fontSize:'0.85em'}}>—</span>}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDetail}>閉じる</Button>
            <Button variant="outlined" onClick={()=>{
              // Save current edits but don't apply
              saveDetailEdits();
            }}>保存</Button>
            <Button variant="contained" color="primary" onClick={()=>{
              // Save and apply current transfers for this SKU
              if(!detail) return;
              const transfers = (detail.transfers || []).filter(t=> t.qty>0).map(t=>({
                sku: detail.sku,
                productId: detail.productId,
                fromStoreId: t.fromId,
                fromStore: t.from,
                toStoreId: t.toId,
                toStore: t.to,
                qty: t.qty
              }));
              // persist locally
              setPlanEdits(prev=> ({...prev, [detail.sku]: transfers}));
              // notify parent
              if(typeof onApplyPlan === 'function' && transfers.length) onApplyPlan(transfers);
              closeDetail();
            }}>保存して申請</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={!!showPreview} onClose={()=> setShowPreview(false)} fullWidth maxWidth="lg">
          <DialogTitle>自動生成プラン プレビュー</DialogTitle>
          <DialogContent dividers>
            {(() => {
              const totalQty = globalPlan.reduce((s,p)=> s + (p.qty||0), 0);
              const totalCount = globalPlan.length;
              const affectedSkus = new Set(globalPlan.map(p=> p.sku));
              const storeBefore = {};
              // aggregate before-inventory for affected SKUs
              rows.forEach(r=>{
                if(!affectedSkus.has(r.sku)) return;
                const invMap = r.invByStore || {};
                Object.keys(invMap).forEach(sid=>{
                  storeBefore[sid] = (storeBefore[sid]||0) + (invMap[sid]||0);
                });
              });
              // apply transfers to compute after-inventory
              const storeAfter = Object.assign({}, storeBefore);
              globalPlan.forEach(p=>{
                const from = String(p.fromStoreId);
                const to = String(p.toStoreId);
                storeAfter[from] = (storeAfter[from]||0) - (p.qty||0);
                storeAfter[to] = (storeAfter[to]||0) + (p.qty||0);
              });
              const storeIds = Object.keys(Object.assign({}, storeBefore, storeAfter)).sort((a,b)=>{
                const an = (STORES.find(s=>String(s.id)===a)?.name||a).toString();
                const bn = (STORES.find(s=>String(s.id)===b)?.name||b).toString();
                return an.localeCompare(bn, 'ja');
              });

              return (
                <div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                    <div style={{fontWeight:700}}>移管サマリ</div>
                    <div style={{color:'#333'}}>
                      合計 {totalCount} 件 / {totalQty.toLocaleString()} 個
                    </div>
                  </div>

                  <div style={{marginBottom:8}}>
                    <div style={{fontWeight:700, marginBottom:6}}>店舗別 在庫変化（対象SKU合算）</div>
                    <div style={{maxHeight:200, overflowY:'auto', border:'1px solid #eee', padding:6, borderRadius:4}}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell align="right">NO</TableCell>
                            <TableCell>店舗名</TableCell>
                            <TableCell align="right">販売数量（28日）</TableCell>
                            <TableCell align="right">在庫数量</TableCell>
                            <TableCell align="right">払出数</TableCell>
                            <TableCell align="right">払出店舗数</TableCell>
                            <TableCell align="right">受入数</TableCell>
                            <TableCell align="right">受入店舗数</TableCell>
                            <TableCell align="right">在庫数量</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(() => {
                            // 店舗別の販売数量を計算
                            const storeSales = {};
                            rows.forEach(r => {
                              Object.keys(r.salesByStore || {}).forEach(sid => {
                                storeSales[sid] = (storeSales[sid] || 0) + (r.salesByStore[sid] || 0);
                              });
                            });
                            
                            // 店舗別の払出・受入情報を計算
                            const storeTransfers = {};
                            globalPlan.forEach(p => {
                              // 払出（From）
                              if (!storeTransfers[p.fromStoreId]) {
                                storeTransfers[p.fromStoreId] = { payoutQty: 0, payoutStores: new Set(), receiveQty: 0, receiveStores: new Set() };
                              }
                              storeTransfers[p.fromStoreId].payoutQty += p.qty;
                              storeTransfers[p.fromStoreId].payoutStores.add(p.toStoreId);
                              
                              // 受入（To）
                              if (!storeTransfers[p.toStoreId]) {
                                storeTransfers[p.toStoreId] = { payoutQty: 0, payoutStores: new Set(), receiveQty: 0, receiveStores: new Set() };
                              }
                              storeTransfers[p.toStoreId].receiveQty += p.qty;
                              storeTransfers[p.toStoreId].receiveStores.add(p.fromStoreId);
                            });
                            
                            return storeIds.map((sid, index) => {
                              const before = storeBefore[sid] || 0;
                              const after = storeAfter[sid] || 0;
                              const sales = storeSales[sid] || 0;
                              const name = STORES.find(s => String(s.id) === sid)?.name || sid;
                              const transfers = storeTransfers[sid] || { payoutQty: 0, payoutStores: new Set(), receiveQty: 0, receiveStores: new Set() };
                              
                              return (
                                <TableRow key={sid}>
                                  <TableCell align="right">{index + 1}</TableCell>
                                  <TableCell style={{fontWeight:600}}>{name}</TableCell>
                                  <TableCell align="right">{sales.toLocaleString()}</TableCell>
                                  <TableCell align="right">{before.toLocaleString()}</TableCell>
                                  <TableCell align="right" style={{color: transfers.payoutQty > 0 ? '#d32f2f' : '#666'}}>
                                    {transfers.payoutQty.toLocaleString()}
                                  </TableCell>
                                  <TableCell align="right">{transfers.payoutStores.size}</TableCell>
                                  <TableCell align="right" style={{color: transfers.receiveQty > 0 ? '#2e7d32' : '#666'}}>
                                    {transfers.receiveQty.toLocaleString()}
                                  </TableCell>
                                  <TableCell align="right">{transfers.receiveStores.size}</TableCell>
                                  <TableCell align="right" style={{fontWeight:700, backgroundColor: after !== before ? '#f0f9ff' : 'transparent'}}>
                                    {after.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              );
                            });
                          })()}
                          {!storeIds.length && (
                            <TableRow><TableCell colSpan={9} align="center" style={{color:'#888'}}>該当する店舗データなし</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div style={{maxHeight: '40vh', overflowY:'auto'}}>
                    <Table size="small">
                      <TableHead>
                        {/* ヘッダー行 */}
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox 
                              size="small" 
                              checked={previewAllChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setPreviewAllChecked(checked);
                                if (checked) {
                                  setPreviewChecked(new Set(globalPlan.map((p,i) => i)));
                                } else {
                                  setPreviewChecked(new Set());
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" onClick={()=>handleSort('no')} style={{cursor:'pointer'}}>NO {sortField==='no'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell onClick={()=>handleSort('sku')} style={{cursor:'pointer'}}>SKU {sortField==='sku'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell onClick={()=>handleSort('itemName')} style={{cursor:'pointer'}}>アイテム名 {sortField==='itemName'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell align="right" onClick={()=>handleSort('price')} style={{cursor:'pointer'}}>売価 {sortField==='price'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell onClick={()=>handleSort('fromStore')} style={{cursor:'pointer'}}>移管元 {sortField==='fromStore'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell align="right" onClick={()=>handleSort('invQty')} style={{cursor:'pointer'}}>在庫数量 {sortField==='invQty'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell align="right" onClick={()=>handleSort('qty')} style={{cursor:'pointer'}}>移管数量 {sortField==='qty'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell onClick={()=>handleSort('toStore')} style={{cursor:'pointer'}}>移管先 {sortField==='toStore'&&(sortOrder==='asc'?'↑':'↓')}</TableCell>
                          <TableCell align="right" style={{backgroundColor:'#fff3e0'}}>払出販売数(28日)</TableCell>
                          <TableCell align="right" style={{backgroundColor:'#fff3e0'}}>払出元在庫数</TableCell>
                          <TableCell align="right" style={{backgroundColor:'#fff3e0'}}>払出移管後在庫</TableCell>
                          <TableCell align="right" style={{backgroundColor:'#e3f2fd'}}>受入販売数(28日)</TableCell>
                          <TableCell align="right" style={{backgroundColor:'#e3f2fd'}}>受入元在庫数</TableCell>
                          <TableCell align="right" style={{backgroundColor:'#e3f2fd'}}>受入移管後在庫</TableCell>
                        </TableRow>
                        
                        {/* フィルター行 */}
                        <TableRow>
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="SKU"
                              value={previewFilters.sku}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, sku:e.target.value}))}
                              style={{width:'100%', minWidth:80}}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="アイテム名"
                              value={previewFilters.itemName}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, itemName:e.target.value}))}
                              style={{width:'100%', minWidth:100}}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="売価"
                              value={previewFilters.price}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, price:e.target.value}))}
                              style={{width:'100%', minWidth:70}}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="移管元"
                              value={previewFilters.fromStore}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, fromStore:e.target.value}))}
                              style={{width:'100%', minWidth:80}}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="在庫数量"
                              value={previewFilters.invQty}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, invQty:e.target.value}))}
                              style={{width:'100%', minWidth:70}}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="移管数量"
                              value={previewFilters.qty}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, qty:e.target.value}))}
                              style={{width:'100%', minWidth:70}}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="移管先"
                              value={previewFilters.toStore}
                              onChange={(e)=>setPreviewFilters(prev=>({...prev, toStore:e.target.value}))}
                              style={{width:'100%', minWidth:80}}
                            />
                          </TableCell>
                          <TableCell style={{backgroundColor:'#fff3e0'}}></TableCell>
                          <TableCell style={{backgroundColor:'#fff3e0'}}></TableCell>
                          <TableCell style={{backgroundColor:'#fff3e0'}}></TableCell>
                          <TableCell style={{backgroundColor:'#e3f2fd'}}></TableCell>
                          <TableCell style={{backgroundColor:'#e3f2fd'}}></TableCell>
                          <TableCell style={{backgroundColor:'#e3f2fd'}}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          const handleSort = (field) => {
                            if (sortField === field) {
                              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortField(field);
                              setSortOrder('asc');
                            }
                          };
                          
                          let filteredPlan = globalPlan.filter(p => {
                            const product = PRODUCTS.find(pr=> pr.sku === p.sku);
                            const itemName = product?.itemName || product?.name || '';
                            const price = product?.price || 0;
                            const fromStoreInvBefore = rows.find(r=> r.sku === p.sku)?.invByStore?.[p.fromStoreId] || 0;
                            
                            return (
                              (!previewFilters.sku || p.sku.toLowerCase().includes(previewFilters.sku.toLowerCase())) &&
                              (!previewFilters.itemName || itemName.toLowerCase().includes(previewFilters.itemName.toLowerCase())) &&
                              (!previewFilters.price || String(price).includes(previewFilters.price)) &&
                              (!previewFilters.fromStore || p.fromStore.toLowerCase().includes(previewFilters.fromStore.toLowerCase())) &&
                              (!previewFilters.invQty || String(fromStoreInvBefore).includes(previewFilters.invQty)) &&
                              (!previewFilters.qty || String(p.qty).includes(previewFilters.qty)) &&
                              (!previewFilters.toStore || p.toStore.toLowerCase().includes(previewFilters.toStore.toLowerCase()))
                            );
                          });
                          
                          if (sortField) {
                            filteredPlan.sort((a, b) => {
                              let aVal, bVal;
                              const productA = PRODUCTS.find(pr=> pr.sku === a.sku);
                              const productB = PRODUCTS.find(pr=> pr.sku === b.sku);
                              
                              switch(sortField) {
                                case 'no': aVal = globalPlan.indexOf(a); bVal = globalPlan.indexOf(b); break;
                                case 'sku': aVal = a.sku; bVal = b.sku; break;
                                case 'itemName': aVal = productA?.itemName || productA?.name || ''; bVal = productB?.itemName || productB?.name || ''; break;
                                case 'price': aVal = productA?.price || 0; bVal = productB?.price || 0; break;
                                case 'fromStore': aVal = a.fromStore; bVal = b.fromStore; break;
                                case 'toStore': aVal = a.toStore; bVal = b.toStore; break;
                                case 'qty': aVal = a.qty; bVal = b.qty; break;
                                case 'invQty': 
                                  aVal = rows.find(r=> r.sku === a.sku)?.invByStore?.[a.fromStoreId] || 0;
                                  bVal = rows.find(r=> r.sku === b.sku)?.invByStore?.[b.fromStoreId] || 0;
                                  break;
                                default: aVal = 0; bVal = 0;
                              }
                              
                              if (typeof aVal === 'string') {
                                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                              } else {
                                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                              }
                            });
                          }
                          
                          // 初期化時に全てチェック
                          React.useEffect(() => {
                            if (globalPlan.length > 0 && previewChecked.size === 0) {
                              setPreviewChecked(new Set(globalPlan.map((p,i) => i)));
                            }
                          }, [globalPlan.length]);
                          
                          return filteredPlan.map((p,i)=>{
                            const originalIndex = globalPlan.indexOf(p);
                            const product = PRODUCTS.find(pr=> pr.sku === p.sku);
                            const itemName = product?.itemName || product?.name || '';
                            const price = product?.price || 0;
                            
                            // 元店舗の在庫と販売数
                            const fromStoreInvBefore = rows.find(r=> r.sku === p.sku)?.invByStore?.[p.fromStoreId] || 0;
                            const fromStoreSales = rows.find(r=> r.sku === p.sku)?.salesByStore?.[p.fromStoreId] || 0;
                            
                            // 移管先店舗の在庫と販売数
                            const toStoreInvBefore = rows.find(r=> r.sku === p.sku)?.invByStore?.[p.toStoreId] || 0;
                            const toStoreSales = rows.find(r=> r.sku === p.sku)?.salesByStore?.[p.toStoreId] || 0;
                            
                            // 移管後在庫
                            const fromStoreInvAfter = fromStoreInvBefore - p.qty;
                            const toStoreInvAfter = toStoreInvBefore + p.qty;
                            
                            return (
                              <TableRow key={originalIndex}>
                                <TableCell padding="checkbox">
                                  <Checkbox 
                                    size="small" 
                                    checked={previewChecked.has(originalIndex)}
                                    onChange={(e) => {
                                      const newChecked = new Set(previewChecked);
                                      if (e.target.checked) {
                                        newChecked.add(originalIndex);
                                      } else {
                                        newChecked.delete(originalIndex);
                                      }
                                      setPreviewChecked(newChecked);
                                      setPreviewAllChecked(newChecked.size === globalPlan.length);
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right">{originalIndex + 1}</TableCell>
                                <TableCell style={{fontFamily:'monospace'}}>{p.sku}</TableCell>
                                <TableCell>{itemName}</TableCell>
                                <TableCell align="right">¥{price.toLocaleString()}</TableCell>
                                <TableCell>{p.fromStore}</TableCell>
                                <TableCell align="right">{fromStoreInvBefore.toLocaleString()}</TableCell>
                                <TableCell align="right" style={{fontWeight:700, color:'#d32f2f'}}>{p.qty}</TableCell>
                                <TableCell>{p.toStore}</TableCell>
                                <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#fff3e0'}}>{fromStoreSales.toLocaleString()}</TableCell>
                                <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#fff3e0', color:'#666'}}>{fromStoreInvBefore.toLocaleString()}</TableCell>
                                <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#fff3e0', fontWeight:700}}>{fromStoreInvAfter.toLocaleString()}</TableCell>
                                <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#e3f2fd'}}>{toStoreSales.toLocaleString()}</TableCell>
                                <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#e3f2fd', color:'#666'}}>{toStoreInvBefore.toLocaleString()}</TableCell>
                                <TableCell align="right" style={{fontSize:'0.85em', backgroundColor:'#e3f2fd', fontWeight:700}}>{toStoreInvAfter.toLocaleString()}</TableCell>
                              </TableRow>
                            );
                          });
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> setShowPreview(false)}>閉じる</Button>
            <Button variant="contained" color="primary" onClick={()=>{
              if(typeof onApplyPlan === 'function' && globalPlan.length){
                onApplyPlan(globalPlan);
              }
              setShowPreview(false);
            }}>登録してタスク化</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
})();
