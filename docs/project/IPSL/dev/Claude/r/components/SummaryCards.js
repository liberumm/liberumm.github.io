const { Grid, Paper, Typography } = MaterialUI;
const { useState } = React;

function SummaryCards() {
  // データ定義を移動
  const [data, setData] = useState([/* ...existing data... */]);
  const summaryStatus = ['依頼中', '提案中', '確定済', '発注残', '発注済', '納品済', '差し戻し', '削除予定'];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {summaryStatus.map((status) => {
        const statusData = data.filter((item) => item.status === status);
        const totalQuantity = statusData.reduce((acc, item) => acc + item.quantity, 0);
        const totalCost = statusData.reduce((acc, item) => acc + item.totalCost, 0);
        const totalPrice = statusData.reduce((acc, item) => acc + item.totalPrice, 0);
        const totalMarkup = statusData.reduce((acc, item) => acc + (item.price - item.cost), 0);
        const avgPrice =
          statusData.length > 0
            ? (statusData.reduce((acc, item) => acc + item.price, 0) / statusData.length).toFixed(2)
            : 0;

        return (
          <Grid item xs={6} sm={4} md={3} key={status}>
            <Paper sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
              <Typography variant="subtitle2">ステータス: {status}</Typography>
              <Typography variant="body2">数量: {totalQuantity}</Typography>
              <Typography variant="body2">原価計: {totalCost}</Typography>
              <Typography variant="body2">売価計: {totalPrice}</Typography>
              <Typography variant="body2">値入: {totalMarkup}</Typography>
              <Typography variant="body2">平均売価: {avgPrice}</Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
