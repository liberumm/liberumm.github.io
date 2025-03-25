const { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TextField } = MaterialUI;

// 数値入力制限
const allowOnlyNumbers = (e) => {
  if (!/[0-9.,]/.test(e.key)) {
    e.preventDefault();
  }
};

// 数値フォーマット関数
const formatNumber = (value, type) => {
  if (!value) return value;
  const num = parseFloat(value.replace(/,/g, "").replace(/%/g, ""));
  if (isNaN(num)) return value;
  if (type === "loss_rate" || type === "rate") {
    return num.toFixed(1) + "%";
  } else if (type === "money") {
    const rounded = Math.round(num);
    const original = num.toFixed(1);
    return rounded === num ? rounded.toLocaleString() : rounded.toLocaleString() + " (" + original + ")";
  }
  return num.toLocaleString();
};

// メモ化されたテキストフィールド
const MemoizedTextField = React.memo(({ value, onChange, onBlur, onFocus, onKeyDown, onKeyPress, rowIndex, colIndex }) => {
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
        // IMEの確定時は処理をスキップ
        if (e.keyCode === 229) return;
        onKeyDown && onKeyDown(e);
      }}
      onKeyPress={onKeyPress}
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
        'data-col': colIndex
      }}
    />
  );
}, (prevProps, nextProps) => prevProps.value === nextProps.value);

// メモ化されたテーブル行
const MemoizedTableRow = React.memo(({ 
  header, 
  rowIndex, 
  numericData, 
  handlePlanChange, 
  handleFieldBlur, 
  handleFieldFocus, 
  handleKeyEvent, 
  renderTextField, 
  getCellBg, 
  getRowStyle, 
  focusedCell 
}) => {
  return (
    <TableRow 
      sx={{
        ...getRowStyle(rowIndex),
        backgroundColor: focusedCell && focusedCell.row === rowIndex ? "#ffe0b2" : "inherit"
      }}
    >
      <TableCell 
        sx={{
          whiteSpace: "nowrap",
          padding: "2px 4px",
          textAlign:"center",
          backgroundColor: getCellBg(rowIndex, 0)
        }}
      >
        {rowIndex + 1}
      </TableCell>
      {["item", "period", "target", "unit"].map((field, i) => (
        <TableCell
          key={i}
          sx={{
            whiteSpace: "nowrap",
            padding: "2px 4px",
            textAlign: field === "item" ? "left" : "center",
            backgroundColor: getCellBg(rowIndex, i + 1)
          }}
        >
          {header[field]}
        </TableCell>
      ))}
      <TableCell 
        sx={{
          whiteSpace: "nowrap",
          padding: "2px 4px",
          textAlign:"right",
          backgroundColor: "#e3f2fd",
          borderLeft: "2px solid #90caf9",
          borderRight: "2px solid #90caf9"
        }}
      >
        {numericData.sum ? numericData.sum[rowIndex] : ""}
      </TableCell>
      {numericData.plans.map((col, j) => (
        <TableCell
          key={`plan-${j}`}
          sx={{
            whiteSpace: "nowrap",
            padding: "2px 4px",
            backgroundColor: getCellBg(rowIndex, j + 6)
          }}
        >
          {renderTextField({
            value: col[rowIndex],
            onChange: (e) => handlePlanChange(rowIndex, j, e.target.value),
            onBlur: (e) => handleFieldBlur(rowIndex, 'plan', j, e.target.value, header),
            onFocus: () => handleFieldFocus(rowIndex, j + 6),
            onKeyDown: (e) => handleKeyEvent(e, rowIndex, 'plan', j, col[rowIndex], header, j + 6),
            rowIndex,
            colIndex: j + 6
          })}
        </TableCell>
      ))}
    </TableRow>
  );
});

// デバウンス処理
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Excel関連のユーティリティ関数
const excelUtils = {
  importData: (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(event.target.result, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      callback(data);
    };
    reader.readAsBinaryString(file);
  },
  
  exportData: (data, filename) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, filename);
  }
};

// 数値の合計を再計算する関数を修正
const recalcNumericData = (data) => {
  // yoyの代わりにplansの長さを使用
  const numRows = data.plans[0].length;
  const sum = [];
  for (let i = 0; i < numRows; i++) {
    let s = 0;
    data.plans.forEach(planCol => {
      const cellValue = planCol[i];
      if (cellValue !== undefined) {
        const num = parseFloat(cellValue.replace(/,/g, "").replace(/%/g, ""));
        if (!isNaN(num)) {
          s += num;
        }
      }
    });
    sum.push(s ? s.toLocaleString() : "");
  }
  return { ...data, sum };
};

// スタイル定義を追加
const styles = {
  dataButtons: {
    display: 'flex',
    gap: 1,
    mb: 1,
    justifyContent: 'flex-end'
  },
  button: {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': {
      bgcolor: 'primary.dark'
    }
  },
  tableContainer: {
    width: '100%',
    m: '4px auto',
    p: '2px',
    overflowX: 'auto'
  }
};

// グローバルで共有する列幅定義をより詳細に設定
const columnWidths = {
  no: '50px',      // No.列を少し広く
  item: '150px',   // 項目列を広く
  period: '70px',  // 期間列
  target: '100px', // 対象列を広く
  unit: '60px',    // 単位列
  sum: '120px',    // 合計列を広く
  plan: '100px'    // 計画列
};

// キーボード処理のユーティリティ関数を追加
const keyboardUtils = {
  handleKeyDown: (e, rowIndex, colIndex, maxRows, tableId = null) => {
    e.preventDefault();
    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (e.key) {
      case 'Enter':
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

    // 対象要素のセレクタを構築
    let selector = `input[data-row="${nextRow}"][data-col="${nextCol}"]`;
    if (tableId) {
      selector += `[data-table="${tableId}"]`;
    }

    requestAnimationFrame(() => {
      const nextElement = document.querySelector(selector);
      if (nextElement) {
        nextElement.focus();
        nextElement.select();
      }
    });

    return { nextRow, nextCol };
  }
};

window.keyboardUtils = keyboardUtils;

window.columnWidths = columnWidths;
window.formatNumber = formatNumber;
window.recalcNumericData = recalcNumericData;
window.styles = styles;

// getValueTypeをwindowに追加してグローバルに利用可能に
window.getValueType = (item, target) => {
  if (item === "ロス" && target === "売価率") return "loss_rate";
  if (target.indexOf("率") !== -1) return "rate";
  if (target === "売価高" || target === "原価高" || target === "総利益高") return "money";
  return "normal";
};