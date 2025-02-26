// 定数定義
const CLASSIFICATION_LEVELS = [
  { key: 'company', label: '全社' }
];

const HIERARCHY_STRUCTURE = {
  company: { 
    label: '全社',
    children: ['department']
  },
  department: {
    label: '部門',
    count: 3,
    children: ['corner']
  },
  corner: {
    label: 'コーナー',
    count: 3, // 部門ごとに3コーナー
    children: ['line']
  },
  line: {
    label: 'ライン',
    count: 3, // コーナーごとに3ライン
    children: ['category']
  },
  category: {
    label: 'カテゴリ',
    count: 5, // ラインごとに5カテゴリ
    children: []
  },
  block: {
    label: 'ブロック',
    count: 3,
    children: ['store']
  },
  store: {
    label: '店舗',
    count: 5, // ブロックごとに5店舗
    children: []
  }
};

const DISPLAY_ROWS = [
  { label: "期首在庫_原価", key: "beginningCost" },
  { label: "期首在庫_売価", key: "beginningPrice" },
  { label: "売上高", key: "sales" },
  { label: "売上原価", key: "costOfGoodsSold" },
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

const VIEW_MODES = [
  { key: 'company', label: '全社' },
  { key: 'classification', label: '分類別' },
  { key: 'store', label: '店舗別' }
];

function MonthlyComparisonTable({ monthData = {}, selectedMonth }) {
  const { 
    Table, TableHead, TableBody, TableRow, TableCell,
    Paper, FormControl, Select, MenuItem, Chip,
    InputLabel, Radio, RadioGroup, FormControlLabel,
    Button, Stack, TextField
  } = MaterialUI;

  // セル共通のスタイル（罫線・パディング）
  const cellStyle = { border: '1px solid #ccc', padding: '8px' };

  // 編集可能なキー一覧
  const editableKeys = [
    "beginningCost",
    "beginningPrice",
    "sales",
    "midPurchaseCost",
    "midPurchasePrice",
    "priceIncrease",
    "priceDecrease",
    "lossRate",
    "rebateCost",
    "endingCost",
    "endingPrice"
  ];

  // 表示モードの状態管理
  const [viewMode, setViewMode] = React.useState('company');
  const [selectedLevel, setSelectedLevel] = React.useState('company');
  const [selectedParent, setSelectedParent] = React.useState(null);

  // 表示項目の選択状態
  const [selectedRows, setSelectedRows] = React.useState(() => {
    const initial = {};
    DISPLAY_ROWS.forEach(row => { initial[row.key] = true; });
    return initial;
  });

  // 分類表示の切替状態
  const [visibleClassifications, setVisibleClassifications] = React.useState(() => {
    const initial = {};
    CLASSIFICATION_LEVELS.forEach(level => { initial[level.key] = true; });
    return initial;
  });

  // 当月セルの編集値を保持する状態
  // 構造は { [itemKey]: { [rowKey]: editedValue } }
  const [editedValues, setEditedValues] = React.useState({});

  const updateEdited = (itemKey, rowKey, newVal) => {
    setEditedValues(prev => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [rowKey]: newVal
      }
    }));
  };

  // ヘルパー関数：数値の整形（小数点第1位まで表示）
  const formatNumber = (num) => {
    if (typeof num === "number") {
      return num.toFixed(1);
    }
    return "0.0";
  };

  // 表示モード切替コントロール
  const renderViewModeControl = () => (
    <FormControl component="fieldset" style={{ marginBottom: '10px' }}>
      <RadioGroup row value={viewMode} onChange={(e) => {
        setViewMode(e.target.value);
        // モード切替時に適切な初期レベルを設定
        setSelectedLevel(e.target.value === 'classification' ? 'department' : 
                         e.target.value === 'store' ? 'block' : 'company');
      }}>
        {VIEW_MODES.map(mode => (
          <FormControlLabel
            key={mode.key}
            value={mode.key}
            control={<Radio />}
            label={mode.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  // 階層レベル選択コントロール
  const renderLevelSelector = () => {
    if (viewMode === 'company') return null;

    const levels = viewMode === 'classification' 
      ? ['department', 'corner', 'line', 'category']
      : ['block', 'store'];

    return (
      <FormControl style={{ minWidth: 120, marginLeft: 20 }}>
        <InputLabel>表示レベル</InputLabel>
        <Select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={cellStyle}
        >
          {levels.map(level => (
            <MenuItem key={level} value={level}>
              {HIERARCHY_STRUCTURE[level].label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // 選択中の親要素選択コントロール
  const renderParentSelector = () => {
    if (viewMode === 'company' || !HIERARCHY_STRUCTURE[selectedLevel].children) return null;

    const parentLevel = Object.entries(HIERARCHY_STRUCTURE)
      .find(([_, value]) => value.children.includes(selectedLevel))?.[0];

    if (!parentLevel) return null;

    return (
      <FormControl style={{ minWidth: 120, marginLeft: 20 }}>
        <InputLabel>{HIERARCHY_STRUCTURE[parentLevel].label}</InputLabel>
        <Select
          value={selectedParent || ''}
          onChange={(e) => setSelectedParent(e.target.value)}
          style={cellStyle}
        >
          {Array.from({ length: HIERARCHY_STRUCTURE[parentLevel].count }, (_, i) => (
            <MenuItem key={i} value={`${parentLevel}_${i+1}`}>
              {`${HIERARCHY_STRUCTURE[parentLevel].label}${i+1}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // 分類切替コントロール
  const renderClassificationControl = () => (
    <div style={{ marginBottom: 10 }}>
      <span>分類表示切替：</span>
      {CLASSIFICATION_LEVELS.map(level => (
        <Chip
          key={level.key}
          label={level.label}
          onClick={() => setVisibleClassifications(prev => ({
            ...prev,
            [level.key]: !prev[level.key]
          }))}
          color={visibleClassifications[level.key] ? "primary" : "default"}
          style={{ marginRight: 5 }}
        />
      ))}
    </div>
  );

  // ヘッダー部分の生成（分類ごとの列を展開）
  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell style={{ ...cellStyle, verticalAlign: 'middle', textAlign: 'center' }} rowSpan={2}>
          項目
        </TableCell>
        {CLASSIFICATION_LEVELS.filter(level => visibleClassifications[level.key]).map(level => (
          <TableCell key={level.key} style={{ ...cellStyle, textAlign: 'center' }} colSpan={3}>
            {level.label}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        {CLASSIFICATION_LEVELS.filter(level => visibleClassifications[level.key]).map(level => (
          <React.Fragment key={level.key}>
            <TableCell style={{ ...cellStyle, textAlign: 'center' }}>前月</TableCell>
            <TableCell style={{ ...cellStyle, textAlign: 'center' }}>当月</TableCell>
            <TableCell style={{ ...cellStyle, textAlign: 'center' }}>次月</TableCell>
          </React.Fragment>
        ))}
      </TableRow>
    </TableHead>
  );

  // 分類別データの生成
  const generateClassificationData = () => {
    switch (selectedLevel) {
      case 'department':
        return monthData.departments.map(dept => ({
          key: dept.id,
          label: dept.id,
          data: dept.data
        }));
      case 'corner':
        if (!selectedParent) return [];
        const [_, deptIndex] = selectedParent.split('_');
        return monthData.departments[deptIndex - 1]?.corners.map(corner => ({
          key: corner.id,
          label: corner.id,
          data: corner.data
        })) || [];
      case 'line':
        if (!selectedParent) return [];
        const [__, cornerDeptIndex, cornerIndex] = selectedParent.split('_');
        return monthData.departments[cornerDeptIndex - 1]?.corners[cornerIndex - 1]?.lines.map(line => ({
          key: line.id,
          label: line.id,
          data: line.data
        })) || [];
      case 'category':
        if (!selectedParent) return [];
        const [___, catDeptIndex, catCornerIndex, lineIndex] = selectedParent.split('_');
        return monthData.departments[catDeptIndex - 1]?.corners[catCornerIndex - 1]?.lines[lineIndex - 1]?.categories.map(category => ({
          key: category.id,
          label: category.id,
          data: category.data
        })) || [];
      default:
        return [];
    }
  };

  // 店舗別データの生成
  const generateStoreData = () => {
    switch (selectedLevel) {
      case 'block':
        return (monthData.blocks || []).map(block => ({
          key: block.id,
          label: block.label,
          data: block.data
        }));
      case 'store':
        if (!selectedParent) return [];
        const [_, blockIndex] = selectedParent.split('_');
        return (monthData.blocks?.[blockIndex - 1]?.stores || []).map(store => ({
          key: store.id,
          label: store.label,
          data: store.data
        }));
      default:
        return [];
    }
  };

  // データ行の生成（当月を中心とした３か月のみ表示）
  const renderDataRows = () => {
    const visibleRows = DISPLAY_ROWS.filter(row => selectedRows[row.key]);

    // 表示データの取得
    const getDisplayData = () => {
      switch (viewMode) {
        case 'company':
          const defaultCompanyData = {
            prev: {},
            current: {},
            next: {}
          };
          return [{
            key: 'company',
            label: '全社',
            data: monthData.company || defaultCompanyData
          }];
        case 'classification':
          return generateClassificationData();
        case 'store':
          return generateStoreData();
        default:
          return [];
      }
    };

    const displayData = getDisplayData();

    return visibleRows.map(row => (
      <TableRow key={row.key}>
        <TableCell style={cellStyle}>{row.label}</TableCell>
        {displayData.map(item => {
          const prevValue = item.data?.prev?.[row.key] || 0;
          const currentValue = item.data?.current?.[row.key] || 0;
          const nextValue = item.data?.next?.[row.key] || 0;

          return (
            <React.Fragment key={item.key}>
              <TableCell style={cellStyle} align="right">{formatNumber(prevValue)}</TableCell>
              <TableCell style={cellStyle} align="right">
                {editableKeys.includes(row.key) ? (
                  <TextField
                    value={editedValues[item.key]?.[row.key] ?? currentValue}
                    onChange={(e) => updateEdited(item.key, row.key, e.target.value)}
                    variant="standard"
                    size="small"
                    type="number"
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                ) : (
                  formatNumber(currentValue)
                )}
              </TableCell>
              <TableCell style={cellStyle} align="right">{formatNumber(nextValue)}</TableCell>
            </React.Fragment>
          );
        })}
      </TableRow>
    ));
  };

  // CSVエクスポート機能（３か月分）
  const exportToCSV = () => {
    const rows = DISPLAY_ROWS.filter(row => selectedRows[row.key]);
    const header = ['項目', '前月', '当月', '次月'];
    const csvContent = [
      header.join(','),
      ...rows.map(row => {
        const data = monthData.monthlyDetails[selectedMonth] || {};
        return [
          row.label,
          data[row.key]?.prev || 0,
          data[row.key]?.current || 0,
          data[row.key]?.next || 0
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `monthly_comparison_${selectedMonth}月.csv`;
    link.click();
  };

  // Excelテンプレートダウンロード
  const downloadTemplate = () => {
    alert('テンプレートのダウンロードは準備中です');
  };

  // データのアップロード処理
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        // ヘッダー行をスキップしてデータを処理
        rows.slice(1).forEach(row => {
          const [label, prev, current, next] = row.split(',');
          // データの更新処理をここに実装
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <Paper style={{ padding: 20, marginBottom: 20 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={exportToCSV}>
          CSVエクスポート
        </Button>
        <Button variant="contained" onClick={downloadTemplate}>
          テンプレートダウンロード
        </Button>
        <Button variant="contained" component="label">
          データアップロード
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileUpload}
          />
        </Button>
      </Stack>
      <h2>単月比較表 ({selectedMonth}月)</h2>
      {renderViewModeControl()}
      {renderLevelSelector()}
      {renderParentSelector()}
      {renderClassificationControl()}
      <div className="chip-area" style={{ marginBottom: 10 }}>
        <span>表示項目：</span>
        {DISPLAY_ROWS.map(row => (
          <Chip
            key={row.key}
            label={row.label}
            onClick={() => setSelectedRows(prev => ({
              ...prev,
              [row.key]: !prev[row.key]
            }))}
            color={selectedRows[row.key] ? "primary" : "default"}
            style={{ marginRight: 5 }}
          />
        ))}
      </div>
      <Table size="small">
        {renderTableHeader()}
        <TableBody>
          {renderDataRows()}
        </TableBody>
      </Table>
    </Paper>
  );
}

// グローバル登録（ブラウザ環境の場合）
if (typeof window !== 'undefined') {
  window.MonthlyComparisonTable = MonthlyComparisonTable;
}
