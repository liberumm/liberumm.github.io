const { useState, useEffect } = React;
const { Grid, TextField, MenuItem, Box, Button, useTheme, useMediaQuery, Paper, Typography } = MaterialUI;

const Filter = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // フィルタに必要なステートの定義
    const years = [2022, 2023, 2024];
    const months = ["選択しない", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const weeks = ["選択しない", ...Array.from({ length: 52 }).map((_, i) => `${i + 1}`)];
    const locations = ["全社", "東京本店", "大阪支店", "名古屋支店", "福岡支店"];
    const departments = ["全部門", "営業部", "企画部", "開発部", "総務部"];

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState("選択しない");
    const [weekNumber, setWeekNumber] = useState("選択しない");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [department, setDepartment] = useState("");

    // 月度変更時の処理
    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        setWeekNumber("選択しない");

        const { startDate, endDate } = getMonthRange(year, parseInt(newMonth.replace('月', ''), 10));
        setStartDate(startDate.toISOString().split('T')[0]);
        setEndDate(endDate.toISOString().split('T')[0]);
    };

    // 週番号に基づいて開始日と終了日を計算する関数
    const calculateWeekRange = (year, week) => {
        const fiscalYearStart = new Date(year, 3, 1); // 4月1日
        const dayOfWeek = fiscalYearStart.getDay();
        const firstMonday = new Date(fiscalYearStart);
        firstMonday.setDate(fiscalYearStart.getDate() + (1 - dayOfWeek + 7) % 7);

        const startOfWeek = new Date(firstMonday);
        startOfWeek.setDate(firstMonday.getDate() + (week - 1) * 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return { startDate: startOfWeek, endDate: endOfWeek };
    };

    // 月度に基づいて開始日と終了日を計算する関数
    const getMonthRange = (year, month) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // 月の最終日
        return { startDate, endDate };
    };

    // 年度全体の期間を計算する関数
    const getYearRange = (year) => {
        const startDate = new Date(year, 3, 1); // 4月1日
        const endDate = new Date(year + 1, 2, 31); // 翌年の3月31日
        return { startDate, endDate };
    };

    // 年度、月度、週番号の選択によって開始日と終了日を更新する処理
    useEffect(() => {
        let newStartDate, newEndDate;

        if (weekNumber !== "選択しない" && weekNumber) {
            const { startDate, endDate } = calculateWeekRange(year, parseInt(weekNumber, 10));
            newStartDate = startDate;
            newEndDate = endDate;
            setMonth(`${startDate.getMonth() + 1}月`);
        } else if (month !== "選択しない" && month) {
            const { startDate, endDate } = getMonthRange(year, parseInt(month.replace('月', ''), 10));
            newStartDate = startDate;
            newEndDate = endDate;
        } else {
            const { startDate, endDate } = getYearRange(year);
            newStartDate = startDate;
            newEndDate = endDate;
        }

        setStartDate(newStartDate.toISOString().split('T')[0]);
        setEndDate(newEndDate.toISOString().split('T')[0]);

    }, [year, month, weekNumber]);

    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
        setYear(today.getFullYear());
        setMonth(`${today.getMonth() + 1}月`);
        
        const weekNum = Math.ceil((today - firstDay) / (7 * 24 * 60 * 60 * 1000));
        setWeekNumber(weekNum.toString());
    }, []);

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 2, 
                mb: 2,
                borderTop: `4px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.background.paper,
                overflow: 'hidden'
            }}
        >
            <Typography variant="subtitle1" sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: theme.palette.text.primary
            }}>
                <span className="material-icons">filter_alt</span>
                検索条件
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        select
                        fullWidth
                        label="年度"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        size="small"
                    >
                        {years.map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        select
                        fullWidth
                        label="月度"
                        value={month}
                        onChange={handleMonthChange}
                        size="small"
                    >
                        {months.map(month => (
                            <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        select
                        fullWidth
                        label="週"
                        value={weekNumber}
                        onChange={(e) => setWeekNumber(e.target.value)}
                        size="small"
                    >
                        {weeks.map(week => (
                            <MenuItem key={week} value={week}>{week}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="開始日"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="終了日"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="店舗/部署"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        size="small"
                    >
                        {locations.map(loc => (
                            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="部門"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        size="small"
                    >
                        {departments.map(dep => (
                            <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6} sx={{ 
                    display: 'flex', 
                    gap: 1,
                    justifyContent: { xs: 'stretch', md: 'flex-end' },
                    alignItems: 'flex-start'
                }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<span className="material-icons">refresh</span>}
                        size="small"
                        sx={{ 
                            flex: { xs: 1, md: 'initial' },
                            minWidth: 120,
                            backgroundColor: theme.palette.background.paper
                        }}
                    >
                        リセット
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<span className="material-icons">search</span>}
                        size="small"
                        sx={{ 
                            flex: { xs: 1, md: 'initial' },
                            minWidth: 120
                        }}
                    >
                        検索
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
