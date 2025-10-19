// app/components/Filter.js
const { Paper, Box, Typography, Button, Grid, TextField, MenuItem } = MaterialUI;

function Filter({ onApply }){
  const years = (() => { const y=new Date().getFullYear(); return [y-2,y-1,y,y+1,y+2]; })();
  const months = ['選択しない','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const weeks  = ['選択しない', ...Array.from({ length: 52 }).map((_, i) => `${i + 1}`)];
  const locationOptions = React.useMemo(()=> ['全社', ...window.MASTERS.STORES.map(s=>s.name)], []);
  const departmentOptions = React.useMemo(()=> ['全部門', ...Array.from(new Set(window.FIXTURES.PRODUCTS.map(p => p.dept)))], []);

  const [year, setYear] = React.useState(new Date().getFullYear());
  const [month, setMonth] = React.useState('選択しない');
  const [weekNumber, setWeekNumber] = React.useState('選択しない');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [location, setLocation] = React.useState('全社');
  const [department, setDepartment] = React.useState('全部門');

  const { ymd, startOfMonth, endOfMonth } = window.Utils;

  const getMonthRange = (y, m) => ({ startDate: new Date(y, m - 1, 1), endDate: new Date(y, m, 0) });
  const getJST = (date) => ymd(date);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value; setMonth(newMonth); setWeekNumber('選択しない');
    if (newMonth !== '選択しない') {
      const { startDate: s, endDate: e2 } = getMonthRange(year, parseInt(newMonth.replace('月', ''), 10));
      setStartDate(getJST(s)); setEndDate(getJST(e2));
    }
  };

  React.useEffect(()=>{
    const t=new Date(); const s=startOfMonth(t); const e=endOfMonth(t);
    setYear(t.getFullYear()); setMonth(`${t.getMonth()+1}月`); setWeekNumber('選択しない');
    setStartDate(getJST(s)); setEndDate(getJST(e)); setLocation('全社'); setDepartment('全部門');
  },[]);

  return (
    <Paper elevation={3} sx={{ p: 2, borderTop: theme => `4px solid ${theme.palette.primary.main}` }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle1" sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <span className="material-icons">filter_alt</span> 条件
        </Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<span className="material-icons">refresh</span>} size="small"
            onClick={() => {
              const t=new Date(); const s=window.Utils.startOfMonth(t); const e=window.Utils.endOfMonth(t);
              setYear(t.getFullYear()); setMonth(`${t.getMonth()+1}月`); setWeekNumber('選択しない');
              setStartDate(getJST(s)); setEndDate(getJST(e)); setLocation('全社'); setDepartment('全部門');
            }}>リセット</Button>
          <Button variant="contained" startIcon={<span className="material-icons">search</span>} size="small"
            onClick={() => onApply?.({ start:startDate, end:endDate, year, month, weekNumber, location, department })}>検索</Button>
        </Box>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={4} sm={4} md={2}>
          <TextField select label="年度" value={year} onChange={(e)=>setYear(e.target.value)} size="small" fullWidth>
            {years.map(y=><MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={4} sm={4} md={1}>
          <TextField select label="月度" value={month} onChange={handleMonthChange} size="small" fullWidth>
            {months.map(m=><MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={4} sm={4} md={1}>
          <TextField select label="週" value={weekNumber} onChange={(e)=>setWeekNumber(e.target.value)} size="small" fullWidth>
            {weeks.map(w=><MenuItem key={w} value={w}>{w}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField label="開始日" type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} InputLabelProps={{shrink:true}} size="small" fullWidth/>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField label="終了日" type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} InputLabelProps={{shrink:true}} size="small" fullWidth/>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField select label="拠点/部署" value={location} onChange={(e)=>setLocation(e.target.value)} size="small" fullWidth>
            {locationOptions.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField select label="部門" value={department} onChange={(e)=>setDepartment(e.target.value)} size="small" fullWidth>
            {departmentOptions.map(dep => <MenuItem key={dep} value={dep}>{dep}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
}
