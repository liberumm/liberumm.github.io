const {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} = MaterialUI;

/* ---------- サンプルデータ（5行） ---------- */
const sampleExpenses = [
  {
    id: 'E001',
    department: '店舗開発部',
    date: '2024-06-03',
    projectId: 'P001',
    projectName: '新店舗開発',
    budgetId: 'B003',
    taskId: 'T001',
    estimates: [
      { estimateId:'EST001-1', date:'2024-06-01', estimateName:'什器購入見積A', department:'店舗開発部', account:'資産', amount:500000, vendor:'○○建設', vendorEstimateId:'VE001-001' },
      { estimateId:'EST001-2', date:'2024-06-02', estimateName:'什器購入見積B', department:'店舗開発部', account:'資産', amount:300000, vendor:'△△設備', vendorEstimateId:'VE001-002' }
    ],
    invoices: [
      { invoiceId:'INV001-1', date:'2024-06-10', estimateId:'EST001-1', paymentDate:'2024-06-20', invoiceName:'什器請求A', department:'店舗開発部', account:'資産', amount:400000, vendor:'○○建設', vendorInvoiceId:'VI001-001' },
      { invoiceId:'INV001-2', date:'2024-06-15', estimateId:'EST001-2', paymentDate:'2024-06-25', invoiceName:'什器請求B', department:'店舗開発部', account:'資産', amount:400000, vendor:'△△設備', vendorInvoiceId:'VI001-002' }
    ],
    payments: [
      { paymentId:'PAY001-1', date:'2024-06-20', estimateId:'EST001-1', invoiceId:'INV001-1', paymentDate:'2024-06-20', postingDate:'2024-06-21', paymentName:'什器支払A', department:'店舗開発部', account:'資産', amount:800000, vendor:'○○建設' }
    ]
  },
  {
    id: 'E002',
    department: 'サイト開発部',
    date: '2024-06-11',
    projectId: 'P002',
    projectName: '改装プロジェクト',
    budgetId: 'B002',
    taskId: 'T002',
    estimates: [
      { estimateId:'EST002-1', date:'2024-06-05', estimateName:'工事見積', department:'サイト開発部', account:'工事費', amount:300000, vendor:'△△設備', vendorEstimateId:'VE002-001' }
    ],
    invoices: [
      { invoiceId:'INV002-1', date:'2024-06-15', estimateId:'EST002-1', paymentDate:'2024-06-25', invoiceName:'工事請求', department:'サイト開発部', account:'工事費', amount:300000, vendor:'△△設備', vendorInvoiceId:'VI002-001' }
    ],
    payments: [
      { paymentId:'PAY002-1', date:'2024-06-25', estimateId:'EST002-1', invoiceId:'INV002-1', paymentDate:'2024-06-25', postingDate:'2024-06-26', paymentName:'工事支払', department:'サイト開発部', account:'工事費', amount:300000, vendor:'△△設備' }
    ]
  },
  {
    id: 'E003',
    department: '店舗開発部',
    date: '2024-06-15',
    projectId: 'P001',
    projectName: '新店舗開発',
    budgetId: 'B004',
    taskId: 'T003',
    estimates: [
      { estimateId:'EST003-1', date:'2024-06-07', estimateName:'外注業務見積', department:'店舗開発部', account:'外注費', amount:200000, vendor:'□□サービス', vendorEstimateId:'VE003-001' }
    ],
    invoices: [
      { invoiceId:'INV003-1', date:'2024-06-18', estimateId:'EST003-1', paymentDate:'2024-06-28', invoiceName:'外注請求', department:'店舗開発部', account:'外注費', amount:180000, vendor:'□□サービス', vendorInvoiceId:'VI003-001' }
    ],
    payments: [
      { paymentId:'PAY003-1', date:'2024-06-28', estimateId:'EST003-1', invoiceId:'INV003-1', paymentDate:'2024-06-28', postingDate:'2024-06-29', paymentName:'外注支払', department:'店舗開発部', account:'外注費', amount:150000, vendor:'□□サービス' }
    ]
  },
  {
    id: 'E004',
    department: 'マーケティング部',
    date: '2024-06-07',
    projectId: 'P003',
    projectName: 'マーケティング調査',
    budgetId: 'B005',
    taskId: 'T004',
    estimates: [
      { estimateId:'EST004-1', date:'2024-06-02', estimateName:'調査見積', department:'マーケティング部', account:'外注費', amount:120000, vendor:'△△リサーチ', vendorEstimateId:'VE004-001' }
    ],
    invoices: [
      { invoiceId:'INV004-1', date:'2024-06-10', estimateId:'EST004-1', paymentDate:'2024-06-20', invoiceName:'調査請求', department:'マーケティング部', account:'外注費', amount:120000, vendor:'△△リサーチ', vendorInvoiceId:'VI004-001' }
    ],
    payments: [
      { paymentId:'PAY004-1', date:'2024-06-20', estimateId:'EST004-1', invoiceId:'INV004-1', paymentDate:'2024-06-20', postingDate:'2024-06-21', paymentName:'調査支払', department:'マーケティング部', account:'外注費', amount:60000, vendor:'△△リサーチ' }
    ]
  },
  {
    id: 'E005',
    department: 'IT部',
    date: '2024-06-09',
    projectId: 'P004',
    projectName: 'システム開発',
    budgetId: 'B006',
    taskId: 'T005',
    estimates: [
      { estimateId:'EST005-1', date:'2024-06-04', estimateName:'システム開発見積', department:'IT部', account:'開発費', amount:800000, vendor:'□□ソフト', vendorEstimateId:'VE005-001' }
    ],
    invoices: [
      { invoiceId:'INV005-1', date:'2024-06-12', estimateId:'EST005-1', paymentDate:'2024-06-22', invoiceName:'開発請求A', department:'IT部', account:'開発費', amount:400000, vendor:'□□ソフト', vendorInvoiceId:'VI005-001' },
      { invoiceId:'INV005-2', date:'2024-06-18', estimateId:'EST005-1', paymentDate:'2024-06-28', invoiceName:'開発請求B', department:'IT部', account:'開発費', amount:400000, vendor:'□□ソフト', vendorInvoiceId:'VI005-002' }
    ],
    payments: [
      { paymentId:'PAY005-1', date:'2024-06-25', estimateId:'EST005-1', invoiceId:'INV005-1', paymentDate:'2024-06-25', postingDate:'2024-06-26', paymentName:'開発支払A', department:'IT部', account:'開発費', amount:400000, vendor:'□□ソフト' }
    ]
  }
];

