// components/DimensionSpreadsheet.js
function DimensionSpreadsheet(props) {
  const { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } = MaterialUI;

  // フィルタリングされたデータを取得
  const filteredData = React.useMemo(() => {
      return props.data.filter(item => {
          const matchesProduct = props.filters.product === '' || item.productName.includes(props.filters.product);
          const matchesStatus = props.filters.status === '' || item.status.includes(props.filters.status);
          const matchesStore = props.filters.store === '' || item.store.includes(props.filters.store);
          return matchesProduct && matchesStatus && matchesStore;
      });
  }, [props.filters, props.data]);

  // ステータスに応じたカラー
  const statusColor = {
      "予定": "default",
      "出荷中": "warning",
      "完了": "success",
  };

  // 在庫価値と粗利益の計算
  const enrichedData = React.useMemo(() => {
      let inventoryLevel = 0;
      const dataWithInventory = filteredData.map(item => {
          inventoryLevel += item.quantity; // 納品
          // ここでは簡易的に納品後すぐに販売する前提
          // 実際の在庫回転率を考慮するには販売データとのリンクが必要
          const grossProfit = item.quantity * (item.sellingPrice - item.costPerUnit);
          const inventoryValue = inventoryLevel * item.costPerUnit;
          return {
              ...item,
              grossProfit,
              inventoryValue
          };
      });
      return dataWithInventory;
  }, [filteredData]);

  // Excelエクスポート機能の追加
  const handleExportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(enrichedData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "dimension_spreadsheet.xlsx");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleExportCSV = () => {
      const csvData = Papa.unparse(enrichedData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "dimension_spreadsheet.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
      <Box component={Paper} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
              データスプレッドシート
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleExportCSV}>
                  CSVとしてエクスポート
              </Button>
              <Button variant="contained" color="primary" onClick={handleExportExcel}>
                  Excelとしてエクスポート
              </Button>
          </Box>
          <TableContainer>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell>商品名</TableCell>
                          <TableCell align="right">数量</TableCell>
                          <TableCell>納品予定日</TableCell>
                          <TableCell>ステータス</TableCell>
                          <TableCell>店舗</TableCell>
                          <TableCell align="right">在庫価値 (円)</TableCell>
                          <TableCell align="right">粗利益 (円)</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {enrichedData.map((row) => (
                          <TableRow key={row.id}>
                              <TableCell>{row.productName}</TableCell>
                              <TableCell align="right">{row.quantity}</TableCell>
                              <TableCell>{row.expectedDate}</TableCell>
                              <TableCell>
                                  <Chip label={row.status} color={statusColor[row.status]} />
                              </TableCell>
                              <TableCell>{row.store}</TableCell>
                              <TableCell align="right">{row.inventoryValue.toLocaleString()}円</TableCell>
                              <TableCell align="right">{row.grossProfit.toLocaleString()}円</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </Box>
  );
}

window.DimensionSpreadsheet = DimensionSpreadsheet;
