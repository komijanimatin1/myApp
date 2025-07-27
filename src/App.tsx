import React, { useCallback } from "react";
import {
  IonApp,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonRouterOutlet,
  IonText
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

// Types for Cordova InAppBrowser
interface CordovaWithInAppBrowser extends Cordova {
  InAppBrowser: {
    open: (url: string, target: string, options: string) => InAppBrowserRef;
  };
}

interface InAppBrowserRef {
  addEventListener: (event: string, callback: (event: any) => void) => void;
  removeEventListener: (event: string, callback: (event: any) => void) => void;
  executeScript: (details: { code: string }) => Promise<any[]>;
  close: () => void;
}

// 🔥 آرایه گلوبال از دکمه‌ها
const buttonData = [
  { url: "https://4-player.ir", label: "A", site: "4-Player" },
  { url: "https://react-select.com/home", label: "B", site: "React Select" },
  { url: "https://react-icons.github.io/react-icons/", label: "C", site: "React Icons" },
  { url: "https://quera.org/", label: "D", site: "Quera" },
  { url: "https://www.zoomit.ir/", label: "E", site: "Zoomit" },
  { url: "https://google.com", label: "F", site: "Google" },
];

// صفحه اصلی
const HomePage: React.FC = () => {
  const openWebView = useCallback((url: string, site: string) => {
    const cordovaInstance = window.cordova as CordovaWithInAppBrowser | undefined;

    if (!cordovaInstance?.InAppBrowser) {
      console.warn("Cordova InAppBrowser plugin is not available, fallback to window.open");
      window.open(url, "_blank");
      return;
    }

    const browser = cordovaInstance.InAppBrowser.open(
      url,
      "_blank",
      `location=no,zoom=no,fullscreen=yes,footer=yes,footertitle=${site},closebuttoncaption=Close,closebuttoncolor=#5d5d5d,injectbutton=yes,hardwareback=yes`
    );

    // Listen for AI button click events
    const aiButtonListener = (event: any) => {
      console.log("AI Button clicked!", event);
      
      // If we want to handle AI button clicks on JavaScript side as well
      if (event.type === "inject") {
        console.log("AI Button inject event received:", event);
        // Additional JavaScript-side processing can be added here
      }
    };

    // Add event listeners
    // Removed loadStopListener - no more automatic alert on page load
    browser.addEventListener("inject", aiButtonListener); // Listen for inject events from AI button

    const exitListener = () => {
      browser.removeEventListener("inject", aiButtonListener);
      browser.removeEventListener("exit", exitListener);
    };
    browser.addEventListener("exit", exitListener);
  }, []);

  return (
    <IonPage>
      <IonHeader style={{ marginTop: 75, marginLeft: 40 }}>
        <IonToolbar>
          <IonTitle>IONIC WebView APP</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ marginTop: 40 }} />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {buttonData.map(({ url, label, site }) => (
            <div
              key={url}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <IonButton
                style={{
                  width: 100,
                  height: 100,
                  border: "1px solid #000",
                  borderRadius: "100%",
                  fontSize: 24,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => openWebView(url, site)}
              >
                {label}
              </IonButton>
              <IonText style={{ fontSize: 14 }}>{site}</IonText>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={HomePage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;