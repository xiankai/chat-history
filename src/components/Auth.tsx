import { MouseEventHandler, useEffect, useRef, useState } from "react";
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
import { useAuth0 } from "@auth0/auth0-react";

declare global {
  interface Window {
    get_access_token: any;
    signout_function: () => void;
  }
}

export const Auth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;

    window.get_access_token = getAccessTokenSilently;
  }, [isAuthenticated]);

  return (
    <div className="dropdown dropdown-end">
      {isLoading ? null : user ? (
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            {user.picture ? <img src={user.picture}></img> : user.email}
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
        {user && (
          <li className="w-full break-all">
            <p>
              Signed in as {user.email} with {user.identit}
            </p>
          </li>
        )}
        {isAuthenticated ? (
          <button
            className="btn w-full"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        ) : (
          <button className="btn w-full" onClick={() => loginWithRedirect()}>
            Log In
          </button>
        )}
      </ul>
    </div>
  );
};
