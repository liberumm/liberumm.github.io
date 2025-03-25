// 値の種類を判定
const getValueType = (item, target) => {
  if (item === "ロス" && target === "売価率") return "loss_rate";
  if (target.indexOf("率") !== -1) return "rate";
  if (target === "売価高" || target === "原価高" || target === "総利益高") return "money";
  return "normal";
};

// 行ヘッダー定義
const rowHeaders = [
  { item: "期初在庫", period: "当月", target: "売価高", unit: "千円" },
  { item: "期初在庫", period: "当月", target: "原価高", unit: "千円" },
  { item: "期初在庫", period: "当月", target: "原価率", unit: "%" },
  { item: "売上", period: "当月", target: "売価高", unit: "千円" },
  { item: "売上", period: "当月", target: "原価高", unit: "千円" },
  { item: "売上", period: "当月", target: "総利益高", unit: "千円" },
  { item: "売上", period: "当月", target: "総利益率", unit: "%" },
  { item: "値下", period: "当月", target: "売価高", unit: "千円" },
  { item: "値下", period: "当月", target: "値下げ率", unit: "%" },
  { item: "リベート", period: "当月", target: "原価高", unit: "千円" },
  { item: "リベート", period: "当月", target: "リベート率", unit: "%" },
  { item: "ロス", period: "当月", target: "売価高", unit: "千円" },
  { item: "ロス", period: "当月", target: "売価率", unit: "%" },
  { item: "期首在庫", period: "当月", target: "売価高", unit: "千円" },
  { item: "期首在庫", period: "当月", target: "原価高", unit: "千円" },
  { item: "期首在庫", period: "当月", target: "原価率", unit: "%" },
  { item: "期末在庫", period: "当月", target: "売価高", unit: "千円" },
  { item: "期末在庫", period: "当月", target: "原価高", unit: "千円" },
  { item: "期末在庫", period: "当月", target: "原価率", unit: "%" },
  { item: "在庫高変動", period: "当月", target: "売価高", unit: "千円" },
  { item: "仕入", period: "当月", target: "売価高", unit: "千円" },
  { item: "仕入", period: "当月", target: "原価高", unit: "千円" },
  { item: "仕入", period: "当月", target: "値入率", unit: "%" },
  { item: "仕入（リベート含）", period: "当月", target: "売価高", unit: "千円" },
  { item: "仕入（リベート含）", period: "当月", target: "原価高", unit: "千円" },
  { item: "仕入（リベート含）", period: "当月", target: "値入率", unit: "%" },
  { item: "累計売上", period: "前月", target: "売価高", unit: "千円" },
  { item: "累計原価", period: "前月", target: "原価高", unit: "千円" },
  { item: "累計期末在庫", period: "前月", target: "原価率", unit: "%" },
  { item: "累計売上", period: "当月", target: "売価高", unit: "千円" },
  { item: "累計売上", period: "当月", target: "原価高", unit: "千円" },
  { item: "累計仕入", period: "当月", target: "売価高", unit: "千円" },
  { item: "累計仕入", period: "当月", target: "原価高", unit: "千円" },
  { item: "累計期末在庫", period: "当月", target: "原価率", unit: "%" },
];

// 初期データ定義
const numericDataColumns = {
  plans: [
    [
      "10000", "117432", "", "55745", "", "19745", "", "13549", "", "750",
      "", "500", "2", "188529", "122298", "", "186398", "", "", "",
      "68278", "34555", "", "68278", "35305", "", "419971", "277301", "",
      "475716", "", "", "311856", "", "", ""  // ※要素数を37に合わせています
    ],
    // plan2 ～ plan13 はすべて空文字列の配列（37要素に合わせる）
    ...Array.from({ length: 12 }, () => Array(rowHeaders.length).fill(""))
  ]
};

