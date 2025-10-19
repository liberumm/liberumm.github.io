// app/components/Section.js
const { Paper, Box, Divider } = MaterialUI;

function Section({title, icon, children, actions}){
  return (
    <Paper variant="outlined" sx={{mb:2}}>
      <Box sx={{p:1.0, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div className="secTitle"><span className="material-icons">{icon}</span>{title}</div>
        {actions}
      </Box>
      <Divider/>
      <Box sx={{p:1.5}}>
        {children}
      </Box>
    </Paper>
  );
}
