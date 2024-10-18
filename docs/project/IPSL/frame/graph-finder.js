const { useRef, useEffect, useState } = React;
const { Box, Grid, Paper, Typography, ButtonGroup, Button } = MaterialUI;

function Graph() {
    const lineChartRef = useRef(null);
    const [data, setData] = useState([
        { category: 'Documents', usage: [12, 14, 18, 15, 20, 22, 25, 28, 30, 33, 35, 40], cost: [100, 120, 150, 140, 160, 180, 190, 210, 230, 250, 270, 300] },
        { category: 'Pictures', usage: [25, 30, 28, 35, 40, 45, 50, 55, 60, 62, 65, 70], cost: [200, 220, 210, 250, 270, 290, 310, 330, 350, 370, 390, 420] },
        { category: 'Music', usage: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40], cost: [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260] },
        { category: 'Videos', usage: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85], cost: [300, 320, 350, 360, 380, 400, 420, 440, 460, 480, 500, 520] },
        { category: 'Backups', usage: [10, 12, 15, 17, 20, 22, 25, 28, 30, 32, 35, 38], cost: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190] }
    ]);
    const [viewMode, setViewMode] = useState('total');

    useEffect(() => {
        const svgLine = d3.select(lineChartRef.current);
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };

        const updateLineChart = () => {
            const width = svgLine.node().parentNode.clientWidth - margin.left - margin.right;
            const height = window.innerHeight * 0.3 - margin.top - margin.bottom;
            svgLine.attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom);

            svgLine.selectAll('*').remove(); // Clear existing SVG content

            const g = svgLine.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            // Scales
            const x = d3.scaleLinear().domain([0, 11]).range([0, width]);
            const y = d3.scaleLinear().domain([0, viewMode === 'total' ? d3.max(data.reduce((acc, d) => d.usage.map((value, i) => (acc[i] || 0) + value), [])) : d3.max(data.flatMap(d => d.usage))]).nice().range([height, 0]);

            // X Axis
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(12).tickFormat((d, i) => `${i + 1}月`));

            // Y Axis
            g.append('g')
                .call(d3.axisLeft(y));

            const color = d3.scaleOrdinal().domain(data.map(d => d.category)).range(d3.schemeCategory10);

            // Line
            if (viewMode === 'total') {
                const totalUsage = data.reduce((acc, d) => {
                    d.usage.forEach((value, i) => {
                        acc[i] = (acc[i] || 0) + value;
                    });
                    return acc;
                }, []);
                g.append('path')
                    .datum(totalUsage)
                    .attr('fill', 'none')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 1.5)
                    .attr('d', d3.line()
                        .x((_, i) => x(i))
                        .y(d => y(d))
                    );
            } else {
                data.forEach(d => {
                    g.append('path')
                        .datum(d.usage)
                        .attr('fill', 'none')
                        .attr('stroke', color(d.category))
                        .attr('stroke-width', 1.5)
                        .attr('d', d3.line()
                            .x((_, i) => x(i))
                            .y(d => y(d))
                        );
                });
            }
        };

        updateLineChart();

        // Update graph on window resize
        window.addEventListener('resize', updateLineChart);
        return () => window.removeEventListener('resize', updateLineChart);
    }, [data, viewMode]);

    return (
        <Grid container spacing={2} justifyContent="center" mb={4}>
            <Grid item xs={12} md={8} lg={6}>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h6" gutterBottom>
                        Storage Usage Overview (Line Chart)
                    </Typography>
                    <ButtonGroup variant="contained" color="primary" style={{ marginBottom: 16 }}>
                        <Button onClick={() => setViewMode('total')}>Total Usage</Button>
                        <Button onClick={() => setViewMode('category')}>Usage by Category</Button>
                    </ButtonGroup>
                    <Box component="div" sx={{ py: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <svg ref={lineChartRef} width="100%" height="100%"></svg>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}
