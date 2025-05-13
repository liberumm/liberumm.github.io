const {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Chip
} = MaterialUI;

/* ---- マスタデータ ---- */
const DEPARTMENTS = ['店舗開発部', 'サイト開発部', '施設活性化部'];
const ACCOUNTS    = ['広告宣伝費', '販促費', '什器購入', '外注業務'];

/* ---- ユーティリティ ---- */
const fmtYen   = v => v.toLocaleString('ja-JP');
const fmtRatio = (num, den) =>
  den ? `${Math.round((num / den) * 100)}%` : '0%';

/* ---- 空フォーム定義 ---- */
const emptyForm = {
  id: '',
  startDate: '',
  endDate: '',
  name: '',
  account: '',
  posting: '費用',
  department: '',
  burdenDept: '',
  pattern: '',
  projectId: '',
  insideAnnual: true,
  budget: '',
  prepaid: '',
  posted: '',
  assigneeDepartment: '' // 担当部署追加
};

/* ---- コンポーネント ---- */
const BudgetList = () => {
  /* ========== state ========== */
  const [rows, setRows] = React.useState([
    { id:'B001', startDate:'2024-06-01', endDate:'2024-06-30', name:'広宣A案', account:'広告宣伝費', posting:'費用', department:'店舗開発部', burdenDept:'店舗開発部', pattern:'均等', projectId:'P001', insideAnnual:true,  budget:1000000, prepaid:200000, posted:300000 },
    { id:'B002', startDate:'2024-06-05', endDate:'2024-06-20', name:'販促B案', account:'販促費',   posting:'費用', department:'サイト開発部', burdenDept:'サイト開発部', pattern:'均等', projectId:'P002', insideAnnual:false, budget:500000,  prepaid:0,      posted:450000 },
    { id:'B003', startDate:'2024-07-01', endDate:'2024-07-31', name:'什器購入C', account:'什器購入', posting:'資産', department:'施設活性化部', burdenDept:'施設活性化部', pattern:'均等', projectId:'P003', insideAnnual:true,  budget:300000,  prepaid:50000,  posted:0      },
    { id:'B004', startDate:'2024-07-10', endDate:'2024-07-25', name:'外注D',   account:'外注業務', posting:'費用', department:'店舗開発部', burdenDept:'店舗開発部', pattern:'均等', projectId:'P004', insideAnnual:false, budget:200000,  prepaid:0,      posted:180000 },
    { id:'B005', startDate:'2024-08-01', endDate:'2024-08-31', name:'設備改修E', account:'什器購入', posting:'資産', department:'施設活性化部', burdenDept:'店舗開発部', pattern:'スポット', projectId:'P005', insideAnnual:true,  budget:800000,  prepaid:150000, posted:100000 },
    { id:'B006', startDate:'2024-09-01', endDate:'2024-09-30', name:'広告F',   account:'広告宣伝費', posting:'費用', department:'店舗開発部', burdenDept:'サイト開発部', pattern:'均等', projectId:'P006', insideAnnual:true,  budget:600000,  prepaid:0,      posted:600000 },
    { id:'B007', startDate:'2024-10-01', endDate:'2024-10-31', name:'販促G',   account:'販促費',   posting:'費用', department:'サイト開発部', burdenDept:'施設活性化部', pattern:'段階',   projectId:'P007', insideAnnual:false, budget:400000,  prepaid:50000,  posted:200000 },
    { id:'B008', startDate:'2024-11-01', endDate:'2024-11-30', name:'外注H',   account:'外注業務', posting:'資産', department:'施設活性化部', burdenDept:'サイト開発部', pattern:'均等', projectId:'P008', insideAnnual:true,  budget:250000,  prepaid:50000,  posted:100000 }
  ]);

  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [insideFilter,     setInsideFilter]     = React.useState('ALL');      // ALL/INSIDE/OUTSIDE
  const [viewMode,         setViewMode]         = React.useState('DETAIL');   // DETAIL/TOTAL

  const [addOpen,   setAddOpen]   = React.useState(false);
  const [addForm,   setAddForm]   = React.useState(emptyForm);
  const [editOpen,  setEditOpen]  = React.useState(false);
  const [editForm,  setEditForm]  = React.useState(emptyForm);
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [groupRows, setGroupRows] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 20;

  // 追加：CSVエクスポート用関数
  const exportCSV = () => {
    let csv = "";
    if(viewMode==='DETAIL'){
      csv = DETAIL_HEADERS.join(",") + "\n";
      filtered.forEach((r, idx) => {
        const row = [
          idx+1,
          fmtRatio(r.posted+r.prepaid, r.budget),
          `${r.startDate}～${r.endDate}`,
          r.id,
          r.name,
          r.account,
          r.posting,
          r.department,
          r.burdenDept,
          r.pattern,
          r.projectId,
          r.insideAnnual ? '内' : '外',
          r.budget,
          r.prepaid,
          r.posted,
          r.assigneeDepartment || ""
        ].join(",");
        csv += row + "\n";
      });
    } else {
      csv = TOTAL_HEADERS.join(",") + "\n";
      totalData.forEach((g, idx) => {
        const row = [
          idx+1,
          fmtRatio(g.posted+g.prepaid, g.budget),
          g.periodLabel,
          g.posting,
          g.department,
          g.burdenDept,
          g.insideAnnual ? '内' : '外',
          g.budget,
          g.prepaid,
          g.posted,
          "" // 集計には担当部署なし
        ].join(",");
        csv += row + "\n";
      });
    }
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "予算一覧.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ========== 抽出 ========== */
  const filtered = rows.filter(r =>
    (!departmentFilter || r.department === departmentFilter) &&
    (insideFilter === 'ALL' ||
      (insideFilter === 'INSIDE'  && r.insideAnnual) ||
      (insideFilter === 'OUTSIDE' && !r.insideAnnual))
  );

  /* ========== 集計 ========== */
  const totalData = React.useMemo(() => {
    const map = new Map();
    filtered.forEach(r => {
      const key = [
        `${r.startDate}～${r.endDate}`,
        r.posting,
        r.department,
        r.burdenDept,
        r.insideAnnual
      ].join('|');
      const agg = map.get(key) || {
        periodLabel: `${r.startDate}～${r.endDate}`,
        posting: r.posting,
        department: r.department,
        burdenDept: r.burdenDept,
        insideAnnual: r.insideAnnual,
        budget: 0,
        prepaid: 0,
        posted: 0
      };
      agg.budget  += r.budget;
      agg.prepaid += r.prepaid;
      agg.posted  += r.posted;
      map.set(key, agg);
    });
    return Array.from(map.values());
  }, [filtered]);

  /* ========== ページネーション用データ ========== */
  const pagedFiltered = React.useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page]);

  const pagedTotalData = React.useMemo(() => {
    return totalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [totalData, page]);

  /* ========== 件数表示 ========== */
  const totalCount = viewMode === 'DETAIL' ? filtered.length : totalData.length;
  const startIdx = totalCount === 0 ? 0 : page * rowsPerPage + 1;
  const endIdx = Math.min((page + 1) * rowsPerPage, totalCount);

  /* ========== ヘッダー定義 ========== */
  const DETAIL_HEADERS = [
    'No','進捗','期間','予算ID','予算名','勘定科目',
    '計上方法','部署','負担部署','配分パターン',
    '企画ID','年度予算内外',
    '予算金額','前払金額(未計上)','計上金額','担当部署' // 担当部署追加
  ];
  const TOTAL_HEADERS = [
    'No','進捗','期間','計上方法','部署','負担部署',
    '年度予算内外','予算金額','前払金額(未計上)','計上金額','担当部署' // 担当部署追加
  ];

  /* ========== 行クリック ========== */
  const handleRowClickDetail = r => {
    setEditForm(r);
    setEditOpen(true);
  };
  const handleRowClickTotal = g => {
    setGroupRows(filtered.filter(r =>
      `${r.startDate}～${r.endDate}` === g.periodLabel &&
      r.posting    === g.posting &&
      r.department === g.department &&
      r.burdenDept === g.burdenDept &&
      r.insideAnnual === g.insideAnnual
    ));
    setGroupOpen(true);
  };

  /* ========== 追加 ========== */
  const handleAddOpen   = () => { setAddForm(emptyForm); setAddOpen(true); };
  const handleAddChange = (f, v) => setAddForm(prev => ({ ...prev, [f]: v }));
  const handleAddSave   = () => {
    setRows(prev => [
      ...prev,
      {
        ...addForm,
        budget:  Number(addForm.budget),
        prepaid: Number(addForm.prepaid),
        posted:  Number(addForm.posted)
      }
    ]);
    setAddOpen(false);
  };

  /* ========== 編集 ========== */
  const handleEditChange = (f, v) => setEditForm(prev => ({ ...prev, [f]: v }));
  const handleEditSave   = () => {
    setRows(prev =>
      prev.map(r =>
        r.id === editForm.id
          ? {
              ...editForm,
              budget:  Number(editForm.budget),
              prepaid: Number(editForm.prepaid),
              posted:  Number(editForm.posted)
            }
          : r
      )
    );
    setEditOpen(false);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>予算一覧</Typography>
      {/* 追加：エクスポートボタン（フィルター行の上部） */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" size="small" onClick={exportCSV}>
          エクスポート
        </Button>
      </Box>
      <Box sx={{ display:'flex', flexWrap:'wrap', gap:1, mb:2 }}>
        <FormControl size="small" sx={{ minWidth:120 }}>
          <InputLabel>部署</InputLabel>
          <Select
            value={departmentFilter}
            label="部署"
            onChange={e => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="">全て</MenuItem>
            {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          exclusive size="small"
          value={insideFilter}
          onChange={(_,v)=>v&&setInsideFilter(v)}
        >
          <ToggleButton value="ALL">内外:全て</ToggleButton>
          <ToggleButton value="INSIDE">内</ToggleButton>
          <ToggleButton value="OUTSIDE">外</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          exclusive size="small"
          value={viewMode}
          onChange={(_,v)=>v&&setViewMode(v)}
        >
          <ToggleButton value="DETAIL">勘定科目別</ToggleButton>
          <ToggleButton value="TOTAL">勘定科目合計</ToggleButton>
        </ToggleButtonGroup>

        <Button variant="contained" size="small" onClick={handleAddOpen}>
          新規作成
        </Button>
      </Box>

      {/* 件数表示 */}
      <Box sx={{ mb: 1, fontSize: 14, color: '#555' }}>
        {startIdx} ～ {endIdx} 件を表示 ({totalCount} 件中)
      </Box>

      {/* メインテーブル */}
      <TableContainer sx={{
        maxHeight:440, overflowX:'auto',
        '& table':{borderCollapse:'collapse'},
        '& th, & td':{borderRight:'1px solid #b0bec5'},
        '& th:last-of-type, & td:last-of-type':{borderRight:'none'}
      }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {(viewMode==='DETAIL' ? DETAIL_HEADERS : TOTAL_HEADERS).map(h=>(
                <TableCell
                  key={h}
                  align={['予算金額','前払金額(未計上)','計上金額'].includes(h)?'right':'center'}
                  sx={{ background:'#e3eafc', fontWeight:'bold', borderBottom:'2px solid #90caf9' }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {viewMode==='DETAIL'
              ? pagedFiltered.map((r,idx)=>(
                  <TableRow
                    key={r.id}
                    hover
                    sx={{ cursor:'pointer' }}
                    onClick={()=>handleRowClickDetail(r)}
                  >
                    <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align="center">{fmtRatio(r.posted+r.prepaid, r.budget)}</TableCell>
                    <TableCell align="center">{`${r.startDate}～${r.endDate}`}</TableCell>
                    <TableCell align="center">{r.id}</TableCell>
                    <TableCell align="center">{r.name}</TableCell>
                    <TableCell align="center">{r.account}</TableCell>
                    <TableCell align="center">{r.posting}</TableCell>
                    <TableCell align="center">{r.department}</TableCell>
                    <TableCell align="center">{r.burdenDept}</TableCell>
                    <TableCell align="center">{r.pattern}</TableCell>
                    <TableCell align="center">{r.projectId}</TableCell>
                    <TableCell align="center">{r.insideAnnual?'内':'外'}</TableCell>
                    <TableCell align="right">{fmtYen(r.budget)}</TableCell>
                    <TableCell align="right">{fmtYen(r.prepaid)}</TableCell>
                    <TableCell align="right">{fmtYen(r.posted)}</TableCell>
                    <TableCell align="center">{r.assigneeDepartment||"-"}</TableCell>
                  </TableRow>
                ))
              : pagedTotalData.map((g,idx)=>(
                  <TableRow
                    key={idx}
                    hover
                    sx={{ cursor:'pointer' }}
                    onClick={()=>handleRowClickTotal(g)}
                  >
                    <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell align="center">{fmtRatio(g.posted+g.prepaid, g.budget)}</TableCell>
                    <TableCell align="center">{g.periodLabel}</TableCell>
                    <TableCell align="center">{g.posting}</TableCell>
                    <TableCell align="center">{g.department}</TableCell>
                    <TableCell align="center">{g.burdenDept}</TableCell>
                    <TableCell align="center">{g.insideAnnual?'内':'外'}</TableCell>
                    <TableCell align="right">{fmtYen(g.budget)}</TableCell>
                    <TableCell align="right">{fmtYen(g.prepaid)}</TableCell>
                    <TableCell align="right">{fmtYen(g.posted)}</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* ページネーション */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
        <Button
          size="small"
          onClick={() => setPage(0)}
          disabled={page === 0}
        >{"<<"}</Button>
        <Button
          size="small"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >{"<"}</Button>
        <Box sx={{ mx: 1, fontSize: 14 }}>
          {page + 1} / {Math.max(1, Math.ceil(totalCount / rowsPerPage))}
        </Box>
        <Button
          size="small"
          onClick={() => setPage(p => Math.min(Math.ceil(totalCount / rowsPerPage) - 1, p + 1))}
          disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
        >{">"}</Button>
        <Button
          size="small"
          onClick={() => setPage(Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1))}
          disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
        >{">>"}</Button>
      </Box>

      {/* 新規作成モーダル */}
      <Dialog open={addOpen} onClose={()=>setAddOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>予算新規作成</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, mt:1
          }}>
            <TextField
              label="開始日" type="date"
              value={addForm.startDate}
              onChange={e=>handleAddChange('startDate', e.target.value)}
              InputLabelProps={{ shrink:true }} fullWidth
            />
            <TextField
              label="終了日" type="date"
              value={addForm.endDate}
              onChange={e=>handleAddChange('endDate', e.target.value)}
              InputLabelProps={{ shrink:true }} fullWidth
            />
            <TextField
              label="予算ID"
              value={addForm.id}
              onChange={e=>handleAddChange('id', e.target.value)}
              fullWidth
            />
            <TextField
              label="予算名"
              value={addForm.name}
              onChange={e=>handleAddChange('name', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>勘定科目</InputLabel>
              <Select
                value={addForm.account}
                label="勘定科目"
                onChange={e=>handleAddChange('account', e.target.value)}
              >
                {ACCOUNTS.map(a=><MenuItem key={a} value={a}>{a}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>計上方法</InputLabel>
              <Select
                value={addForm.posting}
                label="計上方法"
                onChange={e=>handleAddChange('posting', e.target.value)}
              >
                <MenuItem value="費用">費用</MenuItem>
                <MenuItem value="資産">資産</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>部署</InputLabel>
              <Select
                value={addForm.department}
                label="部署"
                onChange={e=>handleAddChange('department', e.target.value)}
              >
                {DEPARTMENTS.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>負担部署</InputLabel>
              <Select
                value={addForm.burdenDept}
                label="負担部署"
                onChange={e=>handleAddChange('burdenDept', e.target.value)}
              >
                {DEPARTMENTS.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="配分パターン"
              value={addForm.pattern}
              onChange={e=>handleAddChange('pattern', e.target.value)}
              fullWidth
            />
            <TextField
              label="企画ID"
              value={addForm.projectId}
              onChange={e=>handleAddChange('projectId', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>年度予算内外</InputLabel>
              <Select
                value={addForm.insideAnnual ? '内' : '外'}
                label="年度予算内外"
                onChange={e=>handleAddChange('insideAnnual', e.target.value==='内')}
              >
                <MenuItem value="内">内</MenuItem>
                <MenuItem value="外">外</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="予算金額"
              type="number"
              value={addForm.budget}
              onChange={e=>handleAddChange('budget', e.target.value)}
              fullWidth
            />
            <TextField
              label="前払金額(未計上)"
              type="number"
              value={addForm.prepaid}
              onChange={e=>handleAddChange('prepaid', e.target.value)}
              fullWidth
            />
            <TextField
              label="計上金額"
              type="number"
              value={addForm.posted}
              onChange={e=>handleAddChange('posted', e.target.value)}
              fullWidth
            />
            <TextField
              label="担当部署"
              value={addForm.assigneeDepartment||""}
              onChange={e=>handleAddChange('assigneeDepartment', e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setAddOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddSave}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* 編集モーダル */}
      <Dialog open={editOpen} onClose={()=>setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>予算編集</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, mt:1
          }}>
            <TextField
              label="開始日" type="date"
              value={editForm.startDate}
              onChange={e=>handleEditChange('startDate', e.target.value)}
              InputLabelProps={{ shrink:true }} fullWidth
            />
            <TextField
              label="終了日" type="date"
              value={editForm.endDate}
              onChange={e=>handleEditChange('endDate', e.target.value)}
              InputLabelProps={{ shrink:true }} fullWidth
            />
            <TextField
              label="予算ID"
              value={editForm.id}
              disabled
              fullWidth
            />
            <TextField
              label="予算名"
              value={editForm.name}
              onChange={e=>handleEditChange('name', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>勘定科目</InputLabel>
              <Select
                value={editForm.account}
                label="勘定科目"
                onChange={e=>handleEditChange('account', e.target.value)}
              >
                {ACCOUNTS.map(a=><MenuItem key={a} value={a}>{a}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>計上方法</InputLabel>
              <Select
                value={editForm.posting}
                label="計上方法"
                onChange={e=>handleEditChange('posting', e.target.value)}
              >
                <MenuItem value="費用">費用</MenuItem>
                <MenuItem value="資産">資産</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>部署</InputLabel>
              <Select
                value={editForm.department}
                label="部署"
                onChange={e=>handleEditChange('department', e.target.value)}
              >
                {DEPARTMENTS.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>負担部署</InputLabel>
              <Select
                value={editForm.burdenDept}
                label="負担部署"
                onChange={e=>handleEditChange('burdenDept', e.target.value)}
              >
                {DEPARTMENTS.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="配分パターン"
              value={editForm.pattern}
              onChange={e=>handleEditChange('pattern', e.target.value)}
              fullWidth
            />
            <TextField
              label="企画ID"
              value={editForm.projectId}
              onChange={e=>handleEditChange('projectId', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>年度予算内外</InputLabel>
              <Select
                value={editForm.insideAnnual ? '内' : '外'}
                label="年度予算内外"
                onChange={e=>handleEditChange('insideAnnual', e.target.value==='内')}
              >
                <MenuItem value="内">内</MenuItem>
                <MenuItem value="外">外</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="予算金額"
              type="number"
              value={editForm.budget}
              onChange={e=>handleEditChange('budget', e.target.value)}
              fullWidth
            />
            <TextField
              label="前払金額(未計上)"
              type="number"
              value={editForm.prepaid}
              onChange={e=>handleEditChange('prepaid', e.target.value)}
              fullWidth
            />
            <TextField
              label="計上金額"
              type="number"
              value={editForm.posted}
              onChange={e=>handleEditChange('posted', e.target.value)}
              fullWidth
            />
            <TextField
              label="担当部署"
              value={editForm.assigneeDepartment||""}
              onChange={e=>handleEditChange('assigneeDepartment', e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleEditSave}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* 内訳モーダル */}
      <Dialog open={groupOpen} onClose={()=>setGroupOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>勘定科目内訳</DialogTitle>
        <DialogContent>
          <TableContainer sx={{
            maxHeight:400,
            '& table':{borderCollapse:'collapse'},
            '& th, & td':{borderRight:'1px solid #b0bec5'},
            '& th:last-of-type, & td:last-of-type':{borderRight:'none'}
          }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {DETAIL_HEADERS.map(h=>(
                    <TableCell
                      key={h}
                      align={['予算金額','前払金額(未計上)','計上金額'].includes(h)?'right':'center'}
                      sx={{ background:'#e3eafc', fontWeight:'bold', borderBottom:'2px solid #90caf9' }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {groupRows.map((r,idx)=>(
                  <TableRow
                    key={r.id}
                    hover
                    sx={{ cursor:'pointer' }}
                    onClick={()=>handleRowClickDetail(r)}
                  >
                    <TableCell align="center">{idx+1}</TableCell>
                    <TableCell align="center">{fmtRatio(r.posted+r.prepaid, r.budget)}</TableCell>
                    <TableCell align="center">{`${r.startDate}～${r.endDate}`}</TableCell>
                    <TableCell align="center">{r.id}</TableCell>
                    <TableCell align="center">{r.name}</TableCell>
                    <TableCell align="center">{r.account}</TableCell>
                    <TableCell align="center">{r.posting}</TableCell>
                    <TableCell align="center">{r.department}</TableCell>
                    <TableCell align="center">{r.burdenDept}</TableCell>
                    <TableCell align="center">{r.pattern}</TableCell>
                    <TableCell align="center">{r.projectId}</TableCell>
                    <TableCell align="center">{r.insideAnnual?'内':'外'}</TableCell>
                    <TableCell align="right">{fmtYen(r.budget)}</TableCell>
                    <TableCell align="right">{fmtYen(r.prepaid)}</TableCell>
                    <TableCell align="right">{fmtYen(r.posted)}</TableCell>
                    <TableCell align="center">{r.assigneeDepartment||"-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setGroupOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

window.BudgetList = BudgetList;
