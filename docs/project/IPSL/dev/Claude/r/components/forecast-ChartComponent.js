// components/ChartComponent.js
function ChartComponent({ monthlyData }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      // x軸ラベル（「年度合計」を除く）
      const labels = ["3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月"];
      const dataOld = labels.map((_, i) => monthlyData[i+1]?.old || 0);
      const dataPlan = labels.map((_, i) => monthlyData[i+1]?.factor || 0);
      const dataActual = labels.map((_, i) => monthlyData[i+1]?.actual || 0);

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: '前年', data: dataOld, borderColor: 'blue', backgroundColor: 'blue', fill: false, tension: 0.1 },
            { label: '計画', data: dataPlan, borderColor: 'green', backgroundColor: 'green', fill: false, tension: 0.1 },
            { label: '実績', data: dataActual, borderColor: 'red', backgroundColor: 'red', fill: false, tension: 0.1 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "月次" } },
            x: { title: { display: true, text: "月" } }
          }
        }
      });
      return () => chart.destroy();
    }
  }, [monthlyData]);

  // キャンバスの親コンテナに固定の高さを設定
  return (
    <Paper style={{ marginBottom: 20, padding: 20, overflowX: "auto" }}>
    <div style={{ height: "35vh", width: "100%" }}>
      <canvas ref={canvasRef} style={{ height: "100%", width: "100%" }} />
    </div>
    </Paper>

  );
}
