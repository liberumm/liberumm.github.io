// components/GroupDetailTable.js
function GroupDetailTable({ selectedYear, setSelectedYear }) {
  const { Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, FormControl, InputLabel, Select, MenuItem, Chip } = MaterialUI;
  
  // 年度選択用の定数
  const FISCAL_YEARS = Array.from({ length: 6 }, (_, i) => 2020 + i);
  const DISPLAY_TYPES = ["全社", "部門", "コーナー", "ライン", "カテゴリ"];
  
  // 表示制御用の状態
  const [selectedDisplay, setSelectedDisplay] = React.useState("全社");
  const [selectedDeptChip, setSelectedDeptChip] = React.useState(null);
  const [selectedCornerChip, setSelectedCornerChip] = React.useState(null);

  // フィルター部分のレンダリング
  const renderFilters = () => (
    <div style={{ marginBottom: 20, marginTop: 20 }}>
      <FormControl style={{ minWidth: 120, marginBottom: 20, marginRight: 20 }}>
        <InputLabel>年度</InputLabel>
        <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {FISCAL_YEARS.map(year => (
            <MenuItem key={year} value={year}>
              {year}年度（{year-1}年4月～{year}年3月）
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ minWidth: 120, marginBottom: 20 }}>
        <InputLabel>表示対象</InputLabel>
        <Select
          value={selectedDisplay}
          onChange={(e) => {
            setSelectedDisplay(e.target.value);
            setSelectedDeptChip(null);
            setSelectedCornerChip(null);
          }}
        >
          {DISPLAY_TYPES.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {(selectedDisplay === "コーナー" || selectedDisplay === "ライン" || selectedDisplay === "カテゴリ") && (
        <div className="chip-area">
          <span>部門を選ぶ:</span>
          {Array.from({ length: 5 }, (_, i) => (
            <Chip 
              key={`dept_chip_${i+1}`}
              label={`部門${i+1}`}
              onClick={() => { setSelectedDeptChip(i+1); setSelectedCornerChip(null); }}
              color={selectedDeptChip === i+1 ? "primary" : "default"}
            />
          ))}
        </div>
      )}
      {(selectedDisplay === "ライン" || selectedDisplay === "カテゴリ") && selectedDeptChip && (
        <div className="chip-area">
          <span>コーナーを選ぶ:</span>
          {Array.from({ length: 5 }, (_, j) => (
            <Chip 
              key={`corner_chip_${j+1}`}
              label={`コーナー${j+1}`}
              onClick={() => setSelectedCornerChip(j+1)}
              color={selectedCornerChip === j+1 ? "primary" : "default"}
            />
          ))}
        </div>
      )}
    </div>
  );

  const PARENT_COLUMNS = [
    "年度合計",
    "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月",
    "1月", "2月", "3月", "4月"
  ];
  const SUB_COLUMNS = ["前年", "計画", "傾向", "実績"];
  // 行定義
  const monthlyRows = [{ label: "月次", type: "monthly" }];
  const weeklyRows = [];
  for (let w = 1; w <= 6; w++) {
    weeklyRows.push({ label: `第${w}週`, type: "weekly" });
  }
  const weekdayRows = [];
  ["月曜", "火曜", "水曜", "木曜", "金曜", "土曜", "日曜"].forEach(label => {
    weekdayRows.push({ label, type: "weekday" });
  });
  const dailyRows = [];
  for (let d = 1; d <= 31; d++) {
    dailyRows.push({ label: `${d}日`, type: "daily" });
  }
  // 初期データ生成（グラフ用）
  const generateRowData = (rows) => {
    return rows.map(() => {
      let row = {};
      PARENT_COLUMNS.forEach((col, pIndex) => {
        row[pIndex] = (pIndex === 0) ? null : { old: Math.floor(Math.random()*100), factor: Math.floor(Math.random()*100), yoy: 100, actual: Math.floor(Math.random()*100) };
      });
      return row;
    });
  };
  // 日付計算用ヘルパー
  const getActualMonthAndYear = (monthIndex, fiscalYear) => {
    if (monthIndex === 0) return null;
    let year = fiscalYear, month;
    if (monthIndex === 1) { year = fiscalYear - 1; month = 3; }
    else if (monthIndex === 14) { year = fiscalYear + 1; month = 4; }
    else { month = ((monthIndex - 2 + 3) % 12) + 1; }
    return { year, month };
  };
  const getDaysInMonth = (year, monthIndex) => {
    if (monthIndex === 0) return 0;
    const { year: actualYear, month: actualMonth } = getActualMonthAndYear(monthIndex, selectedYear);
    return new Date(actualYear, actualMonth, 0).getDate();
  };
  const isCellDisabled = (rowType, monthIndex) => {
    if (rowType.type === 'monthly' || rowType.type === 'weekday') return false;
    if (monthIndex === 0) return true;
    const daysInMonth = getDaysInMonth(selectedYear, monthIndex);
    if (rowType.type === 'weekly') return false;
    if (rowType.type === 'daily') {
      const day = parseInt(rowType.label);
      return day > daysInMonth;
    }
    return false;
  };
  const totalColSpan = 1 + (PARENT_COLUMNS.length * SUB_COLUMNS.length);
  // 各グループのデータセット作成
  const createGroupData = () => {
    return {
      monthly: generateRowData(monthlyRows),
      weekly: generateRowData(weeklyRows),
      weekday: generateRowData(weekdayRows),
      daily: generateRowData(dailyRows)
    };
  };
  // グループ構造生成
  const getGroups = () => {
    switch(selectedDisplay) {
      case "全社":
      case "部門":
        return Array.from({ length: (selectedDisplay === "全社" ? 1 : 5) }, (_, i) => ({
          id: (selectedDisplay === "全社") ? "grp_all" : `dept_${i+1}`,
          label: (selectedDisplay === "全社") ? "全社" : `部門${i+1}`,
          children: createGroupData()
        }));
      case "コーナー": {
        let groups = Array.from({ length: 5 }, (_, i) => ({
          id: `dept_${i+1}`,
          label: `部門${i+1}`,
          subGroups: Array.from({ length: 5 }, (_, j) => ({
            id: `dept_${i+1}_corner_${j+1}`,
            label: `コーナー${j+1}`,
            children: createGroupData()
          }))
        }));
        if (selectedDeptChip) {
          groups = groups.filter(g => g.id === `dept_${selectedDeptChip}`);
        }
        return groups;
      }
      case "ライン": {
        let groups = Array.from({ length: 5 }, (_, i) => ({
          id: `dept_${i+1}`,
          label: `部門${i+1}`,
          subGroups: Array.from({ length: 5 }, (_, j) => ({
            id: `dept_${i+1}_corner_${j+1}`,
            label: `コーナー${j+1}`,
            subGroups: Array.from({ length: 5 }, (_, k) => ({
              id: `dept_${i+1}_corner_${j+1}_line_${k+1}`,
              label: `ライン${k+1}`,
              children: createGroupData()
            }))
          }))
        }));
        if (selectedDeptChip) {
          groups = groups.filter(g => g.id === `dept_${selectedDeptChip}`);
          if (selectedCornerChip) {
            groups = groups.map(g => ({
              ...g,
              subGroups: g.subGroups.filter(sg => sg.id === `dept_${selectedDeptChip}_corner_${selectedCornerChip}`)
            }));
          }
        }
        return groups;
      }
      case "カテゴリ": {
        return Array.from({ length: 5 }, (_, i) => ({
          id: `dept_${i+1}`,
          label: `部門${i+1}`,
          subGroups: Array.from({ length: 5 }, (_, j) => ({
            id: `dept_${i+1}_corner_${j+1}`,
            label: `コーナー${j+1}`,
            subGroups: Array.from({ length: 5 }, (_, k) => ({
              id: `dept_${i+1}_corner_${j+1}_line_${k+1}`,
              label: `ライン${k+1}`,
              subGroups: Array.from({ length: 3 }, (_, l) => ({
                id: `dept_${i+1}_corner_${j+1}_line_${k+1}_cat_${l+1}`,
                label: `カテゴリ${l+1}`,
                children: createGroupData()
              }))
            }))
          }))
        }));
      }
      default:
        return [];
    }
  };
  // 各グループの折りたたみ状態およびグローバル表示フラグ
  const [toggleGroups, setToggleGroups] = React.useState({});
  const [allExpanded, setAllExpanded] = React.useState(true);
  const [globalShowWeekly, setGlobalShowWeekly] = React.useState(true);
  const [globalShowWeekday, setGlobalShowWeekday] = React.useState(true);
  const [globalShowDaily, setGlobalShowDaily] = React.useState(true);
  // 各行をレンダリングするための関数
  const renderRows = (groupIdPrefix, dataArray, rowDefs) => {
    return dataArray.map((rowData, i) => {
      let rowDef = rowDefs[i];
      let rowClass = "";
      if(rowDef.type === "weekly" && rowDef.label === "第6週") rowClass = "week6";
      if(rowDef.type === "weekday" && rowDef.label === "日曜") rowClass = "sunday";
      return (
        <TableRow key={groupIdPrefix + "-" + i} className={rowClass}>
          <TableCell className="header-cell">{rowDef.label}</TableCell>
          {PARENT_COLUMNS.map((_, pIndex) => (
            <React.Fragment key={pIndex}>
              {SUB_COLUMNS.map((sub, sIndex) => (
                <TableCell 
                  key={`${groupIdPrefix}-${pIndex}-${sIndex}`} 
                  align="center"
                  className={ isCellDisabled(rowDef, pIndex) ? 'disabled-cell' : '' }
                  style={(sIndex === SUB_COLUMNS.length - 1 && pIndex !== PARENT_COLUMNS.length - 1) ? { borderRight: '2px solid #000' } : {}}
                >
                  {pIndex === 0 ? "" : (
                    <div className="editable-cell" contentEditable={!isCellDisabled(rowDef, pIndex)} suppressContentEditableWarning>
                      {rowData[pIndex][ sIndex === 0 ? "old" : (sIndex === 1 ? "factor" : (sIndex === 2 ? "yoy" : "actual")) ]}
                    </div>
                  )}
                </TableCell>
              ))}
            </React.Fragment>
          ))}
        </TableRow>
      );
    });
  };
  // 再帰的にグループをレンダリング
  const renderGroupRecursive = (groups, indent = 0) => {
    let rows = [];
    groups.forEach(group => {
      const isExpanded = toggleGroups[group.id] !== false;
      rows.push(
        <TableRow key={group.id} 
          className={indent === 0 ? "group-header" : "sub-group-header"}
          onClick={(e) => {
            e.stopPropagation();
            setToggleGroups(prev => ({ ...prev, [group.id]: !isExpanded }));
          }}
        >
          <TableCell style={{ paddingLeft: indent * 20 }} colSpan={totalColSpan}>
            {group.label} {isExpanded ? "▼" : "▶"}
          </TableCell>
        </TableRow>
      );
      if (group.children) {
        rows = rows.concat(renderRows(group.id + "_monthly", group.children.monthly, monthlyRows));
        if(isExpanded) {
          rows.push(
            <TableRow key={group.id + "_weekly_header"} className="sub-group-header"
              onClick={(e) => { e.stopPropagation(); setGlobalShowWeekly(prev => !prev); }}
            >
              <TableCell style={{ paddingLeft: (indent + 1) * 20 }} colSpan={totalColSpan}>
                週別 {globalShowWeekly ? "▼" : "▶"}
              </TableCell>
            </TableRow>
          );
          if(globalShowWeekly) {
            rows = rows.concat(renderRows(group.id + "_weekly", group.children.weekly, weeklyRows));
          }
          rows.push(
            <TableRow key={group.id + "_weekday_header"} className="sub-group-header"
              onClick={(e) => { e.stopPropagation(); setGlobalShowWeekday(prev => !prev); }}
            >
              <TableCell style={{ paddingLeft: (indent + 1) * 20 }} colSpan={totalColSpan}>
                曜日別 {globalShowWeekday ? "▼" : "▶"}
              </TableCell>
            </TableRow>
          );
          if(globalShowWeekday) {
            rows = rows.concat(renderRows(group.id + "_weekday", group.children.weekday, weekdayRows));
          }
          rows.push(
            <TableRow key={group.id + "_daily_header"} className="sub-group-header"
              onClick={(e) => { e.stopPropagation(); setGlobalShowDaily(prev => !prev); }}
            >
              <TableCell style={{ paddingLeft: (indent + 1) * 20 }} colSpan={totalColSpan}>
                日別 {globalShowDaily ? "▼" : "▶"}
              </TableCell>
            </TableRow>
          );
          if(globalShowDaily) {
            rows = rows.concat(renderRows(group.id + "_daily", group.children.daily, dailyRows));
          }
        }
      }
      if(group.subGroups) {
        rows = rows.concat(renderGroupRecursive(group.subGroups, indent + 1));
      }
    });
    return rows;
  };
  // 全体一括切替用の処理
  const getAllGroupIds = (groups) => {
    let ids = [];
    groups.forEach(group => {
      ids.push(group.id);
      if(group.subGroups) ids = ids.concat(getAllGroupIds(group.subGroups));
    });
    return ids;
  };
  const handleToggleAll = () => {
    const groups = getGroups();
    const allIds = getAllGroupIds(groups);
    const newToggle = {};
    allIds.forEach(id => { newToggle[id] = !allExpanded; });
    setToggleGroups(newToggle);
    setAllExpanded(!allExpanded);
  };
  const groups = getGroups();
  return (
    <Paper style={{ overflowX: 'auto', marginBottom: 20 }}>
      <Button variant="contained" className="toggle-all-btn" onClick={handleToggleAll}>
        {allExpanded ? "全て折りたたむ" : "全て展開"}
      </Button>
      {renderFilters()}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell rowSpan={2} className="header-cell">行/列</TableCell>
            {PARENT_COLUMNS.map((parent, index) => (
              <TableCell 
                key={index} 
                align="center" 
                colSpan={SUB_COLUMNS.length} 
                className="header-cell"
                style={ index !== PARENT_COLUMNS.length - 1 ? { borderRight: '2px solid #000' } : {} }
              >
                {parent}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {PARENT_COLUMNS.map((_, index) =>
              SUB_COLUMNS.map((sub, subIndex) => (
                <TableCell 
                  key={`${index}-${subIndex}`} 
                  align="center" 
                  className="header-cell"
                  style={(subIndex === SUB_COLUMNS.length - 1 && index !== PARENT_COLUMNS.length - 1) ? { borderRight: '2px solid #000' } : {}}
                >
                  {sub}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderGroupRecursive(groups)}
        </TableBody>
      </Table>
    </Paper>
  );
}
