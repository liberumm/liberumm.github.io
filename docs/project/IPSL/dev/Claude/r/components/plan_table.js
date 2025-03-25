const { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TextField } = MaterialUI;

// 追加テーブルの定義
const additionalTables = [
  {
    title: "売上計画テーブル",
    headers: [
      { item: "売上", period: "当月", target: "売価高", unit: "千円" },
      { item: "売上", period: "当月", target: "原価高", unit: "千円" }
    ]
  },
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

// 追加テーブル用の初期データ定義
const additionalNumericDataColumns = additionalTables.reduce((acc, table) => {
  if (table && table.title) {
    acc[table.title] = {
      plans: Array.from({ length: 13 }, () => Array(table.headers.length).fill("")),
      sum: Array(table.headers.length).fill("")
    };
  }
  return acc;
}, {});

// メモ化されたテキストフィールドコンポーネント
const MemoizedTextField = React.memo(({ value, onChange, onBlur, onFocus, onKeyDown, rowIndex, colIndex, tableId }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={(e) => {
        onFocus(e);
        e.target.select();
      }}
      onKeyDown={(e) => {
        // IME確定時は処理をスキップ
        if (e.keyCode === 229) return;
        onKeyDown && onKeyDown(e);
      }}
      fullWidth
      inputProps={{
        style: { 
          whiteSpace: "nowrap", 
          textAlign: "right", 
          padding: "2px",
          height: "20px",
          fontSize: "14px"
        },
        'data-row': rowIndex,
        'data-col': colIndex,
        'data-table': tableId,
        'inputMode': 'numeric',
        'pattern': '[0-9]*'
      }}
    />
  );
});

