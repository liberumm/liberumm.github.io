// header.js
const { AppBar, Toolbar, Typography } = MaterialUI;

function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    店舗管理システム
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

// グローバルにアクセス可能にする
window.Header = Header;