function ProfitTable() {
  const [focusedCell, setFocusedCell] = React.useState(null);
  const [numericData, setNumericData] = React.useState(numericDataColumns);
  
  // マウント後、初期数値データに sum 列を追加して反映
  React.useEffect(() => {
    setNumericData(recalcNumericData(numericDataColumns));
  }, []);

  // デバウンス処理用の関数
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // 計画値の変更：値のチェックを blur 時のみに変更
  const handlePlanChange = React.useCallback((rowIndex, planIndex, newValue) => {
    requestAnimationFrame(() => {
      setNumericData(prev => {
        const newPlans = [...prev.plans];
        newPlans[planIndex] = [...newPlans[planIndex]];
        newPlans[planIndex][rowIndex] = newValue;
        return { ...prev, plans: newPlans };
      });
    });
  }, []);

  // 合計再計算を遅延実行（待ち時間を300msに延長）
  const debouncedRecalc = React.useCallback(
    debounce((data) => {
      requestAnimationFrame(() => {
        setNumericData(recalcNumericData(data));
      });
    }, 0),
    []
  );

  // フォーカス解除時の処理を更新
  const handleFieldBlur = React.useCallback((rowIndex, fieldType, planIndex, currentValue, header) => {
    if (!currentValue) {
      setFocusedCell(null);
      return;
    }

    // 数値検証を簡略化
    if (!/^[0-9.,]*$/.test(currentValue)) {
      setFocusedCell(null);
      return;
    }

    const type = getValueType(header.item, header.target);
    const formatted = formatNumber(currentValue, type);

    requestAnimationFrame(() => {
      setNumericData(prev => {
        const newPlans = [...prev.plans];
        newPlans[planIndex] = [...newPlans[planIndex]];
        newPlans[planIndex][rowIndex] = formatted;
        const newData = { ...prev, plans: newPlans };
        debouncedRecalc(newData);
        return newData;
      });
    });
    
    setFocusedCell(null);
  }, [debouncedRecalc]);

  // フォーカス移動処理を修正
  const moveFocus = React.useCallback((rowIndex, colIndex, direction) => {
    if (!direction) return;
    
    let nextRow = rowIndex;
    let nextCol = colIndex;
    
    switch (direction) {
      case 'down':
        nextRow = Math.min(rowIndex + 1, rowHeaders.length - 1);
        break;
      case 'up':
        nextRow = Math.max(rowIndex - 1, 0);
        break;
      case 'left':
        nextCol = Math.max(colIndex - 1, 6);
        break;
      case 'right':
        nextCol = Math.min(colIndex + 1, 18); // 19から18に変更
        break;
    }

    // 少し遅延させてフォーカス移動を実行
    setTimeout(() => {
      const nextElement = document.querySelector(
        `input[data-row="${nextRow}"][data-col="${nextCol}"]`
      );
      if (nextElement) {
        nextElement.focus();
        // フォーカス移動後にセレクト
        nextElement.select();
      }
    }, 0);
  }, []);

  // キーイベント処理を統合
  const handleKeyEvent = React.useCallback((e, rowIndex, fieldType, planIndex, currentValue, header, colIndex) => {
    if (e.key === 'Enter' || e.key.startsWith('Arrow')) {
      keyboardUtils.handleKeyDown(e, rowIndex, colIndex, rowHeaders.length);
    }
  }, []);
  
  // renderTextField の修正
  const renderTextField = React.useCallback(({ 
    value, 
    onChange, 
    onBlur, 
    onFocus, 
    onKeyDown, 
    rowIndex, 
    colIndex, 
    fieldType, 
    planIndex, 
    header 
  }) => (
    <MemoizedTextField
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={(e) => {
        onFocus();
        e.target.select();
      }}
      onKeyDown={onKeyDown}
      rowIndex={rowIndex}
      colIndex={colIndex}
    />
  ), []);

  // テキストフィールドの onFocus/onBlur により focusedCell 状態を更新
  const handleFieldFocus = (rowIndex, colIndex) => {
    setFocusedCell({ row: rowIndex, col: colIndex });
  };
  
  // focusedCell に基づいて、該当する行または列の背景色を変更する関数
  const getCellBg = (rowIndex, colIndex) => {
    if (focusedCell) {
      if (focusedCell.row === rowIndex || focusedCell.col === colIndex) {
        return "#ffe0b2";
      }
    }
    return "inherit";
  };
  
  // 行スタイル（境界線など）
  const getRowStyle = (rowIndex) => {
    const style = { height: "26px" };
    if (rowIndex === rowHeaders.length - 1) {
      style.borderBottom = "2px solid black";
    } else if (rowHeaders[rowIndex].item !== rowHeaders[rowIndex + 1].item) {
      style.borderBottom = "2px solid black";
    }
    return style;
  };
  
  // 特定の計画列へのデータインポート処理
  const handlePlanImport = (planIndex, file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(event.target.result, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // ヘッダー行をスキップし、値のみを取得
      const values = data.slice(1).map(row => row[3] || "");
      
      setNumericData(prev => {
        const newPlans = prev.plans.map((col, idx) => {
          if (idx === planIndex) {
            return values;
          }
          return col;
        });
        return recalcNumericData({ ...prev, plans: newPlans });
      });
    };
    reader.readAsBinaryString(file);
  };

  // テーブルヘッダー用の修正
  const headerTexts = [
    "No.", "項目", "期間", "対象", "単位", "合計",
    ...Array.from({ length: 13 }, (_, i) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <span>{`計画${i + 1}`}</span>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handlePlanImport(i, file);
              e.target.value = null;
            }
          }}
          style={{ display: 'none' }}
          id={`plan-import-${i}`}
        />
        <label htmlFor={`plan-import-${i}`}>
          <span className="material-icons" style={{ cursor: 'pointer', fontSize: '16px' }}>
            file_upload
          </span>
        </label>
      </div>
    ))
  ];

  // コンポーネントのプロップスを修正
  const tableProps = {
    headerTexts,
    renderTextField,
    focusedCell,
    handleFieldFocus,
    handleFieldBlur,
    handlePlanChange,
    handleKeyEvent,
    getCellBg  // getCellBgを明示的に追加
  };

  // columnWidths の定義を追加
  const columnWidths = {
    no: '40px',
    item: '120px',
    period: '60px',
    target: '80px',
    unit: '60px',
    sum: '100px',
    plan: '100px'
  };

  return (
    <Box>
      <Box sx={styles.dataButtons}>
        <input type="file" accept=".xlsx" onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const wb = XLSX.read(event.target.result, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // ヘッダー行をスキップし、行ごとのオブジェクトに変換後、列方向に再変換
            const rows = data.slice(1).map(row => ({
              plans: [row[3] || "", ...Array(12).fill("")]
            }));
            const convertRowsToColumns = (rows) => {
              const numPlanCols = rows[0].plans.length;
              const plans = [];
              for (let j = 0; j < numPlanCols; j++) {
                plans.push(rows.map(row => row.plans[j]));
              }
              return { plans };
            };
            const newDataCols = convertRowsToColumns(rows);
            setNumericData(recalcNumericData(newDataCols));
          };
          reader.readAsBinaryString(file);
          e.target.value = null;
        }} style={{ display: 'none' }} id="import-button" />
        <label htmlFor="import-button">
          <button onClick={() => document.getElementById('import-button').click()}>
            データインポート
          </button>
        </label>
        <button onClick={() => {
          const exportRows = [];
          for (let i = 0; i < rowHeaders.length; i++) {
            const rowData = {
              plans: numericData.plans.map(col => col[i]),
              sum: numericData.sum[i]
            };
            exportRows.push([ rowHeaders[i].item, rowHeaders[i].period, rowHeaders[i].target, rowData.sum ]);
          }
          const ws = XLSX.utils.aoa_to_sheet([
            ["項目", "期間", "対象", "計画"],
            ...exportRows
          ]);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Data");
          XLSX.writeFile(wb, "data.xlsx");
        }}>データエクスポート</button>
        <button onClick={() => {
          const template = [
            ["項目", "期間", "対象", "計画"],
            ...rowHeaders.map(header => [header.item, header.period, header.target, ""])
          ];
          const ws = XLSX.utils.aoa_to_sheet(template);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Template");
          XLSX.writeFile(wb, "template.xlsx");
        }}>テンプレート取得</button>
      </Box>
      <Typography variant="h7" gutterBottom>収益達成計画</Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          width: "100%",
          minWidth: "1500px", // 横スクロールを防ぐための最小幅指定
          margin: "4px auto", 
          padding: "2px",
          overflowX: "hidden" // メインテーブルはスクロールを無効化
        }}
      >
        <Table size="small" style={{ tableLayout: "fixed", width: "100%" }}>
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
                    backgroundColor: colIndex === 5 ? "#e3f2fd" : 
                      (focusedCell && focusedCell.col === colIndex ? "#ffe0b2" : "inherit"),
                    ...(colIndex === 5 && {
                      borderLeft: "2px solid #90caf9",
                      borderRight: "2px solid #90caf9"
                    }),
                    width: columnWidths[
                      colIndex === 0 ? 'no' :
                      colIndex === 1 ? 'item' :
                      colIndex === 2 ? 'period' :
                      colIndex === 3 ? 'target' :
                      colIndex === 4 ? 'unit' :
                      colIndex === 5 ? 'sum' :
                      'plan'
                    ]
                  }}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowHeaders.map((header, rowIndex) => (
              <MemoizedTableRow
                key={rowIndex}
                header={header}
                rowIndex={rowIndex}
                numericData={numericData}
                handlePlanChange={handlePlanChange}
                handleFieldBlur={handleFieldBlur}
                handleFieldFocus={handleFieldFocus}
                handleKeyEvent={handleKeyEvent} // handleKeyPress を handleKeyEvent に変更
                renderTextField={({ value, onChange, onBlur, onFocus, rowIndex, colIndex }) => renderTextField({
                  value,
                  onChange,
                  onBlur,
                  onFocus,
                  onKeyDown: (e) => handleKeyEvent(e, rowIndex, 'plan', colIndex - 6, value, header, colIndex),
                  rowIndex,
                  colIndex,
                  fieldType: 'plan',
                  planIndex: colIndex - 6,
                  header
                })}
                getCellBg={getCellBg}
                getRowStyle={getRowStyle}
                focusedCell={focusedCell}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ProfitTableをエクスポート
window.ProfitTable = ProfitTable;