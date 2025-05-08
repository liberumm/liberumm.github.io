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
  }
};
const invoiceTableCellSx = [
  {width: 100, textAlign: 'center'}, // 請求ID
  {width: 100, textAlign: 'center'}, // 日付
  {width: 100, textAlign: 'center'}, // 見積ID
  {width: 100, textAlign: 'center'}, // 支払日
  {width: 160, textAlign: 'center'}, // 請求名
  {width: 120, textAlign: 'center'}, // 負担部署
  {width: 110, textAlign: 'center'}, // 勘定科目
  {width: 110, textAlign:'right'}, // 金額
  {width: 140, textAlign: 'center'}, // 取引先
  {width: 120, textAlign: 'center'}  // 取引先請求ID
];

const InvoiceTab = () => {
  const [invoices] = React.useState([
    // 案件詳細の列構成に合わせてサンプルデータも拡張
    { invoiceId: 'I001', date: '2024-06-05', estimateId: 'E001', paymentDate: '2024-06-10', invoiceName: '什器請求A', department: '店舗開発部', account: '資産', amount: 800000, vendor: '○○建設', vendorInvoiceId: 'VI001-001' },
    { invoiceId: 'I002', date: '2024-06-13', estimateId: 'E002', paymentDate: '2024-06-18', invoiceName: '工事請求', department: 'サイト開発部', account: '工事費', amount: 300000, vendor: '△△設備', vendorInvoiceId: 'VI002-001' }
  ]);
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 20;

  // ページネーション用データ
  const pagedInvoices = React.useMemo(() => {
    return invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [invoices, page]);
  const totalCount = invoices.length;
  const startIdx = totalCount === 0 ? 0 : page * rowsPerPage + 1;
  const endIdx = Math.min((page + 1) * rowsPerPage, totalCount);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,No.,請求ID,日付,見積ID,支払日,請求名,負担部署,勘定科目,金額,取引先,取引先請求ID\n";
    invoices.forEach((i, index) => {
      const row = [
        index + 1,
        i.invoiceId,
        i.date,
        i.estimateId,
        i.paymentDate,
        i.invoiceName,
        i.department,
        i.account,
        i.amount,
        i.vendor,
        i.vendorInvoiceId
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "請求管理.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <MaterialUI.Paper sx={{ p: 2, mb: 2 }}>
      <MaterialUI.Typography variant="h6" gutterBottom>
        請求管理
      </MaterialUI.Typography>
      <MaterialUI.Button variant="contained" size="small" onClick={exportCSV} sx={{ mb: 1 }}>
        エクスポート
      </MaterialUI.Button>
      {/* 件数表示 */}
      <Box sx={{ mb: 1, fontSize: 14, color: '#555' }}>
        {startIdx} ～ {endIdx} 件を表示 ({totalCount} 件中)
      </Box>
      <MaterialUI.TableContainer sx={{ maxHeight: 440, overflowX: 'auto', ...tableSx }}>
        <MaterialUI.Table size="small" stickyHeader>
          <MaterialUI.TableHead>
            <MaterialUI.TableRow>
              <MaterialUI.TableCell sx={{ width: 48, textAlign: 'center' }}>No.</MaterialUI.TableCell>
              {['請求ID','日付','見積ID','支払日','請求名','負担部署','勘定科目','金額','取引先','取引先請求ID']
                .map((h,idx)=>
                  <MaterialUI.TableCell key={h} sx={invoiceTableCellSx[idx]}>{h}</MaterialUI.TableCell>
                )}
            </MaterialUI.TableRow>
          </MaterialUI.TableHead>
          <MaterialUI.TableBody>
            {pagedInvoices.map((i, index) => (
              <MaterialUI.TableRow key={i.invoiceId} hover>
                <MaterialUI.TableCell sx={{ width: 48, textAlign: 'center' }}>{page * rowsPerPage + index + 1}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[0]}>{i.invoiceId}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[1]}>{i.date}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[2]}>{i.estimateId}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[3]}>{i.paymentDate}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[4]}>{i.invoiceName}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[5]}>{i.department}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[6]}>{i.account}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[7]} className="amount-cell">{i.amount.toLocaleString()}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[8]}>{i.vendor}</MaterialUI.TableCell>
                <MaterialUI.TableCell sx={invoiceTableCellSx[9]}>{i.vendorInvoiceId}</MaterialUI.TableCell>
              </MaterialUI.TableRow>
            ))}
          </MaterialUI.TableBody>
        </MaterialUI.Table>
      </MaterialUI.TableContainer>
      {/* ページネーション */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
        <MaterialUI.Button
          size="small"
          onClick={() => setPage(0)}
          disabled={page === 0}
        >{"<<"}</MaterialUI.Button>
        <MaterialUI.Button
          size="small"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >{"<"}</MaterialUI.Button>
        <Box sx={{ mx: 1, fontSize: 14 }}>
          {page + 1} / {Math.max(1, Math.ceil(totalCount / rowsPerPage))}
        </Box>
        <MaterialUI.Button
          size="small"
          onClick={() => setPage(p => Math.min(Math.ceil(totalCount / rowsPerPage) - 1, p + 1))}
          disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
        >{">"}</MaterialUI.Button>
        <MaterialUI.Button
          size="small"
          onClick={() => setPage(Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1))}
          disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
        >{">>"}</MaterialUI.Button>
      </Box>
    </MaterialUI.Paper>
  );
};

window.InvoiceTab = InvoiceTab;