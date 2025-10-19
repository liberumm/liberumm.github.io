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

    const openDetail = (row)=>{
      const edits = planEdits[row.sku];
      const transfers = edits ? edits.map(e=>({...e})) : row.transfers.map(t=>({...t}));
      const perStore = storeIds.map(sid=>{
        return {
          id: sid,
          name: STORES.find(s=>String(s.id)===String(sid))?.name || String(sid),
          inv: row.invByStore[sid]||0,
          ideal: row.idealByStore[sid]||0,
          diff: (row.invByStore[sid]||0) - (row.idealByStore[sid]||0)
        };
      }).sort((a,b)=> b.diff - a.diff);

      setDetail({
        sku: row.sku,
        name: row.name,
        productId: row.productId,
        perStore,
        transfers
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
        alert(`移管計画（${plan.length}行）をコンソールに出力しました。`);
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

        <Dialog open={!!detail} onClose={closeDetail} fullWidth maxWidth="md">
          <DialogTitle>移管詳細 — {detail?.sku} {detail?.name}</DialogTitle>
          <DialogContent dividers>
            <div style={{marginBottom:8, fontWeight:700}}>店舗別 現在庫／理想在庫／乖離</div>
            <Table size="small" sx={{mb:2}}>
              <TableHead>
                <TableRow>
                  <TableCell style={th}>店舗</TableCell>
                  <TableCell style={th} align="right">現在庫</TableCell>
                  <TableCell style={th} align="right">理想在庫</TableCell>
                  <TableCell style={th} align="right">乖離(=現在-理想)</TableCell>
                  <TableCell style={th} align="center">判定</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detail?.perStore?.map(s=>(
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell align="right">{s.inv.toLocaleString()}</TableCell>
                    <TableCell align="right">{s.ideal.toLocaleString()}</TableCell>
                    <TableCell align="right">{(s.diff).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      {s.diff>0 ? <Chip size="small" color="warning" label="ドナー(過剰)"/> :
                       s.diff<0 ? <Chip size="small" color="info"    label="レシーバ(不足)"/> :
                                  <Chip size="small" variant="outlined" label="適正"/>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div style={{marginBottom:8, fontWeight:700}}>移管ペア（編集可）</div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={th}>From</TableCell>
                  <TableCell style={th}>To</TableCell>
                  <TableCell style={th} align="right">数量</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(detail?.transfers||[]).map((t,i)=>(
                  <TableRow key={i}>
                    <TableCell>{t.from}</TableCell>
                    <TableCell>{t.to}</TableCell>
                    <TableCell align="right" style={{width:140}}>
                      <TextField
                        size="small"
                        type="number"
                        value={t.qty}
                        onChange={(e)=>changeTransferQty(i, e.target.value)}
                        inputProps={{min:0, step:1}}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(!detail?.transfers || detail?.transfers.length===0) && (
                  <TableRow><TableCell colSpan={3} align="center" style={{color:'#888'}}>移管ペアはありません</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDetail}>閉じる</Button>
            <Button variant="contained" onClick={saveDetailEdits}>変更を保存</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
})();
