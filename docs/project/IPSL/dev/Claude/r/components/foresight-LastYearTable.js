// components/LastYearTable.js
function LastYearTable({ lastYearData, onDataUpdate }) {
  const {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Button,
    Collapse,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid
  } = MaterialUI;
  
  const parentColumns = ["年度合計", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月"];
  const LAST_YEAR_ROWS = [
    { label: "期首在庫_原価", key: "beginningCost" },
    { label: "期首在庫_売価", key: "beginningPrice" },
    { label: "売上高", key: "sales" },
    { label: "売上原価", key: "costOfGoodsSold" }, // 追加
    { label: "売上総利益", key: "grossProfit" },
    { label: "期中仕入_原価", key: "midPurchaseCost" },
    { label: "期中仕入_売価", key: "midPurchasePrice" },
    { label: "値上_売価", key: "priceIncrease" },
    { label: "値下_売価", key: "priceDecrease" },
    { label: "ロス率_売価", key: "lossRate" },
    { label: "リベート高_原価", key: "rebateCost" },
    { label: "期末在庫_原価", key: "endingCost" },
    { label: "期末在庫_売価", key: "endingPrice" },
    { label: "回転日数", key: "turnoverDays" }
  ];
  
  const [lastYearExpanded, setLastYearExpanded] = React.useState(true);
  const [viewMode, setViewMode] = React.useState('all');
  const [selectedStore, setSelectedStore] = React.useState('all');
  const [selectedDepartment, setSelectedDepartment] = React.useState('all');

  // ダミーデータ
  const stores = ['all', 'store1', 'store2', 'store3'];
  const departments = ['all', 'dept1', 'dept2', 'dept3'];

  const handleExport = () => {
    const csv = generateCSV(lastYearData);
    downloadCSV(csv, '昨年実績データ.csv');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const data = parseCSV(text);
          if (onDataUpdate) {
            onDataUpdate(data);
          }
        } catch (error) {
          console.error('データのインポートに失敗しました:', error);
          alert('データのインポートに失敗しました。');
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadTemplate = () => {
    const template = generateTemplateCSV();
    downloadCSV(template, '昨年実績テンプレート.csv');
  };

  const generateCSV = (data) => {
    const headers = ['項目', ...parentColumns.slice(1)];
    const rows = LAST_YEAR_ROWS.map(row => {
      const values = parentColumns.slice(1).map((_, index) => {
        const monthData = data[index + 1] || {};
        return monthData[row.key] || '';
      });
      return [row.label, ...values];
    });
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateTemplateCSV = () => {
    const headers = ['年度', '月', '店舗', '部門', ...LAST_YEAR_ROWS.map(row => row.label)];
    return headers.join(',');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const result = {};
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const year = values[0];
      const month = values[1];
      const store = values[2];
      const department = values[3];
      
      if (!result[store]) result[store] = {};
      if (!result[store][department]) result[store][department] = {};
      if (!result[store][department][month]) result[store][department][month] = {};
      
      for (let j = 4; j < headers.length; j++) {
        const key = LAST_YEAR_ROWS.find(row => row.label === headers[j])?.key;
        if (key) {
          result[store][department][month][key] = parseFloat(values[j]) || 0;
        }
      }
    }
    return result;
  };

  const filterData = (data) => {
    if (!data) return {};
    if (viewMode === 'all') return data;
    
    let filteredData = {};
    if (selectedStore !== 'all') {
      filteredData = { [selectedStore]: data[selectedStore] || {} };
    }
    if (selectedDepartment !== 'all') {
      Object.keys(filteredData).forEach(store => {
        filteredData[store] = { [selectedDepartment]: filteredData[store][selectedDepartment] || {} };
      });
    }
    return filteredData;
  };

  return (
    <div>
      <Paper style={{ marginBottom: 20, padding: 20, overflowX: "auto" }}>
        {/* コントロール群 */}
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: 20 }}>
          <Grid item xs={12} sm={12} md={12}>
            <Button variant="contained" fullWidth onClick={() => setLastYearExpanded(prev => !prev)}>
              {lastYearExpanded ? "昨年実績テーブルを折りたたむ" : "昨年実績テーブルを展開"}
            </Button>
          </Grid>
        </Grid>

        {/* テーブル部分 */}
        <Collapse in={lastYearExpanded}>
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: 20 }}>
          <Grid item xs={12} sm={4} md={4}>
            <Button variant="contained" fullWidth onClick={handleExport}>
              データのエクスポート
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Button variant="contained" fullWidth component="label">
              データのインポート
              <input type="file" hidden accept=".csv" onChange={handleImport} />
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Button variant="contained" fullWidth onClick={downloadTemplate}>
              テンプレートのダウンロード
            </Button>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <FormControl fullWidth>
              <InputLabel>表示モード</InputLabel>
              <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                <MenuItem value="all">全体</MenuItem>
                <MenuItem value="byStore">店舗別</MenuItem>
                <MenuItem value="byDepartment">部門別</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {viewMode !== 'all' && (
            <>
              <Grid item xs={4} sm={4} md={4}>
                <FormControl fullWidth>
                  <InputLabel>店舗</InputLabel>
                  <Select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                    {stores.map(store => (
                      <MenuItem key={store} value={store}>
                        {store === 'all' ? '全店舗' : store}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <FormControl fullWidth>
                  <InputLabel>部門</InputLabel>
                  <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>
                        {dept === 'all' ? '全部門' : dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
          <div>
            <h2>昨年実績テーブル</h2>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="header-cell">期間</TableCell>
                  {parentColumns.slice(1).map((month, index) => (
                    <TableCell key={index} className="header-cell" align="center">
                      {month}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {LAST_YEAR_ROWS.map(series => (
                  <TableRow key={series.key}>
                    <TableCell className="header-cell">{series.label}</TableCell>
                    {parentColumns.slice(1).map((month, index) => {
                      const data = lastYearData[index + 1] || {};
                      return (
                        <TableCell key={index} align="center">
                          {data[series.key]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Collapse>
      </Paper>
    </div>
  );
}
