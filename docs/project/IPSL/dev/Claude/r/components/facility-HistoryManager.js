// components/HistoryManager.js
const {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Chip, // Chipを追加
} = MaterialUI;
const { useState } = React;

function HistoryManager() {
  // 内部で使用するカテゴリ・ステータスの表示用マッピング
  const categoryMapping = {
    complaint: "クレーム",
    repair: "修繕",
    meeting: "会議",
    approval: "申請",
    donation: "寄付",
  };
  const statusMapping = {
    open: "未対応",
    in_progress: "対応中",
    done: "完了",
  };

  // サンプルデータ（10件）
  const [histories, setHistories] = useState([
    {
      history_id: 1,
      store_id: 101,
      category: "complaint",
      title: "店舗前の騒音クレーム",
      event_date: "2023-07-01",
      status: "open",
      details: "深夜の騒音により苦情が多数寄せられました。",
      cost: "0.00",
      location_info: "店舗前",
      vendor_id: 201,
      responsible_user_id: 501,
      created_at: "2023-07-01T09:00:00",
      updated_at: "2023-07-01T09:00:00",
      created_by: 501,
      updated_by: 501,
    },
    {
      history_id: 2,
      store_id: 102,
      category: "repair",
      title: "店舗内照明修繕工事",
      event_date: "2023-07-05",
      status: "in_progress",
      details: "照明の不具合により店舗内部の全体照明が点灯しないため、修繕作業中。",
      cost: "150000.00",
      location_info: "店舗内部",
      vendor_id: 202,
      responsible_user_id: 502,
      created_at: "2023-07-05T10:30:00",
      updated_at: "2023-07-05T11:00:00",
      created_by: 502,
      updated_by: 502,
    },
    {
      history_id: 3,
      store_id: 103,
      category: "meeting",
      title: "スタッフ定例会議",
      event_date: "2023-07-10",
      status: "done",
      details: "新商品の販売戦略について議論しました。",
      cost: "0.00",
      location_info: "会議室",
      vendor_id: 0,
      responsible_user_id: 503,
      created_at: "2023-07-10T14:00:00",
      updated_at: "2023-07-10T14:30:00",
      created_by: 503,
      updated_by: 503,
    },
    {
      history_id: 4,
      store_id: 104,
      category: "approval",
      title: "営業時間延長申請",
      event_date: "2023-07-12",
      status: "open",
      details: "顧客からの要望により営業時間延長の申請を提出しました。",
      cost: "0.00",
      location_info: "店舗事務室",
      vendor_id: 0,
      responsible_user_id: 504,
      created_at: "2023-07-12T08:45:00",
      updated_at: "2023-07-12T08:45:00",
      created_by: 504,
      updated_by: 504,
    },
    {
      history_id: 5,
      store_id: 105,
      category: "donation",
      title: "地域イベント寄付金",
      event_date: "2023-07-15",
      status: "done",
      details: "地域の子ども会イベントへの寄付金を支給しました。",
      cost: "50000.00",
      location_info: "店舗管理部",
      vendor_id: 203,
      responsible_user_id: 505,
      created_at: "2023-07-15T12:00:00",
      updated_at: "2023-07-15T12:30:00",
      created_by: 505,
      updated_by: 505,
    },
    {
      history_id: 6,
      store_id: 106,
      category: "complaint",
      title: "駐車場クレーム",
      event_date: "2023-07-18",
      status: "open",
      details: "近隣住民からの駐車場利用に関する苦情。",
      cost: "0.00",
      location_info: "駐車場",
      vendor_id: 0,
      responsible_user_id: 506,
      created_at: "2023-07-18T09:30:00",
      updated_at: "2023-07-18T09:30:00",
      created_by: 506,
      updated_by: 506,
    },
    {
      history_id: 7,
      store_id: 107,
      category: "repair",
      title: "看板修理",
      event_date: "2023-07-20",
      status: "in_progress",
      details: "外装看板の老朽化に伴い修理作業を実施中。",
      cost: "200000.00",
      location_info: "店舗外壁",
      vendor_id: 204,
      responsible_user_id: 507,
      created_at: "2023-07-20T11:00:00",
      updated_at: "2023-07-20T11:30:00",
      created_by: 507,
      updated_by: 507,
    },
    {
      history_id: 8,
      store_id: 108,
      category: "meeting",
      title: "月次報告会議",
      event_date: "2023-07-22",
      status: "done",
      details: "各部門の月次報告を共有し、課題解決策を検討。",
      cost: "0.00",
      location_info: "本社会議室",
      vendor_id: 0,
      responsible_user_id: 508,
      created_at: "2023-07-22T15:00:00",
      updated_at: "2023-07-22T15:30:00",
      created_by: 508,
      updated_by: 508,
    },
    {
      history_id: 9,
      store_id: 109,
      category: "approval",
      title: "新規出店申請",
      event_date: "2023-07-25",
      status: "open",
      details: "新たな出店計画に伴う申請手続き中。",
      cost: "0.00",
      location_info: "店舗企画部",
      vendor_id: 0,
      responsible_user_id: 509,
      created_at: "2023-07-25T10:00:00",
      updated_at: "2023-07-25T10:00:00",
      created_by: 509,
      updated_by: 509,
    },
    {
      history_id: 10,
      store_id: 110,
      category: "donation",
      title: "チャリティ寄付",
      event_date: "2023-07-28",
      status: "done",
      details: "地域のチャリティイベントへの寄付金支給完了。",
      cost: "75000.00",
      location_info: "店舗管理部",
      vendor_id: 205,
      responsible_user_id: 510,
      created_at: "2023-07-28T13:00:00",
      updated_at: "2023-07-28T13:30:00",
      created_by: 510,
      updated_by: 510,
    },
  ]);

  // ダイアログ（新規／編集）の状態管理
  const [openDialog, setOpenDialog] = useState(false);
  // dialogMode は "new"（新規登録） または "edit"（編集）を指定
  const [dialogMode, setDialogMode] = useState("new");
  const defaultHistory = {
    store_id: "",
    category: "",
    title: "",
    event_date: "",
    status: "",
    details: "",
    cost: "",
    location_info: "",
    vendor_id: "",
    responsible_user_id: "",
    created_by: "",
    updated_by: "",
  };
  const [currentHistory, setCurrentHistory] = useState(defaultHistory);

  // フィルター用の状態
  // カテゴリフィルター（Chip用）
  const [selectedCategory, setSelectedCategory] = useState("全て");
  // ステータスフィルター（Tabs）
  const [selectedStatus, setSelectedStatus] = useState("全て");

  // ページネーション用の状態（初期はページ 0、1ページあたり 20 件）
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // フィルター処理（「全て」を選んだ場合は絞り込みなし）
  const filteredHistories = histories.filter((h) => {
    return (
      (selectedCategory === "全て" || h.category === selectedCategory) &&
      (selectedStatus === "全て" || h.status === selectedStatus)
    );
  });

  // ページネーション処理（rowsPerPage が数値の場合はスライス）
  const paginatedHistories =
    rowsPerPage > 0
      ? filteredHistories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredHistories;

  // 新規登録ダイアログを開く
  const handleOpenNew = () => {
    setDialogMode("new");
    setCurrentHistory(defaultHistory);
    setOpenDialog(true);
  };

  // 編集用ダイアログを開く
  const handleOpenEdit = (history) => {
    setDialogMode("edit");
    setCurrentHistory(history);
    setOpenDialog(true);
  };

  // 登録／更新処理
  const handleSaveHistory = () => {
    const now = new Date().toISOString();
    if (dialogMode === "new") {
      const newId =
        histories.length > 0 ? Math.max(...histories.map((h) => h.history_id)) + 1 : 1;
      const newRecord = {
        ...currentHistory,
        history_id: newId,
        created_at: now,
        updated_at: now,
      };
      setHistories([...histories, newRecord]);
    } else if (dialogMode === "edit") {
      // 編集の場合、対象レコードを更新
      const updatedHistories = histories.map((h) =>
        h.history_id === currentHistory.history_id
          ? { ...currentHistory, updated_at: now }
          : h
      );
      setHistories(updatedHistories);
    }
    setOpenDialog(false);
    setCurrentHistory(defaultHistory);
  };

  // 削除処理
  const handleDelete = (history_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setHistories(histories.filter((h) => h.history_id !== history_id));
    }
  };

  // ページ変更時の処理
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 表示件数変更時の処理
  // 選択肢として 10,20,30,「入力」「全て」を用意
  const handleChangeRowsPerPage = (event) => {
    const value = event.target.value;
    if (value === "入力") {
      const custom = prompt("表示件数を入力してください", rowsPerPage);
      if (custom !== null) {
        const customNum = parseInt(custom, 10);
        if (!isNaN(customNum) && customNum > 0) {
          setRowsPerPage(customNum);
          setPage(0);
        }
      }
    } else if (value === "全て") {
      setRowsPerPage(filteredHistories.length);
      setPage(0);
    } else {
      setRowsPerPage(Number(value));
      setPage(0);
    }
  };

  // TablePagination で使用する表示件数の選択肢
  const rowsPerPageOptions = [
    10,
    20,
    30,
    { label: "入力", value: "入力" },
    { label: "全て", value: "全て" },
  ];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        履歴管理
      </Typography>

      {/* カテゴリフィルター：Chip を使用 */}
      <Box mb={2}>
        {["全て", "complaint", "repair", "meeting", "approval", "donation"].map((cat) => (
          <Chip
            key={cat}
            label={cat === "全て" ? "全て" : categoryMapping[cat]}
            color={selectedCategory === cat ? "primary" : "default"}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(0);
            }}
            style={{ marginRight: 8, marginBottom: 8 }}
          />
        ))}
      </Box>

      {/* ステータスフィルター：Tabs */}
      <Box mb={2}>
        <Tabs
          value={selectedStatus}
          onChange={(e, newValue) => {
            setSelectedStatus(newValue);
            setPage(0);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {["全て", "open", "in_progress", "done"].map((stat) => (
            <Tab key={stat} value={stat} label={stat === "全て" ? "全て" : statusMapping[stat]} />
          ))}
        </Tabs>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={handleOpenNew}>
          新規追加
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>履歴ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>カテゴリ</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>タイトル</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>発生日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ステータス</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>詳細内容</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>費用 (円)</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>場所</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>担当者ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>登録者ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新者ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHistories.map((h) => (
              <TableRow
                key={h.history_id}
                // ホバー時の背景色とカーソル、行クリックで編集ダイアログを起動
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)", cursor: "pointer" } }}
                onClick={() => handleOpenEdit(h)}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.history_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {categoryMapping[h.category]}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.title}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.event_date}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {statusMapping[h.status]}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.details}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.cost}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.location_info}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.vendor_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.responsible_user_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.updated_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.created_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{h.updated_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {/* ボタン押下時は行クリックを防ぐ */}
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(h);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(h.history_id);
                    }}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedHistories.length === 0 && (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredHistories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="表示件数："
        />
      </TableContainer>

      {/* 新規／編集用ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogMode === "new" ? "新規履歴登録" : "履歴編集"}</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={currentHistory.store_id}
            onChange={(e) => setCurrentHistory({ ...currentHistory, store_id: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">カテゴリ</InputLabel>
            <Select
              labelId="category-label"
              value={currentHistory.category}
              label="カテゴリ"
              onChange={(e) => setCurrentHistory({ ...currentHistory, category: e.target.value })}
            >
              <MenuItem value="complaint">クレーム</MenuItem>
              <MenuItem value="repair">修繕</MenuItem>
              <MenuItem value="meeting">会議</MenuItem>
              <MenuItem value="approval">申請</MenuItem>
              <MenuItem value="donation">寄付</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="タイトル"
            fullWidth
            margin="dense"
            value={currentHistory.title}
            onChange={(e) => setCurrentHistory({ ...currentHistory, title: e.target.value })}
          />
          <TextField
            label="発生日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentHistory.event_date}
            onChange={(e) => setCurrentHistory({ ...currentHistory, event_date: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">ステータス</InputLabel>
            <Select
              labelId="status-label"
              value={currentHistory.status}
              label="ステータス"
              onChange={(e) => setCurrentHistory({ ...currentHistory, status: e.target.value })}
            >
              <MenuItem value="open">未対応</MenuItem>
              <MenuItem value="in_progress">対応中</MenuItem>
              <MenuItem value="done">完了</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="詳細内容"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={currentHistory.details}
            onChange={(e) => setCurrentHistory({ ...currentHistory, details: e.target.value })}
          />
          <TextField
            label="費用 (円)"
            fullWidth
            margin="dense"
            value={currentHistory.cost}
            onChange={(e) => setCurrentHistory({ ...currentHistory, cost: e.target.value })}
          />
          <TextField
            label="場所"
            fullWidth
            margin="dense"
            value={currentHistory.location_info}
            onChange={(e) => setCurrentHistory({ ...currentHistory, location_info: e.target.value })}
          />
          <TextField
            label="業者ID"
            fullWidth
            margin="dense"
            value={currentHistory.vendor_id}
            onChange={(e) => setCurrentHistory({ ...currentHistory, vendor_id: e.target.value })}
          />
          <TextField
            label="担当者ID"
            fullWidth
            margin="dense"
            value={currentHistory.responsible_user_id}
            onChange={(e) => setCurrentHistory({ ...currentHistory, responsible_user_id: e.target.value })}
          />
          <TextField
            label="登録者ID"
            fullWidth
            margin="dense"
            value={currentHistory.created_by}
            onChange={(e) => setCurrentHistory({ ...currentHistory, created_by: e.target.value })}
          />
          <TextField
            label="更新者ID"
            fullWidth
            margin="dense"
            value={currentHistory.updated_by}
            onChange={(e) => setCurrentHistory({ ...currentHistory, updated_by: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveHistory}>
            {dialogMode === "new" ? "登録" : "更新"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
