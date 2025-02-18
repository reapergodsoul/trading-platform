import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Container
} from '@mui/material';
import useStore from '../store';

const Settings: React.FC = () => {
  const { toggleTheme, theme } = useStore();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
              }
              label="Dark Mode"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Push Notifications"
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Settings;