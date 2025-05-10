// ========================  共通 import  ========================
const {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
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
  IconButton
} = MaterialUI;

// ========================  ステータス定義  ======================
const estimateStatusList = [
  { value: "draft",    label: "作成中",   color: "default" },
  { value: "pending",  label: "承認待ち", color: "warning" },
  { value: "approved", label: "承認済",   color: "success" }
];
const billingStatusList = [
  { value: "unbilled", label: "未請求", color: "default" },
  { value: "billed",   label: "請求済", color: "info" }
];
const paymentStatusList = [
  { value: "unpaid",   label: "未払い", color: "default" },
  { value: "paid",     label: "支払済", color: "success" }
];

// Chip を生成するヘルパ
const chipOf = (list, value) =>
  list.find(s => s.value === value) ?? { label: "未定義", color: "default" };

// ========================  テーブル共通スタイル  ===============
const tableSx = {
  borderRadius: 2,
  boxShadow: 1,
  border: "1px solid #b0bec5",
  mb: 2,
  background: "#fff",
  "& table": { borderCollapse: "separate", borderSpacing: 0 },
  "& th, & td": { borderRight: "1px solid #b0bec5" },
  "& th:last-of-type, & td:last-of-type": { borderRight: "none" },
  "& .MuiTableHead-root th": {
    background: "#e3eafc",
    fontWeight: "bold",
    fontSize: 15,
    borderBottom: "2px solid #90caf9",
    color: "#1a237e",
    letterSpacing: 0.5,
    padding: "8px 12px",
    position: "sticky",
    top: 0,
    zIndex: 2,
    textAlign: "center"
  },
  "& .MuiTableBody-root td": {
    background: "#fff",
    fontSize: 13,
    borderBottom: "1px solid #b0bec5",
    borderRight: "1px solid #b0bec5",
    padding: "7px 10px"
  },
  "& .MuiTableRow-root:nth-of-type(even) td": { background: "#f6f9fc" },
  "& .MuiTableRow-root:hover td": { background: "#e3f2fd" },
  "& .amount-cell": { color: "#1976d2", fontWeight: 700, textAlign: "right" },
  "& .MuiTableCell-root": { padding: "6px 10px" }
};

// 既存列（ステータス列を除く）の幅定義
const estimateTableCellSx = [
  { width: 100, textAlign: "center" }, // 見積ID
  { width: 100, textAlign: "center" }, // 日付
  { width: 160, textAlign: "center" }, // 見積名
  { width: 120, textAlign: "center" }, // 負担部署
  { width: 110, textAlign: "center" }, // 勘定科目
  { width: 110, textAlign: "right"  }, // 金額
  { width: 140, textAlign: "center" }, // 取引先
  { width: 120, textAlign: "center" }, // 取引先見積ID
  { width: 120, textAlign: "center" }  // 担当部署（追加）
];

