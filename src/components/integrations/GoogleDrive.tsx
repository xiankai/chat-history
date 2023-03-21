import { useCallback, useEffect, useRef, useState } from "react";
import { HelmetProvider } from "react-helmet-async";

export const GoogleDrive = () => {
  const [access_token, set_access_token] = useState("");
  const [client, set_client] = useState<any>();

  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const script_url = "https://accounts.google.com/gsi/client";

  const head = document.getElementsByTagName("head")[0];
  const scripts = document.getElementsByTagName("script");

  const ref = useRef<any>();

  useEffect(() => {
    if (
      Array.from(scripts).findIndex((script) => script.src === script_url) ===
      -1
    ) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => {
        const token_client = google.accounts.oauth2.initTokenClient({
          client_id,
          scope:
            "https://www.googleapis.com/auth/drive.appdata \
            https://www.googleapis.com/auth/drive.readonly \
            https://www.googleapis.com/auth/drive.file",
          callback: (tokenResponse: any) => {
            console.log(tokenResponse);
            set_access_token(tokenResponse.access_token);
          },
        });

        ref.current = token_client;
        set_client(token_client);
      };
      script.src = script_url;
      head.appendChild(script);
    }
  }, []);

  const handleSignin = () => {
    client.requestAccessToken();
  };

  const handleFetchData = () => {
    fetch(
      "https://www.googleapis.com/drive/v3/files" +
        `?${new URLSearchParams({
          q: '"folder id" in parents',
        }).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <button onClick={handleSignin}>Sign in with Google</button>
      <button onClick={handleFetchData}>Fetch from Google Drive</button>
    </>
    /* if user is already logged in, show button with icon/logo + username */
    /* clicking on the button allows to customize options / logout? */
    /* otherwise show sign in with google button with icon/logo */
    /* clicking on the button asks the user to authorize the chat history app to create a folder? */

    /* api access to get selected folder and files inside */
    /* api access to get metadata token file (that stores reference to uploaded files) */
    /* api access to fetch files on demand (slow???) */
  );
};
