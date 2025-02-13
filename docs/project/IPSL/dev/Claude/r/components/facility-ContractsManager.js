// components/ContractsManager.js
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
  DialogActions,
  TextField,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} = MaterialUI;
const { useState } = React;

function ContractsManager() {
  // サンプルデータ（全10件）
  const [contracts, setContracts] = useState([
    {
      contract_id: 1,
      store_id: 1,
      contract_type: "普通借家",
      contract_start_date: "2020-01-01",
      contract_end_date: "2025-12-31",
      cancellation_date: "", // 有効
      monthly_rent: 500000.0,
      rent_per_tsubo: 15000.0,
      common_service_fee: 10000.0,
      deposit: 1000000.0,
      construction_support: 50000.0,
      penalty_fee: 20000.0,
      renewal_conditions: "自動更新",
      notes: "備考なし",
      created_at: "2020-01-01 10:00:00",
      updated_at: "2020-01-01 10:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      contract_id: 2,
      store_id: 2,
      contract_type: "定期借家",
      contract_start_date: "2021-03-01",
      contract_end_date: "2026-02-28",
      cancellation_date: "2023-04-30", // 解約済
      monthly_rent: 600000.0,
      rent_per_tsubo: 18000.0,
      common_service_fee: 12000.0,
      deposit: 1200000.0,
      construction_support: 60000.0,
      penalty_fee: 25000.0,
      renewal_conditions: "条件変更",
      notes: "早期解約",
      created_at: "2021-03-01 11:00:00",
      updated_at: "2023-04-30 12:00:00",
      created_by: 2,
      updated_by: 2,
    },
    {
      contract_id: 3,
      store_id: 3,
      contract_type: "事業用定期借地",
      contract_start_date: "2022-06-01",
      contract_end_date: "2030-05-31",
      cancellation_date: "", // 有効
      monthly_rent: 800000.0,
      rent_per_tsubo: 20000.0,
      common_service_fee: 15000.0,
      deposit: 1500000.0,
      construction_support: 70000.0,
      penalty_fee: 30000.0,
      renewal_conditions: "再交渉",
      notes: "新規契約",
      created_at: "2022-06-01 09:30:00",
      updated_at: "2022-06-01 09:30:00",
      created_by: 3,
      updated_by: 3,
    },
    {
      contract_id: 4,
      store_id: 4,
      contract_type: "普通借家",
      contract_start_date: "2019-05-01",
      contract_end_date: "2024-04-30",
      cancellation_date: "",
      monthly_rent: 550000.0,
      rent_per_tsubo: 15500.0,
      common_service_fee: 11000.0,
      deposit: 1100000.0,
      construction_support: 52000.0,
      penalty_fee: 21000.0,
      renewal_conditions: "自動更新",
      notes: "備考なし",
      created_at: "2019-05-01 09:00:00",
      updated_at: "2019-05-01 09:00:00",
      created_by: 4,
      updated_by: 4,
    },
    {
      contract_id: 5,
      store_id: 5,
      contract_type: "定期借家",
      contract_start_date: "2018-07-01",
      contract_end_date: "2023-06-30",
      cancellation_date: "2022-12-31",
      monthly_rent: 620000.0,
      rent_per_tsubo: 18500.0,
      common_service_fee: 12500.0,
      deposit: 1300000.0,
      construction_support: 65000.0,
      penalty_fee: 26000.0,
      renewal_conditions: "条件変更",
      notes: "早期解約",
      created_at: "2018-07-01 10:15:00",
      updated_at: "2022-12-31 11:00:00",
      created_by: 5,
      updated_by: 5,
    },
    {
      contract_id: 6,
      store_id: 6,
      contract_type: "事業用定期借地",
      contract_start_date: "2023-01-01",
      contract_end_date: "2031-12-31",
      cancellation_date: "",
      monthly_rent: 900000.0,
      rent_per_tsubo: 21000.0,
      common_service_fee: 16000.0,
      deposit: 1600000.0,
      construction_support: 75000.0,
      penalty_fee: 32000.0,
      renewal_conditions: "再交渉",
      notes: "新規契約",
      created_at: "2023-01-01 08:45:00",
      updated_at: "2023-01-01 08:45:00",
      created_by: 6,
      updated_by: 6,
    },
    {
      contract_id: 7,
      store_id: 7,
      contract_type: "普通借家",
      contract_start_date: "2017-02-01",
      contract_end_date: "2022-01-31",
      cancellation_date: "2021-12-31",
      monthly_rent: 480000.0,
      rent_per_tsubo: 14000.0,
      common_service_fee: 9000.0,
      deposit: 950000.0,
      construction_support: 45000.0,
      penalty_fee: 19000.0,
      renewal_conditions: "自動更新",
      notes: "早期解約",
      created_at: "2017-02-01 09:30:00",
      updated_at: "2021-12-31 10:00:00",
      created_by: 7,
      updated_by: 7,
    },
    {
      contract_id: 8,
      store_id: 8,
      contract_type: "定期借家",
      contract_start_date: "2020-11-01",
      contract_end_date: "2025-10-31",
      cancellation_date: "",
      monthly_rent: 580000.0,
      rent_per_tsubo: 17000.0,
      common_service_fee: 11500.0,
      deposit: 1150000.0,
      construction_support: 54000.0,
      penalty_fee: 23000.0,
      renewal_conditions: "条件変更",
      notes: "備考あり",
      created_at: "2020-11-01 10:30:00",
      updated_at: "2020-11-01 10:30:00",
      created_by: 8,
      updated_by: 8,
    },
    {
      contract_id: 9,
      store_id: 9,
      contract_type: "事業用定期借地",
      contract_start_date: "2021-08-01",
      contract_end_date: "2029-07-31",
      cancellation_date: "",
      monthly_rent: 750000.0,
      rent_per_tsubo: 19500.0,
      common_service_fee: 13500.0,
      deposit: 1400000.0,
      construction_support: 68000.0,
      penalty_fee: 28000.0,
      renewal_conditions: "再交渉",
      notes: "備考なし",
      created_at: "2021-08-01 09:00:00",
      updated_at: "2021-08-01 09:00:00",
      created_by: 9,
      updated_by: 9,
    },
    {
      contract_id: 10,
      store_id: 10,
      contract_type: "普通借家",
      contract_start_date: "2022-12-01",
      contract_end_date: "2027-11-30",
      cancellation_date: "2023-06-30",
      monthly_rent: 530000.0,
      rent_per_tsubo: 15200.0,
      common_service_fee: 10500.0,
      deposit: 1020000.0,
      construction_support: 51000.0,
      penalty_fee: 20500.0,
      renewal_conditions: "自動更新",
      notes: "早期解約",
      created_at: "2022-12-01 10:00:00",
      updated_at: "2023-06-30 11:00:00",
      created_by: 10,
      updated_by: 10,
    },
  ]);

  // ダイアログ（新規登録／編集）用の状態
  const initialDialogState = {
    store_id: "",
    contract_type: "",
    contract_start_date: "",
    contract_end_date: "",
    cancellation_date: "",
    monthly_rent: "",
    rent_per_tsubo: "",
    common_service_fee: "",
    deposit: "",
    construction_support: "",
    penalty_fee: "",
    renewal_conditions: "",
    notes: "",
    status: "有効", // ステータス（有効： cancellation_date未設定、解約済：設定済）
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogData, setDialogData] = useState(initialDialogState);

  // フィルター用状態
  const [filterContractType, setFilterContractType] = useState("すべて");
  const [filterStatus, setFilterStatus] = useState("すべて");
  // 契約種別選択肢
  const contractTypes = ["普通借家", "定期借家", "事業用定期借地"];

  // ページネーション用状態
  const [currentPage, setCurrentPage] = useState(0);
  // デフォルトは20件表示。-1の場合は「全件」
  const [rowsPerPage, setRowsPerPage] = useState(20);
  // カスタム件数入力用
  const [customRows, setCustomRows] = useState("");

  // フィルター処理（契約種別＆ステータス）
  const filteredContracts = contracts.filter((contract) => {
    const typeMatch =
      filterContractType === "すべて" ||
      contract.contract_type === filterContractType;
    const status = contract.cancellation_date ? "解約済" : "有効";
    const statusMatch = filterStatus === "すべて" || status === filterStatus;
    return typeMatch && statusMatch;
  });

  // ページネーション（rowsPerPageが-1の場合は全件表示）
  const displayedContracts =
    rowsPerPage > 0
      ? filteredContracts.slice(
          currentPage * rowsPerPage,
          currentPage * rowsPerPage + rowsPerPage
        )
      : filteredContracts;

  // 新規追加ダイアログを開く
  const handleOpenNewDialog = () => {
    setIsEditing(false);
    setDialogData(initialDialogState);
    setOpenDialog(true);
  };

  // 編集用ダイアログを開く
  const handleEdit = (contract) => {
    setIsEditing(true);
    setDialogData({
      contract_id: contract.contract_id,
      store_id: contract.store_id,
      contract_type: contract.contract_type,
      contract_start_date: contract.contract_start_date,
      contract_end_date: contract.contract_end_date,
      cancellation_date: contract.cancellation_date,
      monthly_rent: contract.monthly_rent,
      rent_per_tsubo: contract.rent_per_tsubo,
      common_service_fee: contract.common_service_fee,
      deposit: contract.deposit,
      construction_support: contract.construction_support,
      penalty_fee: contract.penalty_fee,
      renewal_conditions: contract.renewal_conditions,
      notes: contract.notes,
      status: contract.cancellation_date ? "解約済" : "有効",
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // 登録／更新処理
  const handleDialogSubmit = () => {
    // ステータスにより解約日の設定を自動調整
    const updatedData = {
      ...dialogData,
      cancellation_date:
        dialogData.status === "有効" ? "" : dialogData.cancellation_date,
    };

    if (isEditing) {
      // 編集の場合：対象契約を更新
      setContracts((prev) =>
        prev.map((contract) =>
          contract.contract_id === updatedData.contract_id
            ? {
                ...contract,
                ...updatedData,
                updated_at: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
                updated_by: 1,
              }
            : contract
        )
      );
    } else {
      // 新規登録の場合：新しいIDを割り当て、作成日時・更新日時などを設定
      const newId =
        contracts.length > 0
          ? Math.max(...contracts.map((c) => c.contract_id)) + 1
          : 1;
      const newContract = {
        ...updatedData,
        contract_id: newId,
        created_at: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        updated_at: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        created_by: 1,
        updated_by: 1,
      };
      setContracts((prev) => [...prev, newContract]);
    }
    setOpenDialog(false);
  };

  // 削除処理
  const handleDelete = (contract_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setContracts((prev) =>
        prev.filter((c) => c.contract_id !== contract_id)
      );
    }
  };

  // ページ変更
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // 1ページあたりの件数変更
  const handleRowsPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setCurrentPage(0);
  };

  // カスタム件数入力
  const handleCustomRowsChange = (e) => {
    setCustomRows(e.target.value);
  };
  const applyCustomRows = () => {
    const num = parseInt(customRows, 10);
    if (!isNaN(num) && num > 0) {
      setRowsPerPage(num);
      setCurrentPage(0);
    }
  };

  return (
    <Box p={2}>
      {/* ヘッダー */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">契約管理</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenNewDialog}>
          新規追加
        </Button>
      </Box>

      {/* フィルター（契約種別＝カテゴリフィルター） */}
      <Box mb={2}>
        <Typography variant="subtitle1">契約種別フィルター</Typography>
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {["すべて", ...contractTypes].map((type) => (
            <Chip
              key={type}
              label={type}
              clickable
              color={filterContractType === type ? "primary" : "default"}
              onClick={() => {
                setFilterContractType(type);
                setCurrentPage(0);
              }}
            />
          ))}
        </Box>
      </Box>

      {/* フィルター（ステータス） */}
      <Box mb={2}>
        <Typography variant="subtitle1">ステータスフィルター</Typography>
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {["すべて", "有効", "解約済"].map((status) => (
            <Chip
              key={status}
              label={status}
              clickable
              color={filterStatus === status ? "primary" : "default"}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(0);
              }}
            />
          ))}
        </Box>
      </Box>

      {/* テーブル */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>契約種別</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>開始日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>終了日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>解約日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>月額賃料</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>坪単価</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>共益費</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>保証金</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>建設協力金</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>違約金</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新条件</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>備考</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedContracts.map((contract) => (
              <TableRow
                key={contract.contract_id}
                onClick={() => handleEdit(contract)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.contract_id}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.store_id}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.contract_type}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.contract_start_date}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.contract_end_date}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.cancellation_date || "－"}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.monthly_rent}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.rent_per_tsubo}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.common_service_fee}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.deposit}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.construction_support}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.penalty_fee}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.renewal_conditions}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.notes}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.created_at}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.updated_at}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.created_by}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {contract.updated_by}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {/* 編集ボタン（行クリックでも編集可能。ここではイベント伝播を止める） */}
                  <Button
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(contract);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contract.contract_id);
                    }}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* ページネーション */}
        <TablePagination
          component="div"
          count={filteredContracts.length}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage > 0 ? rowsPerPage : filteredContracts.length}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
        />
      </TableContainer>

      {/* 新規／編集ダイアログ */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "契約編集" : "新規契約登録"}</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={dialogData.store_id}
            onChange={(e) =>
              setDialogData({ ...dialogData, store_id: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>契約種別</InputLabel>
            <Select
              value={dialogData.contract_type}
              onChange={(e) =>
                setDialogData({ ...dialogData, contract_type: e.target.value })
              }
            >
              <MenuItem value="">
                <em>選択してください</em>
              </MenuItem>
              {contractTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="開始日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dialogData.contract_start_date}
            onChange={(e) =>
              setDialogData({ ...dialogData, contract_start_date: e.target.value })
            }
          />
          <TextField
            label="終了日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dialogData.contract_end_date}
            onChange={(e) =>
              setDialogData({ ...dialogData, contract_end_date: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>ステータス</InputLabel>
            <Select
              value={dialogData.status}
              onChange={(e) =>
                setDialogData({ ...dialogData, status: e.target.value })
              }
            >
              <MenuItem value="有効">有効</MenuItem>
              <MenuItem value="解約済">解約済</MenuItem>
            </Select>
          </FormControl>
          {dialogData.status === "解約済" && (
            <TextField
              label="解約日"
              fullWidth
              margin="dense"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dialogData.cancellation_date}
              onChange={(e) =>
                setDialogData({ ...dialogData, cancellation_date: e.target.value })
              }
            />
          )}
          <TextField
            label="月額賃料"
            fullWidth
            margin="dense"
            type="number"
            value={dialogData.monthly_rent}
            onChange={(e) =>
              setDialogData({ ...dialogData, monthly_rent: e.target.value })
            }
          />
          <TextField
            label="坪単価"
            fullWidth
            margin="dense"
            type="number"
            value={dialogData.rent_per_tsubo}
            onChange={(e) =>
              setDialogData({ ...dialogData, rent_per_tsubo: e.target.value })
            }
          />
          <TextField
            label="共益費"
            fullWidth
            margin="dense"
            type="number"
            value={dialogData.common_service_fee}
            onChange={(e) =>
              setDialogData({ ...dialogData, common_service_fee: e.target.value })
            }
          />
          <TextField
            label="保証金"
            fullWidth
            margin="dense"
            type="number"
            value={dialogData.deposit}
            onChange={(e) =>
              setDialogData({ ...dialogData, deposit: e.target.value })
            }
          />
          <TextField
            label="建設協力金"
            fullWidth
            margin="dense"
            type="number"
            value={dialogData.construction_support}
            onChange={(e) =>
              setDialogData({ ...dialogData, construction_support: e.target.value })
            }
          />
          <TextField
            label="違約金"
            fullWidth
            margin="dense"
            type="number"
            value={dialogData.penalty_fee}
            onChange={(e) =>
              setDialogData({ ...dialogData, penalty_fee: e.target.value })
            }
          />
          <TextField
            label="更新条件"
            fullWidth
            margin="dense"
            value={dialogData.renewal_conditions}
            onChange={(e) =>
              setDialogData({ ...dialogData, renewal_conditions: e.target.value })
            }
          />
          <TextField
            label="備考"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={dialogData.notes}
            onChange={(e) =>
              setDialogData({ ...dialogData, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>キャンセル</Button>
          <Button variant="contained" color="primary" onClick={handleDialogSubmit}>
            {isEditing ? "更新" : "登録"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
