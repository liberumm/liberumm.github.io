// Header.js
const { AppBar, Toolbar, Typography, Box } = MaterialUI;

function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    店舗管理システム
                </Typography>
                {/* 必要に応じて追加のアイコンやボタンをここに配置 */}
            </Toolbar>
        </AppBar>
    );
}
