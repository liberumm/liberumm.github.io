const { Paper, Box, Divider } = MaterialUI;

function Section({ title, icon, actions, children }) {
  return (
    <Paper variant="outlined" sx={{ mb:2 }}>
      <Box sx={{ p:1.0, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontWeight:700}}>
          {icon && <span className="material-icons">{icon}</span>}
          {title}
        </div>
        {actions}
      </Box>
      <Divider/>
      <Box sx={{ p:1.5 }}>
        {children}
      </Box>
    </Paper>
  );
}
