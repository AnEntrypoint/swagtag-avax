import { Col, Row, Button, Card } from "antd";
import { withRouter } from "react-router";
import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import DNS from "contracts/swagtag.js";

/**
 * Shows a payment form
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Pay(props) {
  const { Moralis, chainId } = useMoralis();
  const [name, setName] = useState(null);
  const [item, setItem] = useState(null);
  const [swagtag, setSwagtag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(true);
  const { networks, abi } = DNS[chainId]
    ? DNS[chainId]
    : { networks: { 1: { address: null } }, abi: null };
    const contractAddress = networks[parseInt(chainId)].address;
    useEffect(() => {
    if (!chainId || !name) return;
    if (swagtag) return;
    Moralis.enableWeb3().then(() => {
      Moralis.executeFunction({
        contractAddress,
        functionName: "getAddress",
        abi,
        params: { _name: name },
      }).then((nft) => {
        setSwagtag(JSON.parse(nft));
        setLoading(false);
      });
    });
  }, [name, Moralis, abi, chainId, contractAddress, swagtag]);
  if (!chainId) return false;

  const { location } = props;
  const vars = location.pathname.split("/");
  vars.shift();
  vars.shift();
  const [amount, tag, description, memo] = vars;
  if (tag.toString() !== name) setName(tag);
  const sell = async () => {
    setSending(true);
    console.log(amount);
    try {
      await Moralis.executeFunction({
        contractAddress,
        functionName: "payName",
        msgValue: amount,
        abi,
        params: { _name: name, _amount: amount, _memo: memo },
      });
    } catch (e) {
      console.trace(e);
    }
    setSending(false);
  };
  return (
    <div>
      <Card
        style={{ width: loading ? 300 : "auto" }}
        title={
          <>
            <span style={{ fontSize: "22px", marginRight: "1em" }}>{name}</span>
            {swagtag?.title}
            <a href="https://www.avax.ga">
              <span
                style={{
                  color: "#fbb6ce",
                  fontFamily: "Comfortaa",
                  float: "right",
                  fontSize: "24px",
                }}
              >
                swag<span style={{ color: "#90cdf4" }}>tag</span>
              </span>
            </a>
          </>
        }
        bordered={false}
        loading={loading}
      >
        <Row gutter={8}>
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ color: "gray" }}
          >
            <img
              alt="swagtag image"
              src={
                swagtag?.image || "https://picsum.photos/seed/picsum/1000/666"
              }
            />
            <p style={{ marginTop: "1em" }}>{swagtag?.description}</p>
          </Col>
          <Col xs={22} sm={12} md={12} lg={12} xl={12}>
            <Card>
              <h2>
                {parseFloat((amount / 1000000000000000000).toFixed(8))}{" "}
                AVAX&nbsp;
              </h2>
              {!loading ? (
                <Button onClick={sell} type="primary">
                  SEND
                </Button>
              ) : null}
              <p style={{ marginTop: "1em" }}>{description}</p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default withRouter(Pay);
