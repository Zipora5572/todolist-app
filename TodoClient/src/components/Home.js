import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
      
        <Box sx={{ flex: 1, mx: 1, p: 2, borderRadius: 2, textAlign: 'center' }}>
          <CheckCircleIcon fontSize="large" color="primary" />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Manage Your Tasks
          </Typography>
          <Typography variant="body1">
            Keep track of your tasks efficiently and ensure nothing falls through the cracks!
          </Typography>
        </Box>

        
        <Box sx={{ flex: 1, mx: 1, p: 2,  borderRadius: 2, textAlign: 'center' }}>
          <ListAltIcon fontSize="large" color="secondary" />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Organize Your Day
          </Typography>
          <Typography variant="body1">
            Plan your day with a clear list of tasks to achieve your goals.
          </Typography>
        </Box>

      
        <Box sx={{ flex: 1, mx: 1, p: 2, borderRadius: 2, textAlign: 'center' }}>
          <AccessTimeIcon fontSize="large" color="primary" />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Stay on Schedule
          </Typography>
          <Typography variant="body1">
            Set deadlines and reminders to ensure you stay on track with your tasks.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
