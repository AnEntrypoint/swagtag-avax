import { useEffect } from "react";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Account from "components/Account/Account";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Welcome from "components/Welcome";
import Market from "components/Market";
import NFTBalance from "components/NFTBalance";
import Contract from "components/Contract/Contract";
import Text from "antd/lib/typography/Text";
import Logo from "components/Logo";
import MenuItems from "./components/MenuItems";
import { useMoralis } from "react-moralis";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#bf219d",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
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
    <Layout style={{ height: "100vh", overflow: "auto"}}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <MenuItems />
          <div style={styles.headerRight}>
            <Account />
          </div>
        </Header>

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
            <Route path="/">
              <Redirect to="/welcome" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer style={{ textAlign: "center"}}>
        <Text style={{ display: "block" }}>
          ⭐️ Please star this{" "}
          <button href="https://github.com/AnEntrypoint/udns-dapp" target="_blank" rel="noopener noreferrer">
            internet breaking project
          </button>
          , every star makes us very happy!! ⭐️
        </Text>

        <Text style={{ display: "block" }}>
          🙋 Got questions? Ask them by visiting {""}
          <a target="_blank" rel="noopener noreferrer" href="https://dsc.gg/entrypoint">
          our community  
          </a>
          🙋
        </Text>

        <Text style={{ display: "block" }}>
          📖 Read more about{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/AnEntrypoint/universal-domains/wiki"
          >
            µDNS
          </a>
          📖
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
