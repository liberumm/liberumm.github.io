(function(){
  const { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, TextField, Button, ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Typography, IconButton, Grid, Card, CardContent } = MaterialUI;

  window.OrderModal = function OrderModal(props){
    const { batchRows, actionForm, setActionForm, checkedRows, setCheckedRows, onOpenTransfer, onSubmitBatch, stores, targetStoreIds, onClose, isModal=false, modalTitle='', row } = props;
    const [orientation, setOrientation] = React.useState('byItem'); // 'byItem' | 'byStore'
    const [storeFilter, setStoreFilter] = React.useState('');
    const [codeFilter, setCodeFilter] = React.useState('');
    const [nameFilter, setNameFilter] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    const visibleStores = (stores || []).filter(s=> targetStoreIds ? targetStoreIds.has(s.id) : true);
    
    const searchProducts = ()=>{
      const products = window.FIXTURES.PRODUCTS || [];
      const inventory = window.FIXTURES.INVENTORY || [];
      let results = products.filter(p=>{
        const codeMatch = !codeFilter || (p.sku||'').toLowerCase().includes(codeFilter.toLowerCase()) || (p.itemCode||'').toLowerCase().includes(codeFilter.toLowerCase());
        const nameMatch = !nameFilter || (p.name||'').toLowerCase().includes(nameFilter.toLowerCase()) || (p.itemName||'').toLowerCase().includes(nameFilter.toLowerCase());
        return codeMatch && nameMatch;
      });
      
      if(storeFilter){
        const storeIds = stores.filter(s=> s.name.toLowerCase().includes(storeFilter.toLowerCase())).map(s=>s.id);
        results = results.filter(p=> inventory.some(i=> i.productId===p.id && storeIds.includes(i.storeId) && i.qty>0));
      }
      
      setSearchResults(results.slice(0,50).map(p=>{
        const invQty = inventory.filter(i=> i.productId===p.id && targetStoreIds.has(i.storeId)).reduce((a,c)=>a+c.qty,0);
        return { sku: p.sku, name: p.name||p.itemName||'', itemCode: p.itemCode||(p.sku||'').slice(0,9), invQty, productId: p.id };
      }));
    };
    
    const addToAction = (product)=>{
      setActionForm(prev=>({ ...prev, rows: {...prev.rows, [product.sku]: {...prev.rows?.[product.sku], desiredQty:'', desiredDate:'', plannedQty:'', plannedDate:'', confirmer:'', toStore:''}} }));
      setCheckedRows(prev=> new Set([...prev, product.sku]));
    };
    
    const displayRows = searchResults.length > 0 ? searchResults : batchRows;

    const toggleOrientation = (ev, val)=>{ if(val) setOrientation(val); };

    const content = (
      <div>
        <Paper variant="outlined" sx={{p:2,mb:2}}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField label="店舗名" size="small" value={storeFilter} onChange={(e)=>setStoreFilter(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="商品コード/SKU" size="small" value={codeFilter} onChange={(e)=>setCodeFilter(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="商品名" size="small" value={nameFilter} onChange={(e)=>setNameFilter(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" onClick={searchProducts} fullWidth>検索</Button>
            </Grid>
          </Grid>
        </Paper>
        
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
          <ToggleButtonGroup value={orientation} exclusive onChange={toggleOrientation} size="small">
            <ToggleButton value="byItem">アイテム行方向（店舗列あり）</ToggleButton>
            <ToggleButton value="byStore">店舗行方向（アイテム列あり）</ToggleButton>
          </ToggleButtonGroup>
          {searchResults.length > 0 && <span className="mini">検索結果: {searchResults.length}件</span>}
        </div>

        {orientation === 'byItem' ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>選択</TableCell>
                <TableCell>アイテムコード</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>商品名</TableCell>
                <TableCell align="right">在庫合計</TableCell>
                {visibleStores.map(s=> (<TableCell key={s.id} align="right">{s.name}</TableCell>))}
                <TableCell>納品店舗</TableCell>
                <TableCell>希望数量</TableCell>
                <TableCell>希望納品日</TableCell>
                <TableCell>予定数量</TableCell>
                <TableCell>確認者</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayRows.map(row => (
                <TableRow key={row.sku}>
                  <TableCell>
                    <Checkbox size="small" checked={(checkedRows||new Set()).has(row.sku)} onChange={()=>{
                      setCheckedRows(prev=>{ const s=new Set(prev||new Set()); if(s.has(row.sku)) s.delete(row.sku); else s.add(row.sku); return s; });
                    }}/>
                  </TableCell>
                  <TableCell>{row.itemCode}</TableCell>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.invQty?.toLocaleString?.()||row.invQty}</TableCell>
                  {visibleStores.map(s=>{
                    const inv = (window.FIXTURES.INVENTORY||[]).filter(i=> i.productId===row.productId && i.storeId===s.id).reduce((a,c)=>a+c.qty,0);
                    return (<TableCell key={s.id} align="right">{inv?.toLocaleString?.()||inv}</TableCell>);
                  })}
                  <TableCell>
                    <TextField size="small" value={actionForm.rows?.[row.sku]?.toStore||''} placeholder="納品店舗" onChange={(e)=> setActionForm(prev=>({ ...prev, rows: {...prev.rows, [row.sku]: {...prev.rows?.[row.sku], toStore: e.target.value}} }))} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={actionForm.rows?.[row.sku]?.desiredQty||''} onChange={(e)=> setActionForm(prev=>({ ...prev, rows: {...prev.rows, [row.sku]: {...prev.rows?.[row.sku], desiredQty: e.target.value}} }))} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" type="date" InputLabelProps={{shrink:true}} value={actionForm.rows?.[row.sku]?.desiredDate||''} onChange={(e)=> setActionForm(prev=>({ ...prev, rows: {...prev.rows, [row.sku]: {...prev.rows?.[row.sku], desiredDate: e.target.value}} }))} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={actionForm.rows?.[row.sku]?.plannedQty||''} onChange={(e)=> setActionForm(prev=>({ ...prev, rows: {...prev.rows, [row.sku]: {...prev.rows?.[row.sku], plannedQty: e.target.value}} }))} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={actionForm.rows?.[row.sku]?.confirmer||''} onChange={(e)=> setActionForm(prev=>({ ...prev, rows: {...prev.rows, [row.sku]: {...prev.rows?.[row.sku], confirmer: e.target.value}} }))} />
                  </TableCell>
                  <TableCell>
                    {searchResults.length > 0 ? (
                      <Button size="small" onClick={()=> addToAction(row)}>追加</Button>
                    ) : (
                      <Button size="small" onClick={()=> onOpenTransfer(row)}>移管を検討</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // byStore: rows = 店舗, columns = アイテム
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>店舗</TableCell>
                {displayRows.map(r=> (
                  <TableCell key={r.sku} style={{minWidth:120}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <Checkbox size="small" checked={(checkedRows||new Set()).has(r.sku)} onChange={()=>{ setCheckedRows(prev=>{ const s=new Set(prev||new Set()); if(s.has(r.sku)) s.delete(r.sku); else s.add(r.sku); return s; }); }} />
                      <div style={{fontWeight:700}}>{r.sku}</div>
                      <div className="mini">{r.name}</div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleStores.map(st=> (
                <TableRow key={st.id}>
                  <TableCell>{st.name}</TableCell>
                  {displayRows.map(r=>{
                    const inv = (window.FIXTURES.INVENTORY||[]).filter(i=> i.productId===r.productId && i.storeId===st.id).reduce((a,c)=>a+c.qty,0);
                    const val = actionForm.rows?.[r.sku]?.byStore?.[st.id] || '';
                    return (
                      <TableCell key={r.sku}>
                        <div className="mini">在庫: {inv?.toLocaleString?.()||inv}</div>
                        <TextField size="small" value={val} onChange={(e)=> setActionForm(prev=>{
                          const prevRow = prev.rows?.[r.sku] || {};
                          const by = Object.assign({}, prevRow.byStore || {}, { [st.id]: e.target.value });
                          return { ...prev, rows: { ...prev.rows, [r.sku]: { ...prevRow, byStore: by } } };
                        })} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div style={{marginTop:8}}>
          <Button variant="outlined" onClick={()=> onSubmitBatch('申請')}>一括登録（申請）</Button>
          <Button variant="text" style={{marginLeft:8}} onClick={()=> onSubmitBatch('承認')}>一括承認（本部）</Button>
        </div>
      </div>
    );

    if(isModal){
      return (
        <Dialog open={true} onClose={onClose} maxWidth="xl" fullWidth>
          <DialogTitle style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{modalTitle || '発注一括処理'}</span>
            <IconButton onClick={onClose} size="small"><span style={{fontSize:'20px'}}>×</span></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={1} sx={{mb:1}}>
              <Grid item xs={12} md={3}>
                <Card variant="outlined"><CardContent>
                  <div className="mini">直近売上（直近28日）</div>
                  <div style={{fontWeight:700}}>{(row?.totalSales||0).toLocaleString()}</div>
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card variant="outlined"><CardContent>
                  <div className="mini">今後予測売上（28日先）</div>
                  <div style={{fontWeight:700}}>{(row?.forecastSales||'—')}</div>
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card variant="outlined"><CardContent>
                  <div className="mini">理想売上（配分ベース）</div>
                  <div style={{fontWeight:700}}>{(row?.idealSales||'—')}</div>
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card variant="outlined"><CardContent>
                  <div className="mini">理想販売終了日 / 実販売終了日</div>
                  <div style={{fontWeight:700}}>{(row?.idealEnd||'—')} / {(row?.forecastEnd||'—')}</div>
                </CardContent></Card>
              </Grid>
            </Grid>
            {content}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>キャンセル</Button>
            <Button variant="outlined" onClick={()=> onSubmitBatch('申請')}>登録（申請）</Button>
            <Button variant="contained" color="success" onClick={()=> onSubmitBatch('承認')}>承認（本部）</Button>
          </DialogActions>
        </Dialog>
      );
    }

    return content;
  };

  window.OrderModalDialog = function OrderModalDialog(props){
    return <window.OrderModal {...props} isModal={true} />;
  };
})();
