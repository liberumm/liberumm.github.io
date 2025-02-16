export function EventDetailsModal({ open, onClose, eventData, projects }) {
  // MaterialUI のコンポーネント（※実際は個別 import 推奨）
  const {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Button,
    Icon,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    TextField,
    Stepper,
    Step,
    StepLabel,
  } = MaterialUI;

  // --- 各種ステート ---
  // セクションの展開/折りたたみ状態
  const [expanded, setExpanded] = React.useState({
    basic: true,
    review: true,
    attachments: true,
  });

  // タスクの初期データを event-calender.js の構造に合わせる
  const [tasks, setTasks] = React.useState(() => {
    if (!eventData?.extendedProps?.project_id) return [];

    return [{
      id: Date.now(),
      project_id: eventData.extendedProps.project_id,
      task: eventData.title,
      dueDate: new Date(eventData.start).toISOString().split('T')[0],
      priority: eventData.extendedProps?.priority || 'Medium',
      description: eventData.extendedProps?.description || '',
      completed: false,
      assignee: eventData.extendedProps?.organizer || '未設定',
      type: eventData.extendedProps?.type || 'タスク',
      requester: eventData.extendedProps?.organizer || '未設定',
      createdAt: new Date().toISOString().split('T')[0],
      project: eventData.extendedProps?.project_name || '未設定'
    }];
  });

  // タスクの進捗ステップ（タスク一覧表示用）
  const steps = ["受付", "審査中", "承認待ち", "完了"];

  // タスク作成／編集モーダルの表示状態と編集中のタスク
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);

  // 担当フェーズの定義（横軸：フェーズ）
  const phases = ["依頼", "見積", "承認", "調整", "施工", "請求", "支払", "完了"];

  // 担当フェーズの定義（縦軸：ロールと担当者、各ロールが対応するフェーズ）
  const roles = [
    {
      role: "店舗",
      person: "担当",
      responsibilities: ["依頼", "見積", "調整"],
    },
    {
      role: "取引先",
      person: "担当",
      responsibilities: ["見積", "調整", "施工", "請求"],
    },
    {
      role: "本部",
      person: "担当",
      responsibilities: ["承認", "支払", "完了"],
    },
  ];

  // 各ロールの各フェーズの進捗状態（true: 対応済み, false: 未対応）
  const [progress, setProgress] = React.useState({
    店舗: { 依頼: true, 見積: false, 調整: false },
    取引先: { 見積: true, 調整: false, 施工: false, 請求: false },
    本部: { 承認: false, 支払: false, 完了: false },
  });

  // 現在のユーザー定義を追加
  const currentUser = "佐藤花子"; // event-calender.js と同じ値を使用

  // 自分のTODOデータを修正
  const [myTodos] = React.useState(() => {
    if (!eventData) return [];

    // イベントデータからTODOを生成
    const todo = {
      id: Date.now(),
      project_id: eventData.extendedProps?.project_id || '',
      task: eventData.title,
      dueDate: eventData.start ? new Date(eventData.start).toISOString().split('T')[0] : '',
      priority: eventData.extendedProps?.priority || 'Medium',
      description: eventData.extendedProps?.description || '',
      completed: false,
      assignee: currentUser,
      type: eventData.extendedProps?.type || 'タスク',
      requester: eventData.extendedProps?.organizer || '未設定',
      createdAt: new Date().toISOString().split('T')[0],
      project: eventData.extendedProps?.project_name || '未設定',
      action: eventData.extendedProps?.type === 'タスク' ? 'タスク実行' : 'イベント参加'
    };

    // 案件に関連する他のTODOも追加（オプション）
    const projectTodos = [];
    if (eventData.extendedProps?.project_id) {
      // 関連案件の他のタスクも表示する場合はここに追加
    }

    return [todo, ...projectTodos];
  });

  // 案件管理モーダル用のstate
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState(null);

  // 案件情報を取得
  const projectInfo = React.useMemo(() => {
    if (!eventData?.extendedProps?.project_id) return null;
    const project = projects?.find(p => p.id === eventData.extendedProps.project_id);

    return project || {
      id: eventData.extendedProps.project_id,
      name: eventData.extendedProps?.project_name || '未設定',
      start: new Date(eventData.start).toISOString().split('T')[0],
      end: eventData.end ? new Date(eventData.end).toISOString().split('T')[0] : '未設定',
      status: '進行中',
      manager: eventData.extendedProps?.organizer || '未設定',
      department: eventData.extendedProps?.department || '未設定',
      budget: 0,
      description: eventData.extendedProps?.description || '未設定',
      type: eventData.extendedProps?.type || '未設定'
    };
  }, [eventData, projects]);

  // ★ 案件に関連するイベント（ダミーデータ） ★
  const projectEvents = React.useMemo(() => {
    if (!projectInfo) return [];
    return [
      {
        id: 1,
        title: projectInfo.name + " Kickoff",
        start: projectInfo.start,
        end: projectInfo.start,
        extendedProps: {
          type: "ミーティング",
          organizer: projectInfo.manager,
        },
      },
      {
        id: 2,
        title: projectInfo.name + " Review",
        start: new Date(new Date(projectInfo.start).getTime() + 86400000).toISOString(), // +1日
        end: new Date(new Date(projectInfo.start).getTime() + 86400000).toISOString(),
        extendedProps: {
          type: "レビュー",
          organizer: projectInfo.manager,
        },
      },
    ];
  }, [projectInfo]);

  // --- モーダル表示前の eventData チェック ---
  if (!eventData) return null;

  // --- タスク作成／編集用ハンドラ ---
  const handleOpenTaskModal = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? taskData : t))
      );
    } else {
      setTasks((prev) => [...prev, taskData]);
    }
    setTaskModalOpen(false);
  };

  const handleCloseTaskModal = () => {
    setTaskModalOpen(false);
  };

  // --- サブコンポーネント：全体進捗ステッパー ---
  function OverallProgressStepper() {
    // 各フェーズの全体進捗を計算
    const overallStatus = phases.map((phase) => {
      // このフェーズを担当するロールを抽出
      const responsibleRoles = roles.filter((r) =>
        r.responsibilities.includes(phase)
      );
      if (responsibleRoles.length === 0) return true; // 担当ロールがなければ完了扱い
      // 担当ロールすべてが完了しているか
      return responsibleRoles.every(
        (r) => progress[r.role] && progress[r.role][phase] === true
      );
    });

    return (
      <Stepper alternativeLabel>
        {phases.map((phase, index) => (
          <Step key={phase} completed={overallStatus[index]}>
            <StepLabel>{phase}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  }

  // --- サブコンポーネント：ロール別進捗テーブル ---
  function RoleProgressTable() {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>担当</TableCell>
            {phases.map((phase) => (
              <TableCell key={phase} align="center">
                {phase}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((r) => (
            <TableRow key={r.role}>
              <TableCell>
                {r.role} ({r.person})
              </TableCell>
              {phases.map((phase) => (
                <TableCell key={phase} align="center">
                  {r.responsibilities.includes(phase) ? (
                    progress[r.role] && progress[r.role][phase] ? (
                      <Icon color="primary">check_circle</Icon>
                    ) : (
                      <Icon color="secondary">access_time</Icon>
                    )
                  ) : (
                    <Icon color="action">remove_circle_outline</Icon>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  // --- サブコンポーネント：タスク作成／編集モーダル ---
  function TaskModal({ open, onClose, task, onSave }) {
    const [name, setName] = React.useState(task ? task.name : "");
    const [currentStep, setCurrentStep] = React.useState(
      task ? task.currentStep : 0
    );
    const [projectId, setProjectId] = React.useState(task ? task.project_id : "");

    // タスク内容が変更された場合にフォーム状態を更新
    React.useEffect(() => {
      setName(task ? task.name : "");
      setCurrentStep(task ? task.currentStep : 0);
      setProjectId(task ? task.project_id : "");
    }, [task]);

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{task ? "タスク編集" : "タスク作成"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="案件ID"
            fullWidth
            variant="standard"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            label="タスク名"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label={`進捗 (0〜${steps.length - 1})`}
            type="number"
            fullWidth
            variant="standard"
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button
            onClick={() =>
              onSave({
                id: task ? task.id : Date.now(),
                project_id: projectId,
                name,
                currentStep
              })
            }
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 案件管理用のモーダルコンポーネント
  function ProjectModal({ open, onClose, project }) {
    const [formData, setFormData] = React.useState({
      name: project?.name || '',
      start: project?.start || '',
      end: project?.end || '',
      manager: project?.manager || '',
      department: project?.department || '',
      budget: project?.budget || '',
      description: project?.description || '',
      type: project?.type || ''
    });

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{project ? '案件編集' : '新規案件作成'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="案件名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="開始日"
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="終了日"
                type="date"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* 残りのフィールド */}
            {/* ...existing code... */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button variant="contained" onClick={() => { /* 保存処理 */ }}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 案件情報表示セクションを更新
  const renderProjectInfo = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1">
            案件ID: {projectInfo.id}
          </Typography>
          <Typography variant="body1">
            案件名: {projectInfo.name}
          </Typography>
          <Typography variant="body1">
            開始日: {projectInfo.start}
          </Typography>
          <Typography variant="body1">
            終了日: {projectInfo.end}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="body1">
            担当部署: {projectInfo.department}
          </Typography>
          <Typography variant="body1">
            案件マネージャー: {projectInfo.manager}
          </Typography>
          <Typography variant="body1">
            予算: ¥{projectInfo.budget.toLocaleString()}
          </Typography>
          <Typography variant="body1">
            種別: {projectInfo.type}
          </Typography>
          <Typography variant="body1">
            ステータス: {projectInfo.status}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            案件概要: {projectInfo.description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  // 共通のヘッダー用スタイル
  const headerSx = { p: 2, backgroundColor: '#C0C0C0', color: 'white' };

  // --- メインレンダリング ---
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>
          {eventData?.title || "案件詳細情報"} - {projectInfo?.name}
        </DialogTitle>
        <DialogContent>
          <Container>
            {/* 自分のタスク */}
            <Paper sx={{ mt: 2, mb: 2 }}>
              <Box sx={headerSx}>
                <Typography variant="h6">
                  自分のタスク ({currentUser})
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>完了期限</TableCell>
                      <TableCell>種類</TableCell>
                      <TableCell>タスク</TableCell>
                      <TableCell>優先度</TableCell>
                      <TableCell>依頼者</TableCell>
                      <TableCell>登録日</TableCell>
                      <TableCell>案件</TableCell>
                      <TableCell>アクション</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myTodos.length > 0 ? (
                      myTodos.map((todo, index) => (
                        <TableRow key={index}>
                          <TableCell>{todo.dueDate}</TableCell>
                          <TableCell>{todo.type}</TableCell>
                          <TableCell>{todo.task}</TableCell>
                          <TableCell>{todo.priority}</TableCell>
                          <TableCell>{todo.requester}</TableCell>
                          <TableCell>{todo.createdAt}</TableCell>
                          <TableCell>{todo.project}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={
                                <Icon>
                                  {todo.type === 'タスク' ? 'assignment' : 'event'}
                                </Icon>
                              }
                            >
                              {todo.action}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          表示するタスクはありません
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>

            {/* イベントデータ */}
            <Paper sx={{ mt: 2, mb: 2 }}>
              <Box sx={headerSx}>
                <Typography variant="h6">イベントデータ</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      タイトル: {eventData.title}
                    </Typography>
                    <Typography variant="body1">
                      開始日時: {new Date(eventData.start).toLocaleString()}
                    </Typography>
                    {eventData.end && (
                      <Typography variant="body1">
                        終了日時: {new Date(eventData.end).toLocaleString()}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {eventData.extendedProps && (
                      <>
                        <Typography variant="body1">
                          種別: {eventData.extendedProps.type || '未設定'}
                        </Typography>
                        <Typography variant="body1">
                          オーガナイザー: {eventData.extendedProps.organizer || '未設定'}
                        </Typography>
                        <Typography variant="body1">
                          案件: {eventData.extendedProps.project_name || '未設定'}
                        </Typography>
                        <Typography variant="body1">
                          優先度: {eventData.extendedProps.priority || 'Medium'}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* 全体フェーズ進捗ステッパー */}
            <Paper sx={{ mt: 2, mb: 2 }}>
              <Box sx={headerSx}>
                <Typography variant="h6">全体進捗</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <OverallProgressStepper />
              </Box>
            </Paper>

            {/* 担当フェーズ進捗テーブル */}
            <Paper sx={{ mt: 2, mb: 2 }}>
              <Box sx={headerSx}>
                <Typography variant="h6">担当進捗</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <RoleProgressTable />
              </Box>
            </Paper>

            {/* 案件基本情報 */}
            <Paper sx={{ mb: 2 }}>
              <Box
                sx={{
                  ...headerSx,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => setExpanded((prev) => ({ ...prev, basic: !prev.basic }))}
              >
                <Typography variant="h6">案件基本情報</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProject(projectInfo);
                      setProjectModalOpen(true);
                    }}
                  >
                    編集
                  </Button>
                  <Icon sx={{ color: 'white' }}>
                    {expanded.basic ? "expand_less" : "expand_more"}
                  </Icon>
                </Box>
              </Box>
              {expanded.basic && renderProjectInfo()}
            </Paper>

            {/* 案件タスク一覧 */}
            <Paper sx={{ mt: 2, mb: 2 }}>
              <Box
                sx={{
                  ...headerSx,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">案件タスク一覧</Typography>
                <Button
                  variant="contained"
                  startIcon={<Icon>add</Icon>}
                  onClick={handleOpenTaskModal}
                >
                  タスク作成
                </Button>
              </Box>
              <Box sx={{ p: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>完了期限</TableCell>
                      <TableCell>種類</TableCell>
                      <TableCell>タスク</TableCell>
                      <TableCell>優先度</TableCell>
                      <TableCell>依頼者</TableCell>
                      <TableCell>登録日</TableCell>
                      <TableCell>案件</TableCell>
                      <TableCell>アクション</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>{task.requester}</TableCell>
                        <TableCell>{task.createdAt}</TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleEditTask(task)}
                          >
                            編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>

            {/* ★ 案件イベント一覧 ★ */}
            <Paper sx={{ mt: 2, mb: 2 }}>
              <Box
                sx={{
                  ...headerSx,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">案件イベント一覧</Typography>
                {/* 必要に応じてイベント追加ボタン等を配置 */}
              </Box>
              <Box sx={{ p: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>タイトル</TableCell>
                      <TableCell>開始日時</TableCell>
                      <TableCell>終了日時</TableCell>
                      <TableCell>種別</TableCell>
                      <TableCell>オーガナイザー</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectEvents.length > 0 ? (
                      projectEvents.map((evt) => (
                        <TableRow key={evt.id}>
                          <TableCell>{evt.title}</TableCell>
                          <TableCell>{new Date(evt.start).toLocaleString()}</TableCell>
                          <TableCell>{evt.end ? new Date(evt.end).toLocaleString() : '-'}</TableCell>
                          <TableCell>{evt.extendedProps?.type || '-'}</TableCell>
                          <TableCell>{evt.extendedProps?.organizer || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          案件に関連するイベントはありません
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>

            {/* 添付資料 */}
            <Paper>
              <Box
                sx={{
                  ...headerSx,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    attachments: !prev.attachments,
                  }))
                }
              >
                <Typography variant="h6">添付資料</Typography>
                <Icon sx={{ color: 'white' }}>
                  {expanded.attachments ? "expand_less" : "expand_more"}
                </Icon>
              </Box>
              {expanded.attachments && (
                <Box sx={{ p: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ファイル名</TableCell>
                        <TableCell>説明</TableCell>
                        <TableCell>ダウンロード</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>資料1.pdf</TableCell>
                        <TableCell>案件関連資料</TableCell>
                        <TableCell>
                          <Button variant="outlined" startIcon={<Icon>download</Icon>}>
                            DL
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
            
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      {/* 案件管理モーダル */}
      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        project={editingProject}
      />

      {/* タスク作成／編集モーダル */}
      <TaskModal
        open={taskModalOpen}
        onClose={handleCloseTaskModal}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </>
  );
}
