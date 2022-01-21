import { Card, Button, Spin } from "antd";
import { useState, useEffect } from "react";
import DNS from "contracts/swagtag.js";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Address from "components/Address/Address";

export default function Listings(props) {
  const { Moralis, chainId } = useMoralis();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getList = () => {
    Moralis.Cloud.run("List", {}).then(console.log);
  };

  /*useEffect(() => {
    if(!chainId) return;
    setData(query.data);
  }, [query, chainId]);
  if(!chainId) return;
  const { networks, abi } = DNS[chainId];
const contractAddress = networks[parseInt(chainId)].address;
  
  const ids = [];
  const mapper = async (object, key) => {
    console.log(data);
    return (
      <Card key={index}>
        <div
          style={{
            margin: "auto",
            display: "flex",
            gap: "20px",
            marginTop: "25",
          }}
        >
          <div style={{ width: "100%" }}></div>
        </div>
      </Card>
    );
  };
*/
  return (
    <div
      style={{
        margin: "auto",
        display: "flex",
        gap: "20px",
        marginTop: "25",
        width: "70vw",
      }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            swagtags
          </div>
        }
        size="large"
        style={{
          width: "100%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      ><Button         onClick={getList}      >test</Button></Card>
    </div>
  );
}
