// app/components/AxisSelector.js
const { Stack, Chip, Grid, TextField, MenuItem } = MaterialUI;

function AxisSelector({prodAxis,setProdAxis,storeAxis,setStoreAxis,storeGroup,setStoreGroup}){
  const prodItems=['全部門','部門','コーナー','ライン','カテゴリ','アイテム','SKU'];
  const storeItems=['全店舗','事業','ブロック','店舗'];
  const STORES = window.MASTERS.STORES;
  const STORE_BLOCK = window.MASTERS.STORE_BLOCK;

  const storeOptions = React.useMemo(()=>{
    if(storeAxis==='全店舗') return ['全店舗'];
    if(storeAxis==='事業') return Array.from(new Set(STORES.map(s=>s.channel)));
    if(storeAxis==='ブロック') return Array.from(new Set(STORES.map(s=>STORE_BLOCK[s.id])));
    if(storeAxis==='店舗') return STORES.map(s=>s.name);
    return [];
  },[storeAxis]);

  React.useEffect(()=>{ setStoreGroup(storeOptions[0]||'全店舗'); },[storeAxis]);

  return (
    <Stack spacing={2}>
      <div className="mini" style={{fontWeight:700}}>商品分類軸</div>
      <div className="chipRow">
        {prodItems.map(k=>(
          <Chip key={k} label={k}
            color={prodAxis===k?'primary':'default'}
            variant={prodAxis===k?'filled':'outlined'}
            onClick={()=>setProdAxis(k)}
          />
        ))}
      </div>
      <div className="mini" style={{fontWeight:700, marginTop:8}}>拠点分類軸</div>
      <div className="chipRow" style={{marginBottom:4}}>
        {storeItems.map(k=>(
          <Chip key={k} label={k}
            color={storeAxis===k?'primary':'default'}
            variant={storeAxis===k?'filled':'outlined'}
            onClick={()=>setStoreAxis(k)}
          />
        ))}
      </div>
      {storeAxis!=='全店舗' && (
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField select size="small" label="対象" value={storeGroup||''} onChange={e=>setStoreGroup(e.target.value)} fullWidth>
              {storeOptions.map(v=> <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs="auto"><span className="mini softNote">上位階層を選択してください</span></Grid>
        </Grid>
      )}
    </Stack>
  );
}
