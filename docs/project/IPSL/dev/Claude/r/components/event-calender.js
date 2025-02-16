// Material UI (MUI) のグローバル変数を利用する場合
const {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Icon,
  Chip,
} = MaterialUI;

// ----------------------------------------------------
// 現在のユーザー（例：佐藤花子）
// ----------------------------------------------------
const currentUser = "佐藤花子";

// ----------------------------------------------------
// 案件マスターデータ（サンプル案件）
// ----------------------------------------------------
const sampleProjects = [
  {
    id: "PROJ_001",
    name: "○○店舗改装工事",
    start: "2025-02-01",
    end: "2025-03-31",
    status: "進行中",
    manager: "山田太郎",
    department: "店舗開発部",
    budget: 5000000,
    description: "○○店舗の全面改装工事",
    type: "改装",
  },
  {
    id: "PROJ_002",
    name: "△△店舗定期保守",
    start: "2025-02-01",
    end: "2025-12-31",
    status: "進行中",
    manager: "鈴木一郎",
    department: "施設管理部",
    budget: 1200000,
    description: "△△店舗の年間定期保守",
    type: "保守",
  },
  {
    id: "PROJ_003",
    name: "□□新店舗建設",
    start: "2025-03-01",
    end: "2025-08-31",
    status: "計画中",
    manager: "佐藤次郎",
    department: "新規開発部",
    budget: 8000000,
    description: "新規店舗の建設案件",
    type: "建設",
  },
  {
    id: "PROJ_004",
    name: "××設備更新",
    start: "2025-01-15",
    end: "2025-04-30",
    status: "進行中",
    manager: "高橋和夫",
    department: "設備管理部",
    budget: 3000000,
    description: "老朽化した設備の更新工事",
    type: "更新",
  },
  {
    id: "PROJ_005",
    name: "新規ITシステム導入",
    start: "2025-05-01",
    end: "2025-09-30",
    status: "計画中",
    manager: "中村幸子",
    department: "情報システム部",
    budget: 10000000,
    description: "業務効率化を目的としたITシステムの導入",
    type: "IT",
  },
];

// ----------------------------------------------------
// タスクデータ（各タスクに案件IDを指定）
// ----------------------------------------------------
const sampleTasks = [
  {
    id: 1,
    project_id: "PROJ_001",
    task: "工事準備資料の作成",
    dueDate: "2025-02-02",
    priority: "High",
    description: "工事開始に向けた必要な資料を作成します。",
    completed: false,
    assignee: currentUser,
    type: "準備",
  },
  {
    id: 2,
    project_id: "PROJ_001",
    task: "進捗会議の資料確認",
    dueDate: "2025-02-04",
    priority: "Medium",
    description: "最新の進捗状況をまとめた資料の確認を行います。",
    completed: true,
    assignee: currentUser,
  },
  {
    id: 3,
    project_id: "PROJ_003",
    task: "現場訪問のスケジュール調整",
    dueDate: "2025-02-05",
    priority: "High",
    description: "各部門との調整が必要なため、訪問日時を調整します。",
    completed: false,
    assignee: "鈴木一郎",
  },
  {
    id: 4,
    project_id: "PROJ_003",
    task: "資材発注確認",
    dueDate: "2025-02-06",
    priority: "Low",
    description: "必要な資材の発注状況を確認します。",
    completed: false,
    assignee: "鈴木一郎",
  },
  {
    id: 5,
    project_id: "PROJ_004",
    task: "安全チェックリストの更新",
    dueDate: "2025-02-07",
    priority: "High",
    description: "最新の安全規定に基づきチェックリストを更新します。",
    completed: false,
    assignee: "高橋和夫",
  },
  {
    id: 6,
    project_id: "PROJ_004",
    task: "工程表の再確認",
    dueDate: "2025-02-08",
    priority: "Medium",
    description: "工事工程の進行状況を再確認します。",
    completed: false,
    assignee: "高橋和夫",
  },
  {
    id: 7,
    project_id: "PROJ_002",
    task: "チームミーティングの設定",
    dueDate: "2025-02-09",
    priority: "Low",
    description: "全体の連絡事項を整理し、ミーティングを設定します。",
    completed: true,
    assignee: currentUser,
  },
  {
    id: 8,
    project_id: "PROJ_002",
    task: "請求書の確認",
    dueDate: "2025-02-10",
    priority: "High",
    description: "発注先との請求書の整合性を確認します。",
    completed: false,
    assignee: "鈴木一郎",
  },
  {
    id: 9,
    project_id: "PROJ_005",
    task: "設備点検の予約",
    dueDate: "2025-02-11",
    priority: "Medium",
    description: "点検業者との予約を確定させます。",
    completed: false,
    assignee: "中村幸子",
  },
  {
    id: 10,
    project_id: "PROJ_005",
    task: "現場作業の最終確認",
    dueDate: "2025-02-12",
    priority: "High",
    description: "工事完了前の最終チェックを実施します。",
    completed: true,
    assignee: "中村幸子",
  },
];

