// components/TenantsManager.js
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

function TenantsManager() {
  // サンプルデータ（10件）※各フィールドのサンプル値を設定
  const [tenants, setTenants] = useState([
    {
      tenant_id: 1,
      store_id: 1,
      tenant_name: "テナントA",
      tenant_industry: "雑貨",
      tenant_rent: 200000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2021-05-01",
      contract_end_date: "2024-04-30",
      renewal_conditions: "自動更新",
      utilities_charges: "別途",
      tenant_deposit: 50000.00,
      notes: "備考A",
      created_at: "2021-05-01 00:00:00",
      updated_at: "2021-05-01 00:00:00",
      created_by: 1,
      updated_by: 1,
    },
    {
      tenant_id: 2,
      store_id: 2,
      tenant_name: "テナントB",
      tenant_industry: "飲食",
      tenant_rent: 300000.00,
      tenant_contract_type: "フレキシブル",
      contract_start_date: "2022-01-01",
      contract_end_date: "2025-12-31",
      renewal_conditions: "要交渉",
      utilities_charges: "内包",
      tenant_deposit: 60000.00,
      notes: "備考B",
      created_at: "2022-01-01 00:00:00",
      updated_at: "2022-01-01 00:00:00",
      created_by: 2,
      updated_by: 2,
    },
    {
      tenant_id: 3,
      store_id: 3,
      tenant_name: "テナントC",
      tenant_industry: "ファッション",
      tenant_rent: 250000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2020-06-01",
      contract_end_date: "2023-05-31",
      renewal_conditions: "交渉可能",
      utilities_charges: "別途",
      tenant_deposit: 55000.00,
      notes: "備考C",
      created_at: "2020-06-01 00:00:00",
      updated_at: "2020-06-01 00:00:00",
      created_by: 3,
      updated_by: 3,
    },
    {
      tenant_id: 4,
      store_id: 4,
      tenant_name: "テナントD",
      tenant_industry: "書店",
      tenant_rent: 180000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2021-09-01",
      contract_end_date: "2024-08-31",
      renewal_conditions: "自動更新",
      utilities_charges: "内包",
      tenant_deposit: 45000.00,
      notes: "備考D",
      created_at: "2021-09-01 00:00:00",
      updated_at: "2021-09-01 00:00:00",
      created_by: 4,
      updated_by: 4,
    },
    {
      tenant_id: 5,
      store_id: 5,
      tenant_name: "テナントE",
      tenant_industry: "カフェ",
      tenant_rent: 220000.00,
      tenant_contract_type: "フレキシブル",
      contract_start_date: "2022-03-01",
      contract_end_date: "2025-02-28",
      renewal_conditions: "要交渉",
      utilities_charges: "別途",
      tenant_deposit: 48000.00,
      notes: "備考E",
      created_at: "2022-03-01 00:00:00",
      updated_at: "2022-03-01 00:00:00",
      created_by: 5,
      updated_by: 5,
    },
    {
      tenant_id: 6,
      store_id: 6,
      tenant_name: "テナントF",
      tenant_industry: "スポーツ",
      tenant_rent: 210000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2021-11-01",
      contract_end_date: "2024-10-31",
      renewal_conditions: "自動更新",
      utilities_charges: "内包",
      tenant_deposit: 47000.00,
      notes: "備考F",
      created_at: "2021-11-01 00:00:00",
      updated_at: "2021-11-01 00:00:00",
      created_by: 6,
      updated_by: 6,
    },
    {
      tenant_id: 7,
      store_id: 7,
      tenant_name: "テナントG",
      tenant_industry: "美容",
      tenant_rent: 240000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2020-08-01",
      contract_end_date: "2023-07-31",
      renewal_conditions: "交渉可能",
      utilities_charges: "別途",
      tenant_deposit: 52000.00,
      notes: "備考G",
      created_at: "2020-08-01 00:00:00",
      updated_at: "2020-08-01 00:00:00",
      created_by: 7,
      updated_by: 7,
    },
    {
      tenant_id: 8,
      store_id: 8,
      tenant_name: "テナントH",
      tenant_industry: "電器",
      tenant_rent: 260000.00,
      tenant_contract_type: "フレキシブル",
      contract_start_date: "2021-12-01",
      contract_end_date: "2024-11-30",
      renewal_conditions: "要交渉",
      utilities_charges: "内包",
      tenant_deposit: 53000.00,
      notes: "備考H",
      created_at: "2021-12-01 00:00:00",
      updated_at: "2021-12-01 00:00:00",
      created_by: 8,
      updated_by: 8,
    },
    {
      tenant_id: 9,
      store_id: 9,
      tenant_name: "テナントI",
      tenant_industry: "食品",
      tenant_rent: 230000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2022-04-01",
      contract_end_date: "2025-03-31",
      renewal_conditions: "自動更新",
      utilities_charges: "別途",
      tenant_deposit: 49000.00,
      notes: "備考I",
      created_at: "2022-04-01 00:00:00",
      updated_at: "2022-04-01 00:00:00",
      created_by: 9,
      updated_by: 9,
    },
    {
      tenant_id: 10,
      store_id: 10,
      tenant_name: "テナントJ",
      tenant_industry: "書道",
      tenant_rent: 190000.00,
      tenant_contract_type: "定期",
      contract_start_date: "2021-07-01",
      contract_end_date: "2024-06-30",
      renewal_conditions: "交渉可能",
      utilities_charges: "内包",
      tenant_deposit: 46000.00,
      notes: "備考J",
      created_at: "2021-07-01 00:00:00",
      updated_at: "2021-07-01 00:00:00",
      created_by: 10,
      updated_by: 10,
    },
  ]);

  // 新規登録用ダイアログの状態（入力項目）
  const [openDialog, setOpenDialog] = useState(false);
  const [newTenant, setNewTenant] = useState({
    store_id: "",
    tenant_name: "",
    tenant_industry: "",
    tenant_rent: "",
    tenant_contract_type: "",
    contract_start_date: "",
    contract_end_date: "",
    renewal_conditions: "",
    utilities_charges: "",
    tenant_deposit: "",
    notes: "",
  });

  // ページネーション用状態（デフォルト20件／ページ）
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 編集用ダイアログ状態
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editTenant, setEditTenant] = useState(null);

  // 新規テナント登録処理
  const handleAddTenant = () => {
    const newId =
      tenants.length > 0 ? Math.max(...tenants.map((t) => t.tenant_id)) + 1 : 1;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const tenant = {
      ...newTenant,
      tenant_id: newId,
      created_at: now,
      updated_at: now,
      created_by: 1, // 仮の登録者ID
      updated_by: 1, // 仮の更新者ID
    };
    setTenants([...tenants, tenant]);
    setOpenDialog(false);
    setNewTenant({
      store_id: "",
      tenant_name: "",
      tenant_industry: "",
      tenant_rent: "",
      tenant_contract_type: "",
      contract_start_date: "",
      contract_end_date: "",
      renewal_conditions: "",
      utilities_charges: "",
      tenant_deposit: "",
      notes: "",
    });
  };

  // テナント削除
  const handleDelete = (tenant_id) => {
    if (window.confirm("本当に削除してよろしいですか？")) {
      setTenants(tenants.filter((t) => t.tenant_id !== tenant_id));
    }
  };

  // 編集ダイアログ表示（対象テナントを設定）
  const handleEdit = (tenant) => {
    setEditTenant(tenant);
    setOpenEditDialog(true);
  };

  // テナント更新処理（更新日時／更新者を自動更新）
  const handleUpdateTenant = () => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    setTenants(
      tenants.map((t) =>
        t.tenant_id === editTenant.tenant_id
          ? { ...editTenant, updated_at: now, updated_by: 1 } // 仮の更新者ID
          : t
      )
    );
    setOpenEditDialog(false);
    setEditTenant(null);
  };

  // ページ変更
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 1ページあたりの表示件数変更
  const handleChangeRowsPerPage = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(0);
  };

  // ページネーションに応じた表示データ
  const displayedTenants =
    rowsPerPage > 0
      ? tenants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : tenants;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">テナント管理（store_tenants）</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          新規追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>テナントID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>店舗ID</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>テナント名</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>業種</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>賃料</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>契約形態</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>契約開始日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>契約終了日</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新条件</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>請求方法</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>保証金</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>備考</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>作成日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新日時</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>登録者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>更新者</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedTenants.map((tenant) => (
              <TableRow
                key={tenant.tenant_id}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "action.hover" } }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.tenant_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.store_id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.tenant_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.tenant_industry}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.tenant_rent}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.tenant_contract_type}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.contract_start_date}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.contract_end_date}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.renewal_conditions}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.utilities_charges}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.tenant_deposit}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.notes}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.created_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.updated_at}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.created_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{tenant.updated_by}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(tenant);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tenant.tenant_id);
                    }}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={tenants.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, { label: "全て", value: -1 }]}
          labelRowsPerPage="表示件数:"
        />
      </TableContainer>

      {/* 新規テナント登録ダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>新規テナント登録</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={newTenant.store_id}
            onChange={(e) =>
              setNewTenant({ ...newTenant, store_id: e.target.value })
            }
          />
          <TextField
            label="テナント名"
            fullWidth
            margin="dense"
            value={newTenant.tenant_name}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_name: e.target.value })
            }
          />
          <TextField
            label="業種"
            fullWidth
            margin="dense"
            value={newTenant.tenant_industry}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_industry: e.target.value })
            }
          />
          <TextField
            label="賃料"
            fullWidth
            margin="dense"
            value={newTenant.tenant_rent}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_rent: e.target.value })
            }
          />
          <TextField
            label="契約形態"
            fullWidth
            margin="dense"
            value={newTenant.tenant_contract_type}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_contract_type: e.target.value })
            }
          />
          <TextField
            label="契約開始日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTenant.contract_start_date}
            onChange={(e) =>
              setNewTenant({ ...newTenant, contract_start_date: e.target.value })
            }
          />
          <TextField
            label="契約終了日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTenant.contract_end_date}
            onChange={(e) =>
              setNewTenant({ ...newTenant, contract_end_date: e.target.value })
            }
          />
          <TextField
            label="更新条件"
            fullWidth
            margin="dense"
            value={newTenant.renewal_conditions}
            onChange={(e) =>
              setNewTenant({ ...newTenant, renewal_conditions: e.target.value })
            }
          />
          <TextField
            label="請求方法"
            fullWidth
            margin="dense"
            value={newTenant.utilities_charges}
            onChange={(e) =>
              setNewTenant({ ...newTenant, utilities_charges: e.target.value })
            }
          />
          <TextField
            label="保証金"
            fullWidth
            margin="dense"
            value={newTenant.tenant_deposit}
            onChange={(e) =>
              setNewTenant({ ...newTenant, tenant_deposit: e.target.value })
            }
          />
          <TextField
            label="備考"
            fullWidth
            margin="dense"
            value={newTenant.notes}
            onChange={(e) =>
              setNewTenant({ ...newTenant, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleAddTenant}>
            登録
          </Button>
        </DialogActions>
      </Dialog>

      {/* テナント編集ダイアログ */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setEditTenant(null);
        }}
      >
        <DialogTitle>テナント編集</DialogTitle>
        <DialogContent>
          <TextField
            label="店舗ID"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.store_id : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, store_id: e.target.value })
            }
          />
          <TextField
            label="テナント名"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.tenant_name : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, tenant_name: e.target.value })
            }
          />
          <TextField
            label="業種"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.tenant_industry : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, tenant_industry: e.target.value })
            }
          />
          <TextField
            label="賃料"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.tenant_rent : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, tenant_rent: e.target.value })
            }
          />
          <TextField
            label="契約形態"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.tenant_contract_type : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, tenant_contract_type: e.target.value })
            }
          />
          <TextField
            label="契約開始日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editTenant ? editTenant.contract_start_date : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, contract_start_date: e.target.value })
            }
          />
          <TextField
            label="契約終了日"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editTenant ? editTenant.contract_end_date : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, contract_end_date: e.target.value })
            }
          />
          <TextField
            label="更新条件"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.renewal_conditions : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, renewal_conditions: e.target.value })
            }
          />
          <TextField
            label="請求方法"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.utilities_charges : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, utilities_charges: e.target.value })
            }
          />
          <TextField
            label="保証金"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.tenant_deposit : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, tenant_deposit: e.target.value })
            }
          />
          <TextField
            label="備考"
            fullWidth
            margin="dense"
            value={editTenant ? editTenant.notes : ""}
            onChange={(e) =>
              setEditTenant({ ...editTenant, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setEditTenant(null);
            }}
          >
            キャンセル
          </Button>
          <Button variant="contained" onClick={handleUpdateTenant}>
            更新
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
