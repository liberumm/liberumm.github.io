const {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Tooltip,
} = MaterialUI;
const { useState } = React;

function ProductTable() {
  // ----------------------------
  // サンプル商品データ
  // ----------------------------
  const [data, setData] = useState([
    {
      id: 1,
      status: '提案中',
      availableDeliveryDate: '2023-08-30',
      orderDate: '2023-08-28',
      deliveryDate: '2023-09-01',
      productName: 'Product A',
      corner: 'Electronics',
      line: 'Line 1',
      category: 'Category A',
      itemCode: 'P001',
      cost: 500,
      price: 1000,
      markup: 50,
      quantity: 100,
      totalCost: 50000,
      totalPrice: 100000,
      confirmationDate: '2023-08-25',
      supplier: 'Supplier A',
    },
    {
      id: 2,
      status: '確定済',
      availableDeliveryDate: '2023-08-31',
      orderDate: '2023-08-29',
      deliveryDate: '2023-09-02',
      productName: 'Product B',
      corner: 'Home Appliances',
      line: 'Line 2',
      category: 'Category B',
      itemCode: 'P002',
      cost: 300,
      price: 600,
      markup: 50,
      quantity: 200,
      totalCost: 60000,
      totalPrice: 120000,
      confirmationDate: '2023-08-26',
      supplier: 'Supplier B',
    },
    {
      id: 3,
      status: '発注済',
      availableDeliveryDate: '2023-09-01',
      orderDate: '2023-08-30',
      deliveryDate: '2023-09-03',
      productName: 'Product C',
      corner: 'Furniture',
      line: 'Line 3',
      category: 'Category C',
      itemCode: 'P003',
      cost: 400,
      price: 800,
      markup: 50,
      quantity: 150,
      totalCost: 60000,
      totalPrice: 120000,
      confirmationDate: '2023-08-27',
      supplier: 'Supplier C',
    },
    {
      id: 4,
      status: '納品済',
      availableDeliveryDate: '2023-09-02',
      orderDate: '2023-08-31',
      deliveryDate: '2023-09-04',
      productName: 'Product D',
      corner: 'Clothing',
      line: 'Line 4',
      category: 'Category D',
      itemCode: 'P004',
      cost: 200,
      price: 400,
      markup: 50,
      quantity: 300,
      totalCost: 60000,
      totalPrice: 120000,
      confirmationDate: '2023-08-28',
      supplier: 'Supplier D',
    },
    {
      id: 5,
      status: '差し戻し',
      availableDeliveryDate: '2023-09-03',
      orderDate: '2023-09-01',
      deliveryDate: '2023-09-05',
      productName: 'Product E',
      corner: 'Grocery',
      line: 'Line 5',
      category: 'Category E',
      itemCode: 'P005',
      cost: 100,
      price: 200,
      markup: 50,
      quantity: 400,
      totalCost: 40000,
      totalPrice: 80000,
      confirmationDate: '2023-08-29',
      supplier: 'Supplier E',
    },
    {
      id: 6,
      status: '提案中',
      availableDeliveryDate: '2023-09-04',
      orderDate: '2023-09-02',
      deliveryDate: '2023-09-06',
      productName: 'Product F',
      corner: 'Electronics',
      line: 'Line 6',
      category: 'Category F',
      itemCode: 'P006',
      cost: 600,
      price: 1200,
      markup: 50,
      quantity: 50,
      totalCost: 30000,
      totalPrice: 60000,
      confirmationDate: '2023-08-30',
      supplier: 'Supplier F',
    },
    {
      id: 7,
      status: '確定済',
      availableDeliveryDate: '2023-09-05',
      orderDate: '2023-09-03',
      deliveryDate: '2023-09-07',
      productName: 'Product G',
      corner: 'Home Appliances',
      line: 'Line 7',
      category: 'Category G',
      itemCode: 'P007',
      cost: 350,
      price: 700,
      markup: 50,
      quantity: 150,
      totalCost: 52500,
      totalPrice: 105000,
      confirmationDate: '2023-08-31',
      supplier: 'Supplier G',
    },
    {
      id: 8,
      status: '発注済',
      availableDeliveryDate: '2023-09-06',
      orderDate: '2023-09-04',
      deliveryDate: '2023-09-08',
      productName: 'Product H',
      corner: 'Furniture',
      line: 'Line 8',
      category: 'Category H',
      itemCode: 'P008',
      cost: 450,
      price: 900,
      markup: 50,
      quantity: 100,
      totalCost: 45000,
      totalPrice: 90000,
      confirmationDate: '2023-09-01',
      supplier: 'Supplier H',
    },
    {
      id: 9,
      status: '納品済',
      availableDeliveryDate: '2023-09-07',
      orderDate: '2023-09-05',
      deliveryDate: '2023-09-09',
      productName: 'Product I',
      corner: 'Clothing',
      line: 'Line 9',
      category: 'Category I',
      itemCode: 'P009',
      cost: 250,
      price: 500,
      markup: 50,
      quantity: 250,
      totalCost: 62500,
      totalPrice: 125000,
      confirmationDate: '2023-09-02',
      supplier: 'Supplier I',
    },
    {
      id: 10,
      status: '差し戻し',
      availableDeliveryDate: '2023-09-08',
      orderDate: '2023-09-06',
      deliveryDate: '2023-09-10',
      productName: 'Product J',
      corner: 'Grocery',
      line: 'Line 10',
      category: 'Category J',
      itemCode: 'P010',
      cost: 150,
      price: 300,
      markup: 50,
      quantity: 350,
      totalCost: 52500,
      totalPrice: 105000,
      confirmationDate: '2023-09-03',
      supplier: 'Supplier J',
    },
  ]);

  // ----------------------------
  // フィルター用 state
  // ----------------------------
  const [filters, setFilters] = useState({
    status: '',
    availableDeliveryDate: '',
    orderDate: '',
    deliveryDate: '',
    productName: '',
    corner: '',
    line: '',
    category: '',
    itemCode: '',
    cost: '',
    price: '',
    markup: '',
    quantity: '',
    totalCost: '',
    totalPrice: '',
    confirmationDate: '',
    supplier: '',
  });

  // ----------------------------
  // ページネーション用 state
  // 初期表示件数は 10（数値の場合は 10,20,30、全件表示は -1）
  // ----------------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ----------------------------
  // タブ選択用 state
  // タブの並びは「全て、依頼中、提案中、確定済、発注残、発注済、納品済、差し戻し、削除予定」
  // 初期選択は「確定済」（インデックス 3）
  // ----------------------------
  const [selectedTab, setSelectedTab] = useState(3);

  // ----------------------------
  // フィルター変更ハンドラ
  // ----------------------------
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // ----------------------------
  // タブ変更ハンドラ（タブ変更時にページリセット）
  // ----------------------------
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  // ----------------------------
  // タブおよびフィルターに応じたデータ抽出
  // ----------------------------
  const filteredData = data.filter((row) => {
    const tabFilter =
      selectedTab === 0 ||
      (selectedTab === 1 && row.status === '依頼中') ||
      (selectedTab === 2 && row.status === '提案中') ||
      (selectedTab === 3 && row.status === '確定済') ||
      (selectedTab === 4 && row.status === '発注残') ||
      (selectedTab === 5 && row.status === '発注済') ||
      (selectedTab === 6 && row.status === '納品済') ||
      (selectedTab === 7 && row.status === '差し戻し') ||
      (selectedTab === 8 && row.status === '削除予定');

    return (
      tabFilter &&
      row.status.toLowerCase().includes(filters.status.toLowerCase()) &&
      row.availableDeliveryDate.includes(filters.availableDeliveryDate) &&
      row.orderDate.includes(filters.orderDate) &&
      row.deliveryDate.includes(filters.deliveryDate) &&
      row.productName.toLowerCase().includes(filters.productName.toLowerCase()) &&
      row.corner.toLowerCase().includes(filters.corner.toLowerCase()) &&
      row.line.toLowerCase().includes(filters.line.toLowerCase()) &&
      row.category.toLowerCase().includes(filters.category.toLowerCase()) &&
      row.itemCode.toLowerCase().includes(filters.itemCode.toLowerCase()) &&
      row.cost.toString().includes(filters.cost) &&
      row.price.toString().includes(filters.price) &&
      row.markup.toString().includes(filters.markup) &&
      row.quantity.toString().includes(filters.quantity) &&
      row.totalCost.toString().includes(filters.totalCost) &&
      row.totalPrice.toString().includes(filters.totalPrice) &&
      row.confirmationDate.includes(filters.confirmationDate) &&
      row.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
    );
  });

  // ----------------------------
  // ページネーション：表示するデータ抽出
  // 「全て」が選択された場合（rowsPerPage === -1）は全件表示
  // ----------------------------
  const displayedData =
    rowsPerPage > 0
      ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredData;

  // ----------------------------
  // ページ変更ハンドラ
  // ----------------------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // ----------------------------
  // 1ページあたりの行数変更ハンドラ
  // ----------------------------
  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
  };

  // ----------------------------
  // 各セルの表示用ヘルパー関数
  // セル内容が長い場合はツールチップで全体を表示
  // ----------------------------
  const renderCell = (value) => (
    <Tooltip title={value.toString()} arrow>
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
        }}
      >
        {value}
      </span>
    </Tooltip>
  );

  // ----------------------------
  // 全てのプライマリーアクション定義
  // 各アクションに activeTabs プロパティで有効なタブ番号を指定
  // （タブ番号：1=依頼中、2=提案中、3=確定済、4=発注残、5=発注済、6=納品済、7=差し戻し、8=削除予定）
  // ----------------------------
  const allPrimaryActions = [
    {
      label: "依頼作成　社内",
      onClick: () => console.log("依頼作成　社内 clicked"),
      activeTabs: [1],
    },
    {
      label: "提案作成　取引先",
      onClick: () => console.log("提案作成　取引先 clicked"),
      activeTabs: [1],
    },
    {
      label: "依頼確定　社内",
      onClick: () => console.log("依頼確定　社内 clicked"),
      activeTabs: [2],
    },
    {
      label: "発注　社内",
      onClick: () => console.log("発注　社内 clicked"),
      activeTabs: [3, 4],
    },
    {
      label: "履歴確認",
      onClick: () => console.log("履歴確認 clicked"),
      activeTabs: [5, 6],
    },
  ];

  // ----------------------------
  // サマリーカード用表示ステータス
  // ----------------------------
  const summaryStatus = ['提案中', '確定済', '発注済', '納品済', '差し戻し'];

  return (
    <Grid container spacing={2}>
      {/* ヘッダー */}
      <Grid item xs={12} sx={{ backgroundColor: '#e3f2fd', p: 1 }}>
        <Typography variant="h4" align="center" gutterBottom>
          商品管理システム
        </Typography>
      </Grid>

      {/* サマリーカード */}
      <Grid item xs={12}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {summaryStatus.map((status) => {
            const statusData = filteredData.filter((item) => item.status === status);
            const totalQuantity = statusData.reduce((acc, item) => acc + item.quantity, 0);
            const totalCost = statusData.reduce((acc, item) => acc + item.totalCost, 0);
            const totalPrice = statusData.reduce((acc, item) => acc + item.totalPrice, 0);
            const totalMarkup = statusData.reduce((acc, item) => acc + (item.price - item.cost), 0);
            const avgPrice =
              statusData.length > 0
                ? (statusData.reduce((acc, item) => acc + item.price, 0) / statusData.length).toFixed(2)
                : 0;
            return (
              <Grid item xs={12} sm={6} md={4} key={status}>
                <Paper sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
                  <Typography variant="subtitle2">ステータス: {status}</Typography>
                  <Typography variant="body2">数量: {totalQuantity}</Typography>
                  <Typography variant="body2">原価計: {totalCost}</Typography>
                  <Typography variant="body2">売価計: {totalPrice}</Typography>
                  <Typography variant="body2">値入: {totalMarkup}</Typography>
                  <Typography variant="body2">平均売価: {avgPrice}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      {/* プライマリーアクションボタン群（常時表示、条件により活性化／非活性） */}
      <Grid item xs={12} sx={{ backgroundColor: '#fff3e0', p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ButtonGroup variant="contained">
            {allPrimaryActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                disabled={!action.activeTabs.includes(selectedTab)}
              >
                {action.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Grid>

      {/* ステータス選択タブ */}
      <Grid item xs={12} sx={{ backgroundColor: '#f3e5f5', p: 1 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="全て" />
          <Tab label="依頼中" />
          <Tab label="提案中" />
          <Tab label="確定済" />
          <Tab label="発注残" />
          <Tab label="発注済" />
          <Tab label="納品済" />
          <Tab label="差し戻し" />
          <Tab label="削除予定" />
        </Tabs>
      </Grid>

      {/* テーブルおよびグローバルアクション */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, backgroundColor: '#f1f8e9' }}>
          {/* グローバルアクション */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, backgroundColor: '#ffebee', p: 1 }}>
              <ButtonGroup variant="outlined">
                <Button color="error">削除</Button>
                <Button>Import</Button>
                <Button>Download Template</Button>
                <Button>Export CSV</Button>
                <Button>Export Excel</Button>
              </ButtonGroup>
            </Box>
          </Grid>

          {/* テーブル本体 */}
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small" aria-label="compact table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" size="small" />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>No</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>ステータス</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>納期可能日</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>注文日</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>納品日</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>商品名</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>コーナー</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>ライン</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>カテゴリ</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>商品コード</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>コスト</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>価格</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>マークアップ</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>数量</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>合計コスト</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>合計価格</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>確認日</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>サプライヤー</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" size="small" />
                  </TableCell>
                  <TableCell>No</TableCell>
                  {[
                    'status',
                    'availableDeliveryDate',
                    'orderDate',
                    'deliveryDate',
                    'productName',
                    'corner',
                    'line',
                    'category',
                    'itemCode',
                    'cost',
                    'price',
                    'markup',
                    'quantity',
                    'totalCost',
                    'totalPrice',
                    'confirmationDate',
                    'supplier',
                  ].map((key) => (
                    <TableCell key={key} sx={{ p: 1 }}>
                      <TextField
                        placeholder={key}
                        variant="outlined"
                        size="small"
                        value={filters[key]}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        sx={{ width: '100%' }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" size="small" />
                    </TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(page * rowsPerPage + index + 1)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.status)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.availableDeliveryDate)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.orderDate)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.deliveryDate)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.productName)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.corner)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.line)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.category)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.itemCode)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.cost)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.price)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.markup)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.quantity)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.totalCost)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.totalPrice)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.confirmationDate)}</TableCell>
                    <TableCell sx={{ p: 1 }}>{renderCell(row.supplier)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[
              10,
              20,
              30,
              { label: '全て', value: -1 },
            ]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
