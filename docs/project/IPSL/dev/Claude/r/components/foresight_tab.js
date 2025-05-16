const { Box, Tabs, Tab } = MaterialUI;
const { useState } = React;

function TabArea() {
const [value, setValue] = useState(0);
const handleChange = (event, newValue) => {
    setValue(newValue);
};
// Boxで下線、Tabsでタブ3つを表示
return React.createElement(
    Box,
    { sx: { borderBottom: 1, borderColor: 'divider' } },
    React.createElement(
    Tabs,
    {
        value: value,
        onChange: handleChange,
        centered: true,
        'aria-label': 'simple tabs example'
    },
    React.createElement(Tab, { label: '収益計画', id: 'tab-0', 'aria-controls': 'tabpanel-0' }),
    React.createElement(Tab, { label: '数値計画', id: 'tab-1', 'aria-controls': 'tabpanel-1' }),
    React.createElement(Tab, { label: '数値確認', id: 'tab-2', 'aria-controls': 'tabpanel-2' })
    )
);
}
