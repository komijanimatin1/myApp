import React, { useCallback, useEffect } from "react";
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
import { Route, useHistory, useLocation } from "react-router-dom";

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

// 🆕 صفحه دوم
const NewPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ url: string, label: string, site: string }>();
  const { url, label, site } = location.state || {}; // داده ارسال‌شده

  const openWebView = useCallback(() => {
    const cordovaInstance = window.cordova as CordovaWithInAppBrowser | undefined;

    if (!cordovaInstance?.InAppBrowser) {
      console.warn("Cordova InAppBrowser plugin is not available, fallback to window.open");
      window.open(url, "_blank");
      return;
    }

    const browser = cordovaInstance.InAppBrowser.open(
      url,
      "_blank",
      "location=no,hidden=no,hardwareback=yes,enableViewportScale=yes,mediaPlaybackRequiresUserAction=no,allowInlineMediaPlayback=yes,keyboardDisplayRequiresUserAction=no,toolbar=yes,debug=yes"
    );

    const loadStopListener = () => {
      const jsCode = `
        (function() {
          var html = document.body.innerHTML;
          var parts = [];
          for (var i = 0; i < 1; i++) {
            parts.push(html.substring(i * 1000, (i + 1) * 1000));
          }
          return parts;
        })();
      `;

      // @ts-ignore
      browser.executeScript({ code: jsCode }, function (params) {
        for (var i = 0; i < params[0].length; i++) {
          alert(params[0][i]);
        }
      });
    };

    browser.addEventListener("loadstop", loadStopListener);

    const exitListener = () => {
      browser.removeEventListener("loadstop", loadStopListener);
      browser.removeEventListener("exit", exitListener);
    };
    browser.addEventListener("exit", exitListener);
  }, [url]);

  // 🟢 وقتی صفحه لود شد، WebView باز شود
  useEffect(() => {
    if (url) {
      openWebView();
    }
  }, [url, openWebView]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{site}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-text-center ion-padding"
        style={{ background: "blue" }}
      >
        <IonButton color="light" onClick={() => history.goBack()}>
          Back
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

// صفحه اصلی
const HomePage: React.FC = () => {
  const history = useHistory();

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
                onClick={() =>
                  history.push("/new", { url, label, site })
                }
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
          <Route path="/new" component={NewPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;