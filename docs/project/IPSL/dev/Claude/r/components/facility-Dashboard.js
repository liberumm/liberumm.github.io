// 必要な Material UI コンポーネントの取得
const {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Collapse
} = MaterialUI;
const { useState } = React;

// タブパネル（フェードインエフェクト付き）
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Fade in={value === index} timeout={300}>
      <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
      </div>
    </Fade>
  );
}

// CalendarArea コンポーネント（カレンダー表示エリア）
function CalendarArea() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 今月の初日と末日を算出
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay(); // 0 (Sun)～6 (Sat)
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // カレンダー表示用の配列（前半は空セル）
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  // 7日ごとに分割して週単位の配列にする
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  // 前月／翌月のナビゲーション
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // 今日の強調表示のためのチェック
  const today = new Date();
  const isToday = (day) => {
    return day &&
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate();
  };
  
  return (
    <Paper sx={{ p: 2, backgroundColor: '#e8f5e9', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <span className="material-icons">chevron_left</span>
        </IconButton>
        <Typography variant="h6">
          {year}年 {month + 1}月
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <span className="material-icons">chevron_right</span>
        </IconButton>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
              <TableCell key={dayName} align="center" sx={{ fontWeight: 'bold', p: 0.5 }}>
                {dayName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {weeks.map((week, weekIndex) => (
            <TableRow key={weekIndex}>
              {week.map((day, dayIndex) => (
                <TableCell key={dayIndex} align="center" sx={{ p: 0.5, border: '1px solid #ccc' }}>
                  {day ? (
                    <Box
                      sx={{
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        lineHeight: '24px',
                        textAlign: 'center',
                        bgcolor: isToday(day) ? 'primary.main' : 'transparent',
                        color: isToday(day) ? '#fff' : 'inherit',
                        margin: '0 auto'
                      }}
                    >
                      {day}
                    </Box>
                  ) : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

// TODOリストコンポーネント（対応が必要な項目：常にエリアを表示）
function TodoList({ histories }) {
  // 「オープン」状態の履歴項目のみ抽出
  const openItems = histories.filter(item => item.status === 'open');

  // 対応期限（dueDate）から優先度を計算するヘルパー関数
  const computeUrgency = (dueDateStr) => {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { level: '高', color: 'error' }; // 期限超過
    } else if (diffDays <= 3) {
      return { level: '中', color: 'warning' }; // 3日以内
    } else {
      return { level: '低', color: 'success' }; // それ以外
    }
  };

  return (
    <Paper sx={{ p: 1, m: 1, backgroundColor: '#ffebee' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>TODO リスト</Typography>
      {openItems.length === 0 ? (
        <Typography variant="body2">TODO 項目はありません</Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>対応内容</TableCell>
                <TableCell>対応期限</TableCell>
                <TableCell>優先度</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {openItems.map((item, index) => {
                const urgency = computeUrgency(item.dueDate);
                return (
                  <TableRow key={index}>
                    <TableCell>{item.title || '未定義'}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>
                      <Chip label={urgency.level} color={urgency.color} size="small" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

// EVENTリストコンポーネント（対応は不要だが知っておくべき項目）
function EventList({ events }) {
  if (events.length === 0) {
    return null;
  }
  return (
    <Paper sx={{ p: 1, m: 1, backgroundColor: '#e3f2fd' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>EVENT リスト</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>イベント</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>詳細</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.event_id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.eventDate}</TableCell>
                <TableCell>{event.description || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

// ダッシュボード概要コンポーネント（概要エリア：各情報の合計値と内訳を表示）
function DashboardSummary({ stores, contracts, tenants, facilities, vendors, sales, competitors, histories, selectedStore }) {
  // 選択店舗でフィルタリングするヘルパー
  const filterByStore = (items) =>
    selectedStore ? items?.filter(item => item.store_id === selectedStore) : items;

  // 各データのフィルタ済み配列
  const filteredStores    = filterByStore(stores)     || [];
  const filteredContracts = filterByStore(contracts)  || [];
  const filteredTenants   = filterByStore(tenants)    || [];
  const filteredFacilities= filterByStore(facilities) || [];
  const filteredVendors   = filterByStore(vendors)    || [];

  // 汎用のグループ化関数（指定キーの値ごとに件数を集計）
  const groupBy = (items, key, defaultKey = 'その他') => {
    return items.reduce((acc, item) => {
      const groupKey = item[key] || defaultKey;
      acc[groupKey] = (acc[groupKey] || 0) + 1;
      return acc;
    }, {});
  };

  // 内訳（※各データは、店舗は businessType、契約は status、テナントは genre、設備は status、業者は type、競合は type、履歴は status として集計）
  const storeCountsByType     = groupBy(filteredStores,    'business_type');
  const contractsByStatus     = groupBy(filteredContracts, 'status');
  const tenantsByGenre        = groupBy(filteredTenants,   'genre');
  const facilitiesByStatus    = groupBy(filteredFacilities,'status');
  const vendorsByType         = groupBy(filteredVendors,   'type');
  const competitorsByType     = (competitors || []).reduce((acc, comp) => {
    const type = comp.type || 'その他';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const historiesByStatus     = (histories || []).reduce((acc, hist) => {
    const status = hist.status || '不明';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // 売上の合計と比率の算出
  const totalSales         = (sales || []).reduce((sum, sale) => sum + (sale.annual_sales || 0), 0);
  const totalPlannedSales  = (sales || []).reduce((sum, sale) => sum + (sale.planned_sales || 0), 0);
  const totalPreviousSales = (sales || []).reduce((sum, sale) => sum + (sale.previous_year_sales || 0), 0);
  const plannedRatio       = totalPlannedSales > 0  ? (totalSales / totalPlannedSales * 100).toFixed(1) : '-';
  const previousRatio      = totalPreviousSales > 0 ? (totalSales / totalPreviousSales * 100).toFixed(1) : '-';

  // カード用のデータ定義
  const cardData = [
    {
      title: '店舗情報',
      total: filteredStores.length,
      breakdown: storeCountsByType,
      icon: 'store'
    },
    {
      title: '契約状況',
      total: filteredContracts.length,
      breakdown: contractsByStatus,
      icon: 'assignment'
    },
    {
      title: 'テナント',
      total: filteredTenants.length,
      breakdown: tenantsByGenre,
      icon: 'people'
    },
    {
      title: '設備',
      total: filteredFacilities.length,
      breakdown: facilitiesByStatus,
      icon: 'build'
    },
    {
      title: '業者',
      total: filteredVendors.length,
      breakdown: vendorsByType,
      icon: 'settings'
    },
    {
      title: '売上',
      total: `¥${totalSales.toLocaleString()}`,
      breakdown: {
        '計画比': totalPlannedSales > 0 ? `${plannedRatio}%` : '-',
        '前年比': totalPreviousSales > 0 ? `${previousRatio}%` : '-'
      },
      icon: 'attach_money'
    },
    {
      title: '競合',
      total: (competitors || []).length,
      breakdown: competitorsByType,
      icon: 'trending_up'
    },
    {
      title: '履歴',
      total: (histories || []).length,
      breakdown: historiesByStatus,
      icon: 'history'
    }
  ];

  // カード表示用の配色例
  const cardColors = ['#bbdefb', '#c8e6c9', '#ffe0b2', '#d1c4e9', '#b2dfdb', '#ffcc80', '#b2ebf2', '#eeeeee'];

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1}>
        {cardData.map((item, idx) => (
          <Grid item xs={6} sm={3} md={3} key={idx}>
            <Card
              // カードをクリックしたとき、内部でイベント伝播を止めてから onCardClick を呼び出す
              onClick={(e) => { e.stopPropagation(); onCardClick(item.title); }}
              elevation={1}
              sx={{
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.01)' },
                bgcolor: cardColors[idx],
                p: 1,
                cursor: 'pointer'
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <span className="material-icons" style={{ marginRight: 4, opacity: 0.8, fontSize: '1.2rem' }}>
                    {item.icon}
                  </span>
                  <Typography color="textSecondary" variant="subtitle1">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                  {item.total}
                </Typography>
                <Box>
                  {item.breakdown && Object.entries(item.breakdown).map(([key, value]) => (
                    <Typography key={key} color="textSecondary" variant="caption" display="block">
                      {key}: {value}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// 店舗概要コンポーネント
function StoreOverview({ data = {} }) {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (name.includes('_')) {
      const [parent, child, prop] = name.split('_');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: {
            ...prev[parent][child],
            [prop]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    console.log('保存されたデータ:', editData);
    handleClose();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>項目</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>内容</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>開店年月</TableCell>
              <TableCell>{data.openDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>改装年月</TableCell>
              <TableCell>{data.renovationDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>提出日</TableCell>
              <TableCell>{data.submissionDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>営業時間</TableCell>
              <TableCell>{data.businessHours}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>駐車場必要台数</TableCell>
              <TableCell>{data.parkingRequired} 台</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>駐車場届出台数</TableCell>
              <TableCell>{data.parkingSubmitted} 台</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>駐輪場必要台数</TableCell>
              <TableCell>{data.bicycleParkingRequired} 台</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>駐輪場届出台数</TableCell>
              <TableCell>{data.bicycleParkingSubmitted} 台</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>納品可能時間</TableCell>
              <TableCell>{data.deliveryAvailableTime}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>用途地域</TableCell>
              <TableCell>
                {data.zoningArea?.map((area, index) => (
                  <Typography key={index}>
                    {area} {data.zoningApproved[index] ? '⭕' : '❌'}
                  </Typography>
                ))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>階数</TableCell>
              <TableCell>
                地上: {data.floorInfo?.aboveGround} 階<br />
                地下: {data.floorInfo?.underground} 階<br />
                入居階: {data.floorInfo?.occupiedFloors}<br />
                天井高: {data.floorInfo?.ceilingHeight}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>駐車場（敷地内）</TableCell>
              <TableCell>
                台数: {data.parkingDetails?.onSite?.total} 台<br />
                身障者用台数: {data.parkingDetails?.onSite?.handicap} 台<br />
                有料／無料: {data.parkingDetails?.onSite?.paid ? '有料' : '無料'}<br />
                精算機: {data.parkingDetails?.onSite?.paymentMachine ? 'あり' : 'なし'}<br />
                提携駐車場: {data.parkingDetails?.onSite?.partnerParking} 
                ({data.parkingDetails?.onSite?.partnerParkingCount} 台)<br />
                バイク台数: {data.parkingDetails?.onSite?.motorcycleCount} 台<br />
                管理: {data.parkingDetails?.onSite?.management}<br />
                利用条件: {data.parkingDetails?.onSite?.usageConditions}<br />
                超過料金: {data.parkingDetails?.onSite?.excessFee}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={handleOpen} startIcon={<span className="material-icons">edit</span>}>
          編集
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <span className="material-icons" style={{ marginRight: 8 }}>edit</span>
            店舗概要編集
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* 基本情報 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>基本情報</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="開店年月"
                type="month"
                name="openDate"
                value={editData.openDate}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            {/* 他の編集フィールドも必要に応じて追加 */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// 各管理コンポーネント（実際の実装に合わせて変更してください）
function StoresManager({ setStores, stores }) {
  return <Typography sx={{ p: 2 }}>店舗管理のコンテンツ</Typography>;
}
function ContractsManager() {
  return <Typography sx={{ p: 2 }}>契約管理のコンテンツ</Typography>;
}
function TenantsManager() {
  return <Typography sx={{ p: 2 }}>テナント管理のコンテンツ</Typography>;
}
function BuildingInfoManager() {
  return <Typography sx={{ p: 2 }}>建物情報管理のコンテンツ</Typography>;
}
function FacilitiesManager() {
  return <Typography sx={{ p: 2 }}>設備管理のコンテンツ</Typography>;
}
function VendorsManager() {
  return <Typography sx={{ p: 2 }}>業者管理のコンテンツ</Typography>;
}
function SalesManager() {
  return <Typography sx={{ p: 2 }}>売上管理のコンテンツ</Typography>;
}
function CompetitorsManager() {
  return <Typography sx={{ p: 2 }}>競合管理のコンテンツ</Typography>;
}
function HistoryManager() {
  return <Typography sx={{ p: 2 }}>履歴管理のコンテンツ</Typography>;
}
function SalesConditionManager({ data }) {
  return <Typography sx={{ p: 2 }}>店舗営業管理のコンテンツ：データ {JSON.stringify(data)}</Typography>;
}

// ダッシュボードコンポーネント
function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  const tabItems = [
    { label: '一覧', icon: 'dashboard' },
    { label: '店舗管理', icon: 'store' },
    { label: '店舗営業管理', icon: 'info' },
    { label: '施設概要', icon: 'dataset' },  // "店舗概要"から変更
    { label: '契約管理', icon: 'assignment' },
    { label: 'テナント管理', icon: 'people' },
    { label: '建物情報管理', icon: 'domain' },
    { label: '設備管理', icon: 'build' },
    { label: '業者管理', icon: 'settings' },
    { label: '売上管理', icon: 'attach_money' },
    { label: '競合管理', icon: 'trending_up' },
    { label: '履歴管理', icon: 'history' }
  ];

  // サンプルデータ（実際のデータに置き換えてください）
  const [stores, setStores] = useState([
    // サンプル店舗データ例
    { store_id: 1, store_name: '店舗A', business_type: 'SM', building_category: 'ショッピングモール', floor_area: '150㎡', built_year: '2010' },
    { store_id: 2, store_name: '店舗B', business_type: '衣料', building_category: 'ビル', floor_area: '100㎡', built_year: '2015' }
  ]);
  const [contracts, setContracts] = useState([
    { contract_id: 1, contract_name: '契約A', contract_type: '賃貸', contract_period: '2023-2028', status: '契約中', store_id: 1 },
    { contract_id: 2, contract_name: '契約B', contract_type: 'リース', contract_period: '2022-2027', status: '更新中', store_id: 2 },
    { contract_id: 3, contract_name: '契約C', contract_type: 'リース', contract_period: '2022-2027', status: '契約中', store_id: 2 }
  ]);
  const [tenants, setTenants] = useState([
    { tenant_id: 1, tenant_name: 'テナントA', genre: 'アパレル', contract_status: 'occupied', section: '1F', store_id: 1 },
    { tenant_id: 2, tenant_name: 'テナントB', genre: 'カフェ', contract_status: 'occupied', section: '2F', store_id: 2 }
  ]);
  const [facilities, setFacilities] = useState([
    { facility_id: 1, facility_name: 'エレベーター', status: '正常', installation_place: '正面', store_id: 1 },
    { facility_id: 2, facility_name: '空調', status: '故障中', installation_place: '裏', store_id: 2 }
  ]);
  const [histories, setHistories] = useState([
    { history_id: 1, title: '契約更新確認', dueDate: '2025-02-10', status: 'open' },
    { history_id: 2, title: '設備点検', dueDate: '2025-02-08', status: 'open' },
    { history_id: 3, title: 'テナント対応', dueDate: '2025-02-20', status: 'close' }
  ]);
  const [events, setEvents] = useState([
    { event_id: 1, title: 'システムメンテナンス', eventDate: '2025-02-15', description: '定期メンテナンスのお知らせ' },
    { event_id: 2, title: '新機能リリース', eventDate: '2025-03-01', description: '新機能のご案内' }
  ]);
  const [vendors, setVendors] = useState([
    { store_id: 1, vendor_id: 1, vendor_name: '業者A', type: '設備' },
    { store_id: 2, vendor_id: 2, vendor_name: '業者B', type: '建築' }
  ]);
  const [sales, setSales] = useState([
    { sale_id: 1, annual_sales: 5000000, planned_sales: 6000000, previous_year_sales: 5500000, store_id: 1 },
    { sale_id: 2, annual_sales: 3000000, planned_sales: 3500000, previous_year_sales: 3200000, store_id: 2 }
  ]);
  const [competitors, setCompetitors] = useState([
    { competitor_id: 1, title: '競合A', type: '飲食', store_id: 1 },
    { competitor_id: 2, title: '競合B', type: '小売', store_id: 2 }
  ]);
  const [selectedStore, setSelectedStore] = useState('');
  const [storeOverviewData, setStoreOverviewData] = useState({
    openDate: '2023-01',
    renovationDate: '2023-06',
    submissionDate: '2023-01-01',
    businessHours: '10:00-22:00',
    parkingRequired: 50,
    parkingSubmitted: 60,
    bicycleParkingRequired: 100,
    bicycleParkingSubmitted: 120,
    deliveryAvailableTime: '6:00-10:00',
    zoningArea: ['商業地域', '近隣商業地域'],
    zoningApproved: [true, false],
    floorInfo: {
      aboveGround: 3,
      underground: 1,
      occupiedFloors: '1-2',
      ceilingHeight: '3.5m'
    },
    parkingDetails: {
      onSite: {
        total: 40,
        handicap: 2,
        paid: true,
        paymentMachine: true,
        partnerParking: 'A駐車場',
        partnerParkingCount: 20,
        motorcycleCount: 10,
        management: '自社',
        usageConditions: '1時間無料',
        excessFee: '100円/30分'
      },
      offSite: {
        // ...必要に応じた構造
      }
    }
  });

  // 施設選択用の状態を追加
  const [selectedFacility, setSelectedFacility] = useState('');

  // DashboardSummary 内の各カードをクリックしたときの処理
  // カードタイトルに応じたタブインデックスのマッピング
  const handleCardClick = (cardTitle) => {
    const mapping = {
      '店舗情報': 1,
      '契約状況': 4,
      'テナント': 5,
      '設備': 7,
      '業者': 8,
      '売上': 9,
      '競合': 10,
      '履歴': 11
    };
    const tabIndex = mapping[cardTitle];
    if (tabIndex !== undefined) {
      setTabValue(tabIndex);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 1,
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* カレンダー表示エリア */}
      <Box sx={{ p: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => setCalendarExpanded(!calendarExpanded)}
        >
          <Typography variant="h6">カレンダー</Typography>
          <IconButton size="small">
            <span className="material-icons">
              {calendarExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </IconButton>
        </Box>
        <Collapse in={calendarExpanded}>
          <CalendarArea />
        </Collapse>
      </Box>

      {/* TODOリストエリア */}
      <TodoList histories={histories} />

      {/* EVENTリストエリア */}
      <EventList events={events} />

      {/* 概要エリア（Collapse 内の外側 Paper をクリックすると店舗概要タブへ） */}
      <Box sx={{ p: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => setSummaryExpanded(!summaryExpanded)}
        >
          <Typography variant="h6">概要</Typography>
          <IconButton size="small">
            <span className="material-icons">
              {summaryExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </IconButton>
        </Box>
        <Collapse in={summaryExpanded}>
          {/* 外側 Paper（クリック時は店舗概要タブ：タブインデックス 3 へ遷移） */}
          <Paper sx={{ cursor: 'pointer', p: 1 }} onClick={() => setTabValue(3)}>
            <DashboardSummary
              stores={stores}
              contracts={contracts}
              tenants={tenants}
              facilities={facilities}
              vendors={vendors}
              sales={sales}
              competitors={competitors}
              histories={histories}
              selectedStore={selectedStore}
              onCardClick={handleCardClick}
            />
          </Paper>
        </Collapse>
      </Box>

      {/* タブエリア */}
      <AppBar
        position="static"
        sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          boxShadow: 'none'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          indicatorColor="secondary"
          textColor="inherit"
        >
          {tabItems.map((item, idx) => (
            <Tab
              key={idx}
              label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons" style={{ marginRight: 4 }}>
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              }
            />
          ))}
        </Tabs>
      </AppBar>

      {/* Chips エリア */}
      <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tabItems.map((item, idx) => (
          <Chip
            key={idx}
            icon={<span className="material-icons" style={{ fontSize: '1.2rem' }}>{item.icon}</span>}
            label={item.label}
            variant={tabValue === idx ? 'filled' : 'outlined'}
            color={tabValue === idx ? 'primary' : 'default'}
            onClick={() => setTabValue(idx)}
          />
        ))}
      </Box>

      {/* コンテンツ部分 */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        <TabPanel value={tabValue} index={0}>
          {/* 「一覧」タブ内の各 Paper をクリックすると、対応する管理タブへ遷移 */}
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(1)}>
            <StoresManager setStores={setStores} stores={stores} />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(4)}>
            <ContractsManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(5)}>
            <TenantsManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(6)}>
            <BuildingInfoManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(7)}>
            <FacilitiesManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(8)}>
            <VendorsManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(9)}>
            <SalesManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(10)}>
            <CompetitorsManager />
          </Paper>
          <Paper sx={{ p: 1, mb: 2, cursor: 'pointer' }} onClick={() => setTabValue(11)}>
            <HistoryManager />
          </Paper>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <StoresManager setStores={setStores} stores={stores} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <SalesConditionManager data={storeOverviewData} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <FacilityOverview data={{ ...storeOverviewData, stores: stores }} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <ContractsManager />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          <TenantsManager />
        </TabPanel>
        <TabPanel value={tabValue} index={6}>
          <BuildingInfoManager />
        </TabPanel>
        <TabPanel value={tabValue} index={7}>
          <FacilitiesManager />
        </TabPanel>
        <TabPanel value={tabValue} index={8}>
          <VendorsManager />
        </TabPanel>
        <TabPanel value={tabValue} index={9}>
          <SalesManager />
        </TabPanel>
        <TabPanel value={tabValue} index={10}>
          <CompetitorsManager />
        </TabPanel>
        <TabPanel value={tabValue} index={11}>
          <HistoryManager />
        </TabPanel>
      </Box>
    </Paper>
  );
}

// StoreOverviewをFacilityOverviewに変更
function FacilityOverview({ data = {} }) {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(data);
  // selectedFacility の状態を追加
  const [selectedFacility, setSelectedFacility] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (name.includes('_')) {
      const [parent, child, prop] = name.split('_');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: {
            ...prev[parent][child],
            [prop]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    console.log('保存されたデータ:', editData);
    handleClose();
  };

  // 施設選択用セレクトボックスを追加
  return (
    <Box>
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>施設を選択</InputLabel>
          <Select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            <MenuItem value="">
              <em>選択してください</em>
            </MenuItem>
            {/* stores は props として渡す必要があります */}
            {(data.stores || []).map((store) => (
              <MenuItem key={store.store_id} value={store.store_id}>
                {store.store_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedFacility ? (
        <>
          {/* 選択された施設の基本情報 */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>基本情報</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {/* 既存の店舗情報テーブル */}
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>項目</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>内容</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>開店年月</TableCell>
                        <TableCell>{data.openDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>改装年月</TableCell>
                        <TableCell>{data.renovationDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>提出日</TableCell>
                        <TableCell>{data.submissionDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>営業時間</TableCell>
                        <TableCell>{data.businessHours}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>駐車場必要台数</TableCell>
                        <TableCell>{data.parkingRequired} 台</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>駐車場届出台数</TableCell>
                        <TableCell>{data.parkingSubmitted} 台</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>駐輪場必要台数</TableCell>
                        <TableCell>{data.bicycleParkingRequired} 台</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>駐輪場届出台数</TableCell>
                        <TableCell>{data.bicycleParkingSubmitted} 台</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>納品可能時間</TableCell>
                        <TableCell>{data.deliveryAvailableTime}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>用途地域</TableCell>
                        <TableCell>
                          {data.zoningArea?.map((area, index) => (
                            <Typography key={index}>
                              {area} {data.zoningApproved[index] ? '⭕' : '❌'}
                            </Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>階数</TableCell>
                        <TableCell>
                          地上: {data.floorInfo?.aboveGround} 階<br />
                          地下: {data.floorInfo?.underground} 階<br />
                          入居階: {data.floorInfo?.occupiedFloors}<br />
                          天井高: {data.floorInfo?.ceilingHeight}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>駐車場（敷地内）</TableCell>
                        <TableCell>
                          台数: {data.parkingDetails?.onSite?.total} 台<br />
                          身障者用台数: {data.parkingDetails?.onSite?.handicap} 台<br />
                          有料／無料: {data.parkingDetails?.onSite?.paid ? '有料' : '無料'}<br />
                          精算機: {data.parkingDetails?.onSite?.paymentMachine ? 'あり' : 'なし'}<br />
                          提携駐車場: {data.parkingDetails?.onSite?.partnerParking} 
                          ({data.parkingDetails?.onSite?.partnerParkingCount} 台)<br />
                          バイク台数: {data.parkingDetails?.onSite?.motorcycleCount} 台<br />
                          管理: {data.parkingDetails?.onSite?.management}<br />
                          利用条件: {data.parkingDetails?.onSite?.usageConditions}<br />
                          超過料金: {data.parkingDetails?.onSite?.excessFee}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>

          {/* 関連情報のサマリー */}
          <Grid container spacing={2}>
            {/* テナント情報 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">テナント情報</Typography>
                {/* テナント数や状況のサマリー表示 */}
              </Paper>
            </Grid>
            {/* 設備情報 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">設備情報</Typography>
                {/* 設備数や状況のサマリー表示 */}
              </Paper>
            </Grid>
            {/* その他の関連情報 */}
          </Grid>
        </>
      ) : (
        <Typography>施設を選択してください</Typography>
      )}
    </Box>
  );
}