// ----------------------------------------------------
// baseEventItems：既存のサンプルイベントデータ
// ----------------------------------------------------
const baseEventItems = [
  {
    project_id: "PROJ_001",
    title: "工事開始",
    start: "2025-02-03T09:00:00",
    color: "#e74c3c",
    extendedProps: {
      description: "現場で工事開始の準備を行います。",
      location: "現場入口",
      organizer: "現場責任者",
      type: "工事",
    },
  },
  {
    title: "工程確認",
    start: "2025-02-03T14:00:00",
    color: "#f39c12",
    extendedProps: {
      description: "工程の確認ミーティングを実施します。",
      location: "会議室B",
      organizer: "工程管理者",
      type: "イベント",
    },
  },
  {
    title: "店舗見学",
    start: "2025-02-05T10:00:00",
    color: "#3498db",
    extendedProps: {
      description: "新規店舗の見学を行います。",
      location: "店舗A",
      organizer: "営業担当",
      type: "イベント",
    },
  },
];

// ----------------------------------------------------
// additionalEventItems：自動生成イベント
// ----------------------------------------------------
const additionalEventItems = [];
const additionalStartDate = new Date("2025-02-01");
const additionalEndDate = new Date("2025-03-31");
const repairTitles = ["焼き鳥屋機器修理", "駐車場修繕"];
const maintenanceTitles = ["グリストラップ清掃", "設備巡回点検"];
for (
  let d = new Date(additionalStartDate);
  d <= additionalEndDate;
  d.setDate(d.getDate() + 1)
) {
  const numEvents = Math.floor(Math.random() * 5); // 0～4件
  for (let i = 0; i < numEvents; i++) {
    const eventDate = new Date(d);
    const hour = 8 + Math.floor(Math.random() * 10); // 8時～18時
    eventDate.setHours(hour, 0, 0, 0);
    const category = Math.random() < 0.5 ? 0 : 1;
    let title, project_id, type;
    if (category === 0) {
      title = repairTitles[Math.floor(Math.random() * repairTitles.length)];
      project_id = "PROJ_004";
      type = "修繕工事";
    } else {
      title =
        maintenanceTitles[Math.floor(Math.random() * maintenanceTitles.length)];
      project_id = "PROJ_002";
      type = "定期保守";
    }
    additionalEventItems.push({
      project_id: project_id,
      title: title,
      start: eventDate.toISOString(),
      color:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0"),
      extendedProps: {
        description: "自動生成されたイベント",
        location: "現場",
        organizer: "システム",
        type: type,
      },
    });
  }
}

// ----------------------------------------------------
// sampleEventItems：イベントのマージ
// ----------------------------------------------------
const sampleEventItems = [
  ...baseEventItems,
  ...additionalEventItems,
].map((event) => ({
  ...event,
  project_id: event.project_id || "PROJ_001",
}));