/* ---------- ユーティリティ ---------- */
function getStatus(exp){
  const sum=a=>(a||[]).reduce((s,x)=>s+(x.amount||0),0);
  const est=sum(exp.estimates), inv=sum(exp.invoices), pay=sum(exp.payments);
  if(pay>=inv&&inv>0) return {label:'支払完了',color:'success',value:'支払完了'};
  if(inv>=est&&est>0) return {label:'請求完了',color:'info',value:'請求完了'};
  if(est>0) return {label:'見積完了',color:'default',value:'見積完了'};
  return {label:'未処理',color:'default',value:'未処理'};
}
const getSum=arr=>(arr||[]).reduce((s,x)=>s+(x.amount||0),0);
function getPeriod(exp){
  const dates=[...(exp.estimates||[]),...(exp.invoices||[]),...(exp.payments||[])].map(x=>x.date).filter(Boolean).sort();
  return dates.length?`${dates[0]} ～ ${dates[dates.length-1]}`:'';
}

/* ---------- メインコンポーネント ---------- */
const ProjectTab = () => {
  /* 基本ステート */
  const [expenses,setExpenses]=React.useState(sampleExpenses);
  const [selected,setSelected]=React.useState(null);
  const [edit,setEdit]=React.useState(null);

  /* フィルタ */
  const [statusFilter,setStatusFilter]=React.useState('ALL');
  const [departmentFilter,setDepartmentFilter]=React.useState('');
  const [projectFilter,setProjectFilter]=React.useState('');

  /* 追加モーダル用ステート */
  const emptyEstimate={estimateId:'',date:'',estimateName:'',department:'',account:'',amount:0,vendor:'',vendorEstimateId:''};
  const emptyInvoice ={invoiceId:'',date:'',estimateId:'',paymentDate:'',invoiceName:'',department:'',account:'',amount:0,vendor:'',vendorInvoiceId:''};
  const emptyPayment ={paymentId:'',date:'',estimateId:'',invoiceId:'',paymentDate:'',postingDate:'',paymentName:'',department:'',account:'',amount:0,vendor:''};

  const [openAddEstimate,setOpenAddEstimate]=React.useState(false);
  const [newEstimate,setNewEstimate]=React.useState(emptyEstimate);
  const [openAddInvoice,setOpenAddInvoice]=React.useState(false);
  const [newInvoice,setNewInvoice]=React.useState(emptyInvoice);
  const [openAddPayment,setOpenAddPayment]=React.useState(false);
  const [newPayment,setNewPayment]=React.useState(emptyPayment);

  /* フィルタ結果 */
  const filtered=expenses.filter(exp=>{
    const st=getStatus(exp).value;
    return (statusFilter==='ALL'||st===statusFilter)
      &&(!departmentFilter||exp.department===departmentFilter)
      &&(!projectFilter||exp.projectName===projectFilter);
  });
  const departmentList=[...new Set(expenses.map(e=>e.department))];
  const projectList=[...new Set(expenses.map(e=>e.projectName))];

  /* 一覧 → 編集モーダル */
  const handleRowClick=exp=>{ setSelected(exp.id); setEdit(JSON.parse(JSON.stringify(exp))); };
  const handleDialogClose=()=>{ setSelected(null); setEdit(null); };
  const handleSave=()=>{ setExpenses(prev=>prev.map(e=>e.id===edit.id?edit:e)); handleDialogClose(); };

  /* インライン編集 */
  const changeHeader=(f,v)=>setEdit(prev=>({...prev,[f]:v}));
  const changeArray=(section,idx,key,v)=>{
    const arr=[...(edit[section]||[])]; arr[idx]={...arr[idx],[key]:v};
    setEdit(prev=>({...prev,[section]:arr}));
  };
  const removeArrayItem=(section,idx)=>{
    const arr=[...(edit[section]||[])]; arr.splice(idx,1);
    setEdit(prev=>({...prev,[section]:arr}));
  };

  /* 見積 → 請求／請求 → 支払 */
  const createInvoiceFromEstimate=est=>{
    // 元データを流用しつつ新規IDを空で作成
    const newInv={
      ...emptyInvoice,
      date:est.date,
      estimateId:est.estimateId,
      invoiceName:est.estimateName,
      department:est.department,
      account:est.account,
      amount:est.amount,
      vendor:est.vendor,
      vendorInvoiceId: '', // 新規
      paymentDate: ''
    };
    setEdit(prev=>({...prev,invoices:[...(prev.invoices||[]),newInv]}));
  };
  const createPaymentFromInvoice=inv=>{
    // 元データを流用しつつ新規IDを空で作成
    const newPay={
      ...emptyPayment,
      date:inv.date,
      estimateId:inv.estimateId,
      invoiceId:inv.invoiceId,
      paymentDate:inv.paymentDate,
      postingDate: '',
      paymentName:inv.invoiceName,
      department:inv.department,
      account:inv.account,
      amount:inv.amount,
      vendor:inv.vendor
    };
    setEdit(prev=>({...prev,payments:[...(prev.payments||[]),newPay]}));
  };

  /* 追加モーダル: 開閉・保存 */
  const openAddDialog=(type)=>{
    if(type==='estimate'){ setNewEstimate(emptyEstimate); setOpenAddEstimate(true);}
    if(type==='invoice'){ setNewInvoice(emptyInvoice); setOpenAddInvoice(true);}
    if(type==='payment'){ setNewPayment(emptyPayment); setOpenAddPayment(true);}
  };
  const closeDialog=(type)=>{
    if(type==='estimate') setOpenAddEstimate(false);
    if(type==='invoice') setOpenAddInvoice(false);
    if(type==='payment') setOpenAddPayment(false);
  };
  const saveNew=(type)=>{
    if(type==='estimate'){
      setEdit(prev=>({...prev,estimates:[...(prev.estimates||[]),newEstimate]}));
      closeDialog('estimate');
    }
    if(type==='invoice'){
      setEdit(prev=>({...prev,invoices:[...(prev.invoices||[]),newInvoice]}));
      closeDialog('invoice');
    }
    if(type==='payment'){
      setEdit(prev=>({...prev,payments:[...(prev.payments||[]),newPayment]}));
      closeDialog('payment');
    }
  };

  /* CSV */
  const exportCSV=()=>{
    const header=['No.','ステータス','期間','計上日','案件ID','案件名','部署','予算ID','企画ID','見積合計','請求合計','支払合計'].join(',');
    const body=filtered.map((e,i)=>[
      i+1,getStatus(e).label,getPeriod(e),e.date,e.projectId,e.projectName,e.department,e.budgetId,e.taskId,
      getSum(e.estimates),getSum(e.invoices),getSum(e.payments)
    ].join(',')).join('\n');
    const link=document.createElement('a');
    link.href=encodeURI('data:text/csv;charset=utf-8,'+header+'\n'+body);
    link.download='案件一覧.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // テーブル用スタイル
  const tableSx = {
    borderRadius: 2,
    boxShadow: 1,
    border: '1px solid #b0bec5',
    mb: 2,
    background: '#fff',
    '& table': {
      borderCollapse: 'separate',
      borderSpacing: 0
    },
    '& th, & td': {
      borderRight: '1px solid #b0bec5'
    },
    '& th:last-of-type, & td:last-of-type': {
      borderRight: 'none'
    },
    '& .MuiTableHead-root th': {
      background: '#e3eafc',
      fontWeight: 'bold',
      fontSize: 15,
      borderBottom: '2px solid #90caf9',
      color: '#1a237e',
      letterSpacing: 0.5,
      padding: '8px 12px',
      position: 'sticky',
      top: 0,
      zIndex: 2,
      textAlign: 'center'
    },
    '& .MuiTableBody-root td': {
      background: '#fff',
      fontSize: 13,
      borderBottom: '1px solid #b0bec5',
      borderRight: '1px solid #b0bec5',
      padding: '7px 10px'
    },
    '& .MuiTableRow-root:nth-of-type(even) td': {
      background: '#f6f9fc'
    },
    '& .MuiTableRow-root:hover td': {
      background: '#e3f2fd'
    },
    '& .amount-cell': {
      color: '#1976d2',
      fontWeight: 700,
      textAlign: 'right'
    },
    '& .MuiTableCell-root': {
      padding: '6px 10px'
    },
    '&::-webkit-scrollbar': {
      height: 8,
      width: 8
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e0e0e0',
      borderRadius: 4
    }
  };

  // 案件一覧テーブルのカラム幅指定
  const projectTableCellSx = [
    {width: 48, textAlign: 'center'}, // No.
    {width: 100, textAlign: 'center'}, // ステータス
    {width: 160, textAlign: 'center'}, // 期間
    {width: 100, textAlign: 'center'}, // 計上日
    {width: 90, textAlign: 'center'}, // 案件ID
    {width: 160, textAlign: 'center'}, // 案件名
    {width: 120, textAlign: 'center'}, // 部署
    {width: 90, textAlign: 'center'}, // 予算ID
    {width: 90, textAlign: 'center'}, // 企画ID
    {width: 110, textAlign:'right'}, // 見積合計
    {width: 110, textAlign:'right'}, // 請求合計
    {width: 110, textAlign:'right'}  // 支払合計
  ];

  return (
    <Paper sx={{p:2, background:'#ffffff', borderRadius:3, boxShadow:'0 2px 8px #e3eafc'}}>
      <Typography variant="h6" gutterBottom sx={{fontWeight:700, color:'#1976d2', letterSpacing:1, mb:2}}>
        <MaterialUI.Icon sx={{verticalAlign:'middle', mr:1}}>folder_open</MaterialUI.Icon>
        案件一覧（進捗管理）
      </Typography>

      {/* ---------- フィルタ ---------- */}
      <Box sx={{display:'flex',flexWrap:'wrap',gap:1,mb:2, alignItems:'center'}}>
        {['ALL','見積完了','請求完了','支払完了'].map(v=>(
          <Chip key={v} label={v==='ALL'?'全て':v}
            color={statusFilter===v?'primary':'default'}
            variant={statusFilter===v?'filled':'outlined'}
            size="small" onClick={()=>setStatusFilter(v)}
            sx={{fontWeight:statusFilter===v?700:400, fontSize:13}}
          />
        ))}
        <FormControl size="small" sx={{minWidth:120}}>
          <InputLabel>部署</InputLabel>
          <Select value={departmentFilter} label="部署" onChange={e=>setDepartmentFilter(e.target.value)}>
            <MenuItem value="">全て</MenuItem>
            {departmentList.map(dep=><MenuItem key={dep} value={dep}>{dep}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{minWidth:140}}>
          <InputLabel>案件名</InputLabel>
          <Select value={projectFilter} label="案件名" onChange={e=>setProjectFilter(e.target.value)}>
            <MenuItem value="">全て</MenuItem>
            {projectList.map(p=><MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" size="small" onClick={exportCSV} sx={{ml:'auto', fontWeight:700, boxShadow:'none'}}>
          <MaterialUI.Icon sx={{mr:0.5}}>download</MaterialUI.Icon>エクスポート
        </Button>
      </Box>

      {/* ---------- 一覧テーブル ---------- */}
      <TableContainer sx={{maxHeight:440,overflowX:'auto', ...tableSx}}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {['No.','ステータス','期間','計上日','案件ID','案件名','部署','予算ID','企画ID','見積合計','請求合計','支払合計']
                .map((h,idx)=>
                  <TableCell key={h} sx={projectTableCellSx[idx]}>{h}</TableCell>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((e,i)=>(
              <TableRow key={e.id} hover sx={{cursor:'pointer', transition:'background 0.2s'}} onClick={()=>handleRowClick(e)}>
                <TableCell sx={projectTableCellSx[0]}>{i+1}</TableCell>
                <TableCell sx={projectTableCellSx[1]}>
                  <Chip label={getStatus(e).label} color={getStatus(e).color} size="small" sx={{fontWeight:600}}/>
                </TableCell>
                <TableCell sx={projectTableCellSx[2]}>{getPeriod(e)}</TableCell>
                <TableCell sx={projectTableCellSx[3]}>{e.date}</TableCell>
                <TableCell sx={projectTableCellSx[4]}>{e.projectId}</TableCell>
                <TableCell sx={projectTableCellSx[5]}>{e.projectName}</TableCell>
                <TableCell sx={projectTableCellSx[6]}>{e.department}</TableCell>
                <TableCell sx={projectTableCellSx[7]}>{e.budgetId}</TableCell>
                <TableCell sx={projectTableCellSx[8]}>{e.taskId}</TableCell>
                <TableCell sx={projectTableCellSx[9]}>{getSum(e.estimates).toLocaleString()}</TableCell>
                <TableCell sx={projectTableCellSx[10]}>{getSum(e.invoices).toLocaleString()}</TableCell>
                <TableCell sx={projectTableCellSx[11]}>{getSum(e.payments).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ---------- 詳細モーダル ---------- */}
      <Dialog open={!!selected} onClose={handleDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle>案件詳細・編集</DialogTitle>
        <DialogContent dividers sx={{pt:2}}>
          {edit && (
            <>
              {/* ヘッダー部 */}
              <Grid container spacing={2} sx={{mb:3}}>
                {[
                  {l:'ID',f:'id',ro:true},{l:'計上日',f:'date',type:'date'},
                  {l:'案件ID',f:'projectId'},{l:'案件名',f:'projectName'},{l:'部署',f:'department'},
                  {l:'予算ID',f:'budgetId'},{l:'企画ID',f:'taskId'}
                ].map(({l,f,type,ro})=>(
                  <Grid item xs={12} sm={6} md={4} key={f}>
                    <TextField label={l} fullWidth size="small"
                      value={edit[f]} type={type||'text'}
                      InputProps={ro?{readOnly:true}:undefined}
                      InputLabelProps={type==='date'?{shrink:true}:undefined}
                      onChange={e=>changeHeader(f,e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* ---------- 見積テーブル ---------- */}
              <Typography variant="subtitle2" sx={{mb:1, fontWeight:700, color:'#1976d2'}}>見積一覧</Typography>
              <TableContainer sx={{maxHeight:240, ...tableSx}}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['見積ID','日付','見積名','負担部署','勘定科目','金額','取引先','取引先見積ID','操作']
                        .map((h,idx)=>
                          <TableCell key={h} sx={{
                            width: [100, 100, 160, 120, 110, 110, 140, 120, 110][idx],
                            minWidth: [80, 80, 120, 90, 90, 90, 100, 90, 80][idx],
                            textAlign: idx===5?'right':'left'
                          }}>{h}</TableCell>
                        )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(edit.estimates||[]).map((est,i)=>(
                      <TableRow key={i}>
                        {[
                          {f:'estimateId',w:100},{f:'date',t:'date',w:100},{f:'estimateName',w:160},
                          {f:'department',w:120},{f:'account',w:110},
                          {f:'amount',t:'number',className:'amount-cell',w:110},
                          {f:'vendor',w:140},{f:'vendorEstimateId',w:120}
                        ].map(({f,t,className,w})=>(
                          <TableCell key={f} className={className} sx={{width:w,minWidth:w,textAlign:className?'right':'left'}}>
                            <TextField fullWidth size="small" type={t||'text'}
                              value={est[f]} InputLabelProps={t==='date'?{shrink:true}:undefined}
                              onChange={e=>changeArray('estimates',i,f,t==='number'?Number(e.target.value):e.target.value)}
                              sx={className ? {input: {textAlign: 'right'}} : undefined}
                            />
                          </TableCell>
                        ))}
                        <TableCell sx={{width:110,minWidth:80}}>
                          <Box sx={{display:'flex',gap:1}}>
                            <MaterialUI.Tooltip title="削除">
                              <Button size="small" color="error" variant="outlined" sx={{minWidth:32,p:0.5}} onClick={()=>removeArrayItem('estimates',i)}>
                                <MaterialUI.Icon fontSize="small">delete</MaterialUI.Icon>
                              </Button>
                            </MaterialUI.Tooltip>
                            <MaterialUI.Tooltip title="請求作成">
                              <Button size="small" variant="outlined" sx={{minWidth:32,p:0.5}} onClick={()=>createInvoiceFromEstimate(est)}>
                                <MaterialUI.Icon fontSize="small">receipt_long</MaterialUI.Icon>
                              </Button>
                            </MaterialUI.Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button size="small" sx={{mb:3}} variant="outlined" startIcon={<MaterialUI.Icon>add</MaterialUI.Icon>} onClick={()=>openAddDialog('estimate')}>見積を追加</Button>

              {/* ---------- 請求テーブル ---------- */}
              <Typography variant="subtitle2" sx={{mb:1, fontWeight:700, color:'#1976d2'}}>請求一覧</Typography>
              <TableContainer sx={{maxHeight:240, ...tableSx}}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['請求ID','日付','見積ID','支払日','請求名','負担部署','勘定科目','金額','取引先','取引先請求ID','操作']
                        .map((h,idx)=>
                          <TableCell key={h} sx={{
                            width: [100, 100, 100, 100, 160, 120, 110, 110, 140, 120, 110][idx],
                            minWidth: [80, 80, 80, 80, 120, 90, 90, 90, 100, 90, 80][idx],
                            textAlign: idx===7?'right':'left'
                          }}>{h}</TableCell>
                        )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(edit.invoices||[]).map((inv,i)=>(
                      <TableRow key={i}>
                        {[
                          {f:'invoiceId',w:100},{f:'date',t:'date',w:100},{f:'estimateId',w:100},
                          {f:'paymentDate',t:'date',w:100},{f:'invoiceName',w:160},{f:'department',w:120},
                          {f:'account',w:110},
                          {f:'amount',t:'number',className:'amount-cell',w:110},
                          {f:'vendor',w:140},{f:'vendorInvoiceId',w:120}
                        ].map(({f,t,className,w})=>(
                          <TableCell key={f} className={className} sx={{width:w,minWidth:w,textAlign:className?'right':'left'}}>
                            <TextField fullWidth size="small" type={t||'text'}
                              value={inv[f]} InputLabelProps={t==='date'?{shrink:true}:undefined}
                              onChange={e=>changeArray('invoices',i,f,t==='number'?Number(e.target.value):e.target.value)}
                              sx={className ? {input: {textAlign: 'right'}} : undefined}
                            />
                          </TableCell>
                        ))}
                        <TableCell sx={{width:110,minWidth:80}}>
                          <Box sx={{display:'flex',gap:1}}>
                            <MaterialUI.Tooltip title="削除">
                              <Button size="small" color="error" variant="outlined" sx={{minWidth:32,p:0.5}} onClick={()=>removeArrayItem('invoices',i)}>
                                <MaterialUI.Icon fontSize="small">delete</MaterialUI.Icon>
                              </Button>
                            </MaterialUI.Tooltip>
                            <MaterialUI.Tooltip title="支払作成">
                              <Button size="small" variant="outlined" sx={{minWidth:32,p:0.5}} onClick={()=>createPaymentFromInvoice(inv)}>
                                <MaterialUI.Icon fontSize="small">payments</MaterialUI.Icon>
                              </Button>
                            </MaterialUI.Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button size="small" sx={{mb:3}} variant="outlined" startIcon={<MaterialUI.Icon>add</MaterialUI.Icon>} onClick={()=>openAddDialog('invoice')}>請求を追加</Button>

              {/* ---------- 支払テーブル ---------- */}
              <Typography variant="subtitle2" sx={{mb:1, fontWeight:700, color:'#1976d2'}}>支払一覧</Typography>
              <TableContainer sx={{maxHeight:240, ...tableSx}}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['支払ID','日付','見積ID','請求ID','支払日','計上日','支払名','負担部署','勘定科目','金額','取引先','操作']
                        .map((h,idx)=>
                          <TableCell key={h} sx={{
                            width: [100, 100, 100, 100, 100, 100, 160, 120, 110, 110, 140, 110][idx],
                            minWidth: [80, 80, 80, 80, 80, 80, 120, 90, 90, 90, 100, 80][idx],
                            textAlign: idx===9?'right':'left'
                          }}>{h}</TableCell>
                        )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(edit.payments||[]).map((pay,i)=>(
                      <TableRow key={i}>
                        {[
                          {f:'paymentId',w:100},{f:'date',t:'date',w:100},{f:'estimateId',w:100},
                          {f:'invoiceId',w:100},{f:'paymentDate',t:'date',w:100},{f:'postingDate',t:'date',w:100},
                          {f:'paymentName',w:160},{f:'department',w:120},{f:'account',w:110},
                          {f:'amount',t:'number',className:'amount-cell',w:110},{f:'vendor',w:140}
                        ].map(({f,t,className,w})=>(
                          <TableCell key={f} className={className} sx={{width:w,minWidth:w,textAlign:className?'right':'left'}}>
                            <TextField fullWidth size="small" type={t||'text'}
                              value={pay[f]} InputLabelProps={t==='date'?{shrink:true}:undefined}
                              onChange={e=>changeArray('payments',i,f,t==='number'?Number(e.target.value):e.target.value)}
                              sx={className ? {input: {textAlign: 'right'}} : undefined}
                            />
                          </TableCell>
                        ))}
                        <TableCell sx={{width:110,minWidth:80}}>
                          <MaterialUI.Tooltip title="削除">
                            <Button size="small" color="error" variant="outlined" sx={{minWidth:32,p:0.5}} onClick={()=>removeArrayItem('payments',i)}>
                              <MaterialUI.Icon fontSize="small">delete</MaterialUI.Icon>
                            </Button>
                          </MaterialUI.Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button size="small" variant="outlined" startIcon={<MaterialUI.Icon>add</MaterialUI.Icon>} onClick={()=>openAddDialog('payment')}>支払を追加</Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>キャンセル</Button>
          <Button variant="contained" onClick={handleSave}>保存</Button>
        </DialogActions>
      </Dialog>

      {/* ---------- 追加モーダル群 ---------- */}
      {/* 見積追加 */}
      <Dialog open={openAddEstimate} onClose={()=>closeDialog('estimate')} maxWidth="sm" fullWidth>
        <DialogTitle>見積追加</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              {l:'見積ID',f:'estimateId'},{l:'日付',f:'date',t:'date'},{l:'見積名',f:'estimateName'},
              {l:'負担部署',f:'department'},{l:'勘定科目',f:'account'},{l:'金額',f:'amount',t:'number'},
              {l:'取引先',f:'vendor'},{l:'取引先見積ID',f:'vendorEstimateId'}
            ].map(({l,f,t})=>(
              <Grid item xs={12} sm={6} key={f}>
                <TextField label={l} fullWidth size="small" type={t||'text'}
                  value={newEstimate[f]} InputLabelProps={t==='date'?{shrink:true}:undefined}
                  onChange={e=>setNewEstimate(prev=>({...prev,[f]:t==='number'?Number(e.target.value):e.target.value}))}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>closeDialog('estimate')}>キャンセル</Button>
          <Button variant="contained" onClick={()=>saveNew('estimate')}>追加</Button>
        </DialogActions>
      </Dialog>

      {/* 請求追加 */}
      <Dialog open={openAddInvoice} onClose={()=>closeDialog('invoice')} maxWidth="sm" fullWidth>
        <DialogTitle>請求追加</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              {l:'請求ID',f:'invoiceId'},{l:'日付',f:'date',t:'date'},{l:'見積ID',f:'estimateId'},
              {l:'支払日',f:'paymentDate',t:'date'},{l:'請求名',f:'invoiceName'},{l:'負担部署',f:'department'},
              {l:'勘定科目',f:'account'},{l:'金額',f:'amount',t:'number'},{l:'取引先',f:'vendor'},
              {l:'取引先請求ID',f:'vendorInvoiceId'}
            ].map(({l,f,t})=>(
              <Grid item xs={12} sm={6} key={f}>
                <TextField label={l} fullWidth size="small" type={t||'text'}
                  value={newInvoice[f]} InputLabelProps={t==='date'?{shrink:true}:undefined}
                  onChange={e=>setNewInvoice(prev=>({...prev,[f]:t==='number'?Number(e.target.value):e.target.value}))}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>closeDialog('invoice')}>キャンセル</Button>
          <Button variant="contained" onClick={()=>saveNew('invoice')}>追加</Button>
        </DialogActions>
      </Dialog>

      {/* 支払追加 */}
      <Dialog open={openAddPayment} onClose={()=>closeDialog('payment')} maxWidth="sm" fullWidth>
        <DialogTitle>支払追加</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              {l:'支払ID',f:'paymentId'},{l:'日付',f:'date',t:'date'},{l:'見積ID',f:'estimateId'},
              {l:'請求ID',f:'invoiceId'},{l:'支払日',f:'paymentDate',t:'date'},{l:'計上日',f:'postingDate',t:'date'},
              {l:'支払名',f:'paymentName'},{l:'負担部署',f:'department'},{l:'勘定科目',f:'account'},{l:'金額',f:'amount',t:'number'},
              {l:'取引先',f:'vendor'}
            ].map(({l,f,t})=>(
              <Grid item xs={12} sm={6} key={f}>
                <TextField label={l} fullWidth size="small" type={t||'text'}
                  value={newPayment[f]} InputLabelProps={t==='date'?{shrink:true}:undefined}
                  onChange={e=>setNewPayment(prev=>({...prev,[f]:t==='number'?Number(e.target.value):e.target.value}))}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>closeDialog('payment')}>キャンセル</Button>
          <Button variant="contained" onClick={()=>saveNew('payment')}>追加</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

window.ExpenseTab = ProjectTab;
