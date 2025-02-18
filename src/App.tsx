import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { lightTheme, darkTheme } from './theme/index';
import useStore from './store/index';
import { ErrorBoundary } from './utils/ErrorBoundary.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const theme = useStore((state) => state.theme);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
