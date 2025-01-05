import React, { useEffect, useState } from 'react';
import { Box, Card, CircularProgress, Typography, Grid, Alert, Button } from '@mui/material';
import { CheckCircle, Error, Warning, Refresh } from '@mui/icons-material';
import { useStore } from '../store';

interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'warning';
  message?: string;
  timestamp?: string;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  services: {
    name: string;
    status: 'up' | 'down';
    latency: number;
  }[];
}

const DeploymentStatus: React.FC = () => {
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeploymentStatus = async () => {
    try {
      const response = await fetch('/api/deployment/status');
      const data = await response.json();
      setDeploymentSteps(data.steps);
      setSystemHealth(data.health);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deployment status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeploymentStatus();
    const interval = setInterval(fetchDeploymentStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: DeploymentStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'failed':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'running':
        return <CircularProgress size={20} />;
      default:
        return <CircularProgress size={20} color="inherit" />;
    }
  };

  const renderSystemHealth = () => {
    if (!systemHealth) return null;

    return (
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          System Health
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box>
              <Typography variant="subtitle2">CPU Usage</Typography>
              <CircularProgress
                variant="determinate"
                value={systemHealth.cpu}
                color={systemHealth.cpu > 80 ? 'error' : 'primary'}
              />
              <Typography>{systemHealth.cpu}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography variant="subtitle2">Memory Usage</Typography>
              <CircularProgress
                variant="determinate"
                value={systemHealth.memory}
                color={systemHealth.memory > 80 ? 'error' : 'primary'}
              />
              <Typography>{systemHealth.memory}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography variant="subtitle2">Disk Usage</Typography>
              <CircularProgress
                variant="determinate"
                value={systemHealth.disk}
                color={systemHealth.disk > 80 ? 'error' : 'primary'}
              />
              <Typography>{systemHealth.disk}%</Typography>
            </Box>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Services Status
          </Typography>
          <Grid container spacing={1}>
            {systemHealth.services.map((service) => (
              <Grid item xs={6} key={service.name}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: service.status === 'up' ? 'success.main' : 'error.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {service.name} ({service.latency}ms)
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Deployment Status</Typography>
        <Button
          startIcon={<Refresh />}
          onClick={() => fetchDeploymentStatus()}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderSystemHealth()}

      <Card>
        <Box p={2}>
          {deploymentSteps.map((step) => (
            <Box
              key={step.id}
              display="flex"
              alignItems="center"
              p={1}
              borderBottom="1px solid"
              borderColor="divider"
            >
              <Box mr={2}>{getStatusIcon(step.status)}</Box>
              <Box flex={1}>
                <Typography variant="subtitle1">{step.name}</Typography>
                {step.message && (
                  <Typography variant="body2" color="text.secondary">
                    {step.message}
                  </Typography>
                )}
              </Box>
              {step.timestamp && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default DeploymentStatus;
