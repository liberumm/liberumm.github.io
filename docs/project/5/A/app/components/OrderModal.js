(function(){
  const { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, TextField, Button, ToggleButton, ToggleButtonGroup } = MaterialUI;

  window.OrderModal = function OrderModal(props){
    const { batchRows, actionForm, setActionForm, checkedRows, setCheckedRows, onOpenTransfer, onSubmitBatch, stores, targetStoreIds } = props;
    const [orientation, setOrientation] = React.useState('byItem'); // 'byItem' | 'byStore'

    const visibleStores = (stores || []).filter(s=> targetStoreIds ? targetStoreIds.has(s.id) : true);

    const toggleOrientation = (ev, val)=>{ if(val) setOrientation(val); };

    return (
      <div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
          <ToggleButtonGroup value={orientation} exclusive onChange={toggleOrientation} size="small">
            <ToggleButton value="byItem">アイテム行方向（店舗列あり）</ToggleButton>
            <ToggleButton value="byStore">店舗行方向（アイテム列あり）</ToggleButton>
          </ToggleButtonGroup>
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
              {batchRows.map(row => (
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
                    <Button size="small" onClick={()=> onOpenTransfer(row)}>移管を検討</Button>
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
                {batchRows.map(r=> (
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
                  {batchRows.map(r=>{
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
  };
})();