// ========================  EstimateTab  ========================
function EstimateTab() {
  // ---------- データ ----------
  const [estimates, setEstimates] = React.useState([
    {
      estimateId: "E001",
      date: "2024-06-03",
      estimateName: "什器購入見積A",
      department: "店舗開発部",
      account: "資産",
      amount: 800000,
      vendor: "○○建設",
      vendorEstimateId: "VE001-001",
      estimateStatus: "approved",
      billingStatus: "billed",
      paymentStatus: "unpaid",
      attachment: null,
      assigneeDepartment: "店舗開発部" // 例
    },
    {
      estimateId: "E002",
      date: "2024-06-11",
      estimateName: "工事見積",
      department: "サイト開発部",
      account: "工事費",
      amount: 300000,
      vendor: "△△設備",
      vendorEstimateId: "VE002-001",
      estimateStatus: "draft",
      billingStatus: "unbilled",
      paymentStatus: "unpaid",
      attachment: null,
      assigneeDepartment: "サイト開発部"
    }
  ]);

  // ---------- 編集・追加 ----------
  const emptyEstimate = {
    estimateId: "",
    date: "",
    estimateName: "",
    department: "",
    account: "",
    amount: 0,
    vendor: "",
    vendorEstimateId: "",
    estimateStatus: "draft",
    billingStatus: "unbilled",
    paymentStatus: "unpaid",
    attachment: null,
    assigneeDepartment: "" // 担当部署追加
  };
  const [selected, setSelected] = React.useState(null);
  const [edit,     setEdit]     = React.useState(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newEstimate, setNewEstimate] = React.useState(emptyEstimate);

  // ---------- ページネーション ----------
  const [page, setPage]               = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const totalCount = estimates.length;
  const startIdx   = totalCount ? page * rowsPerPage + 1 : 0;
  const endIdx     = Math.min((page + 1) * rowsPerPage, totalCount);
  const pagedEstimates = React.useMemo(
    () => estimates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [estimates, page, rowsPerPage]
  );

  // ---------- 行クリック ----------
  const handleRowClick = (row) => {
    setSelected(row);
    setEdit({ ...row });
  };

  // ---------- 共通変更ハンドラ ----------
  const chgEdit = (f) => (e) => setEdit(prev => ({ ...prev, [f]: f==="amount" ? +e.target.value : e.target.value }));
  const chgNew  = (f) => (e) => setNewEstimate(prev => ({ ...prev, [f]: f==="amount" ? +e.target.value : e.target.value }));

  // ---------- 添付 ----------
  const editFile = (e) => setEdit(prev => ({ ...prev, attachment: e.target.files?.[0] || null }));
  const newFile  = (e) => setNewEstimate(prev => ({ ...prev, attachment: e.target.files?.[0] || null }));

  // ---------- 保存 ----------
  const saveEdit = () => {
    setEstimates(prev => prev.map(r => r.estimateId === edit.estimateId ? edit : r));
    setSelected(null); setEdit(null);
  };

  const addEstimate = () => {
    setEstimates(prev => [...prev, newEstimate]);
    setNewEstimate(emptyEstimate);
    setIsAddOpen(false);
  };

  // ---------- CSV ----------
  const exportCSV = () => {
    const header = [
      "No.","見積ステータス","請求ステータス","支払ステータス","添付ファイル",
      "見積ID","日付","見積名","負担部署","勘定科目","金額","取引先","取引先見積ID","担当部署"
    ];
    const rows = estimates.map((e,i)=>([
      i+1,
      e.estimateStatus, e.billingStatus, e.paymentStatus, e.attachment?.name||"",
      e.estimateId, e.date, e.estimateName,
      e.department, e.account, e.amount,
      e.vendor, e.vendorEstimateId, e.assigneeDepartment||""
    ]));
    const csv = [header, ...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const url  = URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="見積管理.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const header = [
      "見積ステータス","請求ステータス","支払ステータス","添付ファイル",
      "見積ID","日付","見積名","負担部署","勘定科目","金額","取引先","取引先見積ID","担当部署"
    ];
    const tmpl  = header.join(",") + "\n" + header.map(()=> "").join(",") + "\n";
    const blob  = new Blob([tmpl], {type:"text/csv;charset=utf-8"});
    const url   = URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="見積インポートテンプレート.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (e) => {
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload = (ev)=>{
      const lines=(ev.target.result??"").trim().split("\n").slice(1);
      const recs = lines.map(line=>{
        const [
          estSt,billSt,paySt,att,
          estimateId,date,estimateName,department,account,amount,vendor,vendorEstimateId,assigneeDepartment
        ] = line.split(",");
        return {
          estimateStatus:estSt||"draft",
          billingStatus:billSt||"unbilled",
          paymentStatus:paySt||"unpaid",
          attachment:null,
          estimateId,date,estimateName,department,account,
          amount:+amount||0,vendor,vendorEstimateId,
          assigneeDepartment: assigneeDepartment||""
        };
      });
      setEstimates(prev=>[...prev,...recs]);
    };
    reader.readAsText(file,"utf-8");
    e.target.value=null;
  };

  // ---------- Chip for 請求額条件 (従来ロジック) ----------
  const getAmountChip = (row) =>
    row.amount >= 500000 ? {label:"請求済",color:"success"} : {label:"未請求",color:"default"};

  // =======================  Render  ===========================
  return (
    <Paper sx={{p:2, mb:2}}>
      <Typography variant="h6" gutterBottom>見積管理</Typography>

      {/* 操作ボタン */}
      <Box sx={{mb:1, display:"flex", gap:1}}>
        <Button variant="contained" size="small" onClick={exportCSV}>エクスポート</Button>
        <label>
          <Button variant="contained" size="small" component="span">インポート</Button>
          <input hidden type="file" accept=".csv" onChange={importCSV}/>
        </label>
        <Button variant="contained" size="small" onClick={downloadTemplate}>テンプレートDL</Button>
        <Button variant="contained" size="small" onClick={()=>setIsAddOpen(true)}>新規追加</Button>
      </Box>

      {/* 一覧テーブル */}
      <TableContainer sx={{maxHeight:440, overflowX:"auto", ...tableSx}}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{width:48, textAlign:"center"}}>No.</TableCell>
              <TableCell sx={{width:120, textAlign:"center"}}>見積ステータス</TableCell>
              <TableCell sx={{width:120, textAlign:"center"}}>請求ステータス</TableCell>
              <TableCell sx={{width:120, textAlign:"center"}}>支払ステータス</TableCell>
              <TableCell sx={{width:140, textAlign:"center"}}>添付ファイル</TableCell>
              <TableCell sx={{width:80,  textAlign:"center"}}>金額条件</TableCell>
              {["見積ID","日付","見積名","負担部署","勘定科目","金額","取引先","取引先見積ID"]
                .map((h,i)=><TableCell key={h} sx={estimateTableCellSx[i]}>{h}</TableCell>)}
              <TableCell sx={{width:120, textAlign:"center"}}>担当部署</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedEstimates.map((row,i)=>(
              <TableRow key={row.estimateId} hover sx={{cursor:"pointer"}} onClick={()=>handleRowClick(row)}>
                <TableCell sx={{textAlign:"center"}}>{startIdx+i}</TableCell>
                <TableCell sx={{textAlign:"center"}}>
                  <Chip {...chipOf(estimateStatusList,row.estimateStatus)} size="small"/>
                </TableCell>
                <TableCell sx={{textAlign:"center"}}>
                  <Chip {...chipOf(billingStatusList,row.billingStatus)}  size="small"/>
                </TableCell>
                <TableCell sx={{textAlign:"center"}}>
                  <Chip {...chipOf(paymentStatusList,row.paymentStatus)}  size="small"/>
                </TableCell>
                <TableCell sx={{textAlign:"center"}}>
                  {row.attachment
                    ? <a href={URL.createObjectURL(row.attachment)} download={row.attachment.name}>{row.attachment.name}</a>
                    : "-"}
                </TableCell>
                <TableCell sx={{textAlign:"center"}}>
                  <Chip {...getAmountChip(row)} size="small"/>
                </TableCell>
                <TableCell sx={estimateTableCellSx[0]}>{row.estimateId}</TableCell>
                <TableCell sx={estimateTableCellSx[1]}>{row.date}</TableCell>
                <TableCell sx={estimateTableCellSx[2]}>{row.estimateName}</TableCell>
                <TableCell sx={estimateTableCellSx[3]}>{row.department}</TableCell>
                <TableCell sx={estimateTableCellSx[4]}>{row.account}</TableCell>
                <TableCell className="amount-cell" sx={estimateTableCellSx[5]}>{row.amount.toLocaleString()}</TableCell>
                <TableCell sx={estimateTableCellSx[6]}>{row.vendor}</TableCell>
                <TableCell sx={estimateTableCellSx[7]}>{row.vendorEstimateId}</TableCell>
                <TableCell sx={{width:120, textAlign:"center"}}>{row.assigneeDepartment||"-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ページネーション */}
      <Box sx={{display:"flex", alignItems:"center", justifyContent:"flex-end", gap:1, mb:1}}>
        <Box sx={{display:"flex", alignItems:"center"}}>
          <Typography variant="body2">1ページあたり：</Typography>
          <Select size="small" value={rowsPerPage}
                  onChange={e=>{setRowsPerPage(+e.target.value); setPage(0);}}
                  sx={{ml:1, width:64}}>
            {[10,20,30,50].map(n=><MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </Box>
        <Typography variant="body2">{startIdx}～{endIdx}件／全 {totalCount} 件</Typography>
        <IconButton size="small" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>‹</IconButton>
        <IconButton size="small" onClick={()=>setPage(p=>Math.min(Math.ceil(totalCount/rowsPerPage)-1,p+1))}
                    disabled={page>=Math.ceil(totalCount/rowsPerPage)-1}>›</IconButton>
      </Box>

      {/* 編集ダイアログ */}
      <Dialog open={!!selected} onClose={()=>{setSelected(null); setEdit(null);}} fullWidth maxWidth="xs">
        <DialogTitle>見積詳細・編集</DialogTitle>
        {edit && (
          <DialogContent sx={{display:"flex", flexDirection:"column", gap:2, mt:1}}>
            <TextField label="見積ID" value={edit.estimateId} InputProps={{readOnly:true}} fullWidth margin="dense"/>
            <TextField label="日付" type="date" value={edit.date} onChange={chgEdit("date")}
                       fullWidth margin="dense" InputLabelProps={{shrink:true}}/>
            <TextField label="見積名" value={edit.estimateName} onChange={chgEdit("estimateName")} fullWidth margin="dense"/>
            <TextField label="負担部署" value={edit.department} onChange={chgEdit("department")} fullWidth margin="dense"/>
            <TextField label="勘定科目" value={edit.account} onChange={chgEdit("account")} fullWidth margin="dense"/>
            <TextField label="金額" type="number" value={edit.amount} onChange={chgEdit("amount")} fullWidth margin="dense"/>
            <TextField label="取引先" value={edit.vendor} onChange={chgEdit("vendor")} fullWidth margin="dense"/>
            <TextField label="取引先見積ID" value={edit.vendorEstimateId} onChange={chgEdit("vendorEstimateId")}
                       fullWidth margin="dense"/>
            <TextField label="担当部署" value={edit.assigneeDepartment||""} onChange={chgEdit("assigneeDepartment")} fullWidth margin="dense"/>

            {/* ステータス 3種 */}
            {[
              {lbl:"見積ステータス", field:"estimateStatus", list:estimateStatusList},
              {lbl:"請求ステータス", field:"billingStatus", list:billingStatusList},
              {lbl:"支払ステータス", field:"paymentStatus", list:paymentStatusList}
            ].map(({lbl, field, list})=>(
              <FormControl fullWidth margin="dense" key={field}>
                <InputLabel>{lbl}</InputLabel>
                <Select label={lbl} value={edit[field]} onChange={e=>chgEdit(field)(e)}>
                  {list.map(s=><MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
            ))}

            {/* 添付 */}
            <label>
              <Button component="span" size="small">見積書添付</Button>
              <input type="file" hidden onChange={editFile}/>
            </label>
            {edit.attachment && <Typography variant="body2">{edit.attachment.name}</Typography>}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={()=>{setSelected(null); setEdit(null);}}>キャンセル</Button>
          <Button onClick={saveEdit} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 新規追加ダイアログ */}
      <Dialog open={isAddOpen} onClose={()=>setIsAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>見積データ追加</DialogTitle>
        <DialogContent sx={{display:"flex", flexDirection:"column", gap:2, mt:1}}>
          <TextField label="見積ID" value={newEstimate.estimateId} onChange={chgNew("estimateId")} fullWidth margin="dense"/>
          <TextField label="日付" type="date" value={newEstimate.date} onChange={chgNew("date")}
                     fullWidth margin="dense" InputLabelProps={{shrink:true}}/>
          <TextField label="見積名" value={newEstimate.estimateName} onChange={chgNew("estimateName")} fullWidth margin="dense"/>
          <TextField label="負担部署" value={newEstimate.department} onChange={chgNew("department")} fullWidth margin="dense"/>
          <TextField label="勘定科目" value={newEstimate.account} onChange={chgNew("account")} fullWidth margin="dense"/>
          <TextField label="金額" type="number" value={newEstimate.amount} onChange={chgNew("amount")} fullWidth margin="dense"/>
          <TextField label="取引先" value={newEstimate.vendor} onChange={chgNew("vendor")} fullWidth margin="dense"/>
          <TextField label="取引先見積ID" value={newEstimate.vendorEstimateId} onChange={chgNew("vendorEstimateId")}
                     fullWidth margin="dense"/>
          <TextField label="担当部署" value={newEstimate.assigneeDepartment||""} onChange={chgNew("assigneeDepartment")} fullWidth margin="dense"/>

          {[
            {lbl:"見積ステータス", field:"estimateStatus", list:estimateStatusList},
            {lbl:"請求ステータス", field:"billingStatus", list:billingStatusList},
            {lbl:"支払ステータス", field:"paymentStatus", list:paymentStatusList}
          ].map(({lbl, field, list})=>(
            <FormControl fullWidth margin="dense" key={field}>
              <InputLabel>{lbl}</InputLabel>
              <Select label={lbl} value={newEstimate[field]} onChange={chgNew(field)}>
                {list.map(s=><MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
          ))}

          <label>
            <Button component="span" size="small">見積書添付</Button>
            <input type="file" hidden onChange={newFile}/>
          </label>
          {newEstimate.attachment && <Typography variant="body2">{newEstimate.attachment.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setIsAddOpen(false)}>キャンセル</Button>
          <Button onClick={addEstimate} variant="contained">追加</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

window.EstimateTab = EstimateTab;
