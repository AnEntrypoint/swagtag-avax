import { Card, Button, Spin } from "antd";
import { useState, useEffect } from "react";
import DNS from "contracts/swagtag.js";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Address from "components/Address/Address";

export default function Market(props) {
  const { Moralis, chainId } = useMoralis();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const query = useMoralisQuery("Trade", (q) => {
    q.descending("createdAt");
    return q
  }, [], {
      live: true,
      onCreate: (res) => {
        console.log({res});
        data.push(res);
        setData(data);
      }
  });
  useEffect(() => {
    setData(query.data);
  }, [query]);

  if(!chainId) return '';
  const { networks, abi } = DNS[chainId];
  const contractAddress = networks['1'].address;

  const buy = async (_trade, value)=>{
      const options = {
        contractAddress,
        functionName: 'executeTrade',
        abi,
        msgValue:parseInt(value*1000000000000000000),
        params:{_trade},
      };
      await Moralis.executeFunction(options);
      setLoading(false);
  }

  const ids = [];
  const mapper = (object, key) => {
    const index = object.get("ad");
    const value = parseInt(object.get("price")) / 1000000000000000000;
    if(!ids.includes(index)) {
      ids.push(index);
      if(value > 0) return (
        
        <Card key={key}>
          <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25" }}>
            <div style={{width:"100%"}}>{object.get("name")}: {value.toFixed(32).replace(/0+$/,'').replace(/\.+$/,'')} AVAX</div>
            <Button disabled={loading} type={loading?'':'primary'} onClick={()=>{buy(index, value)}} htmlType="submit">
              BUY
            </Button>
          </div>

        </Card>
      )
    }
  }
  
  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            swagtag avalanche
            <Address avatar="left" copyable address={contractAddress} size={8} />
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
        {loading?<Spin/>:data.map(mapper)}
          
      </Card>
    </div>
  )
}
