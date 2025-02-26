// components/GraphDataTable.js
function GraphDataTable({ monthlyData }) {
  const { Table, TableHead, TableBody, TableRow, TableCell, Paper } = MaterialUI;
  const parentColumns = ["年度合計", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月"];
  return (
    <Paper style={{ marginBottom: 20, padding: 20, overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className="header-cell">データ系列</TableCell>
            {parentColumns.slice(1).map((month, index) => (
              <TableCell key={index} className="header-cell" align="center">{month}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {["前年", "計画", "実績"].map(series => (
            <TableRow key={series}>
              <TableCell className="header-cell">{series}</TableCell>
              {parentColumns.slice(1).map((month, index) => {
                const data = monthlyData[index+1] || {};
                const value = series === "前年" ? data.old : series === "計画" ? data.factor : data.actual;
                return <TableCell key={index} align="center">{value}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
