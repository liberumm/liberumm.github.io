// components/DeliveryPlanning.js
function DeliveryPlanning(props) {
    const { Box, Paper, Typography } = MaterialUI;
    const chartRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);

    // フィルタリングされたデータを取得
    const filteredData = React.useMemo(() => {
        return props.data.filter(item => {
            const matchesProduct = props.filters.product === '' || item.productName.includes(props.filters.product);
            const matchesStatus = props.filters.status === '' || item.status.includes(props.filters.status);
            const matchesStore = props.filters.store === '' || item.store.includes(props.filters.store);
            return matchesProduct && matchesStatus && matchesStore;
        });
    }, [props.filters, props.data]);

    // 売上予測データのサンプル（1月1日から1月31日まで）
    const salesForecastData = React.useMemo(() => {
        return [
            { date: '2025-01-01', sales: 120 },
            { date: '2025-01-02', sales: 80 },
            { date: '2025-01-03', sales: 220 },
            { date: '2025-01-04', sales: 170 },
            { date: '2025-01-05', sales: 100 },
            { date: '2025-01-06', sales: 150 },
            { date: '2025-01-07', sales: 130 },
            { date: '2025-01-08', sales: 90 },
            { date: '2025-01-09', sales: 200 },
            { date: '2025-01-10', sales: 160 },
            { date: '2025-01-11', sales: 110 },
            { date: '2025-01-12', sales: 140 },
            { date: '2025-01-13', sales: 95 },
            { date: '2025-01-14', sales: 175 },
            { date: '2025-01-15', sales: 190 },
            { date: '2025-01-16', sales: 85 },
            { date: '2025-01-17', sales: 155 },
            { date: '2025-01-18', sales: 125 },
            { date: '2025-01-19', sales: 165 },
            { date: '2025-01-20', sales: 180 },
            { date: '2025-01-21', sales: 105 },
            { date: '2025-01-22', sales: 135 },
            { date: '2025-01-23', sales: 115 },
            { date: '2025-01-24', sales: 145 },
            { date: '2025-01-25', sales: 175 },
            { date: '2025-01-26', sales: 95 },
            { date: '2025-01-27', sales: 185 },
            { date: '2025-01-28', sales: 125 },
            { date: '2025-01-29', sales: 160 },
            { date: '2025-01-30', sales: 200 },
            { date: '2025-01-31', sales: 130 },
        ];
    }, []);

    // 在庫管理ロジック
    const inventoryData = React.useMemo(() => {
        // 1月の日付リストを生成
        const allDates = [];
        for (let day = 1; day <= 31; day++) {
            const date = `2025-01-${day.toString().padStart(2, '0')}`;
            allDates.push(date);
        }

        let inventoryLevel = 0;
        const inventoryLevels = [];
        const inventoryValues = [];
        const grossProfits = [];

        allDates.forEach(date => {
            // 当日の納品数量
            const deliveries = filteredData
                .filter(item => item.expectedDate === date)
                .reduce((sum, item) => sum + item.quantity, 0);
            inventoryLevel += deliveries;

            // 当日の売上数量
            const sales = salesForecastData.find(item => item.date === date)?.sales || 0;
            inventoryLevel -= sales;
            if (inventoryLevel < 0) inventoryLevel = 0; // 在庫レベルは0未満にならない

            // 当日の在庫価値（単純に全在庫のコスト単価の平均を使用）
            const averageCostPerUnit = filteredData.length > 0
                ? filteredData.reduce((sum, item) => sum + item.costPerUnit, 0) / filteredData.length
                : 0;
            const inventoryValue = inventoryLevel * averageCostPerUnit;

            // 当日の粗利益（売上数量 × (販売価格 - コスト単価)）
            const averageSellingPrice = filteredData.length > 0
                ? filteredData.reduce((sum, item) => sum + item.sellingPrice, 0) / filteredData.length
                : 0;
            const averageCost = averageCostPerUnit;
            const grossProfit = sales * (averageSellingPrice - averageCost);

            inventoryLevels.push(inventoryLevel);
            inventoryValues.push(inventoryValue);
            grossProfits.push(grossProfit);
        });

        return {
            labels: allDates,
            inventoryLevels,
            inventoryValues,
            grossProfits
        };
    }, [filteredData, salesForecastData]);

    // 在庫回転率の計算
    const inventoryTurnover = React.useMemo(() => {
        const totalSales = salesForecastData.reduce((sum, item) => sum + item.sales, 0);
        const averageInventory = inventoryData.inventoryLevels.length > 0
            ? inventoryData.inventoryLevels.reduce((sum, level) => sum + level, 0) / inventoryData.inventoryLevels.length
            : 0;
        return averageInventory > 0 ? (totalSales / averageInventory).toFixed(2) : 'N/A';
    }, [salesForecastData, inventoryData]);

    React.useEffect(() => {
        // 既存のチャートがあれば破棄
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        chartInstanceRef.current = new Chart(ctx, {
            data: {
                labels: inventoryData.labels,
                datasets: [
                    {
                        label: '納品数量',
                        data: inventoryData.labels.map((date, index) => {
                            const deliveries = props.data
                                .filter(item => item.expectedDate === date)
                                .reduce((sum, item) => sum + item.quantity, 0);
                            return deliveries;
                        }),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y',
                        type: 'bar',
                    },
                    {
                        label: '売上数量',
                        data: salesForecastData.map(item => item.sales),
                        backgroundColor: 'rgba(255, 206, 86, 0.5)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1,
                        yAxisID: 'y',
                        type: 'bar',
                    },
                    {
                        label: '在庫レベル',
                        data: inventoryData.inventoryLevels,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        fill: false,
                        yAxisID: 'y1',
                        type: 'line',
                        tension: 0.1,
                    },
                    {
                        label: '在庫価値 (円)',
                        data: inventoryData.inventoryValues,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.5)',
                        fill: false,
                        yAxisID: 'y2',
                        type: 'line',
                        tension: 0.1,
                    },
                    {
                        label: '粗利益 (円)',
                        data: inventoryData.grossProfits,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        fill: false,
                        yAxisID: 'y3',
                        type: 'line',
                        tension: 0.1,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // レスポンシブに対応
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (context.dataset.label.includes('(円)')) {
                                    label += `: ${context.parsed.y.toLocaleString()} 円`;
                                } else {
                                    label += `: ${context.parsed.y.toLocaleString()}`;
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '納品計画と売上予測 (日別)'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '数量'
                        },
                        beginAtZero: true,
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '在庫レベル'
                        },
                        grid: {
                            drawOnChartArea: false, // y1 のグリッドラインを非表示
                        },
                        beginAtZero: true,
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '在庫価値 (円)'
                        },
                        grid: {
                            drawOnChartArea: false, // y2 のグリッドラインを非表示
                        },
                        beginAtZero: true,
                        // y1とy2が重ならないようにオフセット
                        offset: true,
                    },
                    y3: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '粗利益 (円)'
                        },
                        grid: {
                            drawOnChartArea: false, // y3 のグリッドラインを非表示
                        },
                        beginAtZero: true,
                        // y1とy2とy3が重ならないようにオフセット
                        offset: true,
                    },
                    x: {
                        title: {
                            display: true,
                            text: '日付'
                        },
                        ticks: {
                            maxRotation: 90,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 15, // 表示する日数を制限
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [filteredData, salesForecastData, inventoryData, props.data]);

    return (
        <Box component={Paper} sx={{ p: 2, height: '500px' }}> {/* 高さを固定 */}
            <Typography variant="h6" gutterBottom>
                納品計画と売上予測の関係性 (日別)
            </Typography>
            <canvas ref={chartRef} style={{ width: '100%', height: '400px' }}></canvas>
            <Typography variant="body1" sx={{ mt: 2 }}>
                在庫回転率: {inventoryTurnover}
            </Typography>
        </Box>
    );
}

window.DeliveryPlanning = DeliveryPlanning;
