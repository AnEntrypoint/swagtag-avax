import { Card } from "antd";
import Chains from "components/Chains";
import { useChain } from "react-moralis";
import { Redirect  } from "react-router-dom";
import { useMoralis } from "react-moralis";

export default function Welcome(props) {
  const { chainId } = useChain();
  const { isAuthenticated } = useMoralis();

  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Welcome to µDNS!
          </div>
        }
        size="large"
        style={{
          width: "100%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
      {chainId}
        {(chainId!=='0xa869'||chainId!=='0xa86a')&&isAuthenticated?<div>
            Please switch to Avax Testnet here on your Metamask:
            <Chains/>
        </div>:null}
        {!isAuthenticated?<div>
            Please authenticate using the button on the top right
        </div>:null}

        {isAuthenticated&&(chainId==='0xa869'||chainId==='0xa86a')?<Redirect to={'/nft'}/>:null}
      </Card>
    </div>
  );
}
