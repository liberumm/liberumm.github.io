const { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } = MaterialUI;

/* 追加テーブルのヘッダー定義 */
const additionalTables = [
  {
    title: "売上計画テーブル",
    headers: [
      { item: "売上", period: "当月", target: "売価高", unit: "千円" },
      { item: "売上", period: "当月", target: "原価高", unit: "千円" }
    ]
  },
  // ...existing code for other tables...
  {
    title: "在庫計画テーブル",
    headers: [
      { item: "期末在庫", period: "当月", target: "売価高", unit: "千円" },
      { item: "期末在庫", period: "当月", target: "原価高", unit: "千円" },
      { item: "期末在庫", period: "当月", target: "原価率", unit: "%" }
    ]
  },
  {
    title: "在庫変動計画テーブル",
    headers: [
      { item: "在庫高変動", period: "当月", target: "売価高", unit: "千円" },
      { item: "在庫高変動", period: "当月", target: "原価高", unit: "千円" }
    ]
  },
  {
    title: "仕入計画テーブル",
    headers: [
      { item: "仕入", period: "当月", target: "売価高", unit: "千円" },
      { item: "仕入", period: "当月", target: "原価高", unit: "千円" },
      { item: "仕入", period: "当月", target: "値入率", unit: "%" }
    ]
  },
  {
    title: "累計実績テーブル",
    headers: [
      { item: "累計売上", period: "当月", target: "売価高", unit: "千円" },
      { item: "累計売上", period: "当月", target: "原価高", unit: "千円" },
      { item: "累計仕入", period: "当月", target: "売価高", unit: "千円" },
      { item: "累計仕入", period: "当月", target: "原価高", unit: "千円" },
      { item: "累計期末在庫", period: "当月", target: "原価率", unit: "%" }
    ]
  }
];

/* 追加テーブル用の初期データ定義 */
const additionalNumericDataColumns = additionalTables.reduce((acc, table) => {
  acc[table.title] = {
    plans: Array.from({ length: 13 }, () => Array(table.headers.length).fill("")),
    sum: Array(table.headers.length).fill("")
  };
  return acc;
}, {});

function PlanTable({ 
  headerTexts = [], // デフォルト値を設定
  renderTextField, 
  focusedCell, 
  handleFieldFocus, 
  handleFieldBlur, 
  handlePlanChange, 
  handleKeyPress, 
  handleKeyEvent, // handleKeyDownの代わりにhandleKeyEventを使用
  // デフォルトのgetCellBg関数を追加
  getCellBg = (rowIndex, colIndex) => {
    if (focusedCell) {
      if (focusedCell.row === rowIndex || focusedCell.col === colIndex) {
        return "#ffe0b2";
      }
    }
    return "inherit";
  }
}) {
  const [numericData, setNumericData] = React.useState(additionalNumericDataColumns);

  // 独自のrenderTextFieldを定義
  const renderPlanTextField = React.useCallback(({ value, onChange, onBlur, onFocus, onKeyDown, rowIndex, colIndex, tableId }) => {
    return (
      <MemoizedTextField
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        rowIndex={rowIndex}
        colIndex={colIndex}
        tableId={tableId}
      />
    );
  }, []);

  // 行スタイルの定義を追加
  const getRowStyle = (rowIndex) => ({
    height: "26px"
  });

  return (
    <>
      {additionalTables.map((tableConfig, index) => (
        <Box mt={4} key={index}>
          <Typography variant="h7" gutterBottom>{tableConfig.title}</Typography>
          <TableContainer 
            component={Paper} 
            sx={styles.tableContainer}
          >
            <Table size="small" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  {headerTexts.map((text, colIndex) => (
                    <TableCell
                      key={colIndex}
                      sx={{
                        whiteSpace: "nowrap",
                        padding: "2px 4px",
                        fontWeight: "bold",
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        backgroundColor: colIndex === 5 ? "#e3f2fd" : 
                          (focusedCell && focusedCell.col === colIndex ? "#ffe0b2" : "inherit"),
                        ...(colIndex === 5 && {
                          borderLeft: "2px solid #90caf9",
                          borderRight: "2px solid #90caf9"
                        })
                      }}
                    >
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableConfig.headers.map((header, rowIndex) => (
                  <TableRow key={rowIndex} sx={{
                    backgroundColor: focusedCell && focusedCell.row === rowIndex ? "#ffe0b2" : "inherit",
                    height: "26px"
                  }}>
                    {/* No.列 */}
                    <TableCell sx={{ 
                      textAlign: "center",
                      padding: "2px 4px",
                      backgroundColor: getCellBg(rowIndex, 0)
                    }}>
                      {rowIndex + 1}
                    </TableCell>
                    
                    {/* 項目、期間、対象、単位列 */}
                    {["item", "period", "target", "unit"].map((field, colIndex) => (
                      <TableCell key={colIndex} sx={{
                        padding: "2px 4px",
                        textAlign: field === "item" ? "left" : "center",
                        backgroundColor: getCellBg(rowIndex, colIndex + 1)
                      }}>
                        {header[field]}
                      </TableCell>
                    ))}

                    {/* 合計列 */}
                    <TableCell sx={{ 
                      padding: "2px 4px",
                      textAlign: "right",
                      backgroundColor: "#e3f2fd",
                      borderLeft: "2px solid #90caf9",
                      borderRight: "2px solid #90caf9"
                    }}>
                      {numericData[tableConfig.title].sum[rowIndex]}
                    </TableCell>

                    {/* 計画1-13列 */}
                    {numericData[tableConfig.title].plans.map((col, j) => (
                      <TableCell key={j} sx={{
                        padding: "2px 4px",
                        backgroundColor: getCellBg(rowIndex, j + 6)
                      }}>
                        {renderPlanTextField({
                          value: col[rowIndex] || "",
                          onChange: (e) => {
                            const newData = { ...numericData };
                            newData[tableConfig.title].plans[j][rowIndex] = e.target.value;
                            setNumericData(newData);
                          },
                          onBlur: (e) => handleFieldBlur(rowIndex, 'plan', j, e.target.value, header),
                          onFocus: () => handleFieldFocus(rowIndex, j + 6),
                          onKeyDown: (e) => handleKeyEvent(e, rowIndex, 'plan', j, col[rowIndex] || "", header, j + 6),
                          rowIndex,
                          colIndex: j + 6,
                          tableId: tableConfig.title
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );
}

// exportsの代わりにwindow.PlanTableを使用
window.PlanTable = PlanTable;