// ----------------------------------------------------
// CalendarView コンポーネント
// ----------------------------------------------------
function CalendarView({ initialDate, events, onEventClick }) {
  const calendarEl = React.useRef(null);
  React.useEffect(() => {
    const calendar = new FullCalendar.Calendar(calendarEl.current, {
      locale: "ja",
      initialDate: initialDate,
      initialView: "dayGridMonth",
      headerToolbar: { left: "", center: "title", right: "" },
      events: events,
      height: "auto",
      dayMaxEvents: 2,
      moreLinkContent: (arg) => `+${arg.num}`,
      eventClick: (info) => {
        info.jsEvent.preventDefault();
        if (onEventClick) onEventClick(info.event);
      },
    });
    calendar.render();
    return () => calendar.destroy();
  }, [initialDate, events, onEventClick]);
  return <div ref={calendarEl} />;
}

// ----------------------------------------------------
// CalendarCarousel コンポーネント
// ----------------------------------------------------
function CalendarCarousel({ events, onEventClick }) {
  const swiperContainerRef = React.useRef(null);
  const swiperRef = React.useRef(null);
  const currentDate = new Date();
  const initialRange = 2;
  const initialDates = [];
  for (let i = -initialRange; i <= initialRange; i++) {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + i);
    initialDates.push(new Date(d));
  }
  const [dates, setDates] = React.useState(initialDates);
  const firstChangeRef = React.useRef(true);
  React.useEffect(() => {
    swiperRef.current = new Swiper(swiperContainerRef.current, {
      initialSlide: initialRange,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: false,
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      pagination: { el: ".swiper-pagination", clickable: true },
      on: {
        slideChange: function () {
          if (firstChangeRef.current) {
            firstChangeRef.current = false;
            return;
          }
          setDates((prevDates) => {
            let newDates = prevDates;
            if (this.activeIndex <= 1) {
              const firstDate = prevDates[0];
              const additional = [];
              for (let i = 2; i > 0; i--) {
                let d = new Date(firstDate);
                d.setMonth(d.getMonth() - i);
                additional.push(d);
              }
              newDates = [...additional, ...prevDates];
              this.slideTo(this.activeIndex + additional.length, 0);
            } else if (this.activeIndex >= prevDates.length - 2) {
              const lastDate = prevDates[prevDates.length - 1];
              const additional = [];
              for (let i = 1; i <= 2; i++) {
                let d = new Date(lastDate);
                d.setMonth(d.getMonth() + i);
                additional.push(d);
              }
              newDates = [...prevDates, ...additional];
            }
            return newDates;
          });
          window.dispatchEvent(new Event("resize"));
        },
      },
    });
    return () => {
      if (swiperRef.current) swiperRef.current.destroy();
    };
  }, []);
  React.useEffect(() => {
    if (swiperRef.current) swiperRef.current.update();
  }, [dates]);
  return (
    <div className="swiper" ref={swiperContainerRef}>
      <div className="swiper-wrapper">
        {dates.map((d, i) => (
          <div className="swiper-slide" key={i}>
            <CalendarView
              initialDate={d.toISOString().substring(0, 10)}
              events={events}
              onEventClick={onEventClick}
            />
          </div>
        ))}
      </div>
      <div className="swiper-pagination" />
      <div className="swiper-button-prev" />
      <div className="swiper-button-next" />
    </div>
  );
}

// ----------------------------------------------------
// 各データを「イベント風」に変換するヘルパー関数
// ----------------------------------------------------
const transformTaskToEvent = (task) => {
  const project = sampleProjects.find((p) => p.id === task.project_id);
  return {
    title: task.task,
    start: task.dueDate,
    end: task.dueDate,
    color: "#16a085",
    extendedProps: {
      type: "タスク",
      priority: task.priority,
      project_id: task.project_id,
      project_name: project?.name || "未設定",
      requester: task.assignee || "未設定",
      registration: task.createdAt || "2025-01-01",
      description: task.description,
    },
  };
};
const transformEventData = (event) => {
  const project = sampleProjects.find((p) => p.id === event.project_id);
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000);
  return {
    ...event,
    end: endDate.toISOString(),
    extendedProps: {
      ...event.extendedProps,
      type: event.extendedProps.type || "イベント",
      project_id: event.project_id,
      project_name: project?.name || "未設定",
      contact: event.extendedProps.organizer,
    },
  };
};

