import { Card, Spin, Tooltip } from "antd";
import { useState, useEffect } from "react";
import DNS from "contracts/swagtag.js";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Address from "components/Address/Address";
import { ShoppingCartOutlined } from "@ant-design/icons";

export default function Market(props) {
  const { Moralis, chainId } = useMoralis();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!chainId) return;
    let url;
    if (chainId === "0xa869") url = "https://trades.fujiavax.ga/";
    if (chainId === "0xa86a") url = "https://trades.avax.ga/";
    console.log({ url });

    const fetcher = async () => {
      try {
        setData(
          await (await fetch(url)).json()
        );
      } catch (e) {
        setData([]);
        console.trace(e);
      }
    };
    fetcher();
  }, [Moralis, setData, chainId]);

  if (!chainId) return "";
  const { networks, abi } = DNS[chainId];
  const contractAddress = networks[parseInt(chainId)].address;

  const buy = async (_trade, value) => {
    const options = {
      contractAddress,
      functionName: "executeTrade",
      abi,
      msgValue: parseInt(value * 1000000000000000000),
      params: { _trade },
    };
    await Moralis.executeFunction(options);
    setLoading(false);
  };

  const ids = [];
  const mapper = (object, key) => {
    console.log({object});
    const index = object.trade_id;
    const value = object.price;
    if (!ids.includes(index)) {
      ids.push(index);
      if (value > 0)
        return (
          <Card
            hoverable
            loading={loading}
            key={index}
            style={{
              width: 320,
              border: "2px solid #e7eaf3",
              borderRadius: "20px",
              overflow: "hidden",
            }}
            actions={[
              <Tooltip title="Buy swagtag">
                <ShoppingCartOutlined
                  onClick={() => {
                    buy(index, value);
                  }}
                />
              </Tooltip>,
            ]}
            cover={object.image ? (
              <div
                style={{
                  backgroundColor: "#e2e8f0",
                  textAlign: "center",
                  height: "200px",
                  backgroundImage: `url(${object.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            ) : (
              <div style={{ height: "200px", backgroundColor: "#e2e8f0" }}>
                <img
                  alt={object.uri}
                  style={{ height: "200px", marginLeft: "55px" }}
                  src="data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' style='zoom:0.5; height:400px' %3e%3cg data-name='Layer 11'%3e%3ccircle cx='199.7' cy='199.7' r='199.7' fill='%23e2e8f0'/%3e%3cpath fill='%232f2f2f' d='M189 320c-47 1-88-66-69-109 3-8-3-20-5-30-14-66 62-113 109-100 28 8 50 54 38 82-1 2 1 6 3 8 24 27 26 93 4 118-20 23-79 35-80 31Zm78-85c3-59-27-81-78-62-4 1-11-3-16-4 3-4 5-10 8-11l53-5c5-1 13-2 15-5 7-15-9-47-25-50-40-6-82 10-90 58-7 39 12 56 50 46a71 71 0 0 1 23-2c18 1 34 22 27 35-3 4-2 10-3 15-1 7 0 22-4 22s-3-15-4-23c0-20-16-32-35-28-13 2-27 2-40 5-4 0-12 7-12 8 8 18 13 39 25 53 23 24 51 9 76 2 27-8 28-33 30-54Z'/%3e%3cpath fill='%23f5b5ce' d='M267 235c-2 21-3 46-30 54-25 7-53 22-76-2-12-14-17-35-25-53 0-1 8-8 12-8 13-3 27-3 40-5 19-4 35 8 35 28 1 8-1 23 4 23s3-15 4-22c1-5 0-11 3-15 7-13-9-34-27-35a71 71 0 0 0-23 2c-38 10-57-7-50-46 8-48 50-64 90-58 16 3 32 35 25 50-2 3-10 4-15 5l-53 5c-3 1-5 7-8 11 5 1 12 5 16 4 51-19 81 3 78 62Z'/%3e%3c/g%3e%3c/svg%3e"
                />
              </div>
            )}
          >
            <a
              style={{ color: "lightblue" }}
              target="_blank"
              rel="noreferrer"
              href={`https://${object.uri
                .replace("https://domains.fujiavax.ga/", "")
                .replace("https://domains.avax.ga/", "")}${
                chainId === "0xa869" ? "fuji" : ""
              }.avax.ga`}
            >
              https://
              <span style={{color:'rgb(231, 84, 128);'}}>{object
                .uri
                .replace("https://domains.fujiavax.ga/", "")
                .replace("https://domains.avax.ga/", "")}
              {chainId === "0xa869" ? "fuji" : ""}</span>.avax.ga
            </a>
            <h4 style={{ minHeight: "20px" }}>
              <b>{object.title||"no title"}</b>
            </h4>
            <p style={{ minHeight: "100px" }}>{object.description||"no description"}</p>
            <div>{parseInt(object.price) / 1000000000000000000} AVAX</div>
          </Card>
        );
    }
  };

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
            swagtag avalanche
            <Address
              avatar="left"
              copyable
              address={contractAddress}
              size={8}
            />
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
        <div
          style={{
            margin: "auto",
            display: "flex",
            gap: "20px",
            marginTop: "25",
          }}
        >
          {loading ? <Spin /> : data.map(mapper)}
        </div>
      </Card>
    </div>
  );
}
