import { useEffect, useRef, useState } from "react";
import { User, onAuthStateChanged, getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";
import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";
import Cookies from "js-cookie";
import {
  VITE_FIREBASE_AUTH_CONFIG_API_KEY,
  VITE_FIREBASE_AUTH_CONFIG_AUTH_DOMAIN,
  VITE_FIREBASE_AUTH_CONFIG_PROJECT_ID,
  VITE_FIREBASE_AUTH_CONFIG_STORAGE_BUCKET,
  VITE_FIREBASE_AUTH_CONFIG_MESSAGING_SENDER_ID,
  VITE_FIREBASE_AUTH_CONFIG_APP_ID,
  VITE_FIREBASE_AUTH_CONFIG_MEASUREMENT_ID,
} from "../constants";

export const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const elementRef = useRef(null);

  useEffect(() => {
    // The Firebase UI Web UI Config object.
    // See: https://github.com/firebase/firebaseui-web#configuration
    const uiConfig: firebaseui.auth.Config = {
      // Popup signin flow rather than redirect flow.
      signInFlow: "popup",
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      // signInSuccessUrl: "/auth",
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          // console.log(authResult, redirectUrl);
          return false;
        },
      },
    };

    const firebaseConfig = {
      apiKey: VITE_FIREBASE_AUTH_CONFIG_API_KEY,
      authDomain: VITE_FIREBASE_AUTH_CONFIG_AUTH_DOMAIN,
      projectId: VITE_FIREBASE_AUTH_CONFIG_PROJECT_ID,
      storageBucket: VITE_FIREBASE_AUTH_CONFIG_STORAGE_BUCKET,
      messagingSenderId: VITE_FIREBASE_AUTH_CONFIG_MESSAGING_SENDER_ID,
      appId: VITE_FIREBASE_AUTH_CONFIG_APP_ID,
      measurementId: VITE_FIREBASE_AUTH_CONFIG_MEASUREMENT_ID,
    };
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const firebaseAuth = getAuth(firebaseApp);

    // Get or Create a firebaseUI instance.
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);
    // if (uiConfig.signInFlow === "popup") firebaseUiWidget.reset();

    // We track the auth state to reset firebaseUi if the user signs out.
    const unregisterAuthObserver = onAuthStateChanged(
      firebaseAuth,
      (userObject) => {
        // user has signed out. Reset the UI.
        if (!userObject && user) firebaseUiWidget.reset();

        // user is signed in for the first time
        if (userObject && !user) {
          setUser(userObject);
          userObject.getIdToken().then((firebase_token) => {
            Cookies.set("firebase_token", firebase_token, {
              expires: 1 / 24,
            });
          });
        }
      }
    );

    // Render the firebaseUi Widget.
    // @ts-ignore
    firebaseUiWidget.start(elementRef.current, uiConfig);

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, []);

  return (
    <div className="dropdown dropdown-end">
      {user ? (
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            {user.photoURL ? <img src={user.photoURL}></img> : user.email}
          </div>
        </label>
      ) : (
        <label className="btn" tabIndex={0}>
          Not signed in
        </label>
      )}
      <ul
        tabIndex={0}
        className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
      >
        <div ref={elementRef} />
      </ul>
    </div>
  );
};
