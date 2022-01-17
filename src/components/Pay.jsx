import { Input, Col, Row, Form, Button, Card, Image, PageHeader } from "antd";
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
  const [swagtag, setSwagtag] = useState(null);
  const { networks, abi } = DNS[chainId]
    ? DNS[chainId]
    : { networks: { 1: { address: null } }, abi: null };
  const contractAddress = networks["1"].address;
  useEffect(async () => {
    if (!chainId || !name) return false;
    const nft = await Moralis.executeFunction({
      contractAddress,
      functionName: "getAddress",
      abi,
      params: { _name: name },
    });
    console.log(nft);
    setSwagtag(JSON.parse(nft));
  }, [name]);
  if (!chainId) return false;

  const { location } = props;
  const vars = location.pathname.split("/");
  vars.shift();
  vars.shift();
  const [amount, tag] = vars;
  if (tag.toString() !== name) setName(tag);

  return (
    <div>
      <Row>
        <Col span={24}>
          <PageHeader
            className="site-page-header"
            title="swagtag name"
            subTitle="address"
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Card title={""} width="100%" bordered={false}>
            <Image src={"https://picsum.photos/seed/picsum/1000/666"} />
            swagtag description
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<h1>SEND 0.01 AVAX</h1>} width="100%" bordered={false}>
            Transaction description
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(Pay);
