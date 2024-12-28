const { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, TextField, TablePagination, Tabs, Tab, Typography, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Stepper, Step, StepLabel, InputAdornment, MenuItem, DragIndicator, Tooltip } = MaterialUI;  // InputAdornmentとMenuItemを追加

const { useState, memo, useMemo, useCallback, useEffect, useRef } = React;

const ProductTable = memo(function ProductTable() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // カラム定義を先に行う
    const initialSimpleColumns = [
        { field: 'status', label: 'ステータス' },
        { field: 'deliveryDate', label: '納品日' },
        { field: 'availableDeliveryDate', label: '納期可能日' },
        { field: 'corner', label: 'コーナー' },
        { field: 'line', label: 'ライン' },
        { field: 'category', label: 'カテゴリ' },
        { field: 'itemCode', label: '商品コード' },
        { field: 'productName', label: '商品名' },
        { field: 'quantity', label: '数量' },
        { field: 'price', label: '価格' },
        { field: 'markup', label: '値入' },
        { field: 'totalPrice', label: '合計価格' },
        { field: 'supplier', label: '取引先' }
    ];

    const initialDetailedColumns = [
        { field: 'status', label: 'ステータス' },
        { field: 'availableDeliveryDate', label: '納期可能日' },
        { field: 'orderDate', label: '注文日' },
        { field: 'deliveryDate', label: '納品日' },
        { field: 'productName', label: '商品名' },
        { field: 'corner', label: 'コーナー' },
        { field: 'line', label: 'ライン' },
        { field: 'category', label: 'カテゴリ' },
        { field: 'itemCode', label: '商品コード' },
        { field: 'cost', label: '原価' },
        { field: 'price', label: '価格' },
        { field: 'markup', label: '値入' },
        { field: 'quantity', label: '数量' },
        { field: 'totalCost', label: '原価合計' },
        { field: 'totalPrice', label: '売価合計' },
        { field: 'confirmationDate', label: '確認日' },
        { field: 'supplier', label: '取引先' }
    ];

    const [columns, setColumns] = useState({
        simple: initialSimpleColumns,
        detailed: initialDetailedColumns
    });

    const [data, setData] = useState([
        { id: 1, status: '提案中', availableDeliveryDate: '2023-08-30', orderDate: '2023-08-28', deliveryDate: '2023-09-01', productName: 'Product A', corner: 'Electronics', line: 'Line 1', category: 'Category A', itemCode: 'P001', cost: 500, price: 1000, markup: 50, quantity: 100, totalCost: 50000, totalPrice: 100000, confirmationDate: '2023-08-25', supplier: 'Supplier A' },
        { id: 2, status: '確定済', availableDeliveryDate: '2023-08-31', orderDate: '2023-08-29', deliveryDate: '2023-09-02', productName: 'Product B', corner: 'Home Appliances', line: 'Line 2', category: 'Category B', itemCode: 'P002', cost: 300, price: 600, markup: 50, quantity: 200, totalCost: 60000, totalPrice: 120000, confirmationDate: '2023-08-26', supplier: 'Supplier B' },
        { id: 3, status: '発注済', availableDeliveryDate: '2023-09-01', orderDate: '2023-08-30', deliveryDate: '2023-09-03', productName: 'Product C', corner: 'Furniture', line: 'Line 3', category: 'Category C', itemCode: 'P003', cost: 400, price: 800, markup: 50, quantity: 150, totalCost: 60000, totalPrice: 120000, confirmationDate: '2023-08-27', supplier: 'Supplier C' },
        { id: 4, status: '納品済', availableDeliveryDate: '2023-09-02', orderDate: '2023-08-31', deliveryDate: '2023-09-04', productName: 'Product D', corner: 'Clothing', line: 'Line 4', category: 'Category D', itemCode: 'P004', cost: 200, price: 400, markup: 50, quantity: 300, totalCost: 60000, totalPrice: 120000, confirmationDate: '2023-08-28', supplier: 'Supplier D' },
        { id: 5, status: '差し戻し', availableDeliveryDate: '2023-09-03', orderDate: '2023-09-01', deliveryDate: '2023-09-05', productName: 'Product E', corner: 'Grocery', line: 'Line 5', category: 'Category E', itemCode: 'P005', cost: 100, price: 200, markup: 50, quantity: 400, totalCost: 40000, totalPrice: 80000, confirmationDate: '2023-08-29', supplier: 'Supplier E' },
        { id: 6, status: '提案中', availableDeliveryDate: '2023-09-04', orderDate: '2023-09-02', deliveryDate: '2023-09-06', productName: 'Product F', corner: 'Electronics', line: 'Line 6', category: 'Category F', itemCode: 'P006', cost: 600, price: 1200, markup: 50, quantity: 50, totalCost: 30000, totalPrice: 60000, confirmationDate: '2023-08-30', supplier: 'Supplier F' },
        { id: 7, status: '確定済', availableDeliveryDate: '2023-09-05', orderDate: '2023-09-03', deliveryDate: '2023-09-07', productName: 'Product G', corner: 'Home Appliances', line: 'Line 7', category: 'Category G', itemCode: 'P007', cost: 350, price: 700, markup: 50, quantity: 150, totalCost: 52500, totalPrice: 105000, confirmationDate: '2023-08-31', supplier: 'Supplier G' },
        { id: 8, status: '発注済', availableDeliveryDate: '2023-09-06', orderDate: '2023-09-04', deliveryDate: '2023-09-08', productName: 'Product H', corner: 'Furniture', line: 'Line 8', category: 'Category H', itemCode: 'P008', cost: 450, price: 900, markup: 50, quantity: 100, totalCost: 45000, totalPrice: 90000, confirmationDate: '2023-09-01', supplier: 'Supplier H' },
        { id: 9, status: '納品済', availableDeliveryDate: '2023-09-07', orderDate: '2023-09-05', deliveryDate: '2023-09-09', productName: 'Product I', corner: 'Clothing', line: 'Line 9', category: 'Category I', itemCode: 'P009', cost: 250, price: 500, markup: 50, quantity: 250, totalCost: 62500, totalPrice: 125000, confirmationDate: '2023-09-02', supplier: 'Supplier I' },
        { id: 10, status: '差し戻し', availableDeliveryDate: '2023-09-08', orderDate: '2023-09-06', deliveryDate: '2023-09-10', productName: 'Product J', corner: 'Grocery', line: 'Line 10', category: 'Category J', itemCode: 'P010', cost: 150, price: 300, markup: 50, quantity: 350, totalCost: 52500, totalPrice: 105000, confirmationDate: '2023-09-03', supplier: 'Supplier J' },
    ]);
    const [filters, setFilters] = useState({ status: '', availableDeliveryDate: '', orderDate: '', deliveryDate: '', productName: '', corner: '', line: '', category: '', itemCode: '', cost: '', price: '', markup: '', quantity: '', totalCost: '', totalPrice: '', confirmationDate: '', supplier: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // 初期値を10に変更
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDetailMode, setIsDetailMode] = useState(true);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isProductWizardOpen, setIsProductWizardOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnWidths, setColumnWidths] = useState({});
    const [draggedColumn, setDraggedColumn] = useState(null);
    const [dropIndicator, setDropIndicator] = useState({ show: false, position: null });
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const dragStartTimeRef = useRef(0);
    const dragThrottleRef = useRef(false);

    // カラム幅の設定を追加
    const columnSizes = {
        status: 100,
        availableDeliveryDate: 120,
        orderDate: 120,
        deliveryDate: 120,
        productName: 200,
        corner: 150,
        line: 120,
        category: 150,
        itemCode: 120,
        cost: 100,
        price: 100,
        markup: 80,
        quantity: 80,
        totalCost: 120,
        totalPrice: 120,
        confirmationDate: 120,
        supplier: 150
    };

    // フィールドタイプの定義を追加
    const fieldTypes = {
        status: 'string',
        deliveryDate: 'date',
        availableDeliveryDate: 'date',
        orderDate: 'date',
        confirmationDate: 'date',
        corner: 'string',
        line: 'string',
        category: 'string',
        itemCode: 'string',
        productName: 'string',
        quantity: 'number',
        price: 'number',
        cost: 'number',
        markup: 'number',
        totalPrice: 'number',
        totalCost: 'number',
        supplier: 'string'
    };

    // フィルター処理用のユーティリティ関数
    const filterValue = useCallback((value, filterText, type) => {
        if (!filterText) return true;
        
        switch (type) {
            case 'string':
                return String(value).toLowerCase().includes(filterText.toLowerCase());
            case 'number':
                const numValue = String(value);
                const searchNum = filterText.replace(/[,¥]/g, '');
                return numValue.includes(searchNum);
            case 'date':
                return value.includes(filterText);
            default:
                return true;
        }
    }, []);

    // フィルターの処理を修正
    const handleFilterChange = useCallback((field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    }, []); // 依存配列を空に

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setPage(0);
    };

    // filteredDataの処理を最適化
    const filteredData = useMemo(() => {
        return data.filter(row => {
            // タブによるフィルター
            const tabFilter = 
                selectedTab === 0 || 
                (selectedTab === 1 && row.status === '依頼中') || 
                (selectedTab === 2 && row.status === '提案中') || 
                (selectedTab === 3 && row.status === '確定済') || 
                (selectedTab === 4 && row.status === '発注済') || 
                (selectedTab === 5 && row.status === '発注残') || 
                (selectedTab === 6 && row.status === '納品済') || 
                (selectedTab === 7 && row.status === '差し戻し') || 
                (selectedTab === 8 && row.status === '削除予定');

            if (!tabFilter) return false;

            // 各フィールドのフィルター
            return Object.entries(filters).every(([field, filterText]) => {
                if (!filterText) return true;
                const type = fieldTypes[field];
                return filterValue(row[field], filterText, type);
            });
        });
    }, [data, filters, selectedTab, filterValue]);

    const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const tabCounts = useMemo(() => {
        const counts = {
            all: data.length,
            request: data.filter(row => row.status === '依頼中').length,
            proposal: data.filter(row => row.status === '提案中').length,
            confirmed: data.filter(row => row.status === '確定済').length,
            ordered: data.filter(row => row.status === '発注済').length,
            remaining: data.filter(row => row.status === '発注残').length,
            delivered: data.filter(row => row.status === '納品済').length,
            returned: data.filter(row => row.status === '差し戻し').length,
            deleted: data.filter(row => row.status === '削除予定').length,
        };
        return counts;
    }, [data]);

    const handleRowClick = useCallback((row) => {
        setSelectedRow(row);
        setIsDetailModalOpen(true);
    }, []);

    const handleSort = useCallback((field) => {
        const isAsc = orderBy === field && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(field);
    }, [orderBy, order]);

    const handleHeaderDragStart = useCallback((e, field) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', field); // データを設定
        setDraggedColumn(field);
        e.currentTarget.style.opacity = '0.5';
    }, []);

    const handleHeaderDragEnd = useCallback((e) => {
        e.stopPropagation();
        e.currentTarget.style.opacity = '1';
        setDraggedColumn(null);
        setDragOverColumn(null);
    }, []);

    const handleHeaderDragOver = useCallback((e, field) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (draggedColumn && draggedColumn !== field) {
            setDragOverColumn(field);
            e.dataTransfer.dropEffect = 'move';
        }
    }, [draggedColumn]);

    const handleHeaderDragLeave = useCallback((e) => {
        e.stopPropagation();
        setDragOverColumn(null);
    }, []);

    const handleHeaderDrop = useCallback((e, field) => {
        e.preventDefault();
        e.stopPropagation();

        const draggedField = e.dataTransfer.getData('text/plain'); // データを取得
        
        if (draggedField && draggedField !== field) {
            const mode = isDetailMode ? 'detailed' : 'simple';
            setColumns(prev => {
                const newColumns = [...prev[mode]];
                const draggedIdx = newColumns.findIndex(col => col.field === draggedField);
                const targetIdx = newColumns.findIndex(col => col.field === field);
                
                if (draggedIdx !== -1 && targetIdx !== -1) {
                    const [draggedItem] = newColumns.splice(draggedIdx, 1);
                    newColumns.splice(targetIdx, 0, draggedItem);
                }
                
                return {
                    ...prev,
                    [mode]: newColumns
                };
            });
        }
        
        setDraggedColumn(null);
        setDragOverColumn(null);
    }, [isDetailMode]);

    const handleFilterKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }, []);

    useEffect(() => {
        const calculateColumnWidths = () => {
            const widths = {};
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '14px Roboto';
            
            const measureText = (text) => {
                const metrics = context.measureText(text);
                return Math.ceil(metrics.width);
            };

            const currentColumns = isDetailMode ? columns.detailed : columns.simple;
            
            currentColumns.forEach(({ field, label }) => {
                // ヘッダーの幅を計算
                let maxWidth = measureText(label) + 48; // アイコンとパディング分を追加

                // データの幅を計算
                data.forEach(row => {
                    const cellContent = String(row[field] || '');
                    const cellWidth = measureText(cellContent) + 32; // パディング分を追加
                    maxWidth = Math.max(maxWidth, cellWidth);
                });

                // 最小幅と最大幅の制限を設定
                widths[field] = Math.min(Math.max(maxWidth, 100), 300);
            });

            setColumnWidths(widths);
        };

        calculateColumnWidths();
    }, [data, isDetailMode, columns]);

    const sortedData = useMemo(() => {
        if (!orderBy) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            
            if (order === 'asc') {
                return aValue < bValue ? -1 : 1;
            } else {
                return bValue < aValue ? -1 : 1;
            }
        });
    }, [filteredData, orderBy, order]);

    const DetailDialog = memo(() => (
        <Dialog 
            open={isDetailModalOpen} 
            onClose={() => setIsDetailModalOpen(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
                商品詳細
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    {Object.entries(selectedRow || {}).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="caption" color="textSecondary">
                                    {key}
                                </Typography>
                                <Typography variant="body1">
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsDetailModalOpen(false)}>
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    ));

    const ProductWizard = memo(() => {
        const steps = ['基本情報', '価格設定', '在庫設定', '確認'];
        const [formData, setFormData] = useState({
            productName: '',
            itemCode: '',
            corner: '',
            line: '',
            category: '',
            supplier: '',
            cost: '',
            price: '',
            markup: '',
            quantity: '',
            availableDeliveryDate: '',
            orderDate: '',
            deliveryDate: '',
            status: '提案中',
            remarks: ''
        });

        // コーナー、ライン、カテゴリの選択肢
        const options = {
            corners: ['Electronics', 'Home Appliances', 'Furniture', 'Clothing', 'Grocery'],
            lines: Array.from({ length: 10 }, (_, i) => `Line ${i + 1}`),
            categories: Array.from({ length: 10 }, (_, i) => `Category ${String.fromCharCode(65 + i)}`),
            suppliers: Array.from({ length: 10 }, (_, i) => `Supplier ${String.fromCharCode(65 + i)}`)
        };

        const renderStepContent = (step) => {
            switch (step) {
                case 0:
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="商品名" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="商品コード" value={formData.itemCode} onChange={e => setFormData({...formData, itemCode: e.target.value})} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    select
                                    label="コーナー"
                                    value={formData.corner}
                                    onChange={e => setFormData({...formData, corner: e.target.value})}
                                >
                                    {options.corners.map(option => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/* Add more fields */}
                        </Grid>
                    );
                case 1:
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="原価"
                                    type="number"
                                    value={formData.cost}
                                    onChange={e => setFormData({...formData, cost: e.target.value})}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="売価"
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="値入率"
                                    type="number"
                                    value={formData.markup}
                                    onChange={e => setFormData({...formData, markup: e.target.value})}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    );
                case 2:
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="入数"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="納期可能日"
                                    type="date"
                                    value={formData.availableDeliveryDate}
                                    onChange={e => setFormData({...formData, availableDeliveryDate: e.target.value})}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    );
                case 3:
                    return (
                        <Grid container spacing={2}>
                            {/* 確認画面の内容 */}
                            {Object.entries(formData).map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            {key}
                                        </Typography>
                                        <Typography variant="body1">
                                            {value}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    );
                default:
                    return null;
            }
        };

        return (
            <Dialog open={isProductWizardOpen} maxWidth="md" fullWidth>
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    商品登録
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ py: 3 }}>
                        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                    </Stepper>
                    <Box sx={{ mt: 2 }}>
                        {renderStepContent(activeStep)}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(prev => prev - 1)}
                    >
                        戻る
                    </Button>
                    <Button 
                        variant="contained"
                        onClick={() => {
                            if (activeStep === steps.length - 1) {
                                setIsProductWizardOpen(false);
                                setActiveStep(0);
                            } else {
                                setActiveStep(prev => prev + 1);
                            }
                        }}
                    >
                        {activeStep === steps.length - 1 ? '保存' : '次へ'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    });

    const ActionButtons = memo(() => (
        <Box sx={{
            width: '100%',
            py: 3,
            px: { xs: 2, sm: 3 },
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.grey[50],
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<span className="material-icons">delete</span>}
                    size="small"
                >
                    削除
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<span className="material-icons">add</span>}
                    size="small"
                    onClick={() => setIsProductWizardOpen(true)}
                >
                    商品登録
                </Button>
            </Box>
            <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {[
                    { icon: 'upload', label: 'Import', color: 'secondary' },
                    { icon: 'download', label: 'Template', color: 'info' },
                    { icon: 'file_download', label: 'CSV', color: 'success' },
                    { icon: 'description', label: 'Excel', color: 'warning' }
                ].map(({ icon, label, color }) => (
                    <Button
                        key={label}
                        variant="outlined"
                        color={color}
                        startIcon={<span className="material-icons">{icon}</span>}
                        size="small"
                        sx={{ minWidth: 110 }}
                    >
                        {label}
                    </Button>
                ))}
            </Box>
        </Box>
    ));

    const handleDragHandleClick = useCallback((e, field) => {
        e.stopPropagation();
        setDraggedColumn(draggedColumn === field ? null : field);
    }, [draggedColumn]);

    const TableHeaderCell = memo(({ field, label }) => {
        const isOrdered = orderBy === field;
        const isDragging = draggedColumn === field;
        const isDropTarget = dragOverColumn === field;
        
        const getSortIcon = () => {
            if (!isOrdered) return 'unfold_more';
            return order === 'asc' ? 'arrow_upward' : 'arrow_downward';
        };
        
        return (
            <TableCell 
                sx={{ 
                    whiteSpace: 'nowrap',
                    width: columnSizes[field],
                    minWidth: columnSizes[field],
                    position: 'relative',
                    padding: '8px',
                    backgroundColor: isDragging ? 'action.selected' : isDropTarget ? 'action.hover' : 'inherit',
                    borderLeft: isDropTarget ? `2px solid ${theme.palette.primary.main}` : 'none',
                    transition: 'none',
                    '&:hover .drag-handle': {
                        opacity: 1
                    }
                }}
                draggable={isDragging}
                onDragStart={(e) => handleHeaderDragStart(e, field)}
                onDragOver={(e) => handleHeaderDragOver(e, field)}
                onDrop={(e) => handleHeaderDrop(e, field)}
                onDragEnd={handleHeaderDragEnd}
            >
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Box
                        className="drag-handle"
                        component="span"
                        onClick={(e) => handleDragHandleClick(e, field)}
                        sx={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            opacity: 0.3,
                            '&:hover': { opacity: 1 },
                            color: isDragging ? theme.palette.primary.main : 'inherit'
                        }}
                    >
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                            {isDragging ? 'drag_handle' : 'drag_indicator'}
                        </span>
                    </Box>
                    
                    {/* 残りのコードは変更なし */}
                    <Typography 
                        variant="subtitle2" 
                        component="span"
                        sx={{ 
                            fontWeight: isOrdered ? 'bold' : 'normal',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            userSelect: 'none'
                        }}
                    >
                        {label}
                    </Typography>
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSort(field);
                        }}
                        sx={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            opacity: isOrdered ? 1 : 0.3,
                            '&:hover': { opacity: 1 },
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <span className="material-icons" style={{ 
                            fontSize: '1.2rem',
                            color: isOrdered ? theme.palette.primary.main : 'inherit'
                        }}>
                            {getSortIcon()}
                        </span>
                    </Box>
                </Box>
            </TableCell>
        );
    }, (prev, next) => {
        // カスタム比較関数で不要な再レンダリングを防止
        return (
            prev.field === next.field &&
            prev.label === next.label &&
            (draggedColumn === null || (
                prev.field !== draggedColumn &&
                next.field !== draggedColumn &&
                prev.field !== dragOverColumn &&
                next.field !== dragOverColumn
            ))
        );
    });

    const FilterCell = memo(({ field, onFilterChange }) => {
        const type = fieldTypes[field];
        // filtersから初期値を取得し、localValueとして管理
        const [localValue, setLocalValue] = useState(filters[field] || '');
        
        // filtersの値が変更された場合にlocalValueを更新
        useEffect(() => {
            setLocalValue(filters[field] || '');
        }, [field, filters]);

        // ローカルの値のみを更新
        const handleChange = useCallback((e) => {
            setLocalValue(e.target.value);
        }, []);

        // 値の確定時に親コンポーネントに通知
        const handleCommit = useCallback(() => {
            onFilterChange(field, localValue);
        }, [field, localValue, onFilterChange]);

        // Enterキーで確定
        const handleKeyDown = useCallback((event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.target.blur(); // フォーカスを外す
                handleCommit();
            }
        }, [handleCommit]);

        return (
            <TableCell 
                key={field} 
                sx={{ 
                    p: 1,
                    width: columnSizes[field],
                    minWidth: columnSizes[field]
                }}
            >
                <TextField
                    size="small"
                    variant="standard"
                    fullWidth
                    type={type === 'date' ? 'date' : 'text'}
                    value={localValue}
                    onChange={handleChange}
                    onBlur={handleCommit}
                    onKeyDown={handleKeyDown}
                    InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                    sx={{
                        '& .MuiInput-root': {
                            fontSize: '0.875rem'
                        }
                    }}
                />
            </TableCell>
        );
    }, (prevProps, nextProps) => prevProps.field === nextProps.field);

    const TableHeader = memo(() => {
        const handleFilterChange = useCallback((field, value) => {
            setFilters(prev => ({
                ...prev,
                [field]: value
            }));
        }, []);

        return (
            <TableHead>
                {/* フィルター行 */}
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox color="primary" size="small" />
                    </TableCell>
                    <TableCell sx={{ width: 60, minWidth: 60 }}>No</TableCell>
                    {(isDetailMode ? columns.detailed : columns.simple).map(({ field }) => (
                        <FilterCell 
                            key={field} 
                            field={field}
                            onFilterChange={handleFilterChange}
                        />
                    ))}
                </TableRow>
                {/* ヘッダー行 */}
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox color="primary" size="small" />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>No</TableCell>
                    {(isDetailMode ? columns.detailed : columns.simple).map(({ field, label }) => (
                        <TableHeaderCell 
                            key={field}
                            field={field}
                            label={label}
                        />
                    ))}
                </TableRow>
            </TableHead>
        );
    });

    const CustomTableRow = memo(({ row, index }) => (
        <TableRow 
            onDoubleClick={() => handleRowClick(row)}
            sx={{ 
                cursor: 'pointer', 
                '&:hover': { bgcolor: 'action.hover' },
                userSelect: 'none'
            }}
        >
            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                <Checkbox color="primary" size="small" />
            </TableCell>
            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
            {(isDetailMode ? columns.detailed : columns.simple).map(({ field }) => (
                <TableCell 
                    key={field}
                    sx={{ 
                        p: 1,
                        width: columnWidths[field],
                        minWidth: columnWidths[field],
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.875rem'
                    }}
                >
                    <Tooltip title={String(row[field])} enterDelay={700}>
                        <Box component="span" sx={{ display: 'block' }}>
                            {row[field]}
                        </Box>
                    </Tooltip>
                </TableCell>
            ))}
        </TableRow>
    ));

    const TableContent = memo(() => (
        <Table stickyHeader size="small">
            <TableHeader />
            <TableBody>
                {sortedData.map((row, index) => (
                    <CustomTableRow 
                        key={row.id}
                        row={row}
                        index={index}
                    />
                ))}
            </TableBody>
        </Table>
    ));

    return (
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
             <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant={isTablet ? "scrollable" : "standard"}
                scrollButtons={isTablet ? "auto" : false}
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: theme.palette.grey[100],
                    '& .MuiTab-root': {
                        minHeight: 48,
                        fontSize: '0.875rem',
                        '& .count': {
                            ml: 1,
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem'
                        }
                    }
                }}
            >
                <Tab label={<>全て<span className="count">({tabCounts.all})</span></>} />
                <Tab label={<>依頼中<span className="count">({tabCounts.request})</span></>} />
                <Tab label={<>提案中<span className="count">({tabCounts.proposal})</span></>} />
                <Tab label={<>確定済<span className="count">({tabCounts.confirmed})</span></>} />
                <Tab label={<>発注済<span className="count">({tabCounts.ordered})</span></>} />
                <Tab label={<>発注残<span className="count">({tabCounts.remaining})</span></>} />
                <Tab label={<>納品済<span className="count">({tabCounts.delivered})</span></>} />
                <Tab label={<>差し戻し<span className="count">({tabCounts.returned})</span></>} />
                <Tab label={<>削除予定<span className="count">({tabCounts.deleted})</span></>} />
            </Tabs>

            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isDetailMode}
                            onChange={(e) => setIsDetailMode(e.target.checked)}
                        />
                    }
                    label={isDetailMode ? "詳細表示" : "簡易表示"}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <ActionButtons />
                </Box>
            </Box>

           
            <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                <TableContent />
            </TableContainer>
            
            <DetailDialog />
            <ProductWizard />
            
            <TablePagination
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? "表示数:" : "1ページの表示数:"}
            />
        </Paper>
    );
});

// モジュールエクスポートを削除し、直接グローバルスコープに定義
window.ProductTable = ProductTable;