function PlanTable() {
  const [numericData, setNumericData] = React.useState(additionalNumericDataColumns);
  // focusedCell はグローバルな列ハイライト（全テーブル共通）
  const [focusedCell, setFocusedCell] = React.useState({});
  // tableFocusStates は各テーブルごとの行ハイライト状態を保持
  const [tableFocusStates, setTableFocusStates] = React.useState({});

  // フィールドのブラー処理
  const handleFieldBlur = React.useCallback((rowIndex, colIndex) => {
    // フォーカス解除時はグローバルな列ハイライトも解除
    setFocusedCell({});
  }, []);

  // 計画データ変更時の処理（不変性を保った更新）
  const handlePlanChange = React.useCallback((rowIndex, planIndex, value, tableTitle) => {
    if (!tableTitle) return;
    setNumericData(prev => {
      const newData = { ...prev };
      if (newData[tableTitle]) {
        const newPlans = newData[tableTitle].plans.map(col => [...col]);
        newPlans[planIndex][rowIndex] = value;
        const updatedTableData = {
          ...newData[tableTitle],
          plans: newPlans,
          sum: window.recalcNumericData
            ? window.recalcNumericData({ plans: newPlans, sum: newData[tableTitle].sum }).sum
            : newData[tableTitle].sum
        };
        newData[tableTitle] = updatedTableData;
      }
      return newData;
    });
  }, []);

  // フォーカス時に、現在のテーブル以外のフォーカス状態をクリアする
  const handleTableFieldFocus = React.useCallback((rowIndex, colIndex, tableId) => {
    if (!tableId) return;
    // 現在選択中のテーブルのみ状態をセット（他はクリア）
    setTableFocusStates({ [tableId]: { row: rowIndex } });
    // グローバルな列ハイライトを更新
    setFocusedCell({ col: colIndex });
  }, []);

  // 背景色制御関数
  // ・行：各テーブルごとの tableFocusStates で判断（そのテーブル内のみ）
  // ・列：focusedCell.col が一致すれば全テーブルでハイライト
  const getTableCellBg = React.useCallback((rowIndex, colIndex, tableId) => {
    const tableFocus = tableFocusStates[tableId];
    const isRowFocused = tableFocus && tableFocus.row === rowIndex;
    const isColFocused = focusedCell && focusedCell.col === colIndex;
    return (isRowFocused || isColFocused) ? "#ffe0b2" : "inherit";
  }, [tableFocusStates, focusedCell]);

  // ナビゲーションキー（矢印・Enter）のみ preventDefault() する
  const handleKeyDown = React.useCallback((e, rowIndex, colIndex, tableId) => {
    const navigationKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'];
    if (navigationKeys.includes(e.key)) {
      e.preventDefault();
      const currentTable = additionalTables.find(t => t.title === tableId);
      const maxRows = currentTable && currentTable.headers ? currentTable.headers.length : 0;
      if (window.keyboardUtils && window.keyboardUtils.handleKeyDown) {
        window.keyboardUtils.handleKeyDown(e, rowIndex, colIndex, maxRows, tableId);
      }
    }
    // その他のキー（数字入力等）はブラウザの既定動作を許容
  }, []);

  // テキストフィールドのレンダリング
  const renderPlanTextField = React.useCallback(({ 
    value, 
    onChange, 
    onBlur, 
    onFocus, 
    rowIndex, 
    colIndex, 
    tableId,
    header,
    fieldType,
    planIndex
  }) => (
    <MemoizedTextField
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={(e) => {
        handleTableFieldFocus(rowIndex, colIndex, tableId);
        onFocus && onFocus();
        e.target.select();
      }}
      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex, tableId)}
      rowIndex={rowIndex}
      colIndex={colIndex}
      tableId={tableId}
    />
  ), [handleTableFieldFocus, handleKeyDown]);

  const columnWidths = {
    no: '40px',
    item: '120px',
    period: '60px',
    target: '80px',
    unit: '60px',
    sum: '100px',
    plan: '100px'
  };

  // テキストフィールド内でのキー操作（Enter/矢印キー）
  const handleTextFieldKeyDown = React.useCallback((e, rowIndex, colIndex, tableId, maxRows) => {
    let nextRow = rowIndex;
    let nextCol = colIndex;

    if (e.key === 'Enter') {
      e.preventDefault();
      nextRow = Math.min(rowIndex + 1, maxRows - 1);
    } else if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowDown':
          nextRow = Math.min(rowIndex + 1, maxRows - 1);
          break;
        case 'ArrowUp':
          nextRow = Math.max(rowIndex - 1, 0);
          break;
        case 'ArrowLeft':
          nextCol = Math.max(colIndex - 1, 6);
          break;
        case 'ArrowRight':
          nextCol = Math.min(colIndex + 1, 18);
          break;
      }
    }

    if (nextRow !== rowIndex || nextCol !== colIndex) {
      setTimeout(() => {
        const nextElement = document.querySelector(
          `input[data-row="${nextRow}"][data-col="${nextCol}"][data-table="${tableId}"]`
        );
        if (nextElement) {
          nextElement.focus();
          nextElement.select();
        }
      }, 0);
    }
  }, []);

  // フィールドのブラー時の処理（全角数字の半角変換など）
  const handleAdditionalFieldBlur = React.useCallback((rowIndex, fieldType, planIndex, currentValue, header, tableTitle) => {
    if (!currentValue || !tableTitle) return;

    const normalized = currentValue
      .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/．/g, '.');

    if (!normalized) return;

    const type = window.getValueType ? window.getValueType(header.item, header.target) : null;
    const formatted = window.formatNumber ? window.formatNumber(normalized, type) : normalized;

    handlePlanChange(rowIndex, planIndex, formatted, tableTitle);
    handleFieldBlur(rowIndex);
  }, [handlePlanChange, handleFieldBlur]);

  return (
    <>
      {additionalTables.map((tableConfig) => {
        if (!tableConfig?.title) return null;
        
        return (
          <Box mt={4} key={tableConfig.title}>
            <Typography variant="h7" gutterBottom>{tableConfig.title}</Typography>
            <TableContainer 
              component={Paper} 
              sx={{
                width: "100%",
                minWidth: "1500px",
                margin: "4px auto",
                padding: "2px",
                overflowX: "hidden"
              }}
            >
              <Table size="small" style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: columnWidths.no, textAlign: "center" }}>No.</TableCell>
                    <TableCell sx={{ width: columnWidths.item }}>項目</TableCell>
                    <TableCell sx={{ width: columnWidths.period, textAlign: "center" }}>期間</TableCell>
                    <TableCell sx={{ width: columnWidths.target, textAlign: "center" }}>対象</TableCell>
                    <TableCell sx={{ width: columnWidths.unit, textAlign: "center" }}>単位</TableCell>
                    <TableCell sx={{ 
                      width: columnWidths.sum, 
                      textAlign: "center",
                      backgroundColor: "#e3f2fd",
                      borderLeft: "2px solid #90caf9",
                      borderRight: "2px solid #90caf9"
                    }}>合計</TableCell>
                    {Array.from({ length: 13 }, (_, i) => (
                      <TableCell 
                        key={i} 
                        sx={{ 
                          width: columnWidths.plan,
                          textAlign: "center"
                        }}
                      >
                        計画{i + 1}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableConfig.headers.map((header, rowIndex) => (
                    // 行の背景は tableFocusStates のみで判断
                    <TableRow key={rowIndex} sx={{
                      backgroundColor: tableFocusStates[tableConfig.title] && tableFocusStates[tableConfig.title].row === rowIndex
                        ? "#ffe0b2" : "inherit",
                      height: "26px"
                    }}>
                      <TableCell sx={{ 
                        textAlign: "center",
                        padding: "2px 4px",
                        backgroundColor: getTableCellBg(rowIndex, 0, tableConfig.title)
                      }}>
                        {rowIndex + 1}
                      </TableCell>
                      {["item", "period", "target", "unit"].map((field, colIndex) => (
                        <TableCell key={colIndex} sx={{
                          padding: "2px 4px",
                          textAlign: field === "item" ? "left" : "center",
                          backgroundColor: getTableCellBg(rowIndex, colIndex + 1, tableConfig.title)
                        }}>
                          {header[field]}
                        </TableCell>
                      ))}
                      <TableCell sx={{ 
                        padding: "2px 4px",
                        textAlign: "right",
                        backgroundColor: "#e3f2fd",
                        borderLeft: "2px solid #90caf9",
                        borderRight: "2px solid #90caf9"
                      }}>
                        {numericData[tableConfig.title].sum[rowIndex]}
                      </TableCell>
                      {numericData[tableConfig.title].plans.map((col, j) => (
                        <TableCell key={j} sx={{
                          padding: "2px 4px",
                          backgroundColor: getTableCellBg(rowIndex, j + 6, tableConfig.title)
                        }}>
                          <MemoizedTextField
                            value={col[rowIndex] || ""}
                            onChange={(e) => handlePlanChange(rowIndex, j, e.target.value, tableConfig.title)}
                            onBlur={(e) => handleAdditionalFieldBlur(rowIndex, 'plan', j, e.target.value, header, tableConfig.title)}
                            onFocus={() => handleTableFieldFocus(rowIndex, j + 6, tableConfig.title)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, j + 6, tableConfig.title)}
                            rowIndex={rowIndex}
                            colIndex={j + 6}
                            tableId={tableConfig.title}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </>
  );
}

// exports の代わりに window.PlanTable を使用
window.PlanTable = PlanTable;
