// app/components/RevenueChartDetailed.js
function RevenueChartDetailed({ labels, data, inventory, selected, metric, buckets }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);
  const values = (data||[]).map(v=>v||0);
  const seriesLabel = (metric==='units') ? '販売点数' : (metric==='revenue') ? '売上高' : '粗利高';
  const ma3 = values.map((_, i) => {
    const from = Math.max(0, i - 2); const n = i - from + 1;
    const sumv = values.slice(from, i + 1).reduce((p, c) => p + c, 0);
    return sumv / n;
  });
  const invValues = inventory || [];

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    const annotations = {};
    if (selected?.forecastEnd && Array.isArray(buckets) && buckets.length) {
      const idx = buckets.findIndex(b => (b.start <= selected.forecastEnd && selected.forecastEnd <= b.end));
      if (idx >= 0 && labels[idx]) {
        annotations['depletion'] = {
          type: 'line', xMin: labels[idx], xMax: labels[idx],
          borderColor: 'rgba(220,20,60,0.9)', borderWidth: 2,
          label: { enabled: true, content: `在庫0予測 ${selected.forecastEnd}`, position: 'start' }
        };
      }
    }
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { type: 'bar', label: seriesLabel, data: values, borderRadius:3, yAxisID: 'y' },
          { type: 'line', label: '移動平均(3)', data: ma3, borderWidth: 2, pointRadius: 0, tension: 0.35, fill:false, yAxisID:'y' },
          { type: 'line', label: '在庫推移（推定）', data: invValues, borderWidth:2, pointRadius:0, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y:  { position:'left', beginAtZero:true, title:{ display:true, text: seriesLabel } },
          y1: { position:'right', beginAtZero:true, grid:{ drawOnChartArea:false }, title:{ display:true, text:'在庫' } }
        },
        plugins: { annotation: { annotations }, legend:{ position:'top' } }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels.join('|'), values.join('|'), ma3.join('|'), (inventory||[]).join('|'), selected?.label, selected?.forecastEnd, metric, JSON.stringify(buckets)]);

  return <div className="vh35"><canvas ref={canvasRef} /></div>;
}
