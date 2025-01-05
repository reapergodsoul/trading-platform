import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { safeModeConfig, isSafeMode, getSafeModeMessage } from '../../config/safeMode';

interface SafeModeContextType {
  isInSafeMode: boolean;
  config: typeof safeModeConfig;
}

const SafeModeContext = createContext<SafeModeContextType>({
  isInSafeMode: false,
  config: safeModeConfig,
});

export const useSafeMode = () => useContext(SafeModeContext);

interface SafeModeProviderProps {
  children: React.ReactNode;
}

export const SafeModeProvider: React.FC<SafeModeProviderProps> = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const isInSafeMode = isSafeMode();

  useEffect(() => {
    if (isInSafeMode) {
      setShowNotification(true);
    }
  }, [isInSafeMode]);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <SafeModeContext.Provider value={{ isInSafeMode, config: safeModeConfig }}>
      {children}
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {getSafeModeMessage()}
        </Alert>
      </Snackbar>
    </SafeModeContext.Provider>
  );
};
