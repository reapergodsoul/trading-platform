import { WebSocketMessage } from '../types';
import useStore from '../store';
import { environment } from '../config/environment';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = environment.cloudService.retryAttempts;
  private reconnectTimeout = 1000;
  private localCache: Map<string, any> = new Map();

  constructor(private url: string) {
    this.setupLocalStorage();
  }

  private setupLocalStorage() {
    const storagePath = environment.desktopConfig.dataStoragePath;
    // Ensure storage directory exists
    try {
      // Using Node.js fs API for desktop environment
      const fs = window.require('fs');
      if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to setup local storage:', error);
    }
  }

  connect() {
    if (!environment.isDesktop) {
      console.error('WebSocket service is only available in desktop mode');
      return;
    }

    try {
      // Add security headers and authentication
      const headers = this.getSecureHeaders();
      this.ws = new WebSocket(this.url, {
        headers,
        timeout: environment.cloudService.timeout,
      });
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private getSecureHeaders() {
    return {
      'X-Client-Type': 'desktop',
      'X-Client-Version': process.env.APP_VERSION || '1.0.0',
      'X-Client-ID': this.getClientId(),
    };
  }

  private getClientId() {
    // Implement secure client ID generation
    // This should be a unique identifier for this desktop installation
    const os = window.require('os');
    return Buffer.from(os.hostname() + '-' + os.userInfo().username).toString('base64');
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      useStore.getState().setWsConnected(true);
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      useStore.getState().setWsConnected(false);
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Add local caching
    this.ws.onmessage = async (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        await this.cacheMessage(message);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };
  }

  private async cacheMessage(message: WebSocketMessage) {
    if (!environment.desktopConfig.localCacheSize) return;

    try {
      const fs = window.require('fs').promises;
      const path = window.require('path');
      const cacheFile = path.join(
        environment.desktopConfig.dataStoragePath,
        `cache-${message.type}-${Date.now()}.json`
      );

      await fs.writeFile(cacheFile, JSON.stringify(message));
      this.maintainCacheSize();
    } catch (error) {
      console.error('Failed to cache message:', error);
    }
  }

  private async maintainCacheSize() {
    try {
      const fs = window.require('fs').promises;
      const path = window.require('path');
      const cacheDir = environment.desktopConfig.dataStoragePath;
      const files = await fs.readdir(cacheDir);
      
      let totalSize = 0;
      const fileSizes = await Promise.all(
        files.map(async (file) => {
          const stats = await fs.stat(path.join(cacheDir, file));
          return { file, size: stats.size };
        })
      );

      // Sort by date (newest first)
      fileSizes.sort((a, b) => {
        const timeA = parseInt(a.file.split('-')[2]);
        const timeB = parseInt(b.file.split('-')[2]);
        return timeB - timeA;
      });

      // Remove oldest files if cache size exceeded
      for (const { file, size } of fileSizes) {
        totalSize += size;
        if (totalSize > environment.desktopConfig.localCacheSize) {
          await fs.unlink(path.join(cacheDir, file));
        }
      }
    } catch (error) {
      console.error('Failed to maintain cache size:', error);
    }
  }

  // Cloud service sync
  private async syncWithCloud() {
    if (!environment.cloudService.enableSync) return;

    try {
      const fs = window.require('fs').promises;
      const path = window.require('path');
      const cacheDir = environment.desktopConfig.dataStoragePath;
      const files = await fs.readdir(cacheDir);

      // Upload cached data to cloud
      for (const file of files) {
        const data = await fs.readFile(path.join(cacheDir, file), 'utf8');
        await this.uploadToCloud(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to sync with cloud:', error);
    }
  }

  private async uploadToCloud(data: any) {
    try {
      const response = await fetch(`${environment.cloudServiceUrl}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getSecureHeaders(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Cloud sync failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to upload to cloud:', error);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const store = useStore.getState();
    
    switch (message.type) {
      case 'trade':
        // Update market data with latest trade
        store.setMarketData(message.data.symbol, {
          ...message.data,
          timestamp: message.timestamp,
        });
        break;

      case 'orderbook':
        // Update order book data
        // Implementation depends on your OrderBook type
        break;

      case 'ticker':
        // Update ticker data
        store.setMarketData(message.data.symbol, message.data);
        break;

      case 'alert':
        // Handle price alerts
        const alerts = [...store.priceAlerts];
        if (message.data.triggered) {
          alerts.forEach(alert => {
            if (alert.id === message.data.alertId) {
              alert.active = false;
            }
          });
          store.setPriceAlerts(alerts);
        }
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.reconnectAttempts++;
        this.reconnectTimeout *= 2; // Exponential backoff
        this.connect();
      }, this.reconnectTimeout);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbol,
      }));
    }
  }

  unsubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        symbol,
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      // Perform final sync before disconnecting
      this.syncWithCloud().finally(() => {
        this.ws.close();
        this.ws = null;
      });
    }
  }
}

// Create a singleton instance
const wsService = new WebSocketService('wss://your-trading-api.com/ws');
export default wsService;
