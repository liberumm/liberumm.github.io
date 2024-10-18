const { Box, Grid, Paper, Button, ButtonGroup, Typography, List, ListItem, ListItemText, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } = MaterialUI;
const { useState } = React;

function FileExplorer() {
    const [files, setFiles] = useState([
        { id: '1', name: 'Documents', type: 'folder', size: '1.2 MB', lastModified: '2024-01-01', children: [
            { id: '2', name: 'Projects', type: 'folder', size: '600 KB', lastModified: '2024-02-01', children: [
                { id: '3', name: 'Resume.docx', type: 'file', size: '50 KB', lastModified: '2024-02-15' },
                { id: '4', name: 'CoverLetter.docx', type: 'file', size: '30 KB', lastModified: '2024-02-18' }
            ], open: false },
            { id: '5', name: 'Reports', type: 'folder', size: '400 KB', lastModified: '2024-03-01', children: [
                { id: '6', name: 'AnnualReport.pdf', type: 'file', size: '150 KB', lastModified: '2024-03-15' }
            ], open: false }
        ], open: false },
        { id: '7', name: 'Pictures', type: 'folder', size: '2.5 MB', lastModified: '2024-04-01', children: [
            { id: '8', name: 'Vacation.jpg', type: 'file', size: '1.2 MB', lastModified: '2024-04-10' },
            { id: '9', name: 'Family.png', type: 'file', size: '1.3 MB', lastModified: '2024-04-12' }
        ], open: false },
        { id: '10', name: 'Music', type: 'folder', size: '5 MB', lastModified: '2024-05-01', children: [
            { id: '11', name: 'FavoriteSong.mp3', type: 'file', size: '5 MB', lastModified: '2024-05-10' }
        ], open: false }
    ]);

    const [currentFolder, setCurrentFolder] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);

    const toggleFolder = (id) => {
        const toggleNode = (nodes) => {
            return nodes.map(node => {
                if (node.id === id) {
                    return { ...node, open: !node.open };
                } else if (node.type === 'folder' && node.children) {
                    return { ...node, children: toggleNode(node.children) };
                }
                return node;
            });
        };
        setFiles(toggleNode(files));
    };

    const selectFolder = (folder) => {
        setCurrentFolder(folder);
        setSelectedItem(folder.id);
        openParentFolders(folder.id);
    };

    const openParentFolders = (id) => {
        const openParent = (nodes) => {
            return nodes.map(node => {
                if (node.children?.some(child => child.id === id || openParent([child]).some(n => n.open))) {
                    return { ...node, open: true, children: openParent(node.children) };
                } else {
                    return { ...node, children: openParent(node.children) };
                }
            });
        };
        setFiles(openParent(files));
    };

    const handleFileClick = (file) => {
        setSelectedItem(file.id);
    };

    const handlePreviewClick = (file) => {
        setPreviewFile(file);
    };

    const handleCheckboxChange = (id) => {
        setCheckedItems((prevCheckedItems) => {
            if (prevCheckedItems.includes(id)) {
                return prevCheckedItems.filter((itemId) => itemId !== id);
            } else {
                return [...prevCheckedItems, id];
            }
        });
    };

    const handleTableFolderClick = (folder) => {
        selectFolder(folder);
        if (!folder.open) {
            toggleFolder(folder.id);
        }
    };

    const renderTree = (nodes, level = 0) => (
        <List component="nav" disablePadding>
            {nodes.map((node) => (
                <React.Fragment key={node.id}>
                    <ListItem button onClick={() => node.type === 'folder' ? (toggleFolder(node.id), selectFolder(node)) : handleFileClick(node)}
                        style={{ paddingLeft: level * 20, backgroundColor: selectedItem === node.id ? '#f0f0f0' : 'transparent' }}>
                        {node.type === 'folder' && (
                            <>
                                <span role="img" aria-label="folder">📁</span>&nbsp;
                                <ListItemText primary={`${node.name} ${node.children && node.children.length > 0 ? (node.open ? '[-]' : '[+]') : ''}`} />
                            </>
                        )}
                        {node.type === 'file' && <><span role="img" aria-label="file">📄</span>&nbsp;<ListItemText primary={node.name} /></>}
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
            <Grid item xs={12} md={4} lg={3}>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h6" gutterBottom>
                        Folders
                    </Typography>
                    {renderTree(files)}
                </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h6" gutterBottom>
                        {currentFolder ? currentFolder.name : 'Select a Folder or File'}
                    </Typography>
                    {currentFolder && (
                        <TableContainer>
                            <Table>
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
                                        <TableRow key={child.id} onClick={() => child.type === 'folder' ? handleTableFolderClick(child) : handleFileClick(child)}
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
                                                {child.type === 'folder' && <span role="img" aria-label="folder">📁</span>}
                                                {child.type === 'file' && <span role="img" aria-label="file">📄</span>}&nbsp;
                                                {child.name}
                                            </TableCell>
                                            <TableCell>{child.type}</TableCell>
                                            <TableCell>{child.size}</TableCell>
                                            <TableCell>{child.lastModified}</TableCell>
                                            <TableCell>
                                                {child.type === 'file' && (
                                                    <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handlePreviewClick(child); }}>
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
                    <ButtonGroup variant="contained" color="primary">
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
