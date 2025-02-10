// components/VendorsManager.js
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
  TablePagination,
} = MaterialUI;
const { useState } = React;

function VendorsManager() {
  // サンプルデータ（統合データ：業者マスタ＋店舗⇔業者関係） ※全10件
  const initialVendors = [
    {
      vendor_id: 1,
      vendor_name: "業者1",
      vendor_type: "設計",
      contact_info: "06-1111-1111",
      vendor_notes: "業者備考1",
      vendor_created_at: "2023-04-01 10:00:00",
      vendor_updated_at: "2023-04-01 10:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 101,
      main_category: "施工",
      start_date: "2023-05-01",
      end_date: "2024-05-01",
      relation_notes: "店舗備考1",
      relation_created_at: "2023-04-01 10:00:00",
      relation_updated_at: "2023-04-01 10:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 2,
      vendor_name: "業者2",
      vendor_type: "施工",
      contact_info: "06-2222-2222",
      vendor_notes: "業者備考2",
      vendor_created_at: "2023-04-02 11:00:00",
      vendor_updated_at: "2023-04-02 11:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 102,
      main_category: "内装",
      start_date: "2023-06-01",
      end_date: "2024-06-01",
      relation_notes: "店舗備考2",
      relation_created_at: "2023-04-02 11:00:00",
      relation_updated_at: "2023-04-02 11:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 3,
      vendor_name: "業者3",
      vendor_type: "内装",
      contact_info: "06-3333-3333",
      vendor_notes: "業者備考3",
      vendor_created_at: "2023-04-03 12:00:00",
      vendor_updated_at: "2023-04-03 12:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 103,
      main_category: "保守点検",
      start_date: "2023-07-01",
      end_date: "2024-07-01",
      relation_notes: "店舗備考3",
      relation_created_at: "2023-04-03 12:00:00",
      relation_updated_at: "2023-04-03 12:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 4,
      vendor_name: "業者4",
      vendor_type: "冷凍",
      contact_info: "06-4444-4444",
      vendor_notes: "業者備考4",
      vendor_created_at: "2023-04-04 13:00:00",
      vendor_updated_at: "2023-04-04 13:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 104,
      main_category: "施工",
      start_date: "2023-08-01",
      end_date: "2024-08-01",
      relation_notes: "店舗備考4",
      relation_created_at: "2023-04-04 13:00:00",
      relation_updated_at: "2023-04-04 13:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 5,
      vendor_name: "業者5",
      vendor_type: "空調",
      contact_info: "06-5555-5555",
      vendor_notes: "業者備考5",
      vendor_created_at: "2023-04-05 14:00:00",
      vendor_updated_at: "2023-04-05 14:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 105,
      main_category: "内装",
      start_date: "2023-09-01",
      end_date: "2024-09-01",
      relation_notes: "店舗備考5",
      relation_created_at: "2023-04-05 14:00:00",
      relation_updated_at: "2023-04-05 14:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 6,
      vendor_name: "業者6",
      vendor_type: "設計",
      contact_info: "06-6666-6666",
      vendor_notes: "業者備考6",
      vendor_created_at: "2023-04-06 15:00:00",
      vendor_updated_at: "2023-04-06 15:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 106,
      main_category: "保守点検",
      start_date: "2023-10-01",
      end_date: "2024-10-01",
      relation_notes: "店舗備考6",
      relation_created_at: "2023-04-06 15:00:00",
      relation_updated_at: "2023-04-06 15:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 7,
      vendor_name: "業者7",
      vendor_type: "施工",
      contact_info: "06-7777-7777",
      vendor_notes: "業者備考7",
      vendor_created_at: "2023-04-07 16:00:00",
      vendor_updated_at: "2023-04-07 16:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 107,
      main_category: "施工",
      start_date: "2023-11-01",
      end_date: "2024-11-01",
      relation_notes: "店舗備考7",
      relation_created_at: "2023-04-07 16:00:00",
      relation_updated_at: "2023-04-07 16:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 8,
      vendor_name: "業者8",
      vendor_type: "内装",
      contact_info: "06-8888-8888",
      vendor_notes: "業者備考8",
      vendor_created_at: "2023-04-08 17:00:00",
      vendor_updated_at: "2023-04-08 17:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 108,
      main_category: "内装",
      start_date: "2023-12-01",
      end_date: "2024-12-01",
      relation_notes: "店舗備考8",
      relation_created_at: "2023-04-08 17:00:00",
      relation_updated_at: "2023-04-08 17:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 9,
      vendor_name: "業者9",
      vendor_type: "冷凍",
      contact_info: "06-9999-9999",
      vendor_notes: "業者備考9",
      vendor_created_at: "2023-04-09 18:00:00",
      vendor_updated_at: "2023-04-09 18:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 109,
      main_category: "保守点検",
      start_date: "2024-01-01",
      end_date: "2025-01-01",
      relation_notes: "店舗備考9",
      relation_created_at: "2023-04-09 18:00:00",
      relation_updated_at: "2023-04-09 18:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
    {
      vendor_id: 10,
      vendor_name: "業者10",
      vendor_type: "空調",
      contact_info: "06-1010-1010",
      vendor_notes: "業者備考10",
      vendor_created_at: "2023-04-10 19:00:00",
      vendor_updated_at: "2023-04-10 19:00:00",
      vendor_created_by: 1,
      vendor_updated_by: 1,
      store_id: 110,
      main_category: "施工",
      start_date: "2024-02-01",
      end_date: "2025-02-01",
      relation_notes: "店舗備考10",
      relation_created_at: "2023-04-10 19:00:00",
      relation_updated_at: "2023-04-10 19:00:00",
      relation_created_by: 1,
      relation_updated_by: 1,
    },
  ];

  // 状態管理
  const [vendors, setVendors] = useState(initialVendors);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  // ダイアログ用フォーム（業者情報＋店舗との関係情報）
  const [form, setForm] = useState({
    vendor_name: "",
    vendor_type: "",
    contact_info: "",
    vendor_notes: "",
    store_id: "",
    main_category: "",
    start_date: "",
    end_date: "",
    relation_notes: "",
  });

  // ページネーション用状態
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 新規追加用ダイアログを開く
  const handleOpenAdd = () => {
    setCurrentVendor(null);
    setForm({
      vendor_name: "",
      vendor_type: "",
      contact_info: "",
      vendor_notes: "",
      store_id: "",
      main_category: "",
      start_date: "",
      end_date: "",
      relation_notes: "",
    });
    setOpenDialog(true);
  };

  // 編集用ダイアログを開く（対象データの内容をフォームにセット）
  const handleOpenEdit = (vendor) => {
    setCurrentVendor(vendor);
    setForm({
      vendor_name: vendor.vendor_name,
      vendor_type: vendor.vendor_type,
      contact_info: vendor.contact_info,
      vendor_notes: vendor.vendor_notes,
      store_id: vendor.store_id,
      main_category: vendor.main_category,
      start_date: vendor.start_date,
      end_date: vendor.end_date,
      relation_notes: vendor.relation_notes,
    });
    setOpenDialog(true);
  };

  // 登録／更新処理（新規追加か編集かで分岐）
  const handleSaveVendor = () => {
    // 現在日時（YYYY-MM-DD HH:mm:ss形式）
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (currentVendor) {
      // 編集の場合
      const updatedVendors = vendors.map((v) =>
        v.vendor_id === currentVendor.vendor_id
          ? {
              ...v,
              vendor_name: form.vendor_name,
              vendor_type: form.vendor_type,
              contact_info: form.contact_info,
              vendor_notes: form.vendor_notes,
              vendor_updated_at: now,
              vendor_updated_by: 1,
              store_id: Number(form.store_id),
              main_category: form.main_category,
              start_date: form.start_date,
              end_date: form.end_date,
              relation_notes: form.relation_notes,
              relation_updated_at: now,
              relation_updated_by: 1,
            }
          : v
      );
      setVendors(updatedVendors);
    } else {
      // 新規追加の場合
      const newId = vendors.length > 0 ? Math.max(...vendors.map((v) => v.vendor_id)) + 1 : 1;
      const newVendor = {
        vendor_id: newId,
        vendor_name: form.vendor_name,
        vendor_type: form.vendor_type,
        contact_info: form.contact_info,
        vendor_notes: form.vendor_notes,
        vendor_created_at: now,
        vendor_updated_at: now,
        vendor_created_by: 1,
        vendor_updated_by: 1,
        store_id: Number(form.store_id),
        main_category: form.main_category,
        start_date: form.start_date,
        end_date: form.end_date,
        relation_notes: form.relation_notes,
        relation_created_at: now,
        relation_updated_at: now,
        relation_created_by: 1,
        relation_updated_by: 1,
      };
      setVendors([...vendors, newVendor]);
    }
    setOpenDialog(false);
    setForm({
      vendor_name: "",
      vendor_type: "",
      contact_info: "",
      vendor_notes: "",
      store_id: "",
      main_category: "",
      start_date: "",
      end_date: "",
      relation_notes: "",
    });
    setCurrentVendor(null);
  };

  const handleDelete = (vendor_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setVendors(vendors.filter((v) => v.vendor_id !== vendor_id));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
  };

  const displayVendors =
    rowsPerPage > 0
      ? vendors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : vendors;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">業者管理（統合データ）</Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          新規追加
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {/* 業者マスタ側の項目 */}
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者名</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>区分</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>連絡先</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者備考</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業者更新者</TableCell>
              {/* 店舗⇔業者関係側の項目 */}
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>メインの役割</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>契約開始日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>契約終了日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗備考</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗更新者</TableCell>
              {/* 操作 */}
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayVendors.map((vendor) => (
              <TableRow
                key={vendor.vendor_id}
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_type}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.contact_info}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_notes}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_created_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_updated_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_created_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.vendor_updated_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.main_category}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.start_date}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.end_date}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.relation_notes}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.relation_created_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.relation_updated_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.relation_created_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{vendor.relation_updated_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Button size="small" onClick={() => handleOpenEdit(vendor)}>
                    編集
                  </Button>
                  <Button size="small" color="secondary" onClick={() => handleDelete(vendor.vendor_id)}>
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={vendors.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage === -1 ? vendors.length : rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
          labelRowsPerPage="表示件数:"
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentVendor ? "業者編集" : "新規業者登録"}</DialogTitle>
        <DialogContent>
          {/* 業者情報 */}
          <TextField
            label="業者名"
            fullWidth
            margin="dense"
            value={form.vendor_name}
            onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
          />
          <TextField
            label="区分"
            fullWidth
            margin="dense"
            value={form.vendor_type}
            onChange={(e) => setForm({ ...form, vendor_type: e.target.value })}
          />
          <TextField
            label="連絡先"
            fullWidth
            margin="dense"
            value={form.contact_info}
            onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
          />
          <TextField
            label="業者備考"
            fullWidth
            margin="dense"
            value={form.vendor_notes}
            onChange={(e) => setForm({ ...form, vendor_notes: e.target.value })}
          />
          {/* 店舗との関係情報 */}
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={form.store_id}
            onChange={(e) => setForm({ ...form, store_id: e.target.value })}
          />
          <TextField
            label="メインの役割"
            fullWidth
            margin="dense"
            value={form.main_category}
            onChange={(e) => setForm({ ...form, main_category: e.target.value })}
          />
          <TextField
            label="契約開始日"
            type="date"
            fullWidth
            margin="dense"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="契約終了日"
            type="date"
            fullWidth
            margin="dense"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="店舗備考"
            fullWidth
            margin="dense"
            value={form.relation_notes}
            onChange={(e) => setForm({ ...form, relation_notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSaveVendor}>
            {currentVendor ? "更新" : "登録"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
