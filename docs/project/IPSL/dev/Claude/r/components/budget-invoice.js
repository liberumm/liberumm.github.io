/**************************************************************************
 * InvoiceTab – 請求管理タブ（見積ステータス列追加版）
 *  - テーブル 2 列目に「見積ステータス」を追加
 *  - 行クリックで編集（見積ステータス含む）
 *  - CSV エクスポート／インポート／テンプレートDL にも反映
 **************************************************************************/

const {
  Box, Paper, Typography,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  IconButton, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel
} = MaterialUI;

/* ステータス定義 */
const estimateStatusList = [
  { value: "draft",    label: "作成中",   color: "default" },
  { value: "pending",  label: "承認待ち", color: "warning" },
  { value: "approved", label: "承認済",   color: "success" }
];
const invoiceStatusList = [
  { value: "sent",   label: "送付済", color: "info"    },
  { value: "closed", label: "締済",   color: "success" }
];
const paymentStatusList = [
  { value: "unpaid", label: "未払い", color: "default" },
  { value: "paid",   label: "支払済", color: "success" }
];
const chipOf = (list, val) =>
  list.find(s => s.value === val) ?? { label: "未定義", color: "default" };

/* テーブルスタイル */
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
    padding: "7px 10px"
  },
  "& .MuiTableRow-root:nth-of-type(even) td": { background: "#f6f9fc" },
  "& .MuiTableRow-root:hover td": { background: "#e3f2fd" },
  "& .amount-cell": { color: "#1976d2", fontWeight: 700, textAlign: "right" },
  "& .MuiTableCell-root": { padding: "6px 10px" }
};

/* 各列幅 */
const cellSx = [
  { width: 100, textAlign: "center" }, // 請求ID
  { width: 100, textAlign: "center" }, // 日付
  { width: 100, textAlign: "center" }, // 見積ID
  { width: 100, textAlign: "center" }, // 支払日
  { width: 160, textAlign: "center" }, // 請求名
  { width: 120, textAlign: "center" }, // 負担部署
  { width: 110, textAlign: "center" }, // 勘定科目
  { width: 110, textAlign: "right" },  // 金額
  { width: 140, textAlign: "center" }, // 取引先
  { width: 120, textAlign: "center" }, // 取引先請求ID
  { width: 120, textAlign: "center" }  // 担当部署（追加）
];

