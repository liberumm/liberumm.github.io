const { useRef, useEffect } = React;
const { Box, Grid } = MaterialUI;

function Graph() {
    const svgRef = useRef(null);

    useEffect(() => {
        const data = [12, 25, 6, 8, 15, 20]; // サンプルデータ

        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const updateChart = () => {
            const width = svg.node().parentNode.clientWidth - margin.left - margin.right;
            const height = window.innerHeight * 0.3 - margin.top - margin.bottom;
            svg.attr('width', width + margin.left + margin.right)
               .attr('height', height + margin.top + margin.bottom);

            svg.selectAll('*').remove(); // 既存のSVG内容をクリア

            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            // スケールの設定
            const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
            const y = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);

            // X軸の追加
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Y軸の追加
            g.append('g')
                .call(d3.axisLeft(y));

            // 折れ線の追加
            g.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 1.5)
                .attr('d', d3.line()
                    .x((d, i) => x(i))
                    .y(d => y(d))
                );
        };

        updateChart();

        // ウィンドウサイズ変更時にグラフを更新
        window.addEventListener('resize', updateChart);
        return () => window.removeEventListener('resize', updateChart);

    }, []);

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <Box component="div" sx={{ py: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <svg ref={svgRef} width="100%" height="30%"></svg>
                </Box>
            </Grid>
        </Grid>
    );
}
