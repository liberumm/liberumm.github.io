// components/Dashboard.js
const { AppBar, Tabs, Tab, Box, Typography } = MaterialUI;
const { useState } = React;

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="店舗管理" />
          <Tab label="契約管理" />
          <Tab label="テナント管理" />
          <Tab label="建物情報管理" />
          <Tab label="設備管理" />
          <Tab label="業者管理" />
          <Tab label="売上管理" />
          <Tab label="競合管理" />
          <Tab label="履歴管理" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <StoresManager />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ContractsManager />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TenantsManager />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <BuildingInfoManager />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <FacilitiesManager />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <VendorsManager />
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        <SalesManager />
      </TabPanel>
      <TabPanel value={tabValue} index={7}>
        <CompetitorsManager />
      </TabPanel>
      <TabPanel value={tabValue} index={8}>
        <HistoryManager />
      </TabPanel>
    </Box>
  );
}
