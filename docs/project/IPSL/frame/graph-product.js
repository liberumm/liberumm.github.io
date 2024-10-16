const { useRef, useEffect, useState } = React;
const { Box, Grid, ButtonGroup, Button } = MaterialUI;

function Graph() {
    const svgRef = useRef(null);
    const [timeframe, setTimeframe] = useState('daily');

    const getData = (timeframe) => {
        switch (timeframe) {
            case 'weekly':
                return [
                    { day: 'Week 1', sales: 700, stock: 350, purchase: 200, turnoverDays: 10 },
                    { day: 'Week 2', sales: 800, stock: 300, purchase: 250, turnoverDays: 9 },
                    { day: 'Week 3', sales: 750, stock: 400, purchase: 300, turnoverDays: 11 },
                    { day: 'Week 4', sales: 900, stock: 450, purchase: 350, turnoverDays: 12 }
                ];
            case 'monthly':
                return [
                    { day: 'January', sales: 3000, stock: 1200, purchase: 900, turnoverDays: 10 },
                    { day: 'February', sales: 3200, stock: 1300, purchase: 800, turnoverDays: 11 },
                    { day: 'March', sales: 2900, stock: 1100, purchase: 950, turnoverDays: 9 }
                ];
            case 'yearly':
                return [
                    { day: '2021', sales: 36000, stock: 15000, purchase: 12000, turnoverDays: 10 },
                    { day: '2022', sales: 38000, stock: 14000, purchase: 12500, turnoverDays: 11 },
                    { day: '2023', sales: 40000, stock: 16000, purchase: 13000, turnoverDays: 9 }
                ];
            default:
                return [
                    { day: 'Day 1', sales: 100, stock: 50, purchase: 30, turnoverDays: 10 },
                    { day: 'Day 2', sales: 120, stock: 45, purchase: 20, turnoverDays: 9 },
                    { day: 'Day 3', sales: 80, stock: 60, purchase: 40, turnoverDays: 8 },
                    { day: 'Day 4', sales: 130, stock: 55, purchase: 25, turnoverDays: 12 },
                    { day: 'Day 5', sales: 90, stock: 40, purchase: 35, turnoverDays: 11 },
                    { day: 'Day 6', sales: 150, stock: 70, purchase: 50, turnoverDays: 13 },
                    { day: 'Day 7', sales: 110, stock: 65, purchase: 45, turnoverDays: 10 },
                    { day: 'Day 8', sales: 95, stock: 50, purchase: 30, turnoverDays: 9 },
                    { day: 'Day 9', sales: 105, stock: 55, purchase: 20, turnoverDays: 8 },
                    { day: 'Day 10', sales: 140, stock: 60, purchase: 40, turnoverDays: 14 }
                ];
        }
    };

    useEffect(() => {
        const data = getData(timeframe);
        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 100, bottom: 50, left: 50 };

        const updateChart = () => {
            const width = svg.node().parentNode.clientWidth - margin.left - margin.right;
            const height = window.innerHeight * 0.5 - margin.top - margin.bottom;
            svg.attr('width', width + margin.left + margin.right)
               .attr('height', height + margin.top + margin.bottom);

            svg.selectAll('*').remove(); // 既存のSVG内容をクリア

            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            // スケールの設定
            const x = d3.scaleBand().domain(data.map(d => d.day)).range([0, width]).padding(0.1);
            const y = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(d.sales, d.stock, d.purchase, d.turnoverDays))]).range([height, 0]);

            // X軸の追加
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'rotate(45)')
                .style('text-anchor', 'start');

            // Y軸の追加
            g.append('g')
                .call(d3.axisLeft(y));

            // 折れ線の追加
            const line = d3.line()
                .x(d => x(d.day) + x.bandwidth() / 2)
                .y(d => y(d.value));

            const metrics = ['sales', 'stock', 'purchase', 'turnoverDays'];
            const colors = d3.scaleOrdinal(d3.schemeCategory10).domain(metrics);

            metrics.forEach(metric => {
                g.append('path')
                    .datum(data.map(d => ({ day: d.day, value: d[metric] })))
                    .attr('fill', 'none')
                    .attr('stroke', colors(metric))
                    .attr('stroke-width', 1.5)
                    .attr('d', line);
            });

            // 凡例の追加
            const legend = svg.append('g')
                .attr('transform', `translate(${width + margin.left + 10}, ${margin.top})`);

            metrics.forEach((metric, index) => {
                const legendRow = legend.append('g')
                    .attr('transform', `translate(0, ${index * 20})`);

                legendRow.append('rect')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', colors(metric));

                legendRow.append('text')
                    .attr('x', 15)
                    .attr('y', 10)
                    .attr('text-anchor', 'start')
                    .style('font-size', '0.75rem')
                    .text(metric);
            });
        };

        updateChart();

        // ウィンドウサイズ変更時にグラフを更新
        window.addEventListener('resize', updateChart);
        return () => window.removeEventListener('resize', updateChart);

    }, [timeframe]);

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <ButtonGroup variant="contained" sx={{ mb: 2 }}>
                    <Button onClick={() => setTimeframe('daily')}>日別</Button>
                    <Button onClick={() => setTimeframe('weekly')}>週別</Button>
                    <Button onClick={() => setTimeframe('monthly')}>月別</Button>
                    <Button onClick={() => setTimeframe('yearly')}>年別</Button>
                </ButtonGroup>
                <Box component="div" sx={{ py: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <svg ref={svgRef} width="100%" height="50%"></svg>
                </Box>
            </Grid>
        </Grid>
    );
}

