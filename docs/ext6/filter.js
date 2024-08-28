const { Box, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Button } = MaterialUI;

function Filter() {
    const [category, setCategory] = React.useState('');
    const [priceRange, setPriceRange] = React.useState([20, 50]);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    return (
        <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', mb: 3 , mt:3 }}>
            <Typography variant="h6" gutterBottom>
                フィルター
            </Typography>

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                <InputLabel id="category-label">カテゴリ</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    label="カテゴリ"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>カテゴリー1</MenuItem>
                    <MenuItem value={20}>カテゴリー2</MenuItem>
                    <MenuItem value={30}>カテゴリー3</MenuItem>
                </Select>
            </FormControl>

            <Typography gutterBottom>価格範囲</Typography>
            <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                sx={{ mb: 3 }}
            />

            <Button variant="contained" color="primary" fullWidth>
                適用
            </Button>
        </Box>
    );
}
