import { useEffect } from "react";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Account from "components/Account/Account";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Welcome from "components/Welcome";
import Market from "components/Market";
import NFTBalance from "components/NFTBalance";
import Pay from "components/Pay";
import Contract from "components/Contract/Contract";
import Text from "antd/lib/typography/Text";
import Logo from "components/Logo";
import Listings from "components/Listings";
import MenuItems from "./components/MenuItems";
import { useMoralis } from "react-moralis";
import Chains from "components/Chains";
const { Header, Footer } = Layout;
 
const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Ubuntu",
    color: "#bf219d",
    marginTop: !window.location.hash.toString().startsWith('#/pay')?"50px":null,
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#ebf8ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Ubuntu",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    console.log("connectorId", connectorId);
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto", background:'#fff'}}>
      <Router>
      {!window.location.hash.toString().startsWith('#/pay')?<Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            {isAuthenticated?<Chains/>:null}
            <Account />
          </div>
        </Header>:null}

        <div style={styles.content}>
          <Switch>
            <Route exact path="/welcome">
              <Welcome isServerInfo={isServerInfo} />
            </Route>
            <Route exact path="/market">
              <Market isServerInfo={isServerInfo}/>
            </Route>
            <Route exact path="/nft">
              <NFTBalance isServerInfo={isServerInfo}/>
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/pay">
              <Pay isServerInfo={isServerInfo} />
            </Route>
            <Route path="/">
              <Redirect to="/welcome" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      {!window.location.hash.toString().startsWith('#/pay')?<Footer style={{ textAlign: "center", background:"#fff"}}>
        <Text style={{ display: "block" }}>
          ⭐️ Please star this{" "}
          <a href="https://github.com/AnEntrypoint/swagtag-dapp" target="_blank" rel="noopener noreferrer">
            internet breaking project
          </a>
          , every star makes us very happy!! ⭐️
        </Text>

        <Text style={{ display: "block" }}>
          🙋 inspired? got any questions? come say hi at {""}
          <a target="_blank" rel="noopener noreferrer" href="https://dsc.gg/entrypoint">
          our community  
          </a>
          🙋
        </Text>

        <Text style={{ display: "block" }}>
          read more about{" "}
           
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/AnEntrypoint/swagtag-avax/wiki"
          >
            <span
              className="text-pink-300 font-bold mt-8 text-6xl"
              style={{fontFamily:'Comfortaa'}}
              >swag<span className="text-blue-300">tag</span>
              </span>
          </a>
          📖
        </Text>
      </Footer>:null}
    </Layout>
  );
};

export default App;