/* メインコンポーネント */
function InvoiceTab() {
  /* 一覧データに estimateStatus を追加 */
  const [invoices, setInvoices] = React.useState([
    {
      invoiceId: "I001",
      date: "2024-06-05",
      estimateId: "E001",
      paymentDate: "2024-06-10",
      invoiceName: "什器請求A",
      department: "店舗開発部",
      account: "資産",
      amount: 800000,
      vendor: "○○建設",
      vendorInvoiceId: "VI001-001",
      estimateStatus: "approved",
      invoiceStatus: "sent",
      paymentStatus: "unpaid",
      file: null,
      fileUrl: "",
      assigneeDepartment: "店舗開発部" // 例
    },
    {
      invoiceId: "I002",
      date: "2024-06-13",
      estimateId: "E002",
      paymentDate: "2024-06-18",
      invoiceName: "工事請求",
      department: "サイト開発部",
      account: "工事費",
      amount: 300000,
      vendor: "△△設備",
      vendorInvoiceId: "VI002-001",
      estimateStatus: "draft",
      invoiceStatus: "draft",
      paymentStatus: "unpaid",
      file: null,
      fileUrl: "",
      assigneeDepartment: "サイト開発部"
    }
  ]);

  /* ページング */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const totalCount = invoices.length;
  const startIdx = totalCount ? page * rowsPerPage + 1 : 0;
  const endIdx = Math.min((page + 1) * rowsPerPage, totalCount);
  const paged = React.useMemo(
    () => invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [invoices, page, rowsPerPage]
  );

  /* 編集・追加ダイアログ */
  const empty = {
    invoiceId: "", date: "", estimateId: "", paymentDate: "",
    invoiceName: "", department: "", account: "", amount: 0,
    vendor: "", vendorInvoiceId: "",
    estimateStatus: "draft", invoiceStatus: "draft", paymentStatus: "unpaid",
    file: null, fileUrl: "",
    assigneeDepartment: "" // 担当部署追加
  };
  const [edit, setEdit] = React.useState(null);
  const [newRow, setNewRow] = React.useState(empty);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  /* 変更ハンドラ */
  const chgEdit = (f) => (e) => setEdit(p => ({ ...p, [f]: f === "amount" ? +e.target.value : e.target.value }));
  const chgNew  = (f) => (e) => setNewRow(p => ({ ...p, [f]: f === "amount" ? +e.target.value : e.target.value }));

  const editFile = (e) => {
    const f = e.target.files?.[0] || null;
    setEdit(p => ({ ...p, file: f, fileUrl: f ? URL.createObjectURL(f) : "" }));
  };
  const addFile = (e) => {
    const f = e.target.files?.[0] || null;
    setNewRow(p => ({ ...p, file: f, fileUrl: f ? URL.createObjectURL(f) : "" }));
  };

  const saveEdit = () => {
    setInvoices(prev => prev.map(r => r.invoiceId === edit.invoiceId ? edit : r));
    setEdit(null);
  };
  const addInvoice = () => {
    setInvoices(prev => [...prev, newRow]);
    setNewRow(empty);
    setIsAddOpen(false);
  };

  /* CSV 処理 */
  const exportCSV = () => {
    const header = [
      "見積ステータス","請求ステータス","支払ステータス","添付ファイル",
      "請求ID","日付","見積ID","支払日","請求名","負担部署","勘定科目","金額","取引先","取引先請求ID","担当部署"
    ];
    const rows = invoices.map(r => [
      r.estimateStatus, r.invoiceStatus, r.paymentStatus, r.file?.name || "",
      r.invoiceId, r.date, r.estimateId, r.paymentDate, r.invoiceName,
      r.department, r.account, r.amount, r.vendor, r.vendorInvoiceId, r.assigneeDepartment || ""
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "請求管理.csv"; a.click();
    URL.revokeObjectURL(url);
  };
  const downloadTemplate = () => {
    const hd = [
      "見積ステータス","請求ステータス","支払ステータス","添付ファイル",
      "請求ID","日付","見積ID","支払日","請求名","負担部署","勘定科目","金額","取引先","取引先請求ID","担当部署"
    ];
    const tmpl = hd.join(",") + "\n" + hd.map(() => "").join(",") + "\n";
    const blob = new Blob([tmpl], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "請求インポートテンプレート.csv"; a.click();
    URL.revokeObjectURL(url);
  };
  const importCSV = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = (ev.target.result ?? "").trim().split("\n").slice(1);
      const recs = lines.map(l => {
        const [
          estSt, invSt, paySt, att,
          invoiceId, date, estimateId, paymentDate, invoiceName,
          department, account, amount, vendor, vendorInvoiceId, assigneeDepartment
        ] = l.split(",");
        return {
          estimateStatus: estSt || "draft",
          invoiceStatus: invSt  || "sent",
          paymentStatus: paySt  || "unpaid",
          file: null, fileUrl: "",
          invoiceId, date, estimateId, paymentDate, invoiceName,
          department, account, amount: Number(amount)||0, vendor, vendorInvoiceId,
          assigneeDepartment: assigneeDepartment || ""
        };
      });
      setInvoices(prev => [...prev, ...recs]);
    };
    reader.readAsText(file, "utf-8");
    e.target.value = "";
  };

  const getAmtChip = (r) =>
    r.amount >= 500000
      ? { label: "高額", color: "warning" }
      : { label: "通常", color: "default" };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>請求管理</Typography>

      {/* 操作ボタン */}
      <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
        <Button variant="contained" size="small" onClick={exportCSV}>エクスポート</Button>
        <Button variant="contained" size="small" onClick={() => setIsAddOpen(true)}>新規追加</Button>
        <label>
          <Button variant="contained" size="small" component="span">インポート</Button>
          <input hidden accept=".csv" type="file" onChange={importCSV} />
        </label>
        <Button variant="contained" size="small" onClick={downloadTemplate}>テンプレートDL</Button>
      </Box>

      {/* テーブル */}
      <TableContainer sx={{ maxHeight: 440, overflowX: "auto", ...tableSx }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48, textAlign: "center" }}>No.</TableCell>
              <TableCell sx={{ width:120, textAlign:"center" }}>見積ステータス</TableCell>
              <TableCell sx={{ width:120, textAlign:"center" }}>請求ステータス</TableCell>
              <TableCell sx={{ width:120, textAlign:"center" }}>支払ステータス</TableCell>
              <TableCell sx={{ width:140, textAlign:"center" }}>添付ファイル</TableCell>
              <TableCell sx={{ width:80, textAlign:"center" }}>金額区分</TableCell>
              {["請求ID","日付","見積ID","支払日","請求名","負担部署","勘定科目","金額","取引先","取引先請求ID"]
                .map((h,i)=><TableCell key={h} sx={cellSx[i]}>{h}</TableCell>)}
              {/* 担当部署列追加 */}
              <TableCell sx={{ width:120, textAlign:"center" }}>担当部署</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((r, i) => (
              <TableRow
                key={r.invoiceId + i}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => setEdit({ ...r })}
              >
                <TableCell sx={{ textAlign: "center" }}>{startIdx + i}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip {...chipOf(estimateStatusList, r.estimateStatus)} size="small" />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip {...chipOf(invoiceStatusList, r.invoiceStatus)} size="small" />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip {...chipOf(paymentStatusList, r.paymentStatus)} size="small" />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {r.file
                    ? <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">{r.file.name}</a>
                    : "-"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip {...getAmtChip(r)} size="small" />
                </TableCell>
                <TableCell sx={cellSx[0]}>{r.invoiceId}</TableCell>
                <TableCell sx={cellSx[1]}>{r.date}</TableCell>
                <TableCell sx={cellSx[2]}>{r.estimateId}</TableCell>
                <TableCell sx={cellSx[3]}>{r.paymentDate}</TableCell>
                <TableCell sx={cellSx[4]}>{r.invoiceName}</TableCell>
                <TableCell sx={cellSx[5]}>{r.department}</TableCell>
                <TableCell sx={cellSx[6]}>{r.account}</TableCell>
                <TableCell className="amount-cell" sx={cellSx[7]}>
                  {r.amount.toLocaleString()}
                </TableCell>
                <TableCell sx={cellSx[8]}>{r.vendor}</TableCell>
                <TableCell sx={cellSx[9]}>{r.vendorInvoiceId}</TableCell>
                {/* 担当部署セル追加 */}
                <TableCell sx={{ width:120, textAlign:"center" }}>{r.assigneeDepartment||"-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ページネーション */}
      <Box sx={{
        display: "flex", alignItems: "center",
        justifyContent: "flex-end", gap: 1, mt: 1
      }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">1ページ：</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
            sx={{ ml: 1, width: 64 }}
          >
            {[10, 20, 30, 50].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </Box>
        <Typography variant="body2">{startIdx}～{endIdx}件／全 {totalCount} 件</Typography>
        <IconButton size="small" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>‹</IconButton>
        <IconButton size="small"
          onClick={() => setPage(p => Math.min(Math.ceil(totalCount / rowsPerPage) - 1, p + 1))}
          disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
        >›</IconButton>
      </Box>

      {/* 編集ダイアログ */}
      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth maxWidth="sm">
        <DialogTitle>請求詳細・編集</DialogTitle>
        {edit && (
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {[
              { f: "invoiceId", label: "請求ID" },
              { f: "date", label: "日付", type: "date" },
              { f: "estimateId", label: "見積ID" },
              { f: "paymentDate", label: "支払日", type: "date" },
              { f: "invoiceName", label: "請求名" },
              { f: "department", label: "負担部署" },
              { f: "account", label: "勘定科目" },
              { f: "amount", label: "金額", type: "number" },
              { f: "vendor", label: "取引先" },
              { f: "vendorInvoiceId", label: "取引先請求ID" }
            ].map(({ f, label, type }) => (
              <TextField
                key={f}
                fullWidth margin="dense"
                label={label}
                type={type || "text"}
                InputLabelProps={type === "date" ? { shrink: true } : undefined}
                value={edit[f]}
                onChange={chgEdit(f)}
              />
            ))}

            {/* ステータス選択 */}
            {[
              { lbl: "見積ステータス",      fld: "estimateStatus", list: estimateStatusList },
              { lbl: "請求ステータス",      fld: "invoiceStatus",  list: invoiceStatusList  },
              { lbl: "支払ステータス",      fld: "paymentStatus",  list: paymentStatusList  }
            ].map(({ lbl, fld, list }) => (
              <FormControl fullWidth margin="dense" key={fld}>
                <InputLabel>{lbl}</InputLabel>
                <Select label={lbl} value={edit[fld]} onChange={chgEdit(fld)}>
                  {list.map(s => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            {/* 添付ファイル */}
            <label>
              <Button component="span" size="small">添付変更</Button>
              <input type="file" hidden accept=".pdf,.jpg,.png" onChange={editFile} />
            </label>
            {edit.file && <Typography variant="body2">{edit.file.name}</Typography>}
            <TextField
              label="担当部署"
              fullWidth margin="dense"
              value={edit.assigneeDepartment||""}
              onChange={chgEdit("assigneeDepartment")}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setEdit(null)}>キャンセル</Button>
          <Button onClick={saveEdit} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 新規追加ダイアログ */}
      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>請求データ追加</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {[
            { f: "invoiceId", label: "請求ID" },
            { f: "date", label: "日付", type: "date" },
            { f: "estimateId", label: "見積ID" },
            { f: "paymentDate", label: "支払日", type: "date" },
            { f: "invoiceName", label: "請求名" },
            { f: "department", label: "負担部署" },
            { f: "account", label: "勘定科目" },
            { f: "amount", label: "金額", type: "number" },
            { f: "vendor", label: "取引先" },
            { f: "vendorInvoiceId", label: "取引先請求ID" }
          ].map(({ f, label, type }) => (
            <TextField
              key={f}
              fullWidth margin="dense"
              label={label}
              type={type || "text"}
              InputLabelProps={type === "date" ? { shrink: true } : undefined}
              value={newRow[f]}
              onChange={chgNew(f)}
            />
          ))}

          {/* ステータス */}
          {[
            { lbl: "見積ステータス", fld: "estimateStatus", list: estimateStatusList },
            { lbl: "請求ステータス", fld: "invoiceStatus",  list: invoiceStatusList  },
            { lbl: "支払ステータス", fld: "paymentStatus",  list: paymentStatusList  }
          ].map(({ lbl, fld, list }) => (
            <FormControl fullWidth margin="dense" key={fld}>
              <InputLabel>{lbl}</InputLabel>
              <Select label={lbl} value={newRow[fld]} onChange={chgNew(fld)}>
                {list.map(s => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {/* 添付 */}
          <label>
            <Button component="span" size="small">添付ファイル</Button>
            <input type="file" hidden accept=".pdf,.jpg,.png" onChange={addFile} />
          </label>
          {newRow.file && <Typography variant="body2">{newRow.file.name}</Typography>}
          <TextField
            label="担当部署"
            fullWidth margin="dense"
            value={newRow.assigneeDepartment||""}
            onChange={chgNew("assigneeDepartment")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddOpen(false)}>キャンセル</Button>
          <Button onClick={addInvoice} variant="contained">追加</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

window.InvoiceTab = InvoiceTab;
