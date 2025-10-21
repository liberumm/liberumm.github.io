// app/App.js
const {
  AppBar, Toolbar, Typography, Paper, Box, Stack, Button,
  Card, CardContent, Grid, TextField, Chip, Switch, FormControlLabel, Tooltip, Avatar, List, ListItem, ListItemAvatar, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Tabs, Tab
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
  const [selectedProdItems, setSelectedProdItems] = React.useState(new Set());
  const [selectedStoreItems, setSelectedStoreItems] = React.useState(new Set());

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
  // Approve and simulate execution -> mark as done
  const handleApprove = (task) => {
    // mark approved first
    setTasks(prev => prev.map(t => t.id===task.id ? {...t, status: 'approved'} : t));
    // simulate processing / 実行: ちょっと待ってから完了状態にする
    setTimeout(()=>{
      setTasks(prev => prev.map(t => t.id===task.id ? {...t, status: 'done'} : t));
    }, 800);
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
    // transfers (移管プラン) の詳細表示: 各移管の from → to (qty) を一行ずつ表示
    if(d.transfers && Array.isArray(d.transfers)){
      return (
        <div style={{display:'flex', flexDirection:'column', gap:4}}>
          {d.transfers.map((tr, i)=>{
            const from = tr.from || tr.fromStore || tr.fromStoreId || '';
            const to = tr.to || tr.toStore || tr.toStoreId || '';
            const qty = tr.qty || '';
            return <div key={i} style={{fontSize:12}}>{`${from} → ${to} (${qty})`}</div>;
          })}
        </div>
      );
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
    const useBuckets = (viewMode==='detail') ? buckets : buckets.slice(-2);
    
    // シンプルな実販売データ集計
    const series = useBuckets.map(b=>{
      let total = 0;
      PRODUCTS.forEach(p=>{
        if(targetStoreIds.size === STORES.length){
          const units = sumUnits(idx.idxByProductDate, p.id, b.start, b.end);
          if(metric==='units') total += units;
          else if(metric==='revenue') total += sumRevenue(idx.idxByProductDate, p.id, b.start, b.end);
          else total += units * (p.price - Math.round(p.price*0.6));
        } else {
          Array.from(targetStoreIds).forEach(sid=>{
            const units = sumUnitsByStore(idx.idxByProductStoreDate, p.id, sid, b.start, b.end);
            if(metric==='units') total += units;
            else if(metric==='revenue') total += units * p.price;
            else total += units * (p.price - Math.round(p.price*0.6));
          });
        }
      });
      return total;
    });

    // 在庫推移（簡易版）
    const totalInv = INVENTORY.filter(i=> targetStoreIds.has(i.storeId)).reduce((a,c)=>a+c.qty,0);
    const inventorySeries = useBuckets.map(()=> totalInv); // 簡易的に固定値

    return { labels: useBuckets.map(b=>b.label), series, inventorySeries };
  },[buckets, viewMode, range, targetStoreIds, metric, PRODUCTS, INVENTORY, idx]);

  const [events, setEvents] = React.useState(()=> window.INIT_EVENTS ? window.INIT_EVENTS.slice() : []);
  const [planPreview, setPlanPreview] = React.useState([]);
  const [showPlanPreview, setShowPlanPreview] = React.useState(false);
  const [taskTab, setTaskTab] = React.useState(0); // 0: all, 1: pending (open/hq_pending), 2: done (approved/skipped/done)

  const metricHeader = metric==='units'?'販売点数': metric==='revenue'?'売上高':'粗利高';

  // レスポンシブ検知（Material-UI のブレークポイントを使用）
	const theme = MaterialUI.useTheme();
	const isSm = MaterialUI.useMediaQuery(theme.breakpoints.down('sm'));
	const isMd = MaterialUI.useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0}>
        {/* Toolbar を小画面で折返し対応に */}
        <Toolbar className="wrap" sx={{ flexWrap: isSm ? 'wrap' : 'nowrap' }}>
          <span className="material-icons" style={{marginRight:8}}>insights</span>
          <Typography variant={isSm ? 'subtitle1' : 'h6'} sx={{flexGrow:1}}>商品ダッシュボード</Typography>
          <span className="mini" style={{color:'#666', marginTop: isSm ? 8 : 0}}>期間: {range.start} 〜 {range.end}</span>
        </Toolbar>
      </AppBar>

      <div className="wrap">
        {/* フィルター */}
        <Section title="フィルター" icon="filter_alt">
          <Filter onApply={applyFilter}/>
        </Section>

        {/* 推移チャート */}
        <Section title="売上推移" icon="query_stats">
          {/* Paper の高さを画面幅に応じて調整（小画面は固定ピクセル／大画面は vh 指定） */}
          <Paper variant="outlined" sx={{ p:1.5, minHeight: isSm ? 240 : '35vh' }}>
            <RevenueChartDetailed
              labels={trend.labels}
              data={selectedRow && selectedRow.byBucket ? 
                (viewMode === 'detail' ? selectedRow.byBucket : selectedRow.byBucket.slice(-2)) : 
                trend.series}
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
            selectedProdItems={selectedProdItems} setSelectedProdItems={setSelectedProdItems}
            selectedStoreItems={selectedStoreItems} setSelectedStoreItems={setSelectedStoreItems}
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
            openActionModal={openActionModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={(term)=> setSearchTerm(term)}
            onClear={handleClearActions}
          />
        </Section>

        {/* 販売実績テーブル */}
        <Section
          title={`販売実績テーブル（${metricHeader}｜列＝期間${viewMode==='detail'?'（詳細）':'（簡潔）'}｜行＝${prodAxis}）`}
          icon="table_view"
          actions={
            // 小画面では縦並びにしてボタン等が折り返すようにする
            <Stack direction={isSm ? "column" : "row"} spacing={1} alignItems={isSm ? "stretch" : "center"}>
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

            // レスポンシブフラグ（子コンポーネント側で列削減等に利用）
            smallScreen={isSm}
            
            // AxisSelectorの選択情報
            selectedProdItems={selectedProdItems}
            selectedStoreItems={selectedStoreItems}
          />
        </Section>

        {/* アクションモーダル */}
        {actionModal.type === '移管' && (
          <window.TransferPlannerModal
            open={actionModal.open}
            onClose={closeActionModal}
            modalTitle={`移管計画 - ${actionModal.row?.label || actionModal.row?.itemName || ''}`}
            range={range}
            targetStoreIds={targetStoreIds}
            gapThreshold={0.08}
            minMove={5}
            skuFilter={actionModal.row?.items?.[0]?.sku || ''}
            storeNameFilter={transferFilterStore}
            windowStart={transferFilterStart}
            windowEnd={transferFilterEnd}
            onApplyPlan={(plan) => {
              setPlanPreview(plan || []);
              setShowPlanPreview(true);
            }}
          />
        )}

        {actionModal.type === '発注' && (
          <window.OrderModalDialog
            open={actionModal.open}
            onClose={closeActionModal}
            modalTitle={`発注一括処理 - ${actionModal.row?.label || actionModal.row?.itemName || ''}`}
            row={actionModal.row}
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

        {actionModal.type === '値下' && (
          <window.MarkdownModalDialog
            open={actionModal.open}
            onClose={closeActionModal}
            modalTitle={`値下げ一括処理 - ${actionModal.row?.label || actionModal.row?.itemName || ''}`}
            row={actionModal.row}
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

        {/* やることリスト */}
        <Section title="やることリスト（推奨アクションから自動集約）" icon="checklist">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
            <Tabs value={taskTab} onChange={(e,v)=> setTaskTab(v)} textColor="primary" indicatorColor="primary">
              <Tab label="すべて" />
              <Tab label="未対応" />
              <Tab label="対応済" />
            </Tabs>
            <div>
              <Button size="small" variant="outlined" onClick={()=> setTasks([])}>全タスククリア（デバッグ）</Button>
            </div>
          </div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{fontWeight:700}}>ID</TableCell>
                <TableCell style={{fontWeight:700}}>種別</TableCell>
                <TableCell style={{fontWeight:700}}>摘要</TableCell>
                <TableCell style={{fontWeight:700}}>詳細</TableCell>
                <TableCell style={{fontWeight:700}}>ステータス</TableCell>
                <TableCell style={{fontWeight:700}}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                const filtered = taskTab===0 ? tasks : (taskTab===1 ? tasks.filter(t=> t.status==='open' || t.status==='hq_pending') : tasks.filter(t=> ['approved','skipped','done'].includes(t.status)));
                if(filtered.length===0){
                  return (<TableRow><TableCell colSpan={6} align="center" style={{color:'#888'}}>タスクはありません。</TableCell></TableRow>);
                }
                return filtered.map(t=> (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.rowLabel || ''}</TableCell>
                    <TableCell style={{maxWidth:400}}>{renderTaskDetail(t)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={t.status} color={t.status==='hq_pending' ? 'warning' : t.status==='approved' ? 'success' : t.status==='done' ? 'default' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <div style={{display:'flex', gap:8}}>
                        {t.status==='hq_pending' && (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={()=> handleApprove(t)}>承認</Button>
                            <Button size="small" variant="outlined" color="inherit" onClick={()=> updateTaskStatus(t.id, 'skipped')}>見送り</Button>
                          </>
                        )}
                        {t.status==='open' && (
                          <Button size="small" variant="contained" onClick={()=> updateTaskStatus(t.id, 'hq_pending')}>本部へ送る</Button>
                        )}
                        {t.status==='approved' && (
                          <Button size="small" variant="contained" onClick={()=> updateTaskStatus(t.id, 'done')}>実行済にする</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        </Section>

        {/* 移管プラン プレビュー・確認ダイアログ */}
        <Dialog open={showPlanPreview} onClose={()=> setShowPlanPreview(false)} maxWidth="xl" fullWidth fullScreen={isSm}>
          <DialogTitle>移管プラン プレビュー</DialogTitle>
          <DialogContent dividers>
            <div style={{maxHeight: '60vh', overflowY:'auto'}}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell align="right">Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {planPreview.map((p,i)=>(
                    <TableRow key={i}>
                      <TableCell>{p.sku}</TableCell>
                      <TableCell>{p.fromStore}</TableCell>
                      <TableCell>{p.toStore}</TableCell>
                      <TableCell align="right">{p.qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> setShowPlanPreview(false)}>閉じる</Button>
            <Button variant="contained" color="primary" onClick={()=>{
              // 登録：planPreview をタスク（1つのタスクとしてまとめる）に追加
              if(planPreview.length){
                addTask({ type: '移管', rowLabel: `${planPreview.length}件`, detail: { transfers: planPreview } }, 'hq_pending');
              }
              setShowPlanPreview(false);
              closeActionModal();
            }}>登録（申請）</Button>
          </DialogActions>
        </Dialog>

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
