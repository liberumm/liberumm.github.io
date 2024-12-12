// AllSections.js
const { useState } = React;
const { Box, Tabs, Tab, Typography, Paper } = MaterialUI;

// TabPanelコンポーネント
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`section-tabpanel-${index}`}
            aria-labelledby={`section-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

// アクセシビリティ用のヘルパー関数
function a11yProps(index) {
    return {
        id: `section-tab-${index}`,
        'aria-controls': `section-tabpanel-${index}`,
    };
}

// AllSectionsCombinedコンポーネント: 「全て」タブで全セクションを表示
function AllSectionsCombined({ filters }) {
    return (
        <Box>
            <StoreOverview filters={filters} />
            <StoreEquipment filters={filters} />
            <Contacts filters={filters} />
            <ContractDetails filters={filters} />
            <Tenants filters={filters} />
            <NeighborhoodInfo filters={filters} />
            <RenovationHistory filters={filters} />
            <Issues filters={filters} />
            <GeneralHistory filters={filters} />
        </Box>
    );
}

function AllSections({ filters }) {
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // セクションのラベルと対応するコンポーネントを定義
    const sections = [
        { label: '全て', component: <AllSectionsCombined filters={filters} /> },
        { label: '店舗概要', component: <StoreOverview filters={filters} /> },
        { label: '店舗設備', component: <StoreEquipment filters={filters} /> },
        { label: '連絡先', component: <Contacts filters={filters} /> },
        { label: '契約情報', component: <ContractDetails filters={filters} /> },
        { label: 'テナント', component: <Tenants filters={filters} /> },
        { label: '近隣情報', component: <NeighborhoodInfo filters={filters} /> },
        { label: '改修履歴', component: <RenovationHistory filters={filters} /> },
        { label: '課題', component: <Issues filters={filters} /> },
        { label: '全般履歴', component: <GeneralHistory filters={filters} /> },
    ];

    return (
        <Paper elevation={3} sx={{ width: '100%' }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="セクションタブ"
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                {sections.map((section, index) => (
                    <Tab key={index} label={section.label} {...a11yProps(index)} />
                ))}
            </Tabs>
            {sections.map((section, index) => (
                <TabPanel key={index} value={tabValue} index={index}>
                    {section.component}
                </TabPanel>
            ))}
        </Paper>
    );
}
