// components/IntegratedTable.js
// ※ React, MaterialUI はグローバルで利用可能な前提です

// 必須入力項目の定義（これ以外は計算で導出）
const REQUIRED_INPUTS = [
  { label: "期首在庫_原価", key: "beginningCost" },
  { label: "期首在庫_売価", key: "beginningPrice" },
  { label: "売上高", key: "sales" },
  { label: "期中仕入_原価", key: "midPurchaseCost" },
  { label: "期中仕入_売価", key: "midPurchasePrice" },
  { label: "値上_売価", key: "priceIncrease" },
  { label: "値下_売価", key: "priceDecrease" },
  { label: "リベート高_原価", key: "rebateCost" },
  { label: "ロス率_売価", key: "lossRate" }
];

// 計算項目の定義
const COMPUTED_ROWS = [
  { label: "売上原価", key: "costOfGoodsSold" },
  { label: "売上総利益", key: "grossProfit" },
  { label: "期末在庫_原価", key: "endingCost" },
  { label: "期末在庫_売価", key: "endingPrice" },
  { label: "回転日数", key: "turnoverDays" }
];

// 全表示項目
const ALL_ROWS = [...REQUIRED_INPUTS, ...COMPUTED_ROWS];

// ----- 連続期間計算用のロジック -----
// 1期間分の計算を行い、期末在庫などを求める
function computePeriodData(data, prevEnding) {
  // 前期からの繰越がある場合は使用（ない場合は入力値を使用）
  const beginningCost = data.beginningCost || (prevEnding ? prevEnding.endingCost : 0);
  const beginningPrice = data.beginningPrice || (prevEnding ? prevEnding.endingPrice : 0);
  
  // 必須入力項目の取得
  const sales = data.sales || 0;
  const midPurchaseCost = data.midPurchaseCost || 0;
  const midPurchasePrice = data.midPurchasePrice || 0;
  const priceIncrease = data.priceIncrease || 0;
  const priceDecrease = data.priceDecrease || 0;
  const lossRate = data.lossRate || 0;
  const rebateCost = data.rebateCost || 0;
  
  // 売価還元法による計算
  const endingPrice = beginningPrice + midPurchasePrice + priceIncrease - priceDecrease - sales;
  
  // 原価率の計算
  const totalPrice = beginningPrice + midPurchasePrice + priceIncrease - priceDecrease;
  const costRate = totalPrice !== 0 ? 
    (beginningCost + midPurchaseCost - rebateCost) / totalPrice : 0;
  
  // 売上原価と売上総利益の計算
  const costOfGoodsSold = sales * costRate;
  const grossProfit = sales - costOfGoodsSold;
  
  // 期末在庫（原価）の計算
  const endingCost = endingPrice * costRate;
  
  // 回転日数の計算（月平均）
  const turnoverDays = costOfGoodsSold !== 0 ? 
    (endingCost / costOfGoodsSold) * 30 : 0;

  return {
    ...data, // 入力値はそのまま保持
    endingCost,
    endingPrice,
    costOfGoodsSold,
    grossProfit,
    turnoverDays,
    costRate // 内部計算用
  };
}

// 複数期間の連続計算を実施
function computeChainedPeriods(periods) {
  var results = [];
  var prevEnding = null;
  periods.forEach(function(periodData) {
    var result = computePeriodData(periodData, prevEnding);
    results.push(result);
    // 次期間は、当期の計算結果を使う（ただし、beginning* は自動生成されないので入力があればそちらが優先）
    prevEnding = result;
  });
  return results;
}

// オブジェクト形式（キー:2～13）の各月データを配列に変換し、連続計算後、再びオブジェクトにする
function getComputedData(originalData) {
  var periods = [];
  for (var key = 2; key <= 13; key++) {
    periods.push(originalData[key] || {});
  }
  var computed = computeChainedPeriods(periods);
  var computedObj = {};
  for (var i = 2; i <= 13; i++) {
    computedObj[i] = computed[i - 2];
  }
  return computedObj;
}

// ヘルパー関数：数値の場合は小数点第1位までの文字列にする
function formatNumber(num) {
  if (typeof num === "number") {
    return num.toFixed(1);
  }
  return num;
}

