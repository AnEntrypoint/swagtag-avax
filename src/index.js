import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import Welcome from "components/Welcome";
import HttpsRedirect from 'react-https-redirect';
/** Get your free Moralis Account https://moralis.io/ */

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  //Validate
  if(!APP_ID || !SERVER_URL) throw new Error("Missing Moralis Application ID or Server URL. Make sure to set your .env file.");
  if (isServerInfo)
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <App isServerInfo />
      </MoralisProvider>
    );
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Welcome />
      </div>
    );
  }
};
  // <React.StrictMode>
  // </React.StrictMode>,
window.landed = window.location.hash.toString().replace('#/', '');
if(window.landed === 'nft' || window.landed === 'market' || window.landed === 'welcome') window.landed = '';
ReactDOM.render(
    <HttpsRedirect>
      <Application />
    </HttpsRedirect>,
  document.getElementById("root")
);