// ----------------------------------------------------
// UnaddressedTasksModal コンポーネント（未対応タスクモーダル）
// ----------------------------------------------------
function UnaddressedTasksModal({ open, onClose, tasks, onTaskClick }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>未対応のタスク確認</DialogTitle>
      <DialogContent>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                sx={{ "&:hover": { backgroundColor: "grey.100" }, cursor: "pointer" }}
                onClick={() => onTaskClick(transformTaskToEvent(task))}
              >
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{"タスク"}</TableCell>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{"2025-01-01"}</TableCell>
                <TableCell>{"案件A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------
// NewScheduleDialog コンポーネント（新規予定作成モーダル）
// ----------------------------------------------------
function NewScheduleDialog({ open, onClose, onSubmit }) {
  const [formData, setFormData] = React.useState({
    title: "",
    start: "",
    end: "",
    type: "",
    description: "",
    location: "",
    organizer: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>新規予定の作成</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" name="title" label="タイトル" fullWidth value={formData.title} onChange={handleChange} />
        <TextField margin="dense" name="start" label="開始日時 (YYYY-MM-DDTHH:mm)" fullWidth value={formData.start} onChange={handleChange} />
        <TextField margin="dense" name="end" label="終了日時 (YYYY-MM-DDTHH:mm)" fullWidth value={formData.end} onChange={handleChange} />
        <TextField margin="dense" name="type" label="カテゴリ" fullWidth value={formData.type} onChange={handleChange} />
        <TextField margin="dense" name="location" label="場所" fullWidth value={formData.location} onChange={handleChange} />
        <TextField margin="dense" name="organizer" label="主催者" fullWidth value={formData.organizer} onChange={handleChange} />
        <TextField margin="dense" name="description" label="説明" fullWidth value={formData.description} onChange={handleChange} multiline rows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit} color="primary">作成</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------
// ProjectCrudDialog コンポーネント（案件作成／編集モーダル）
// 「基本情報の設定」「関連タスクのCRUD」「関連イベントのCRUD」の Paper に分割
// ----------------------------------------------------
function ProjectCrudDialog({ open, onClose, onSubmit, initialData }) {
  const [basicInfo, setBasicInfo] = React.useState({
    name: "",
    start: "",
    end: "",
    status: "",
    manager: "",
    department: "",
    budget: "",
    description: "",
    type: ""
  });
  const [tasks, setTasks] = React.useState([]);
  const [events, setEvents] = React.useState([]);

  // モーダル表示時または初期データがある場合は初期化
  React.useEffect(() => {
    if (initialData) {
      setBasicInfo(initialData);
      // 関連タスク／イベントはサンプルデータから読み込み（※実際はAPI等で取得）
      setTasks(sampleTasks.filter(task => task.project_id === initialData.id));
      setEvents(sampleEventItems.filter(event => event.project_id === initialData.id));
    } else {
      setBasicInfo({
        name: "",
        start: "",
        end: "",
        status: "",
        manager: "",
        department: "",
        budget: "",
        description: "",
        type: ""
      });
      setTasks([]);
      setEvents([]);
    }
  }, [initialData, open]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- 関連タスクのCRUD ----------
  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      project_id: initialData ? initialData.id : "NEW_PROJ",
      task: "新しいタスク",
      dueDate: "",
      priority: "Medium",
      description: "",
      completed: false,
      assignee: currentUser,
      type: "タスク"
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // ---------- 関連イベントのCRUD ----------
  const handleAddEvent = () => {
    const newEvent = {
      project_id: initialData ? initialData.id : "NEW_PROJ",
      title: "新しいイベント",
      start: "",
      end: "",
      color: "#8e44ad",
      extendedProps: {
        description: "",
        location: "",
        organizer: "",
        type: "イベント"
      }
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleDeleteEvent = (index) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // 案件データに関連タスク・イベントを付与して返す
    const projectData = {
      ...basicInfo,
      id: initialData ? initialData.id : `PROJ_${Date.now()}`,
      tasks: tasks,
      events: events,
    };
    onSubmit(projectData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? "案件編集" : "新規案件作成"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* 基本情報の設定 */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>基本情報の設定</Typography>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="案件名"
              fullWidth
              value={basicInfo.name}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="start"
              label="開始日 (YYYY-MM-DD)"
              fullWidth
              value={basicInfo.start}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="end"
              label="終了日 (YYYY-MM-DD)"
              fullWidth
              value={basicInfo.end}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="status"
              label="ステータス"
              fullWidth
              value={basicInfo.status}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="manager"
              label="担当者"
              fullWidth
              value={basicInfo.manager}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="department"
              label="部署"
              fullWidth
              value={basicInfo.department}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="budget"
              label="予算"
              fullWidth
              value={basicInfo.budget}
              onChange={handleBasicInfoChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="説明"
              fullWidth
              value={basicInfo.description}
              onChange={handleBasicInfoChange}
              multiline
              rows={2}
            />
            <TextField
              margin="dense"
              name="type"
              label="種類"
              fullWidth
              value={basicInfo.type}
              onChange={handleBasicInfoChange}
            />
          </Paper>

          {/* 関連タスクのCRUD */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="h6">関連タスクのCRUD</Typography>
              <Button variant="contained" size="small" onClick={handleAddTask}>
                タスク追加
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>タスク</TableCell>
                  <TableCell>期限</TableCell>
                  <TableCell>優先度</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      タスクがありません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* 関連イベントのCRUD */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="h6">関連イベントのCRUD</Typography>
              <Button variant="contained" size="small" onClick={handleAddEvent}>
                イベント追加
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>タイトル</TableCell>
                  <TableCell>開始日時</TableCell>
                  <TableCell>種類</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.start}</TableCell>
                    <TableCell>{event.extendedProps?.type}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteEvent(index)}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      イベントがありません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? "更新" : "作成"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------
// ExpandablePanel コンポーネント（共通の展開／縮小UI）
// ----------------------------------------------------
function ExpandablePanel({ title, children, defaultExpanded = true }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const headerSx = {
    backgroundColor: "#1976d2",
    color: "white",
    p: 1,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  return (
    <Paper sx={{ mb: 4 }}>
      <Box sx={headerSx} onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6">{title}</Typography>
        <Icon sx={{ color: "white" }}>{expanded ? "expand_less" : "expand_more"}</Icon>
      </Box>
      {expanded && <Box sx={{ p: 2 }}>{children}</Box>}
    </Paper>
  );
}

// ----------------------------------------------------
// ExpandableProjectPanel コンポーネント（案件関連UI）
// ----------------------------------------------------
function ExpandableProjectPanel({ projects, selectedProject, setSelectedProject, onUpdate, onCreate, onDelete }) {
  return (
    <ExpandablePanel title="案件一覧">
      <ProjectManagementSection
        projects={projects}
        onUpdate={onUpdate}
        onCreate={onCreate}
        onDelete={onDelete}
      />
    </ExpandablePanel>
  );
}

// ----------------------------------------------------
// ProjectFilterPaper コンポーネント（案件フィルター：Chip スタイル）
// ----------------------------------------------------
function ProjectFilterPaper({ projects, selectedProject, setSelectedProject }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>案件フィルター</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {projects.map((project) => (
          <Chip
            key={project.id}
            label={project.name}
            color={selectedProject === project.id ? "primary" : "default"}
            onClick={() =>
              setSelectedProject(project.id === selectedProject ? null : project.id)
            }
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>
    </Paper>
  );
}

// ----------------------------------------------------
// ProjectManagementSection コンポーネント（案件一覧＋CRUD）
// ----------------------------------------------------
function ProjectManagementSection({ projects, onUpdate, onCreate, onDelete }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [projectToEdit, setProjectToEdit] = React.useState(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenCreate = () => {
    setProjectToEdit(null);
    setDialogOpen(true);
  };
  const handleOpenEdit = (project) => {
    setProjectToEdit(project);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);
  const handleSubmitDialog = (formData) => {
    if (projectToEdit) {
      onUpdate({ ...projectToEdit, ...formData });
    } else {
      onCreate({ ...formData, id: `PROJ_${Date.now()}` });
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleOpenCreate}>
          新規案件作成
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>案件名</TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>担当者</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.start}</TableCell>
                  <TableCell>{project.end}</TableCell>
                  <TableCell>{project.manager}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleOpenEdit(project)}>
                      編集
                    </Button>
                    <Button size="small" color="error" onClick={() => onDelete(project.id)}>
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={projects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <ProjectCrudDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
        initialData={projectToEdit}
      />
    </React.Fragment>
  );
}

// ----------------------------------------------------
// CategoryFilterChips コンポーネント（カテゴリフィルター用）
// ----------------------------------------------------
function CategoryFilterChips({ allCategories, selectedCategories, onToggleCategory }) {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {allCategories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          color={selectedCategories.includes(cat) ? "primary" : "default"}
          onClick={() => onToggleCategory(cat)}
          sx={{ cursor: "pointer" }}
        />
      ))}
    </Box>
  );
}

// ----------------------------------------------------
// EventDetailsModal コンポーネント（イベント詳細表示）
// ----------------------------------------------------
function EventDetailsModal({ open, onClose, eventData, projects }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>イベント詳細</DialogTitle>
      <DialogContent>
        {eventData ? (
          <Box>
            <Typography variant="subtitle1">{eventData.title}</Typography>
            <Typography variant="body2">{eventData.extendedProps.description}</Typography>
          </Box>
        ) : (
          <Typography variant="body2">詳細情報がありません</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------
// CalendarApp コンポーネント（メイン）
// ----------------------------------------------------
function CalendarApp() {
  const [projects, setProjects] = React.useState(sampleProjects);
  const [eventItems, setEventItems] = React.useState(sampleEventItems);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [eventModalOpen, setEventModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  // モーダル表示用の状態
  const [showUnaddressedModal, setShowUnaddressedModal] = React.useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);
  const [showProjectManagementModal, setShowProjectManagementModal] = React.useState(false);
  // カテゴリフィルター用の状態
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  // 案件フィルターは selectedProject で管理

  // 案件 CRUD ハンドラ
  const handleProjectUpdate = (updatedProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };
  const handleProjectCreate = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };
  const handleProjectDelete = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // 案件でフィルタリング
  const filteredEvents = selectedProject
    ? eventItems.filter((event) => event.project_id === selectedProject)
    : eventItems;
  const filteredTasks = selectedProject
    ? sampleTasks.filter((task) => task.project_id === selectedProject)
    : sampleTasks;
  const combinedCalendarEvents = [
    ...filteredEvents,
    ...filteredTasks.map((task) => transformTaskToEvent(task)),
  ];
  // カテゴリチップ用：全てのカテゴリ（重複除外）
  const allCategories = Array.from(new Set(combinedCalendarEvents.map((e) => e.extendedProps.type)));
  // カテゴリフィルター適用
  const filteredCalendarEvents =
    selectedCategories.length > 0
      ? combinedCalendarEvents.filter((e) => selectedCategories.includes(e.extendedProps.type))
      : combinedCalendarEvents;

  // タスク確認用：未完了タスク
  const tasksNeedingAttention = sampleTasks.filter(
    (task) => !task.completed && task.assignee === currentUser
  );
  // 直近の予定
  const myProjectIds = new Set(
    sampleTasks.filter((task) => task.assignee === currentUser).map((task) => task.project_id)
  );
  const upcomingEventItems = [
    ...eventItems.filter((e) => new Date(e.start) >= new Date() && myProjectIds.has(e.project_id)),
    ...sampleTasks
      .filter((task) => task.assignee !== currentUser && new Date(task.dueDate) >= new Date())
      .map((task) => transformTaskToEvent(task)),
  ];
  const upcomingEvents = upcomingEventItems
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  const handleOpenDetailEvent = (data) => {
    setSelectedEvent(data);
    setEventModalOpen(true);
  };

  // アクションボタン用ハンドラー
  const handleCheckUnaddressedTasks = () => setShowUnaddressedModal(true);
  const handleCreateSchedule = () => setShowScheduleDialog(true);
  const handleManageProjects = () => setShowProjectManagementModal(true);

  // カテゴリチップのトグル
  const onToggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // 新規予定作成時（ダミー実装：alert表示＆予定追加）
  const handleNewScheduleSubmit = (data) => {
    const newEvent = {
      title: data.title,
      start: data.start,
      end: data.end,
      color: "#8e44ad",
      extendedProps: {
        description: data.description,
        location: data.location,
        organizer: data.organizer,
        type: data.type,
      },
      project_id: "PROJ_001",
    };
    setEventItems((prev) => [...prev, newEvent]);
    alert("新規予定を作成しました");
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* カレンダー表示 Paper */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <CalendarCarousel events={filteredCalendarEvents} onEventClick={handleOpenDetailEvent} />
      </Paper>
      {/* カテゴリフィルター用 Paper */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>カテゴリフィルター</Typography>
        <CategoryFilterChips
          allCategories={allCategories}
          selectedCategories={selectedCategories}
          onToggleCategory={onToggleCategory}
        />
      </Paper>
      {/* 案件フィルター用（Chip スタイル） */}
      <ProjectFilterPaper
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      {/* アクションボタンパネル */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <Button variant="contained" onClick={handleCheckUnaddressedTasks}>
            未対応のタスク確認
          </Button>
          <Button variant="contained" onClick={handleCreateSchedule}>
            予定の作成
          </Button>
          <Button variant="contained" onClick={handleManageProjects}>
            案件管理
          </Button>
        </Box>
      </Paper>
      {/* 案件関連パネル（常時表示） */}
      <ExpandableProjectPanel
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        onUpdate={handleProjectUpdate}
        onCreate={handleProjectCreate}
        onDelete={handleProjectDelete}
      />
      {/* 対応が必要な予定 */}
      <ExpandablePanel title="対応が必要な予定">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksNeedingAttention.map((task) => (
              <TableRow
                key={task.id}
                sx={{ "&:hover": { backgroundColor: "grey.100" }, cursor: "pointer" }}
                onClick={() => handleOpenDetailEvent(transformTaskToEvent(task))}
              >
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{"タスク"}</TableCell>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{"2025-01-01"}</TableCell>
                <TableCell>{"案件A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ExpandablePanel>
      {/* 直近の予定 */}
      <ExpandablePanel title="直近の予定">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>開始時刻</TableCell>
              <TableCell>終了時刻</TableCell>
              <TableCell>種類</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>問い合わせ先</TableCell>
              <TableCell>案件</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingEvents.map((event, index) => {
              const transformed = transformEventData(event);
              return (
                <TableRow
                  key={index}
                  sx={{ "&:hover": { backgroundColor: "grey.100" }, cursor: "pointer" }}
                  onClick={() => handleOpenDetailEvent(transformed)}
                >
                  <TableCell>{new Date(transformed.start).toLocaleString()}</TableCell>
                  <TableCell>{new Date(transformed.end).toLocaleString()}</TableCell>
                  <TableCell>{transformed.extendedProps.type}</TableCell>
                  <TableCell>{transformed.title}</TableCell>
                  <TableCell>{transformed.extendedProps.organizer}</TableCell>
                  <TableCell>{"案件A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ExpandablePanel>
      <EventDetailsModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        eventData={selectedEvent}
        projects={projects}
      />
      {/* 各種モーダル */}
      <UnaddressedTasksModal
        open={showUnaddressedModal}
        onClose={() => setShowUnaddressedModal(false)}
        tasks={tasksNeedingAttention}
        onTaskClick={handleOpenDetailEvent}
      />
      <NewScheduleDialog
        open={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        onSubmit={handleNewScheduleSubmit}
      />
      {/* 案件管理モーダル（必要に応じて追加実装可能） */}
      {/* 例：<ProjectManagementModal ... /> */}
    </Box>
  );
}

// ----------------------------------------------------
// メインのカレンダーアプリケーションをグローバルに公開
// ----------------------------------------------------
window.CalendarApp = CalendarApp;
