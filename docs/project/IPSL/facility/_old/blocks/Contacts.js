// Contacts.js
const { useState } = React;
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } = MaterialUI;

function Contacts({ filters }) {
    const [contacts, setContacts] = useState([
        { id: 1, department: '店舗開発部', name: '山田 太郎', company: '設計事務所A', role: '担当者名A', contactPerson: '内装担当A' },
        { id: 2, department: '現場担当', name: '佐藤 花子', company: '施工会社B', role: '担当者名B', contactPerson: '施工担当B' },
        // 他の連絡先もここに追加
    ]);

    const [open, setOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);

    const handleOpen = (contactItem = null) => {
        setCurrentContact(contactItem);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentContact(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentContact({
            ...currentContact,
            [name]: value
        });
    };

    const handleSave = () => {
        if (currentContact.id) {
            // 更新
            setContacts(contacts.map(ct => ct.id === currentContact.id ? currentContact : ct));
        } else {
            // 追加
            const newId = contacts.length > 0 ? Math.max(...contacts.map(ct => ct.id)) + 1 : 1;
            setContacts([...contacts, { ...currentContact, id: newId }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('本当に削除しますか？')) {
            setContacts(contacts.filter(ct => ct.id !== id));
        }
    };

    // フィルター適用
    const filteredContacts = contacts.filter(ct => {
        const matchesSearch = filters.search === '' || ct.department.includes(filters.search) || ct.name.includes(filters.search) || ct.company.includes(filters.search);
        const matchesLocation = filters.location === 'all' || ct.department === filters.location; // 仮のロジック
        // 他のフィルター条件を追加する場合はここに記述
        return matchesSearch && matchesLocation;
    });

    return (
        <TableContainer component={Paper} style={{ marginBottom: 20 }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }} >
                        <TableCell>部署</TableCell>
                        <TableCell>担当者名</TableCell>
                        <TableCell>会社</TableCell>
                        <TableCell>役割</TableCell>
                        <TableCell>連絡先</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>{contact.department}</TableCell>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.company}</TableCell>
                            <TableCell>{contact.role}</TableCell>
                            <TableCell>{contact.contactPerson}</TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleOpen(contact)}>編集</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(contact.id)}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredContacts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center">該当する連絡先がありません。</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: 16 }}>
                連絡先追加
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentContact && currentContact.id ? '連絡先編集' : '連絡先追加'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="部署"
                                name="department"
                                value={currentContact ? currentContact.department : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="担当者名"
                                name="name"
                                value={currentContact ? currentContact.name : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="会社"
                                name="company"
                                value={currentContact ? currentContact.company : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="役割"
                                name="role"
                                value={currentContact ? currentContact.role : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="連絡先"
                                name="contactPerson"
                                value={currentContact ? currentContact.contactPerson : ''}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">キャンセル</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">保存</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}
