// app/App.js
const {
  AppBar, Toolbar, Typography, Paper, Box, Stack, Button,
  Card, CardContent, Grid, TextField, Chip, Switch, FormControlLabel, Tooltip, Avatar, List, ListItem, ListItemAvatar, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody, Checkbox
} = MaterialUI;

function App(){
  // 期間・基本フィルタ
  const [range,setRange]=React.useState(()=>{
    const t=new Date();
    return {start: window.Utils.ymd(window.Utils.startOfMonth(t)), end: window.Utils.ymd(window.Utils.endOfMonth(t))};
  });
  const [locFilter,  setLocFilter]  = React.useState('全社');
  const [deptFilter, setDeptFilter] = React.useState('全部門');
  const applyFilter = ({start,end,location,department})=>{
    setRange({start,end});
    if(location) setLocFilter(location);
    if(department) setDeptFilter(department);
  };

  // 集計粒度・指標
  const [granularity,setGranularity]=React.useState('week');
  const [metric,setMetric]=React.useState('units');
  const [custom,setCustom]=React.useState({intervalDays:7, columns:8});
  const [viewMode,setViewMode]=React.useState('detail');
  const {buckets}=React.useMemo(()=> window.Utils.buildBuckets(range, granularity, custom), [range,granularity,custom]);

  // 行選択・モーダル
  const [selectedRow,setSelectedRow]=React.useState(null);
  const [actionModal,setActionModal]=React.useState({open:false,type:null,row:null});
  const openActionModal=(type,row)=> {
    // 移管の場合、TransferPlannerを表示
    if(type === '移管' && row?.action?.detail?.transfers) {
      setActionModal({
        open: true,
        type: '移管',
        row: row,
        transfers: row.action.detail.transfers
      });
      return;
    }
    setActionModal({open:true,type,row});
  };
  const closeActionModal=()=> setActionModal({open:false,type:null,row:null});

  // 分類軸・店舗軸
  const [prodAxis,setProdAxis]=React.useState('SKU');
  const [storeAxis,setStoreAxis]=React.useState('全店舗');
  const [storeGroup,setStoreGroup]=React.useState('全店舗');

  // 店舗間比較
  const [compareMode, setCompareMode] = React.useState(true);

  // 年次系トグル（初期OFF）
  const [yoyShow, setYoyShow] = React.useState(false);         // 前年値
  const [yoyRateShow, setYoyRateShow] = React.useState(false); // 前年比(%)
  const [yoyDiffShow, setYoyDiffShow] = React.useState(false); // 差分（今年-前年）

 
  // ROI系列の一括表示
  const [roiVisible, setRoiVisible] = React.useState(false); // 切替トグル（表上部）
 
  // アクションパネル用 state（App側で一元管理）
  const [filterAction, setFilterAction] = React.useState('all');  // 'all'|'発注'|'移管'|'値下'
  const [searchTerm, setSearchTerm] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState({});
  const [checkedRows, setCheckedRows] = React.useState(new Set());
  // やることリスト（タスク）
  const [tasks, setTasks] = React.useState(()=> window.INIT_TASKS ? window.INIT_TASKS.slice() : []); // {id, type, rowLabel, detail, status: 'open'|'hq_pending'|'approved'|'skipped'}

  // addTask: allow optional initial status override
  const addTask = (task, initialStatus) => {
    const id = `T${String(Date.now()).slice(-6)}`;
    const defaultStatus = task.type==='発注' ? 'hq_pending' : (task.type==='値下' ? 'hq_pending' : 'open');
    const status = initialStatus || defaultStatus;
    setTasks(prev => [{...task, id, status}, ...prev]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id===id ? {...t, status} : t));
  };
  // タスク詳細を見やすく要約して返す
  const renderTaskDetail = (t) => {
    const d = t.detail || {};
    if(typeof d === 'string') return d;
    if(d.comment) return d.comment;
    // rows があれば件数と先頭のSKU/名前を表示
    if(Array.isArray(d.rows)){
      const items = d.rows.map(r => r.sku || r.name || (r.productId?`#${r.productId}`:'')).filter(Boolean);
      const sample = items.slice(0,3).join(', ');
      return `${d.rows.length}件${sample? '：' + sample : ''}`;
    }
    // transfers (移管プラン) の簡易表示
    if(d.transfers && Array.isArray(d.transfers)){
      return `移管 ${d.transfers.length}件`;
    }
    // fallback: keys を短く表示
    const keys = Object.keys(d).filter(k=> k!=='rows' && k!=='transfers');
    if(keys.length) return keys.map(k=> `${k}: ${typeof d[k] === 'object' ? '[...]' : String(d[k])}`).join(' / ');
    return '';
  };
  const handleClearActions = ()=>{
    setFilterAction('all');
    setSearchTerm('');
    setColumnFilters({});
    setCheckedRows(new Set());
  };

  // モーダル用フォーム（発注/値下/移管 の入力を保持）
  const [actionForm, setActionForm] = React.useState({});
  // 移管用フィルタ
  const [transferFilterStore, setTransferFilterStore] = React.useState('');
  const [transferFilterStart, setTransferFilterStart] = React.useState('');
  const [transferFilterEnd, setTransferFilterEnd] = React.useState('');
  // バッチ対象行（チェックされた行、または現在のモーダル行）
  const batchRows = React.useMemo(()=>{
    const products = window.FIXTURES.PRODUCTS || [];
    const INVENTORY = window.FIXTURES.INVENTORY || [];
    const picks = Array.from(checkedRows || []);
    const list = [];
    if(picks.length === 0){
      if(actionModal.row){
        const r = actionModal.row;
        list.push({ sku: r.sku||'', name: r.label||r.name||'', itemCode: r.itemCode || (r.sku||'').slice(0,9), invQty: r.inv || r.totalInv || 0, productId: r.productId || null });
      }
    } else {
      picks.forEach(lbl=>{
        const p = products.find(pp=> pp.sku===lbl || pp.name===lbl || pp.itemName===lbl || pp.itemCode===lbl);
        const productId = p ? p.id : null;
        const invQty = productId ? INVENTORY.filter(i=> i.productId===productId && targetStoreIds.has(i.storeId)).reduce((a,c)=>a+c.qty,0) : 0;
        list.push({ sku: p? p.sku : lbl, name: p? p.name || p.itemName || '' : lbl, itemCode: p? (p.itemCode || (p.sku||'').slice(0,9)) : '', invQty, productId });
      });
    }
    return list;
  }, [checkedRows, actionModal.row, targetStoreIds]);

  React.useEffect(()=>{
    if(actionModal.open){
      const r = actionModal.row || {};
      const rowsMap = {};
      batchRows.forEach(b=>{
        rowsMap[b.sku] = { desiredQty:'', desiredDate:'', plannedQty:'', plannedDate:'', qty:0, discountAmount:'', newPrice:'', toStore:'', confirmer:'', confirmDate:'' };
      });
      setActionForm({
        itemCode: r.itemCode || (r.sku || '').slice(0,9),
        sku: r.sku || '',
        name: r.label || r.name || '',
        invQty: r.inv || r.totalInv || 0,
        rows: rowsMap,
        transfers: actionModal.transfers || []
      });
    } else {
      setActionForm({});
    }
  }, [actionModal.open, actionModal.row, batchRows, actionModal.transfers]);

  // 店舗スコープ
  const STORES = window.MASTERS.STORES;
  const STORE_BLOCK = window.MASTERS.STORE_BLOCK;
  const targetStoreIds = React.useMemo(()=>{
    let base;
    if(storeAxis==='全店舗') base = new Set(STORES.map(s=>s.id));
    else if(storeAxis==='事業')   base = new Set(STORES.filter(s=>s.channel===storeGroup).map(s=>s.id));
    else if(storeAxis==='ブロック')base = new Set(STORES.filter(s=>STORE_BLOCK[s.id]===storeGroup).map(s=>s.id));
    else if(storeAxis==='店舗')   base = new Set(STORES.filter(s=>s.name===storeGroup).map(s=>s.id));
    else                          base = new Set(STORES.map(s=>s.id));
    if(locFilter && locFilter!=='全社'){
      const ids = STORES.filter(s=>s.name===locFilter).map(s=>s.id);
      base = new Set(ids);
    }
    return base;
  },[storeAxis,storeGroup,locFilter]);

  // トレンド（売上推移チャート）
  const PRODUCTS  = window.FIXTURES.PRODUCTS;
  const INVENTORY = window.FIXTURES.INVENTORY;
  const SALES     = window.FIXTURES.SALES;

  const { buildIndexes, sumUnits, sumUnitsByStore, sumRevenue } = window.Sales;
  const idx = React.useMemo(()=> buildIndexes(SALES, PRODUCTS), [SALES, PRODUCTS]);

  const trend = React.useMemo(()=>{
    const scopeItems = PRODUCTS.slice(0, 150);
    const scopedStoreIds = new Set(targetStoreIds);
    scopedStoreIds._all = (scopedStoreIds.size===STORES.length);

    const useBuckets = (viewMode==='detail') ? buckets : buckets.slice(-2);

    // inventory-aware series: simulate per-product inventory consumption across buckets
    const series = useBuckets.map(_=>0);
    // prepare remaining inventory per product (across target stores)
    const remainingByProd = {};
    scopeItems.forEach(p=>{
      remainingByProd[p.id] = (INVENTORY || []).filter(i=> i.productId===p.id && targetStoreIds.has(i.storeId)).reduce((a,c)=>a+c.qty,0);
    });

    // for each bucket in time order, compute expected sales based on past units,
    // but cap by remaining inventory (so sales stop when inventory exhausted)
    for(let bi=0; bi<useBuckets.length; bi++){
      const b = useBuckets[bi];
      let bucketTotal = 0;
      scopeItems.forEach(p=>{
        let expected = 0;
        if(scopedStoreIds._all){
          expected = sumUnits(idx.idxByProductDate, p.id, b.start, b.end);
        } else {
          Array.from(scopedStoreIds).forEach(sid=> expected += sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, b.start, b.end));
        }

        const avail = Math.max(0, remainingByProd[p.id] || 0);
        const sold = Math.min(avail, expected);
        // decrement remaining inventory
        remainingByProd[p.id] = Math.max(0, avail - sold);

        if(metric==='units') bucketTotal += sold;
        else if(metric==='revenue') bucketTotal += sold * p.price;
        else bucketTotal += sold * (p.price - Math.round(p.price*0.6));
      });
      series[bi] = bucketTotal;
    }

    const itemSet = new Set(scopeItems.map(p=>p.id));
    const initialInvTotal = INVENTORY
      .filter(i=> itemSet.has(i.productId) && targetStoreIds.has(i.storeId))
      .reduce((a,c)=>a+c.qty,0);

    const invByBucketEnd = useBuckets.map(b=>{
      let sold=0;
      scopeItems.forEach(p=>{
        if(scopedStoreIds._all) sold += sumUnits(idx.idxByProductDate, p.id, range.start, b.end);
        else Array.from(scopedStoreIds).forEach(sid=> sold += sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, range.start, b.end));
      });
      return Math.max(0, initialInvTotal - sold);
    });

    return { labels: useBuckets.map(b=>b.label), series, inventorySeries: invByBucketEnd };
  },[buckets, viewMode, range, targetStoreIds, metric, PRODUCTS, INVENTORY, idx]);

  const [events, setEvents] = React.useState(()=> window.INIT_EVENTS ? window.INIT_EVENTS.slice() : []);

  const metricHeader = metric==='units'?'販売点数': metric==='revenue'?'売上高':'粗利高';

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar className="wrap">
          <span className="material-icons" style={{marginRight:8}}>insights</span>
          <Typography variant="h6" sx={{flexGrow:1}}>商品ダッシュボード</Typography>
          <span className="mini" style={{color:'#666'}}>期間: {range.start} 〜 {range.end}</span>
        </Toolbar>
      </AppBar>

      <div className="wrap">
        {/* フィルター */}
        <Section title="フィルター" icon="filter_alt">
          <Filter onApply={applyFilter}/>
        </Section>

        {/* 推移チャート */}
        <Section title="売上推移" icon="query_stats">
          <Paper variant="outlined" className="vh35" sx={{p:1.5}}>
            <RevenueChartDetailed
              labels={trend.labels}
              data={trend.series}
              inventory={trend.inventorySeries}
              selected={selectedRow}
              metric={metric}
              buckets={buckets}
            />
          </Paper>
        </Section>

        {/* 集計設定 */}
        <Section title="集計設定" icon="tune">
          <SelectorBar
            granularity={granularity} setGranularity={setGranularity}
            custom={custom} setCustom={setCustom}
          />
        </Section>

        {/* 分類軸 */}
        <Section title="分類軸" icon="category">
          <AxisSelector
            prodAxis={prodAxis} setProdAxis={setProdAxis}
            storeAxis={storeAxis} setStoreAxis={setStoreAxis}
            storeGroup={storeGroup} setStoreGroup={setStoreGroup}
          />
          <Box sx={{mt:1}}>
            <span className="pill">
              <span className="material-icons" style={{fontSize:16}}>info</span>
              商品コードの体系：<b>4桁＋4桁＋2桁</b>（4桁＝カテゴリ／8桁＝アイテム／10桁＝SKU）
              <span className="mini">※SKU＝サイズ×色の最小管理単位</span>
            </span>
          </Box>
        </Section>

        {/* アクション操作：検索/アクション絞り/列フィルタ */}
        <Section title="アクション操作" icon="bolt">
          <window.ActionPanel.Panel
            filterAction={filterAction}
            setFilterAction={setFilterAction}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            checkedRows={checkedRows}
            setCheckedRows={setCheckedRows}
            onClear={handleClearActions}
          />
        </Section>

        {/* 販売実績テーブル */}
        <Section
          title={`販売実績テーブル（${metricHeader}｜列＝期間${viewMode==='detail'?'（詳細）':'（簡潔）'}｜行＝${prodAxis}）`}
          icon="table_view"
          actions={
            <Stack direction="row" spacing={1} alignItems="center">
              {/* 簡潔/詳細 */}
              <Tooltip title="簡潔表示：期間列を直近2本に圧縮／詳細表示：全バケット">
                <FormControlLabel
                  control={<Switch checked={viewMode==='detail'} onChange={(e)=>setViewMode(e.target.checked ? 'detail':'simple')}/>}
                  label={viewMode==='detail' ? '詳細表示' : '簡潔表示'}
                />
              </Tooltip>

              {/* 指標切替 */}
              <div className="mini" style={{fontWeight:700}}>指標</div>
              {[{key:'units',label:'販売点数'},{key:'revenue',label:'売上高'},{key:'profit',label:'粗利高'}].map(it=>(
                <Chip key={it.key} label={it.label}
                  color={metric===it.key?'primary':'default'}
                  variant={metric===it.key?'filled':'outlined'}
                  onClick={()=>setMetric(it.key)} size="small"/>
              ))}

              {/* 店舗間比較 */}
              <FormControlLabel
                control={<Switch checked={compareMode} onChange={(e)=>setCompareMode(e.target.checked)} />}
                label="店舗間比較"
              />

              {/* ROI列 一括表示 */}
              <DividerDot />
              <Tooltip title="ROI関連の列（#Units30/ASP30/Profit30/ROI(30)/U-Turn30）の一括表示を切替">
                <FormControlLabel
                  control={<Switch checked={roiVisible} onChange={(e)=>setRoiVisible(e.target.checked)} />}
                  label="ROI列"
                />
              </Tooltip>

              {/* 年次系（初期OFF） */}
              <DividerDot />
              <FormControlLabel
                control={<Switch checked={yoyShow} onChange={(e)=>setYoyShow(e.target.checked)} />}
                label="前年値"
              />
              <FormControlLabel
                control={<Switch checked={yoyDiffShow} onChange={(e)=>setYoyDiffShow(e.target.checked)} />}
                label="前年差"
              />
              <FormControlLabel
                control={<Switch checked={yoyRateShow} onChange={(e)=>setYoyRateShow(e.target.checked)} />}
                label="前年比(%)"
              />
            </Stack>
          }
        >
          <div className="mini" style={{marginBottom:8}}>
            拠点スコープ：{storeAxis}{storeAxis!=='全店舗' ? `｜${storeGroup}` : ''} ／ 指標：{metricHeader} ／ 条件フィルタ：{locFilter}・{deptFilter}
          </div>

          <SalesTable
            range={range}
            deptFilter={deptFilter}
            prodAxis={prodAxis}
            buckets={buckets}
            metric={metric}
            viewMode={viewMode}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            targetStoreIds={targetStoreIds}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            openActionModal={(type,row)=> setActionModal({open:true,type,row})}

            // 年次系表示制御
            yoyShow={yoyShow}
            yoyRateShow={yoyRateShow}
            yoyDiffShow={yoyDiffShow}

            // ROI一括表示制御を渡す
            roiVisible={roiVisible}

            // アクションパネルからの条件（SalesTable側で利用）
            filterAction={filterAction}
            searchTerm={searchTerm}
            columnFilters={columnFilters}
            checkedRows={checkedRows}
            setCheckedRows={setCheckedRows}
          />
        </Section>

        {/* アクションモーダル */}
        {actionModal.type === '移管' ? (
          <Dialog open={actionModal.open} onClose={closeActionModal} maxWidth="xl" fullWidth>
            <DialogTitle>移管計画 - {actionModal.row?.label || actionModal.row?.itemName || ''}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{mb:1}}>
                <Grid item xs={12} md={4}>
                  <TextField label="対象店舗（名前でフィルタ）" value={transferFilterStore} onChange={(e)=>setTransferFilterStore(e.target.value)} fullWidth size="small" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="対象期間開始" type="date" InputLabelProps={{shrink:true}} value={transferFilterStart} onChange={(e)=>setTransferFilterStart(e.target.value)} fullWidth size="small" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="対象期間終了" type="date" InputLabelProps={{shrink:true}} value={transferFilterEnd} onChange={(e)=>setTransferFilterEnd(e.target.value)} fullWidth size="small" />
                </Grid>
              </Grid>
              <window.TransferPlanner 
                range={range} 
                targetStoreIds={targetStoreIds}
                gapThreshold={0.08}
                minMove={5}
                skuFilter={actionModal.row?.items?.[0]?.sku || ''}
                storeNameFilter={transferFilterStore}
                windowStart={transferFilterStart}
                windowEnd={transferFilterEnd}
                onApplyPlan={(plan) => {
                  // 移管計画をタスクとして追加
                  addTask({ type: '移管', rowLabel: actionModal.row?.label, detail: plan });
                  closeActionModal();
                }}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={actionModal.open} onClose={closeActionModal} maxWidth="xl" fullWidth>
            <DialogTitle>{actionModal.type || ''} - {actionModal.row?.label || actionModal.row?.itemName || ''}</DialogTitle>
            <DialogContent dividers>
              {/* KPI cards */}
              <Grid container spacing={1} sx={{mb:1}}>
                <Grid item xs={12} md={3}>
                  <Card variant="outlined"><CardContent>
                    <div className="mini">直近売上（直近28日）</div>
                    <div style={{fontWeight:700}}>{(actionModal.row?.totalSales||0).toLocaleString()}</div>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card variant="outlined"><CardContent>
                    <div className="mini">今後予測売上（28日先）</div>
                    <div style={{fontWeight:700}}>{(actionModal.row?.forecastSales||'—')}</div>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card variant="outlined"><CardContent>
                    <div className="mini">理想売上（配分ベース）</div>
                    <div style={{fontWeight:700}}>{(actionModal.row?.idealSales||'—')}</div>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card variant="outlined"><CardContent>
                    <div className="mini">理想販売終了日 / 実販売終了日</div>
                    <div style={{fontWeight:700}}>{(actionModal.row?.idealEnd||'—')} / {(actionModal.row?.forecastEnd||'—')}</div>
                  </CardContent></Card>
                </Grid>
              </Grid>

              {/* Form fields differ by action type */}
              { (actionModal.type === '発注') && (
                <window.OrderModal
                  batchRows={batchRows}
                  actionForm={actionForm}
                  setActionForm={setActionForm}
                  checkedRows={checkedRows}
                  setCheckedRows={setCheckedRows}
                  onOpenTransfer={(row)=> setActionModal({open:true, type:'移管', row: {...row, label: row.name, sku: row.sku, totalInv: row.invQty}, transfers: actionModal.transfers})}
                  onSubmitBatch={(mode)=>{
                    const rows = batchRows.map(r=>({ sku: r.sku, productId: r.productId, desiredQty: actionForm.rows?.[r.sku]?.desiredQty, desiredDate: actionForm.rows?.[r.sku]?.desiredDate, plannedQty: actionForm.rows?.[r.sku]?.plannedQty, plannedDate: actionForm.rows?.[r.sku]?.plannedDate, confirmer: actionForm.rows?.[r.sku]?.confirmer, byStore: actionForm.rows?.[r.sku]?.byStore }));
                    addTask({ type: '発注', rowLabel: `${rows.length}件`, detail: { rows } }, mode==='承認' ? 'approved' : 'hq_pending');
                    closeActionModal();
                  }}
                  stores={STORES}
                  targetStoreIds={targetStoreIds}
                />
              )}

              { (actionModal.type === '値下') && (
                <window.MarkdownModal
                  batchRows={batchRows}
                  actionForm={actionForm}
                  setActionForm={setActionForm}
                  checkedRows={checkedRows}
                  setCheckedRows={setCheckedRows}
                  onOpenTransfer={(row)=> setActionModal({open:true, type:'移管', row: {...row, label: row.name, sku: row.sku, totalInv: row.invQty}, transfers: actionModal.transfers})}
                  onSubmitBatch={(mode)=>{
                    const rows = batchRows.map(r=>({ sku: r.sku, productId: r.productId, qty: actionForm.rows?.[r.sku]?.qty, discountAmount: actionForm.rows?.[r.sku]?.discountAmount, newPrice: actionForm.rows?.[r.sku]?.newPrice, byStore: actionForm.rows?.[r.sku]?.byStore }));
                    addTask({ type: '値下', rowLabel: `${rows.length}件`, detail: { rows } }, mode==='承認' ? 'approved' : 'hq_pending');
                    closeActionModal();
                  }}
                  stores={STORES}
                  targetStoreIds={targetStoreIds}
                />
              )}

              {actionModal.type === '移管' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}><TextField label="ステータス" value={actionForm.status||'下書き'} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={3}><TextField label="アイテムコード" value={actionForm.itemCode||''} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={2}><TextField label="SKU" value={actionForm.sku||''} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={4}><TextField label="商品名" value={actionForm.name||''} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={2}><TextField label="数量" value={actionForm.qty||0} onChange={(e)=>setActionForm({...actionForm, qty:e.target.value})} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={2}><TextField label="希望数量" value={actionForm.desiredQty||''} onChange={(e)=>setActionForm({...actionForm, desiredQty:e.target.value})} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={3}><TextField label="移管先" value={actionForm.toStore||''} onChange={(e)=>setActionForm({...actionForm, toStore:e.target.value})} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={3}><TextField label="確認者" value={actionForm.confirmer||''} onChange={(e)=>setActionForm({...actionForm, confirmer:e.target.value})} fullWidth size="small"/></Grid>
                  <Grid item xs={12} md={3}><TextField label="確認日" type="date" InputLabelProps={{shrink:true}} value={actionForm.confirmDate||''} onChange={(e)=>setActionForm({...actionForm, confirmDate:e.target.value})} fullWidth size="small"/></Grid>
                </Grid>
              )}

            </DialogContent>
            <DialogActions>
              {/* Buttons: Cancel, Auto-calc (移管), Register variants */}
              {actionModal.type === '移管' && <Button onClick={()=>{
                // 自動計算：簡易的に TransferPlanner を再-open（ユーザーが呼べるよう誘導）
                setActionModal({open:true,type:'移管',row:actionModal.row, transfers: actionModal.transfers});
              }}>自動計算</Button>}
              <Button onClick={closeActionModal}>キャンセル</Button>
              <Button variant="outlined" onClick={()=>{
                // 登録（店舗申請）
                const detail = {...actionForm};
                addTask({ type: actionModal.type || 'その他', rowLabel: actionModal.row?.label, detail }, 'hq_pending');
                closeActionModal();
              }}>登録（申請）</Button>
              <Button variant="contained" color="success" onClick={()=>{
                // 承認（本部）
                const detail = {...actionForm};
                addTask({ type: actionModal.type || 'その他', rowLabel: actionModal.row?.label, detail }, 'approved');
                closeActionModal();
              }}>承認（本部）</Button>
              <Button variant="outlined" color="inherit" onClick={()=>{
                // 差戻（本部）
                const detail = {...actionForm};
                addTask({ type: actionModal.type || 'その他', rowLabel: actionModal.row?.label, detail }, 'open');
                closeActionModal();
              }}>差戻（本部）</Button>
              <Button variant="text" color="error" onClick={()=>{
                // 取下（店舗）
                const detail = {...actionForm};
                addTask({ type: actionModal.type || 'その他', rowLabel: actionModal.row?.label, detail }, 'skipped');
                closeActionModal();
              }}>取下（店舗）</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* やることリスト */}
        <Section title="やることリスト（推奨アクションから自動集約）" icon="checklist">
          <div style={{display:'flex',gap:24}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700, marginBottom:8}}>未完了（対応が必要）</div>
              <List dense>
                {tasks.filter(t=> t.status==='open' || t.status==='hq_pending').length===0 && (<div className="mini">未完了のタスクはありません。</div>)}
                {tasks.filter(t=> t.status==='open' || t.status==='hq_pending').map(t=> (
                  <ListItem key={t.id} secondaryAction={(
                    <div style={{display:'flex',gap:8}}>
                      {t.status==='hq_pending' && (
                        <>
                          <Button size="small" variant="contained" color="success" onClick={()=> updateTaskStatus(t.id, 'approved')}>承認</Button>
                          <Button size="small" variant="outlined" color="inherit" onClick={()=> updateTaskStatus(t.id, 'skipped')}>見送り</Button>
                        </>
                      )}
                      {t.status==='open' && (
                        <Button size="small" variant="contained" onClick={()=> updateTaskStatus(t.id, 'hq_pending')}>本部へ送る</Button>
                      )}
                    </div>
                  )}>
                    <ListItemText primary={`${t.type} - ${t.rowLabel || ''}`} secondary={renderTaskDetail(t)} />
                  </ListItem>
                ))}
              </List>
            </div>

            <div style={{flex:1}}>
              <div style={{fontWeight:700, marginBottom:8}}>完了 / 対応済み</div>
              <List dense>
                {tasks.filter(t=> t.status==='approved' || t.status==='skipped').length===0 && (<div className="mini">完了済みのタスクはありません。</div>)}
                {tasks.filter(t=> t.status==='approved' || t.status==='skipped').map(t=> (
                  <ListItem key={t.id}>
                    <ListItemText primary={`${t.type} - ${t.rowLabel || ''}`} secondary={`${t.status}｜${renderTaskDetail(t)}`} />
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </Section>

        {/* イベント */}
        <Section title="イベントリスト" icon="event">
          <Grid container spacing={1}>
            {events.map(ev=>(
              <Grid key={ev.date+ev.title} item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <div className="mini" style={{color:'#222', fontWeight:700}}>
                      <span className="material-icons" style={{fontSize:16, verticalAlign:'middle'}}>calendar_today</span> {ev.date}
                    </div>
                    <Typography variant="subtitle1" sx={{mt:0.5}}>{ev.title}</Typography>
                    <div className="mini" style={{margin:'4px 0'}}>場所：{ev.where}</div>
                    <div className="mini" style={{color:'#444'}}>{ev.desc}</div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>
      </div>
    </>
  );
}

// 小さな区切り用（視認性）
function DividerDot(){
  return <span style={{width:6,height:6,background:'#cbd5e1',display:'inline-block',borderRadius:99,margin:'0 8px'}} />;
}
