// components/TransferPlanner.js
(function(){
  const {
    Button, Paper, Grid, TextField, Select, MenuItem, FormControl,
    Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Box
  } = MaterialUI;

  const { ymd } = window.Utils || {
    ymd: (d)=> {
      const z = (n)=> String(n).padStart(2,'0');
      return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
    }
  };

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

  function computeIdeal({invByStore, salesByStore}){
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
    const ideal = {};
    storeIds.forEach(s=> ideal[s] = Math.round(totalInv * share[s]));
    return { idealByStore: ideal, salesShare: share };
  }

  function makeTransfers({invByStore, idealByStore, gapThreshold=0.08, minMove=5, stores}){
    const storeIds = Object.keys(invByStore);
    const totalInv = storeIds.reduce((a,s)=>a+(invByStore[s]||0),0);
    if(totalInv<=0) return [];

    const donors = [];
    const takers = [];
    
    storeIds.forEach(s=>{
      const cur = invByStore[s]||0;
      const ideal = idealByStore[s]||0;
      const diff = cur - ideal;
      const gapShare = totalInv > 0 ? Math.abs(diff) / totalInv : 0;
      
      if(gapShare > gapThreshold && diff > minMove){
        donors.push({storeId:s, available: diff});
      } else if(gapShare > gapThreshold && diff < -minMove){
        takers.push({storeId:s, need: -diff});
      }
    });

    const transfers = [];
    donors.forEach(d=>{
      let remain = d.available;
      for(const t of takers){
        if(remain<=0) break;
        if(t.need<=0) continue;
        const qty = Math.min(remain, t.need);
        if(qty >= minMove){
          transfers.push({
            from: stores.find(s=> String(s.id)===String(d.storeId))?.name || d.storeId,
            fromId: d.storeId,
            to: stores.find(s=> String(s.id)===String(t.storeId))?.name || t.storeId,
            toId: t.storeId,
            qty
          });
          remain -= qty;
          t.need -= qty;
        }
      }
    });

    return transfers;
  }

  window.TransferPlanner = function TransferPlanner(props){
    const {
      range,
      targetStoreIds,
      gapThreshold: initGap=0.08,
      minMove: initMin=5,
      skuFilter: initQuery='',
      storeNameFilter='',
      windowStart='',
      windowEnd='',
      onApplyPlan,
      onClose,
      isModal=false,
      modalTitle=''
    } = props;

    const STORES = window.MASTERS.STORES || [];
    const PRODUCTS = window.FIXTURES.PRODUCTS || [];
    const { buildIndexes } = window.Sales;
    const idx = React.useMemo(()=> buildIndexes(window.FIXTURES.SALES, PRODUCTS), []);

    const [gapThreshold, setGapThreshold] = React.useState(initGap);
    const [minMove, setMinMove] = React.useState(initMin);
    const [query, setQuery] = React.useState(initQuery);
    const [storeFilter, setStoreFilter] = React.useState(storeNameFilter||'');
    const [codeFilter, setCodeFilter] = React.useState('');
    const [nameFilter, setNameFilter] = React.useState('');
    const [selected, setSelected] = React.useState(new Set());
    const [detail, setDetail] = React.useState(null);
    const [globalPlan, setGlobalPlan] = React.useState([]);
    const [tabValue, setTabValue] = React.useState(0);

    const storeIds = React.useMemo(()=>{
      return STORES
        .filter(s=> targetStoreIds && targetStoreIds.has(s.id))
        .map(s=>s.id);
    }, [STORES, targetStoreIds]);

    const last28Start = calcLast28Start(range.end);

    const rows = React.useMemo(()=>{
      const list = [];
      PRODUCTS.forEach(p=>{
        // 統合フィルタリング
        const codeMatch = !codeFilter || (p.sku||'').toLowerCase().includes(codeFilter.toLowerCase()) || (p.itemCode||'').toLowerCase().includes(codeFilter.toLowerCase());
        const nameMatch = !nameFilter || (p.name||'').toLowerCase().includes(nameFilter.toLowerCase()) || (p.itemName||'').toLowerCase().includes(nameFilter.toLowerCase());
        const queryMatch = !query || (p.sku||'').toLowerCase().includes(query.toLowerCase()) || (p.name||'').toLowerCase().includes(query.toLowerCase()) || (p.itemName||'').toLowerCase().includes(query.toLowerCase());
        
        if(!codeMatch || !nameMatch || !queryMatch) return;
        
        // 店舗フィルタ
        if(storeFilter){
          const storeIds = STORES.filter(s=> s.name.toLowerCase().includes(storeFilter.toLowerCase())).map(s=>s.id);
          const hasInventory = (window.FIXTURES.INVENTORY||[]).some(i=> i.productId===p.id && storeIds.includes(i.storeId) && i.qty>0);
          if(!hasInventory) return;
        }
        
        const invByStore = sumInvByStore({productId:p.id, storeIds});
        const salesByStore = sumUnitsByStore28({
          idx, productId:p.id, storeIds, start:last28Start, end:range.end
        });

        const { idealByStore } = computeIdeal({invByStore, salesByStore});
        const transfers = makeTransfers({
          invByStore, idealByStore, gapThreshold, minMove, stores:STORES
        });

        if(transfers.length === 0) return;

        const totalInv = Object.values(invByStore).reduce((a,b)=>a+b,0);
        const totalSales = Object.values(salesByStore).reduce((a,b)=>a+b,0);

        list.push({
          sku: p.sku, 
          name: p.name || p.itemName || '',
          productId: p.id,
          totalInv, 
          totalSales,
          invByStore, 
          salesByStore, 
          idealByStore,
          transfers
        });
      });

      return list.sort((a,b)=> b.transfers.length - a.transfers.length);
    }, [PRODUCTS, storeIds, last28Start, range.end, gapThreshold, minMove, query, storeFilter, codeFilter, nameFilter]);

    const toggleSelect = (sku)=>{
      setSelected(prev=>{
        const s = new Set(prev);
        if(s.has(sku)) s.delete(sku); else s.add(sku);
        return s;
      });
    };

    const openDetail = (row)=>{
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

      setDetail({
        sku: row.sku,
        name: row.name,
        productId: row.productId,
        perStore,
        transfers: row.transfers.map(t=>({...t}))
      });
    };

    const closeDetail = ()=> setDetail(null);

    const updateStoreTransfer = (storeId, field, value)=>{
      setDetail(prev=>{
        const d = {...prev};
        d.perStore = d.perStore.map(s=> s.id===storeId ? {...s, [field]: value} : s);
        return d;
      });
    };

    const autoGenerateAll = ()=>{
      const allPlan = [];
      PRODUCTS.forEach(p=>{
        const invByStore = sumInvByStore({productId: p.id, storeIds});
        const salesByStore = sumUnitsByStore28({ 
          idx, productId: p.id, storeIds, start: last28Start, end: range.end 
        });
        const { idealByStore } = computeIdeal({invByStore, salesByStore});
        const transfers = makeTransfers({invByStore, idealByStore, gapThreshold, minMove, stores:STORES});
        
        transfers.forEach(t=>{
          allPlan.push({
            sku: p.sku,
            productId: p.id,
            fromStoreId: t.fromId,
            fromStore: t.from,
            toStoreId: t.toId,
            toStore: t.to,
            qty: t.qty
          });
        });
      });
      setGlobalPlan(allPlan);
    };

    const applyPlan = (useSelected = false)=>{
      const plan = [];
      const targetRows = useSelected ? rows.filter(r=> selected.has(r.sku)) : rows;
      
      targetRows.forEach(r=>{
        r.transfers.forEach(t=>{
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
      }
    };

    const exportCSV = ()=>{
      const plan = [];
      rows.forEach(r=>{
        r.transfers.forEach(t=>{
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

    const content = (
      <div>
        {/* 設定パネル */}
        <Paper variant="outlined" sx={{p:2, mb:2}}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
              <TextField
                label="店舗名"
                size="small"
                value={storeFilter}
                onChange={(e)=>setStoreFilter(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="商品コード/SKU"
                size="small"
                value={codeFilter}
                onChange={(e)=>setCodeFilter(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="商品名"
                size="small"
                value={nameFilter}
                onChange={(e)=>setNameFilter(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="乖離しきい値(%)"
                size="small"
                type="number"
                value={(gapThreshold*100).toFixed(1)}
                onChange={(e)=> setGapThreshold(Math.max(0, Number(e.target.value||0)/100))}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="最小移管数量"
                size="small"
                type="number"
                value={minMove}
                onChange={(e)=> setMinMove(Math.max(1, parseInt(e.target.value||'1',10)))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button variant="outlined" size="small" onClick={autoGenerateAll}>
                  全件自動生成
                </Button>
                <Button variant="outlined" size="small" onClick={exportCSV}>
                  CSV出力
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={()=>applyPlan(true)} 
                  disabled={selected.size===0}
                >
                  選択適用({selected.size})
                </Button>
                <Button variant="contained" size="small" onClick={()=>applyPlan(false)}>
                  全件適用
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* タブ切り替え */}
        <Paper variant="outlined" sx={{mb:2}}>
          <Tabs value={tabValue} onChange={(e,v)=>setTabValue(v)}>
            <Tab label={`移管候補 (${rows.length})`} />
            <Tab label={`自動生成プラン (${globalPlan.length})`} disabled={globalPlan.length===0} />
          </Tabs>
        </Paper>

        {/* タブコンテンツ */}
        {tabValue === 0 && (
          <div style={{maxHeight:'60vh', overflowY:'auto'}}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      size="small" 
                      indeterminate={selected.size > 0 && selected.size < rows.length}
                      checked={rows.length > 0 && selected.size === rows.length}
                      onChange={(e)=>{
                        if(e.target.checked){
                          setSelected(new Set(rows.map(r=>r.sku)));
                        } else {
                          setSelected(new Set());
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>商品名</TableCell>
                  <TableCell align="right">総在庫</TableCell>
                  <TableCell align="right">直近28日販売</TableCell>
                  <TableCell align="right">乖離指数</TableCell>
                  <TableCell align="right">回転日数</TableCell>
                  <TableCell align="center">推奨</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(r=>{
                  const total = Math.max(1, r.totalInv);
                  const gaps = Object.keys(r.invByStore).map(s=>{
                    const curShare = (r.invByStore[s]||0)/total;
                    const idealShare = (r.idealByStore[s]||0)/total;
                    return Math.abs(curShare-idealShare);
                  });
                  const maxGap = gaps.length? Math.max(...gaps):0;
                  const dailySales = r.totalSales / 28;
                  const turnoverDays = dailySales > 0 ? (r.totalInv / dailySales) : (r.totalInv > 0 ? 999 : 0);
                  
                  return (
                    <TableRow key={r.sku} hover>
                      <TableCell padding="checkbox">
                        <Checkbox 
                          size="small" 
                          checked={selected.has(r.sku)} 
                          onChange={()=>toggleSelect(r.sku)} 
                        />
                      </TableCell>
                      <TableCell style={{fontFamily:'monospace'}}>{r.sku}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell align="right">{r.totalInv.toLocaleString()}</TableCell>
                      <TableCell align="right">{r.totalSales.toLocaleString()}</TableCell>
                      <TableCell align="right">{maxGap.toFixed(3)}</TableCell>
                      <TableCell align="right">
                        {turnoverDays >= 999 ? '—' : turnoverDays.toFixed(1)}日
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={r.transfers.length > 0 ? `移管候補(${r.transfers.length}件)` : '—'}
                          color={r.transfers.length > 0 ? 'warning' : 'default'}
                          variant={r.transfers.length > 0 ? 'filled':'outlined'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={()=>openDetail(r)}
                        >
                          詳細
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" style={{color:'#888'}}>
                      移管候補なし
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {tabValue === 1 && (
          <div style={{maxHeight:'60vh', overflowY:'auto'}}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right">NO</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>アイテム名</TableCell>
                  <TableCell align="right">売価</TableCell>
                  <TableCell>移管元</TableCell>
                  <TableCell align="right">在庫数量</TableCell>
                  <TableCell align="right">移管数量</TableCell>
                  <TableCell>移管先</TableCell>
                  <TableCell align="right" style={{backgroundColor:'#fff3e0'}}>払出販売数(28日)</TableCell>
                  <TableCell align="right" style={{backgroundColor:'#fff3e0'}}>払出元在庫数</TableCell>
                  <TableCell align="right" style={{backgroundColor:'#fff3e0'}}>払出移管後在庫</TableCell>
                  <TableCell align="right" style={{backgroundColor:'#e3f2fd'}}>受入販売数(28日)</TableCell>
                  <TableCell align="right" style={{backgroundColor:'#e3f2fd'}}>受入元在庫数</TableCell>
                  <TableCell align="right" style={{backgroundColor:'#e3f2fd'}}>受入移管後在庫</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {globalPlan.map((p,i)=>{
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
                    <TableRow key={i}>
                      <TableCell align="right">{i + 1}</TableCell>
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
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* 詳細モーダル */}
        <Dialog open={!!detail} onClose={closeDetail} fullWidth maxWidth="lg">
          <DialogTitle sx={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center', py:2}}>
            <Box>
              <div style={{fontSize:'1.1em', fontWeight:600}}>移管計画詳細</div>
              <div style={{fontSize:'0.85em', opacity:0.9, marginTop:4}}>{detail?.sku} | {detail?.name}</div>
            </Box>
            <Button onClick={closeDetail} sx={{color:'#fff', minWidth:'auto', p:1}} size="small">×</Button>
          </DialogTitle>
          <DialogContent dividers sx={{p:3, backgroundColor:'#fafafa'}}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>店舗</TableCell>
                  <TableCell align="right">現在庫</TableCell>
                  <TableCell align="right">直近28日販売</TableCell>
                  <TableCell align="right">回転日数</TableCell>
                  <TableCell align="right">理想</TableCell>
                  <TableCell align="right">乖離</TableCell>
                  <TableCell>移管先</TableCell>
                  <TableCell align="right">移管数</TableCell>
                  <TableCell align="right">ToBe</TableCell>
                  <TableCell align="right">ToBe回転</TableCell>
                  <TableCell align="right">残差</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detail?.perStore?.map(s=>{
                  const calcToBeInv = (perStore, transfers)=>{
                    const tobe = {};
                    perStore.forEach(st=> tobe[st.id] = st.inv);
                    transfers.forEach(t=>{
                      tobe[t.fromId] = (tobe[t.fromId]||0) - t.qty;
                      tobe[t.toId] = (tobe[t.toId]||0) + t.qty;
                    });
                    return tobe;
                  };
                  
                  const tobeInv = calcToBeInv(detail.perStore, detail.transfers||[]);
                  const tobe = tobeInv[s.id]||s.inv;
                  const remaining = tobe - s.ideal;
                  const dailySales = (s.sales||0) / 28;
                  const turnoverDays = dailySales > 0 ? (s.inv / dailySales) : (s.inv > 0 ? 999 : 0);
                  const tobeTurnoverDays = dailySales > 0 ? (tobe / dailySales) : (tobe > 0 ? 999 : 0);
                  
                  return (
                    <TableRow 
                      key={s.id} 
                      style={{
                        backgroundColor: s.diff>0 ? '#fff3e0' : s.diff<0 ? '#e3f2fd' : 'transparent'
                      }}
                    >
                      <TableCell style={{fontWeight:600}}>{s.name}</TableCell>
                      <TableCell align="right">{s.inv.toLocaleString()}</TableCell>
                      <TableCell align="right">{(s.sales||0).toLocaleString()}</TableCell>
                      <TableCell align="right" style={{fontSize:'0.85em'}}>
                        {turnoverDays >= 999 ? '—' : turnoverDays.toFixed(1)}日
                      </TableCell>
                      <TableCell align="right">{s.ideal.toLocaleString()}</TableCell>
                      <TableCell 
                        align="right" 
                        style={{
                          fontWeight:700, 
                          color: s.diff>0?'#e65100':s.diff<0?'#0277bd':'#666'
                        }}
                      >
                        {s.diff>0?'+':''}{s.diff.toLocaleString()}
                      </TableCell>
                      <TableCell style={{width:140}}>
                        {s.diff > 0 ? (
                          s.transfers && s.transfers.length > 1 ? (
                            <div style={{fontSize:'0.8em'}}>
                              {s.transfers.map((t, idx) => (
                                <div key={idx} style={{marginBottom:'2px'}}>
                                  {t.toName} ({t.qty})
                                </div>
                              ))}
                            </div>
                          ) : (
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
                          )
                        ) : <span style={{color:'#999', fontSize:'0.85em'}}>—</span>}
                      </TableCell>
                      <TableCell align="right" style={{width:80}}>
                        {s.diff > 0 ? (
                          s.transfers && s.transfers.length > 1 ? (
                            <div style={{fontSize:'0.8em', textAlign:'right'}}>
                              {s.transfers.reduce((sum, t) => sum + t.qty, 0).toLocaleString()}
                            </div>
                          ) : (
                            <TextField
                              size="small"
                              type="number"
                              value={s.transferQty||0}
                              onChange={(e)=>updateStoreTransfer(s.id, 'transferQty', Number(e.target.value)||0)}
                              inputProps={{min:0, max:s.inv, step:1}}
                              fullWidth
                              sx={{input:{textAlign:'right', fontSize:'0.85em'}}}
                            />
                          )
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
                        {s.diff > 0 && ((s.transfers && s.transfers.length > 0) || (s.transferTo && s.transferQty > 0)) ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={()=>{
                              // 移管申請処理（複数店舗対応）
                              if(s.transfers && s.transfers.length > 0){
                                s.transfers.forEach(t => {
                                  console.log(`移管申請: ${s.name} → ${t.toName} (${t.qty}個)`);
                                });
                              } else {
                                console.log(`移管申請: ${s.name} → ${detail?.perStore?.find(t=>String(t.id)===String(s.transferTo))?.name} (${s.transferQty}個)`);
                              }
                            }}
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
          </DialogContent>
          <DialogActions sx={{p:2, backgroundColor:'#f5f5f5', gap:1}}>
            <Button onClick={closeDetail} variant="outlined" color="inherit">閉じる</Button>
            <Box sx={{flex:1}} />
            <Button variant="outlined" color="primary" onClick={()=>{
              // 自動プラン生成（複数店舗対応）
              const donors = detail?.perStore?.filter(s=> s.diff > 0) || [];
              const takers = detail?.perStore?.filter(s=> s.diff < 0) || [];
              
              const updatedPerStore = detail?.perStore?.map(s=> ({...s, transferQty:0, transferTo:'', transfers: []})) || [];
              const transfers = [];
              
              donors.forEach(d=>{
                let remain = d.diff;
                const takersCopy = takers.map(t=> ({...t, remaining: Math.abs(t.diff)}));
                
                for(const t of takersCopy){
                  if(remain<=0) break;
                  if(t.remaining<=0) continue;
                  
                  const qty = Math.min(remain, t.remaining);
                  if(qty>=1){
                    transfers.push({
                      fromId: d.id,
                      toId: t.id,
                      qty: qty
                    });
                    remain -= qty;
                    t.remaining -= qty;
                  }
                }
              });
              
              // 移管情報を店舗データに反映
              transfers.forEach(transfer => {
                const fromStore = updatedPerStore.find(p=> String(p.id)===String(transfer.fromId));
                if(fromStore){
                  if(!fromStore.transfers) fromStore.transfers = [];
                  fromStore.transfers.push({
                    toId: transfer.toId,
                    qty: transfer.qty,
                    toName: updatedPerStore.find(p=> String(p.id)===String(transfer.toId))?.name
                  });
                  // 最初の移管先を表示用に設定
                  if(!fromStore.transferTo){
                    fromStore.transferTo = transfer.toId;
                    fromStore.transferQty = transfer.qty;
                  }
                }
              });
              
              setDetail(prev=> ({...prev, perStore: updatedPerStore, transfers}));
            }}>自動プラン生成</Button>
            <Button variant="contained" color="success" onClick={closeDetail} sx={{fontWeight:600}}>
              保存して申請
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

    if(isModal){
      return (
        <Dialog open={true} onClose={onClose} maxWidth="xl" fullWidth>
          <DialogTitle style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{modalTitle || '移管計画'}</span>
            <Button onClick={onClose} style={{minWidth:'auto',padding:'4px'}}>×</Button>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{mb:1}}>
              <Grid item xs={12} md={4}>
                <TextField label="対象店舗（名前でフィルタ）" value={storeNameFilter} fullWidth size="small" disabled />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="対象期間開始" value={windowStart} fullWidth size="small" disabled />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="対象期間終了" value={windowEnd} fullWidth size="small" disabled />
              </Grid>
            </Grid>
            {content}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>閉じる</Button>
          </DialogActions>
        </Dialog>
      );
    }

    return content;
  };

  window.TransferPlannerModal = function TransferPlannerModal(props){
    return <window.TransferPlanner {...props} isModal={true} />;
  };
})();