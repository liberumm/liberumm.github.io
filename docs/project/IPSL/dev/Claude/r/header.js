const { AppBar, Toolbar, Typography, Button, IconButton, Container, Box, Menu, MenuItem, Modal, Paper, TextField, Tabs, Tab, List, ListItem, ListItemText, Chip, Select, FormControl, InputLabel, ToggleButtonGroup, ToggleButton, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, TablePagination } = MaterialUI;

function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(0);
    const [isAdmin] = React.useState(true); // 実際の認証システムと連携
    const [inquiries] = React.useState([
        { 
            id: 1, 
            title: "商品登録について", 
            status: "未対応", 
            assignedTo: "", // nullから空文字列に変更
            dueDate: null,
            createdAt: "2024-01-20",
            createdBy: "user1",
            shared: true
        },
        { id: 2, title: "在庫管理の質問", status: "対応中", assignedTo: "担当者A", createdAt: "2024-01-19" }
    ]);
    const [accountModalOpen, setAccountModalOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState('active'); // デフォルトを未完了に変更
    const [userRole] = React.useState('admin'); // 実際の認証システムと連携
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedInquiry, setSelectedInquiry] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [isDetailEditing, setIsDetailEditing] = React.useState(false);
    const [editingInquiry, setEditingInquiry] = React.useState(null);
    
    // 担当者リスト（実際のデータに置き換えてください）
    const [assignableUsers] = React.useState([
        { id: 'user1', name: '担当者A' },
        { id: 'user2', name: '担当者B' },
        { id: 'user3', name: '担当者C' },
    ]);

    // 状態リスト
    const statusOptions = ['未対応', '対応中', '完了', '保留'];
    
    // メッセージ状態管理を最適化
    const [messageState, setMessageState] = React.useState({
        text: '',
        files: []
    });

    // メッセージ入力ハンドラを最適化
    const handleMessageChange = React.useCallback((e) => {
        const newText = e.target.value;
        setMessageState(prev => ({
            ...prev,
            text: newText
        }));
    }, []);

    const [userInfo] = React.useState({
        id: 'user1',
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'admin',
        department: '営業部'
    });

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAssistClick = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    // メッセージ送信処理を最適化
    const handleMessageSend = React.useCallback((text) => {
        const userMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, userMessage]);

        setTimeout(() => {
            const systemMessage = {
                id: Date.now() + 1,
                text: `「${text}」についての返答です。システムからの自動応答メッセージです。`,
                sender: 'system',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, systemMessage]);
        }, 1000);
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleStatusChange = (inquiryId, newStatus) => {
        // ステータス更新処理
    };

    const handleAssignTo = (inquiryId, userId) => {
        // 担当者割り当て処理
    };

    const handleAccountClick = () => {
        handleMenuClose(); // メニューを閉じる
        setAccountModalOpen(true);
    };

    const handleAccountModalClose = () => {
        setAccountModalOpen(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setMessageState(prev => ({
            ...prev,
            files: [...prev.files, ...droppedFiles]
        }));
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setMessageState(prev => ({
            ...prev,
            files: [...prev.files, ...selectedFiles]
        }));
    };

    const handleInquiryClick = (inquiry) => {
        setSelectedInquiry(inquiry);
    };

    const handleRemoveFile = (index) => {
        setMessageState(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const filterInquiries = (inquiries, type, status) => {
        let filtered = inquiries;
        
        // タイプによるフィルタリング
        switch(type) {
            case 'my':
                filtered = inquiries.filter(i => i.createdBy === userInfo.id);
                break;
            case 'shared':
                filtered = inquiries.filter(i => i.shared);
                break;
            case 'needsAction':
                filtered = inquiries.filter(i => i.assignedTo === userInfo.id && i.status !== '完了');
                break;
            case 'all':
                // 管理者のみ全体表示
                if (!['admin', 'operator'].includes(userRole)) filtered = [];
                break;
        }

        // ステータスによるフィルタリング
        if (status !== 'all') {
            filtered = filtered.filter(i => 
                status === 'completed' ? i.status === '完了' : i.status !== '完了'
            );
        }

        return filtered;
    };

    // ページネーション処理
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // 検索処理
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // CSV出力用の関数を追加
    const exportToCSV = (type) => {
        const data = filterInquiries(inquiries, type, statusFilter)
            .filter(inquiry => inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const headers = ['タイトル', '状態', '作成日', '担当者', '期限'];
        const csvData = data.map(item => [
            item.title,
            item.status,
            item.createdAt,
            item.assignedTo || '未割当',
            item.dueDate || ''
        ]);
        
        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `問い合わせ一覧_${type}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // メッセージCSV出力用の関数を追加
    const exportMessagesToCSV = () => {
        const headers = ['時刻', '送信者', 'メッセージ'];
        const csvData = messages.map(msg => [
            msg.timestamp,
            msg.sender === 'user' ? 'ユーザー' : 'システム',
            msg.text.replace(/\n/g, '\\n')  // 改行コードを保持
        ]);
        
        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `メッセージ履歴_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // タブパネルコンテンツ
    const TabPanel = ({ children, value, index }) => (
        <Box role="tabpanel" hidden={value !== index} sx={{ flex: 1, overflow: 'auto' }}>
            {value === index && children}
        </Box>
    );

    const renderInquiryTable = (type) => (
        <Box sx={{ p: 3 }}>
            <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={(e, value) => value && setStatusFilter(value)}
                        size="small"
                    >
                        <ToggleButton value="all">全て</ToggleButton>
                        <ToggleButton value="active">未完了</ToggleButton>
                        <ToggleButton value="completed">完了</ToggleButton>
                    </ToggleButtonGroup>
                    
                    <Button
                        variant="outlined"
                        startIcon={<span className="material-icons">file_download</span>}
                        onClick={() => exportToCSV(type)}
                        size="small"
                    >
                        CSV出力
                    </Button>
                </Box>
                
                <TextField
                    size="small"
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ minWidth: 250 }}
                />
            </Box>
            <TableContainer 
                component={Paper} 
                variant="outlined"
                sx={{ mb: 2 }}
            >
                <Table size="small" aria-label="inquiries table">
                    <TableHead>
                        <TableRow>
                            <TableCell>タイトル</TableCell>
                            <TableCell>状態</TableCell>
                            <TableCell>作成日</TableCell>
                            <TableCell>担当者</TableCell>
                            {['needsAction', 'all'].includes(type) && (
                                <TableCell align="right">期限</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterInquiries(inquiries, type, statusFilter)
                            .filter(inquiry => 
                                inquiry.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(inquiry => (
                                <TableRow 
                                    key={inquiry.id}
                                    hover
                                    onClick={() => handleInquiryClick(inquiry)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{inquiry.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={inquiry.status}
                                            color={inquiry.status === "未対応" ? "error" : "primary"}
                                        />
                                    </TableCell>
                                    <TableCell>{inquiry.createdAt}</TableCell>
                                    <TableCell>{inquiry.assignedTo || '未割当'}</TableCell>
                                    {['needsAction', 'all'].includes(type) && (
                                        <TableCell align="right">
                                            <TextField
                                                size="small"
                                                type="date"
                                                value={inquiry.dueDate || ''}
                                                onChange={(e) => handleDueDateChange(inquiry.id, e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                sx={{ width: 130 }}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30, { label: '全て', value: -1 }]}
                    component="div"
                    count={filterInquiries(inquiries, type, statusFilter).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="表示件数:"
                />
            </TableContainer>
        </Box>
    );

    // MessageInputコンポーネントを最適化
    const MessageInputField = React.memo(({ onSend }) => {
        const [inputValue, setInputValue] = React.useState('');
        const inputRef = React.useRef(null);

        const handleChange = (e) => {
            setInputValue(e.target.value);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                if (inputValue.trim()) {
                    onSend(inputValue);
                    setInputValue('');
                }
            }
        };

        const handleSendClick = () => {
            if (inputValue.trim()) {
                onSend(inputValue);
                setInputValue('');
                inputRef.current?.focus();
            }
        };

        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    inputRef={inputRef}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="メッセージを入力..."
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    sx={{
                        '& .MuiInputBase-root': {
                            lineHeight: '1.5'
                        }
                    }}
                    InputProps={{
                        sx: { lineHeight: '1.5' },
                        spellCheck: false,
                        autoComplete: 'off'
                    }}
                />
                <IconButton onClick={handleSendClick} color="primary">
                    <span className="material-icons">send</span>
                </IconButton>
            </Box>
        );
    }, []);

    const MessageInput = React.memo(() => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box 
                sx={{ 
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: '#f8f8f8',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    multiple
                />
                <Typography color="textSecondary">
                    ファイルをドロップするか、クリックしてファイルを選択
                </Typography>
            </Box>

            {messageState.files.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {messageState.files.map((file, index) => (
                        <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => handleRemoveFile(index)}
                            size="small"
                        />
                    ))}
                </Box>
            )}

            <MessageInputField onSend={handleMessageSend} />
        </Box>
    ), []); // 依存配列を空にする

    // MessageDisplayコンポーネントを修正
    const MessageDisplay = React.memo(() => (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1,
            p: 2
        }}>
            {messages.map(msg => (
                <Box
                    key={msg.id}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%'
                    }}
                >
                    <Paper
                        sx={{
                            p: 1,
                            bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                            color: msg.sender === 'user' ? 'white' : 'text.primary'
                        }}
                    >
                        <Typography 
                            variant="body1" 
                            style={{ whiteSpace: 'pre-wrap' }}  // 改行を保持
                        >
                            {msg.text}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {msg.timestamp}
                        </Typography>
                    </Paper>
                </Box>
            ))}
        </Box>
    ));

    // 編集開始ハンドラ
    const handleStartEditing = () => {
        setEditingInquiry({ 
            ...selectedInquiry,
            assignedTo: selectedInquiry.assignedTo || "" // nullの場合は空文字列を設定
        });
        setIsDetailEditing(true);
    };

    // 編集保存ハンドラ
    const handleSaveEditing = () => {
        // ここで実際の保存処理を実装
        setSelectedInquiry(editingInquiry);
        setIsDetailEditing(false);
    };

    // 編集キャンセルハンドラ
    const handleCancelEditing = () => {
        setEditingInquiry(null);
        setIsDetailEditing(false);
    };

    return (
        <React.Fragment>
            <AppBar position="static" sx={{ bgcolor: '#1976d2', boxShadow: 3 }}>
                <Container maxWidth={false} sx={{ padding: 0 }}>
                    <Toolbar disableGutters>
                        <Typography variant="h6" noWrap sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                            商品管理アシスト - Product Management Assist
                        </Typography>

                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                                <span className="material-icons">menu</span>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose} component="a" href="/">ホーム</MenuItem>
                                <MenuItem onClick={handleAccountClick}>アカウント</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); handleAssistClick(); }}>アシスト</MenuItem>
                            </Menu>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button color="inherit" href="/">ホーム</Button>
                            <Button color="inherit" onClick={handleAccountClick}>アカウント</Button>
                            <Button color="inherit" onClick={handleAssistClick}>アシスト</Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="assist-modal-title"
            >
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTabPanel-root': {
                        p: 0
                    }
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" id="assist-modal-title">
                            アシスト
                        </Typography>
                        <IconButton onClick={handleModalClose}>
                            <span className="material-icons">close</span>
                        </IconButton>
                    </Box>

                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="メッセージ" />
                        <Tab label="自分の問い合わせ" />
                        <Tab label="共有された問い合わせ" />
                        <Tab label="対応が必要" />
                        {['admin', 'operator'].includes(userRole) && 
                            <Tab label="全体の問い合わせ" />
                        }
                    </Tabs>

                    <Box sx={{ 
                        flex: 1, 
                        overflow: 'hidden', 
                        mt: 3, 
                        display: 'flex', 
                        flexDirection: 'column' 
                    }}>
                        <TabPanel value={activeTab} index={0}>
                            <Box sx={{ 
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mb: 2,
                                px: 3
                            }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<span className="material-icons">file_download</span>}
                                    onClick={exportMessagesToCSV}
                                    size="small"
                                    disabled={messages.length === 0}
                                >
                                    メッセージ履歴CSV出力
                                </Button>
                            </Box>
                            <Box sx={{ 
                                flexGrow: 1, 
                                mb: 3, 
                                overflow: 'auto',
                                px: 3
                            }}>
                                <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                        minHeight: 300, 
                                        overflow: 'auto',
                                        mb: 2
                                    }}
                                >
                                    <MessageDisplay />
                                </Paper>
                            </Box>
                            <Box sx={{ px: 3, pb: 3 }}>
                                <MessageInput />
                            </Box>
                        </TabPanel>

                        <TabPanel value={activeTab} index={1}>
                            {renderInquiryTable('my')}
                        </TabPanel>
                        <TabPanel value={activeTab} index={2}>
                            {renderInquiryTable('shared')}
                        </TabPanel>
                        <TabPanel value={activeTab} index={3}>
                            {renderInquiryTable('needsAction')}
                        </TabPanel>
                        {['admin', 'operator'].includes(userRole) && (
                            <TabPanel value={activeTab} index={4}>
                                {renderInquiryTable('all')}
                            </TabPanel>
                        )}
                    </Box>
                </Paper>
            </Modal>

            <Modal
                open={Boolean(selectedInquiry)}
                onClose={() => setSelectedInquiry(null)}
            >
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">問い合わせ詳細</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {!isDetailEditing ? (
                                <>
                                    <IconButton color="primary" onClick={handleStartEditing}>
                                        <span className="material-icons">edit</span>
                                    </IconButton>
                                    <IconButton onClick={() => setSelectedInquiry(null)}>
                                        <span className="material-icons">close</span>
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton color="primary" onClick={handleSaveEditing}>
                                        <span className="material-icons">save</span>
                                    </IconButton>
                                    <IconButton color="error" onClick={handleCancelEditing}>
                                        <span className="material-icons">close</span>
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Box>

                    {selectedInquiry && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="タイトル"
                                value={isDetailEditing ? editingInquiry.title : selectedInquiry.title}
                                onChange={(e) => setEditingInquiry({ ...editingInquiry, title: e.target.value })}
                                fullWidth
                                disabled={!isDetailEditing}
                            />

                            <TextField
                                label="内容"
                                value={isDetailEditing ? editingInquiry.content : selectedInquiry.content}
                                onChange={(e) => setEditingInquiry({ ...editingInquiry, content: e.target.value })}
                                multiline
                                rows={4}
                                fullWidth
                                disabled={!isDetailEditing}
                            />

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                {isDetailEditing ? (
                                    <FormControl fullWidth>
                                        <InputLabel>状態</InputLabel>
                                        <Select
                                            value={editingInquiry.status}
                                            onChange={(e) => setEditingInquiry({ ...editingInquiry, status: e.target.value })}
                                            label="状態"
                                        >
                                            {statusOptions.map(status => (
                                                <MenuItem key={status} value={status}>{status}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        label="状態"
                                        value={selectedInquiry.status}
                                        disabled
                                        fullWidth
                                    />
                                )}

                                <TextField
                                    label="返信予定日"
                                    type="date"
                                    value={isDetailEditing ? editingInquiry.dueDate : selectedInquiry.dueDate}
                                    onChange={(e) => setEditingInquiry({ ...editingInquiry, dueDate: e.target.value })}
                                    disabled={!isDetailEditing}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                <TextField
                                    label="問い合わせ日"
                                    type="date"
                                    value={selectedInquiry.createdAt}
                                    disabled
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />

                                {isDetailEditing ? (
                                    <FormControl fullWidth>
                                        <InputLabel>担当者</InputLabel>
                                        <Select
                                            value={editingInquiry.assignedTo}
                                            onChange={(e) => setEditingInquiry({ ...editingInquiry, assignedTo: e.target.value })}
                                            label="担当者"
                                        >
                                            <MenuItem value="">未割当</MenuItem>
                                            {assignableUsers.map(user => (
                                                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        label="担当者"
                                        value={selectedInquiry.assignedTo || '未割当'}
                                        disabled
                                        fullWidth
                                    />
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                                <IconButton 
                                    color="primary"
                                    href={`https://external-system.com/inquiry/${selectedInquiry.id}`}
                                    target="_blank"
                                    title="外部システムで開く"
                                >
                                    <span className="material-icons">open_in_new</span>
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Modal>

            <Modal open={accountModalOpen} onClose={handleAccountModalClose}>
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                                {userInfo.name[0]}
                            </Avatar>
                            <Typography variant="h6">
                                アカウント情報
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                color="primary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <span className="material-icons">
                                    {isEditing ? 'save' : 'edit'}
                                </span>
                            </IconButton>
                            <IconButton onClick={handleAccountModalClose}>
                                <span className="material-icons">close</span>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="名前"
                            value={userInfo.name}
                            fullWidth
                            disabled={!isEditing}
                        />
                        <TextField
                            label="メールアドレス"
                            value={userInfo.email}
                            fullWidth
                            disabled={!isEditing}
                        />
                        <TextField
                            label="部署"
                            value={userInfo.department}
                            fullWidth
                            disabled={!isEditing}
                        />
                        <TextField
                            label="役割"
                            value={userInfo.role}
                            disabled
                            fullWidth
                        />
                    </Box>
                </Paper>
            </Modal>
        </React.Fragment>
    );
}
