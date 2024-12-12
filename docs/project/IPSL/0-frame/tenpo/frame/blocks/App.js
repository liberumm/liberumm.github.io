// App.js
const { useState } = React;
const { Container, Box, Switch, FormControlLabel } = MaterialUI;

function App() {
    // fullWidthの初期値をtrueに設定（デフォルトでフルウィンドウ幅）
    const [fullWidth, setFullWidth] = useState(true);

    const toggleWidth = () => {
        setFullWidth(!fullWidth);
    };

    // フィルターの状態管理
    const [filters, setFilters] = useState({
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        location: 'all',
        equipmentCategory: 'all',
        search: ''
    });

    const resetFilters = () => {
        setFilters({
            year: new Date().getFullYear().toString(),
            month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
            location: 'all',
            equipmentCategory: 'all',
            search: ''
        });
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* ヘッダー */}
            <Header />

            {/* メインコンテンツ */}
            <Box component="main" flexGrow={1}>
                {/* フィルターエリア */}
                <FilterArea filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

                {/* フルウィンドウ幅切り替えスイッチ */}
                <FormControlLabel
                    control={<Switch checked={fullWidth} onChange={toggleWidth} />}
                    label={fullWidth ? "デフォルト幅に戻す" : "フルウィンドウ幅にする"}
                    sx={{ m: 2 }}
                />
                <Container maxWidth={fullWidth ? false : "lg"}>
                    <AllSections filters={filters} />
                </Container>
            </Box>

            {/* フッター */}
            <Footer />
        </Box>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
