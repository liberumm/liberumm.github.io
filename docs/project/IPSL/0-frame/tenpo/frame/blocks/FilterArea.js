// FilterArea.js
const { useState } = React;
const { Box, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button } = MaterialUI;

function FilterArea({ filters, setFilters, resetFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleReset = () => {
        resetFilters();
    };

    return (
        <Box component={Paper} sx={{ padding: 2, marginBottom: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {/* 年フィルター */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>年</InputLabel>
                        <Select
                            name="year"
                            value={filters.year}
                            label="年"
                            onChange={handleChange}
                        >
                            {/* 年の選択肢を動的に生成 */}
                            {Array.from(new Array(10), (val, index) => {
                                const year = new Date().getFullYear() - index;
                                return (
                                    <MenuItem key={year} value={year.toString()}>
                                        {year}年
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                {/* 月フィルター */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>月</InputLabel>
                        <Select
                            name="month"
                            value={filters.month}
                            label="月"
                            onChange={handleChange}
                        >
                            {/* 月の選択肢 */}
                            {Array.from(new Array(12), (val, index) => {
                                const month = (index + 1).toString().padStart(2, '0');
                                return (
                                    <MenuItem key={month} value={month}>
                                        {month}月
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                {/* 拠点フィルター */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>拠点</InputLabel>
                        <Select
                            name="location"
                            value={filters.location}
                            label="拠点"
                            onChange={handleChange}
                        >
                            {/* 拠点の選択肢 */}
                            <MenuItem value="all">全て</MenuItem>
                            <MenuItem value="103">拠点103</MenuItem>
                            <MenuItem value="104">拠点104</MenuItem>
                            <MenuItem value="105">拠点105</MenuItem>
                            {/* 必要に応じて追加 */}
                        </Select>
                    </FormControl>
                </Grid>

                {/* 設備カテゴリーフィルター */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>設備カテゴリー</InputLabel>
                        <Select
                            name="equipmentCategory"
                            value={filters.equipmentCategory}
                            label="設備カテゴリー"
                            onChange={handleChange}
                        >
                            {/* 設備カテゴリーの選択肢 */}
                            <MenuItem value="all">全て</MenuItem>
                            <MenuItem value="売場設備">売場設備</MenuItem>
                            <MenuItem value="給茶機">給茶機</MenuItem>
                            {/* 必要に応じて追加 */}
                        </Select>
                    </FormControl>
                </Grid>

                {/* 検索フィルター */}
                <Grid item xs={12} sm={12} md={2}>
                    <TextField
                        label="検索"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>

                {/* リセットボタン */}
                <Grid item xs={12} sm={12} md={2}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={handleReset}
                        size="small"
                    >
                        リセット
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
