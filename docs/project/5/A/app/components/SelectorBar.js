// app/components/SelectorBar.js
const { Stack, Chip, Grid, TextField } = MaterialUI;

function SelectorBar({granularity,setGranularity,custom,setCustom}){
  const gItems = [
    {key:'year', label:'年'}, {key:'half', label:'半期'}, {key:'quarter', label:'四半期'},
    {key:'month', label:'月'}, {key:'week', label:'週'}, {key:'day', label:'日'}, {key:'custom', label:'カスタム'}
  ];
  return (
    <Stack spacing={1}>
      <div className="mini" style={{fontWeight:700}}>集計単位</div>
      <div className="chipRow">
        {gItems.map(it=>(
          <Chip key={it.key} label={it.label}
            color={granularity===it.key?'primary':'default'}
            variant={granularity===it.key?'filled':'outlined'}
            onClick={()=>setGranularity(it.key)}
          />
        ))}
      </div>
      {granularity==='custom' && (
        <Grid container spacing={1} alignItems="center" sx={{mt:0.5}}>
          <Grid item xs={6} md={2}>
            <TextField size="small" type="number" label="間隔（日）" value={custom.intervalDays}
              onChange={e=>setCustom({...custom, intervalDays: Math.max(1, Number(e.target.value)||1)})} fullWidth/>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField size="small" type="number" label="列数" value={custom.columns}
              onChange={e=>setCustom({...custom, columns: Math.max(1, Number(e.target.value)||1)})} fullWidth/>
          </Grid>
          <Grid item xs={12} md="auto"><span className="mini softNote">終了日から遡って作成（最大24列）</span></Grid>
        </Grid>
      )}
    </Stack>
  );
}
