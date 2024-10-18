const { Box, Grid, Paper, Button, ButtonGroup, Typography, List, ListItem, ListItemText, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } = MaterialUI;
const { useState, useEffect } = React;

function FileExplorer() {
    const [files, setFiles] = useState([
        { id: '30', name: '全社', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
            { id: '51', name: 'SampleFolder1', type: 'folder', size: '2 MB', lastModified: '2024-08-01', children: [
                { id: '52', name: 'CompanyPolicy.docx', type: 'file', size: '500 KB', lastModified: '2024-08-02' },
                { id: '53', name: 'AnnualPlan.xlsx', type: 'file', size: '1.5 MB', lastModified: '2024-08-03' }
            ], open: false }
        ], open: false },
        { id: '31', name: '自部署', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
            { id: '54', name: 'SampleFolder2', type: 'folder', size: '1.8 MB', lastModified: '2024-08-04', children: [
                { id: '55', name: 'SubFolder', type: 'folder', size: '500 KB', lastModified: '2024-08-05', children: [
                    { id: '56', name: 'SubFile.txt', type: 'file', size: '100 KB', lastModified: '2024-08-06' }
                ], open: false },
                { id: '57', name: 'MixedFile.pdf', type: 'file', size: '1.3 MB', lastModified: '2024-08-07' }
            ], open: false }
        ], open: false },
        { id: '32', name: '取引先', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
            { id: '33', name: 'リッケイ', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
                { id: '34', name: 'SampleFolder', type: 'folder', size: '500 KB', lastModified: '2024-07-01', children: [
                    { id: '35', name: 'SampleFile.txt', type: 'file', size: '100 KB', lastModified: '2024-07-02' }
                ], open: false }
            ], open: false },
            { id: '36', name: '両毛', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
                { id: '37', name: 'SampleFolder', type: 'folder', size: '600 KB', lastModified: '2024-07-03', children: [
                    { id: '38', name: 'SampleFile.pdf', type: 'file', size: '200 KB', lastModified: '2024-07-04' }
                ], open: false }
            ], open: false },
            { id: '39', name: 'SCSK', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
                { id: '40', name: 'SampleFolder', type: 'folder', size: '700 KB', lastModified: '2024-07-05', children: [
                    { id: '41', name: 'SampleFile.docx', type: 'file', size: '300 KB', lastModified: '2024-07-06' }
                ], open: false }
            ], open: false },
            { id: '42', name: 'BIPROGY', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
                { id: '43', name: 'SampleFolder', type: 'folder', size: '800 KB', lastModified: '2024-07-07', children: [
                    { id: '44', name: 'SampleFile.xlsx', type: 'file', size: '400 KB', lastModified: '2024-07-08' }
                ], open: false }
            ], open: false },
            { id: '45', name: 'IE', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
                { id: '46', name: 'SampleFolder', type: 'folder', size: '900 KB', lastModified: '2024-07-09', children: [
                    { id: '47', name: 'SampleFile.pptx', type: 'file', size: '500 KB', lastModified: '2024-07-10' }
                ], open: false }
            ], open: false },
            { id: '48', name: 'アスタリスク', type: 'folder', size: 'N/A', lastModified: 'N/A', children: [
                { id: '49', name: 'SampleFolder', type: 'folder', size: '1 MB', lastModified: '2024-07-11', children: [
                    { id: '50', name: 'SampleFile.jpg', type: 'file', size: '600 KB', lastModified: '2024-07-12' }
                ], open: false }
            ], open: false }
        ], open: false }
    ]);

    const [currentFolder, setCurrentFolder] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        setFiles((prevFiles) => prevFiles.map(node => addParentReferences(node)));
    }, []);

    const addParentReferences = (node, parent = null) => {
        node.parent = parent;
        if (node.children) {
            node.children = node.children.map(child => addParentReferences(child, node));
        }
        return node;
    };

    const toggleFolder = (id) => {
        setFiles((prevFiles) => prevFiles.map(node => updateNodeOpenState(node, id)));
    };

    const updateNodeOpenState = (node, id) => {
        if (node.id === id) {
            return { ...node, open: !node.open };
        } else if (node.type === 'folder' && node.children) {
            return { ...node, children: node.children.map(child => updateNodeOpenState(child, id)) };
        }
        return node;
    };

    const selectFolder = (folder) => {
        setCurrentFolder(folder);
        setSelectedItem(folder.id);
    };

    const handleCheckboxChange = (id) => {
        setCheckedItems((prevCheckedItems) =>
            prevCheckedItems.includes(id)
                ? prevCheckedItems.filter((itemId) => itemId !== id)
                : [...prevCheckedItems, id]
        );
    };

    const getFolderPath = (folder, path = []) => {
        if (!folder) return path;
        path.unshift(folder.name);
        return getFolderPath(folder.parent, path);
    };

    const renderTree = (nodes, level = 0) => (
        <List component="nav" disablePadding>
            {nodes.map((node) => (
                <React.Fragment key={node.id}>
                    <ListItem
                        button
                        onClick={() => node.type === 'folder' ? (toggleFolder(node.id), selectFolder(node)) : setSelectedItem(node.id)}
                        style={{ paddingLeft: level * 20, backgroundColor: selectedItem === node.id ? '#f0f0f0' : 'transparent' }}>
                        {node.type === 'folder' ? (
                            <>
                                <span role="img" aria-label="folder">📁</span>&nbsp;
                                <ListItemText primary={`${node.name} ${node.open ? '[-]' : '[+]'} `} />
                            </>
                        ) : (
                            <><span role="img" aria-label="file">📄</span>&nbsp;<ListItemText primary={node.name} /></>
                        )}
                    </ListItem>
                    {node.type === 'folder' && node.open && node.children && (
                        <Collapse in={node.open} timeout="auto" unmountOnExit>
                            {renderTree(node.children, level + 1)}
                        </Collapse>
                    )}
                </React.Fragment>
            ))}
        </List>
    );

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={12} lg={12}>
                <Paper style={{ padding: 6 }}>
                    <Typography variant="h6" gutterBottom>
                        保管扱い
                    </Typography>
                    <ButtonGroup variant="contained" color="primary" size="small" style={{ marginBottom: 8 }}>
                        <Button>全て</Button>
                        <Button>通常</Button>
                        <Button>一時</Button>
                        <Button>倉庫</Button>
                    </ButtonGroup>
                </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
                <Paper style={{ padding: 6 }}>
                    <Typography variant="h6" gutterBottom>
                        共有範囲
                    </Typography>
                    {renderTree(files)}
                </Paper>
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
                <Paper style={{ padding: 6 }}>
                    <Typography variant="h6" gutterBottom>
                        {currentFolder ? `> ${getFolderPath(currentFolder).join(' > ')}` : 'Select a Folder or File'}
                    </Typography>
                    {currentFolder && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Last Modified</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentFolder.children && currentFolder.children.map((child) => (
                                        <TableRow key={child.id} onClick={() => child.type === 'folder' ? selectFolder(child) : setSelectedItem(child.id)}
                                            style={{ backgroundColor: selectedItem === child.id ? '#f0f0f0' : 'transparent' }}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={checkedItems.includes(child.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleCheckboxChange(child.id);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {child.type === 'folder' ? <span role="img" aria-label="folder">📁</span> : <span role="img" aria-label="file">📄</span>}&nbsp;
                                                {child.name}
                                            </TableCell>
                                            <TableCell>{child.type}</TableCell>
                                            <TableCell>{child.size}</TableCell>
                                            <TableCell>{child.lastModified}</TableCell>
                                            <TableCell>
                                                {child.type === 'file' && (
                                                    <Button variant="contained" color="primary" size="small" onClick={(e) => { e.stopPropagation(); setPreviewFile(child); }}>
                                                        Preview
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
                <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                    <ButtonGroup variant="contained" color="primary" size="small">
                        <Button>Create New Folder</Button>
                        <Button>Upload File</Button>
                        <Button>Delete</Button>
                    </ButtonGroup>
                </Box>
            </Grid>
            {previewFile && (
                <Dialog open={Boolean(previewFile)} onClose={() => setPreviewFile(null)}>
                    <DialogTitle>File Preview</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Name: {previewFile.name}</Typography>
                        <Typography variant="body1">Type: {previewFile.type}</Typography>
                        <Typography variant="body1">Size: {previewFile.size}</Typography>
                        <Typography variant="body1">Last Modified: {previewFile.lastModified}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPreviewFile(null)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Grid>
    );
}
