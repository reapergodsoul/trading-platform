import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useMutation } from 'react-query';
import api from '../../services/api';
import useStore from '../../store';

interface LoginCredentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useStore((state) => state.setUser);

  const from = location.state?.from?.pathname || '/';

  const loginMutation = useMutation(
    (data: LoginCredentials) => api.post('/auth/login', data),
    {
      onSuccess: (response) => {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        navigate(from, { replace: true });
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Trading Platform
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          Sign In
        </Typography>

        {loginMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : 'An error occurred during login'}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            sx={{ mr: 2 }}
          >
            Don't have an account? Sign Up
          </Link>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
