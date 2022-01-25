import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import Welcome from "components/Welcome";
import HttpsRedirect from 'react-https-redirect';
/** Get your free Moralis Account https://moralis.io/ */


const APP_ID = !window.location.toString().includes('fuji')?process.env.REACT_APP_MORALIS_APPLICATION_ID:'dHgn1VdTnuLhClhKlFz7BqTi6hobxPfgSf47VDur';
const SERVER_URL =  !window.location.toString().includes('fuji')?process.env.REACT_APP_MORALIS_SERVER_URL:'https://jbbli2mhhhnd.usemoralis.com:2053/server';

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
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