// ----- コンポーネント本体 -----
function IntegratedTable(props) {
  var currentPlanData = props.currentPlanData;
  var progressData = props.progressData;
  var lastYearData = props.lastYearData;
  
  var Table = MaterialUI.Table,
      TableHead = MaterialUI.TableHead,
      TableBody = MaterialUI.TableBody,
      TableRow = MaterialUI.TableRow,
      TableCell = MaterialUI.TableCell,
      Paper = MaterialUI.Paper,
      Chip = MaterialUI.Chip;
  
  var _React$useState = React.useState({
        lastYear: true,
        plan: true,
        actual: true
      }),
      showIntegratedColumns = _React$useState[0],
      setShowIntegratedColumns = _React$useState[1];
  
  var LAST_YEAR_ROWS = [
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
  
  var _React$useState2 = React.useState(function() {
        const initial = {};
        ALL_ROWS.forEach(row => { initial[row.key] = true; });
        return initial;
      }),
      showIntegratedRows = _React$useState2[0],
      setShowIntegratedRows = _React$useState2[1];
  
  var parentColumns = ["年度合計", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月"];
  
  // 計算が必要な項目（元データではなく連続計算結果を表示する）
  var computedRowKeys = ["costOfGoodsSold", "grossProfit", "endingCost", "endingPrice", "turnoverDays"];
  
  // 各データセットについて、各月（キー:2～13）の連続計算を実施
  var computedLastYear = getComputedData(lastYearData);
  var computedPlan = getComputedData(currentPlanData);
  var computedProgress = getComputedData(progressData);
  
  return React.createElement(
    Paper,
    { style: { padding: 20, overflowX: "auto", marginBottom: 20 } },
    React.createElement(
      "div",
      { className: "chip-area" },
      React.createElement("span", null, "列の表示切替:"),
      React.createElement(Chip, {
        label: "前年",
        onClick: function() {
          return setShowIntegratedColumns(function(prev) {
            return Object.assign({}, prev, { lastYear: !prev.lastYear });
          });
        },
        color: showIntegratedColumns.lastYear ? "primary" : "default"
      }),
      React.createElement(Chip, {
        label: "計画",
        onClick: function() {
          return setShowIntegratedColumns(function(prev) {
            return Object.assign({}, prev, { plan: !prev.plan });
          });
        },
        color: showIntegratedColumns.plan ? "primary" : "default"
      }),
      React.createElement(Chip, {
        label: "実績",
        onClick: function() {
          return setShowIntegratedColumns(function(prev) {
            return Object.assign({}, prev, { actual: !prev.actual });
          });
        },
        color: showIntegratedColumns.actual ? "primary" : "default"
      })
    ),
    React.createElement(
      "div",
      { className: "chip-area", style: { marginTop: 10 } },
      React.createElement("span", null, "行の表示切替:"),
      LAST_YEAR_ROWS.map(function(row) {
        return React.createElement(Chip, {
          key: row.key,
          label: row.label,
          onClick: function() {
            return setShowIntegratedRows(function(prev) {
              var newObj = Object.assign({}, prev);
              newObj[row.key] = !prev[row.key];
              return newObj;
            });
          },
          color: showIntegratedRows[row.key] ? "primary" : "default"
        });
      })
    ),
    React.createElement("h2", null, "統合テーブル"),
    (function() {
      var visibleCount = [showIntegratedColumns.lastYear, showIntegratedColumns.plan, showIntegratedColumns.actual].filter(function(v) { return v; }).length;
      return React.createElement(
        Table,
        { size: "small" },
        React.createElement(
          TableHead,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(
              TableCell,
              { className: "header-cell", rowSpan: 2, align: "center" },
              "期間"
            ),
            React.createElement(
              TableCell,
              { className: "header-cell", align: "center", colSpan: visibleCount },
              "年度合計"
            ),
            parentColumns.slice(1).map(function(month, index) {
              return React.createElement(
                TableCell,
                { key: index, className: "header-cell", align: "center", colSpan: visibleCount },
                month
              );
            })
          ),
          React.createElement(
            TableRow,
            null,
            showIntegratedColumns.lastYear && React.createElement(
              TableCell,
              { className: "header-cell", align: "center" },
              "前年"
            ),
            showIntegratedColumns.plan && React.createElement(
              TableCell,
              { className: "header-cell", align: "center" },
              "計画"
            ),
            showIntegratedColumns.actual && React.createElement(
              TableCell,
              { className: "header-cell", align: "center" },
              "実績"
            ),
            parentColumns.slice(1).map(function(month, index) {
              var cells = [];
              if (showIntegratedColumns.lastYear) {
                cells.push(React.createElement(
                  TableCell,
                  { key: "ly-" + index, className: "header-cell", align: "center" },
                  "前年"
                ));
              }
              if (showIntegratedColumns.plan) {
                cells.push(React.createElement(
                  TableCell,
                  { key: "plan-" + index, className: "header-cell", align: "center" },
                  "計画"
                ));
              }
              if (showIntegratedColumns.actual) {
                cells.push(React.createElement(
                  TableCell,
                  { key: "act-" + index, className: "header-cell", align: "center" },
                  "実績"
                ));
              }
              return cells;
            })
          )
        ),
        React.createElement(
          TableBody,
          null,
          LAST_YEAR_ROWS.filter(function(row) { return showIntegratedRows[row.key]; }).map(function(row) {
            return React.createElement(
              TableRow,
              { key: row.key },
              React.createElement(
                TableCell,
                { className: "header-cell", align: "right" },
                row.label
              ),
              // 年度合計
              showIntegratedColumns.lastYear && React.createElement(
                TableCell,
                { align: "right" },
                (function() {
                  var sum = 0;
                  for (var key = 2; key <= 13; key++) {
                    var value;
                    if (computedRowKeys.indexOf(row.key) !== -1) {
                      value = computedLastYear[key] ? computedLastYear[key][row.key] : 0;
                    } else {
                      value = lastYearData[key] ? lastYearData[key][row.key] : 0;
                    }
                    sum += value || 0;
                  }
                  return formatNumber(sum);
                })()
              ),
              showIntegratedColumns.plan && React.createElement(
                TableCell,
                { align: "right" },
                (function() {
                  var sum = 0;
                  for (var key = 2; key <= 13; key++) {
                    var value;
                    if (computedRowKeys.indexOf(row.key) !== -1) {
                      value = computedPlan[key] ? computedPlan[key][row.key] : 0;
                    } else {
                      value = currentPlanData[key] ? currentPlanData[key][row.key] : 0;
                    }
                    sum += value || 0;
                  }
                  return formatNumber(sum);
                })()
              ),
              showIntegratedColumns.actual && React.createElement(
                TableCell,
                { align: "right" },
                (function() {
                  var sum = 0;
                  for (var key = 2; key <= 13; key++) {
                    var value;
                    if (computedRowKeys.indexOf(row.key) !== -1) {
                      value = computedProgress[key] ? computedProgress[key][row.key] : 0;
                    } else {
                      value = progressData[key] ? progressData[key][row.key] : 0;
                    }
                    sum += value || 0;
                  }
                  return formatNumber(sum);
                })()
              ),
              // 各月のデータ
              parentColumns.slice(1).map(function(month, index) {
                var monthKey = index + 1;
                var cells = [];
                if (showIntegratedColumns.lastYear) {
                  var data = lastYearData[monthKey] || {};
                  var computedData = computedLastYear[monthKey] || {};
                  cells.push(React.createElement(
                    TableCell,
                    { key: "ly-" + monthKey + "-" + row.key, align: "right" },
                    computedRowKeys.indexOf(row.key) !== -1
                      ? formatNumber(computedData[row.key])
                      : formatNumber(data[row.key])
                  ));
                }
                if (showIntegratedColumns.plan) {
                  var dataPlan = currentPlanData[monthKey] || {};
                  var computedDataPlan = computedPlan[monthKey] || {};
                  cells.push(React.createElement(
                    TableCell,
                    { key: "plan-" + monthKey + "-" + row.key, align: "right" },
                    computedRowKeys.indexOf(row.key) !== -1
                      ? formatNumber(computedDataPlan[row.key])
                      : formatNumber(dataPlan[row.key])
                  ));
                }
                if (showIntegratedColumns.actual) {
                  var dataProgress = progressData[monthKey] || {};
                  var computedDataProgress = computedProgress[monthKey] || {};
                  cells.push(React.createElement(
                    TableCell,
                    { key: "act-" + monthKey + "-" + row.key, align: "right" },
                    computedRowKeys.indexOf(row.key) !== -1
                      ? formatNumber(computedDataProgress[row.key])
                      : formatNumber(dataProgress[row.key])
                  ));
                }
                return cells;
              })
            );
          })
        )
      );
    })()
  );
}

// グローバル登録（必要に応じて）
window.IntegratedTable = IntegratedTable;
