const {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableFooter,
    TablePagination,
    Button,
  } = MaterialUI;
  
  ////////////////////////////////////////////////////////////////
  // 追記: xlsx ライブラリを読み込み
  ////////////////////////////////////////////////////////////////
  const XLSX = window.XLSX;
  
  // サンプルデータ（30行分）
  const initialData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    category: String.fromCharCode(65 + (i % 3)), // A, B, C
    type: String.fromCharCode(88 + (i % 2)), // X, Y
    value: (i + 1) * 5,
  }));
  
  function DataSpreadsheet() {
    ////////////////////////////////////////////////////////////////////
    // 追記: データを state に格納するように変更 (initialDataを初期値に)
    ////////////////////////////////////////////////////////////////////
    const [tableData, setTableData] = React.useState(initialData);
  
    // ページネーション用ステート
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20); // デフォルト値を20に設定
  
    // ホバー管理用ステート
    const [hoveredColumn, setHoveredColumn] = React.useState(null); // ホバー中の列を管理
    const [hoveredRow, setHoveredRow] = React.useState(false); // データ行ホバー中かを管理
  
    // ページ切り替え時の処理
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    // 表示行数切り替え時の処理
    const handleChangeRowsPerPage = (event) => {
      const value =
        event.target.value === 'all' ? tableData.length : parseInt(event.target.value, 10);
      setRowsPerPage(value);
      setPage(0); // ページをリセット
    };
  
    ////////////////////////////////////////////////////////////////////
    // ページごとのデータを取得
    ////////////////////////////////////////////////////////////////////
    const paginatedData =
      rowsPerPage === tableData.length
        ? tableData
        : tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
    ////////////////////////////////////////////////////////////////////
    // 追記: csv/excelインポート
    ////////////////////////////////////////////////////////////////////
    const handleImport = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        const reader = new FileReader();
        reader.onload = (evt) => {
          // ファイルを読み込んだら、XLSXを使ってワークブックを読み込み
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
  
          // とりあえず最初のシートを取得
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
  
          // sheet_to_json でデータを配列オブジェクト形式に変換
          // 例: [{id: 1, category: "A", type: "X", value: 5}, ... ]
          const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
  
          // 変換結果をそのまま state に設定する
          // ※インポートするファイルのカラム名などによっては、
          //   加工してからsetTableDataする必要があります
          setTableData(data);
          setPage(0); // ページを先頭に戻す
        };
        // ExcelもCSVも同じパーサでOK
        reader.readAsBinaryString(file);
      } catch (error) {
        console.error('インポートに失敗しました:', error);
      }
    };
  
    ////////////////////////////////////////////////////////////////////
    // 追記: csvエクスポート
    ////////////////////////////////////////////////////////////////////
    const handleExportCSV = () => {
      try {
        // テーブルデータをワークシートに変換
        const ws = XLSX.utils.json_to_sheet(tableData);
        // 新しいワークブックを作る
        const wb = XLSX.utils.book_new();
        // シートをワークブックに追加
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        // CSV形式で書き出し
        XLSX.writeFile(wb, 'exported_data.csv');
      } catch (error) {
        console.error('CSVエクスポートに失敗しました:', error);
      }
    };
  
    ////////////////////////////////////////////////////////////////////
    // 追記: Excel(xlsx)エクスポート
    ////////////////////////////////////////////////////////////////////
    const handleExportExcel = () => {
      try {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        // xlsx形式で書き出し
        XLSX.writeFile(wb, 'exported_data.xlsx');
      } catch (error) {
        console.error('Excelエクスポートに失敗しました:', error);
      }
    };
  
    return (
      <Paper elevation={3} sx={{ m: 2 }}>
        <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>データスプレッドシート</h3>
  
          {/******************************************************************
           * 追記: ファイルインポートボタン・エクスポートボタン
           ******************************************************************/}
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            {/* csv/excelファイルを選択するインプット */}
            <Button variant="outlined" component="label">
              インポート (CSV/Excel)
              <input
                type="file"
                hidden
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleImport}
              />
            </Button>
  
            {/* CSV出力 */}
            <Button variant="outlined" onClick={handleExportCSV}>
              CSVエクスポート
            </Button>
  
            {/* Excel出力 */}
            <Button variant="outlined" onClick={handleExportExcel}>
              Excelエクスポート
            </Button>
          </Box>
  
          <TableContainer component={Paper}>
            <Table
              sx={{
                borderCollapse: 'collapse',
                width: '100%',
              }}
              size="small" // コンパクト表示
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    onMouseEnter={() => setHoveredColumn(0)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    sx={{
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '14px',
                      backgroundColor:
                        hoveredColumn === 0 && !hoveredRow
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'inherit',
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    onMouseEnter={() => setHoveredColumn(1)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    sx={{
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '14px',
                      backgroundColor:
                        hoveredColumn === 1 && !hoveredRow
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'inherit',
                    }}
                  >
                    カテゴリー
                  </TableCell>
                  <TableCell
                    onMouseEnter={() => setHoveredColumn(2)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    sx={{
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '14px',
                      backgroundColor:
                        hoveredColumn === 2 && !hoveredRow
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'inherit',
                    }}
                  >
                    タイプ
                  </TableCell>
                  <TableCell
                    onMouseEnter={() => setHoveredColumn(3)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    sx={{
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '14px',
                      backgroundColor:
                        hoveredColumn === 3 && !hoveredRow
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'inherit',
                    }}
                  >
                    値
                  </TableCell>
                </TableRow>
              </TableHead>
  
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(true)}
                    onMouseLeave={() => setHoveredRow(false)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '12px',
                        backgroundColor:
                          hoveredColumn === 0 && !hoveredRow
                            ? 'rgba(0, 0, 0, 0.1)'
                            : 'inherit',
                      }}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '12px',
                        backgroundColor:
                          hoveredColumn === 1 && !hoveredRow
                            ? 'rgba(0, 0, 0, 0.1)'
                            : 'inherit',
                      }}
                    >
                      {row.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '12px',
                        backgroundColor:
                          hoveredColumn === 2 && !hoveredRow
                            ? 'rgba(0, 0, 0, 0.1)'
                            : 'inherit',
                      }}
                    >
                      {row.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '12px',
                        backgroundColor:
                          hoveredColumn === 3 && !hoveredRow
                            ? 'rgba(0, 0, 0, 0.1)'
                            : 'inherit',
                      }}
                    >
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
  
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{
                      border: '1px solid #ccc',
                      textAlign: 'right',
                      padding: '4px',
                      fontSize: '12px',
                    }}
                  >
                    合計
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {tableData.reduce((acc, curr) => acc + Number(curr.value), 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
  
          <TablePagination
            rowsPerPageOptions={[10, 20, 30, { label: '全て', value: 'all' }]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="表示行数"
          />
        </Box>
      </Paper>
    );
  }
  
  // グローバルに設定して他のスクリプトから利用可能に
  window.DataSpreadsheet = DataSpreadsheet;
  