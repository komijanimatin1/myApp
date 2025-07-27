declare global {
  interface Window {
    cordova?: {
      InAppBrowser: {
        open: (url: string, target: string, options: string) => InAppBrowserRef;
      };
    };
  }
}

interface InAppBrowserRef {
  addEventListener: (event: string, callback: (event: any) => void) => void;
  removeEventListener: (event: string, callback: (event: any) => void) => void;
  executeScript: (details: { code: string }) => Promise<any[]>;
  close: () => void;
  show: () => void;
  hide: () => void;
}

export {}; 