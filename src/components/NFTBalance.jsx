import React, { useState } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import {
  Card,
  Tooltip,
  Modal,
  Skeleton,
  Spin,
  Input,
  Form,
  Button,
  Tabs,
} from "antd";
import {
  FileSearchOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import AddressInput from "./AddressInput";
//import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import DNS from "contracts/swagtag.js";
const { TabPane } = Tabs;

const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};

function NFTBalance() {
  const { data: NFTBalances } = useNFTBalances();
  const { Moralis, chainId } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  //const { verifyMetadata } = useVerifyMetadata();
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ip, preSetIp] = useState();
  const setIp = (ip) => preSetIp(JSON.stringify(ip));
  const [ip1, setIp1] = useState();
  const [ip2, setIp2] = useState();
  const [ip3, setIp3] = useState();
  const [ip4, setIp4] = useState();
  const [cname, setCname] = useState();
  const [nft, setNft] = useState();
  const [tokenName, setTokenName] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  console.log("LANDED", window.landed);
  const [domain, setDomain] = useState(window.landed);
  const [price, setPrice] = useState();
  if (!chainId) return "";
  const { networks, abi } = DNS[chainId];
  const contractAddress = networks["1"].address;
  async function transfer(nft, receiver) {
    const options = {
      type: nft.contract_type,
      tokenId: nft.token_id,
      receiver: receiver,
      contractAddress: nft.token_address,
    };

    setIsPending(true);
    await Moralis.transfer(options)
      .then((tx) => {
        setIsPending(false);
      })
      .catch((e) => {
        alert(e.message);
        setIsPending(false);
      });
  }
  const tester =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  function validateIPaddress(ipaddress) {
    if (tester.test(ipaddress)) {
      return true;
    }
    return false;
  }

  const buildIp = () => {
    if (!ip1) throw new Error("has to have at least one ip");
    if (!validateIPaddress(ip1)) throw new Error("ip invalid");
    if (ip2 && !validateIPaddress(ip2)) throw new Error("second ip invalid");
    if (ip3 && !validateIPaddress(ip3)) throw new Error("third ip invalid");
    if (ip4 && !validateIPaddress(ip4)) throw new Error("fourth ip invalid");
    const ips = [];
    ips.push(ip1);
    if (ip2) ips.push(ip2);
    if (ip3) ips.push(ip3);
    if (ip4) ips.push(ip4);
    return { tokenName, description, image, ips };
  };
  const buildIpFromCname = () => {
    if (!cname) throw new Error("has to have a cname");
    const out = buildIp();
    out.cname = cname;
    return out;
  };

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const claim = async (base) => {
    setIsPending(true);
    let name;
    if (chainId === "0xa869") name = "https://domains.fuji.avax.ga/" + base;
    if (chainId === "0xa86a") name = "https://domains.avax.ga/" + base;
    const out = {
      contractAddress,
      functionName: "mintToken",
      abi,
      params: { name },
    };
    if (chainId === "0xa86a") out.msgValue = parseInt(10000000000000000);

    await Moralis.executeFunction(out);
    setIsPending(false);
  };
  const sell = async () => {
    const _price = parseInt(price * 1000000000000000000).toString();

    setIsPending(true);
    await Moralis.executeFunction({
      contractAddress,
      functionName: "openTrade",
      abi,
      params: { _item: nft.token_id, _price },
    });
    setIsPriceModalVisible(false);
    setIsPending(false);
  };
  const edit = async () => {
    setIsPending(true);
    await Moralis.executeFunction({
      contractAddress,
      functionName: "setAddress",
      abi,
      params: { _name: nft.token_uri, _address: ip },
    });
    setIsEditModalVisible(false);
    setIsPending(false);
  };

  const drawnft = (nft, index) => {
    //Verify Metadata

    if (!nft.token_uri.includes("domains.avax.ga/")) return;
    if (nft.token_uri.includes("#")) return;
    //nft = verifyMetadata(nft);
    let link = nft.token_uri.toString().split("/")[1];
    if (!link.length) return;
    console.log({ link });
    link = link.pop();
    if (!link) return;
    console.log("URI", nft.token_uri);
    if (nft.token_address.toLowerCase() !== contractAddress.toLowerCase())
      return null;
    return (
      <Card
        hoverable
        style={{
          width: 240,
          border: "2px solid #e7eaf3",
        }}
        actions={[
          <Tooltip title="Edit">
            <FileSearchOutlined
              onClick={() => {
                setNft(nft);
                setIsEditModalVisible(true);
              }}
            />
          </Tooltip>,
          <Tooltip title="Transfer NFT">
            <SendOutlined onClick={() => handleTransferClick(nft)} />
          </Tooltip>,
          <Tooltip title="Sell On Marketplace">
            <ShoppingCartOutlined
              onClick={() => {
                setNft(nft);
                setIsPriceModalVisible(true);
              }}
            />
          </Tooltip>,
        ]}
        key={index}
      >
        <Meta title={<a href={"https://" + link + ".avax.ga"}>{link}</a>} />
      </Card>
    );
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
        size="large"
        style={{
          width: "100%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        <Form
          layout="vertical"
          onSubmit={() => {
            claim(domain);
          }}
          name="claim swagtag"
        >
          <Form.Item required style={{ marginBottom: "15px" }} key="claim">
            <div
              style={{
                margin: "auto",
                display: "flex",
                gap: "20px",
                marginTop: "25",
              }}
            >
              <Input
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                }}
                placeholder="your swagtag like davinci or legolas"
              />
              <Button
                type={isPending ? "secondary" : "primary"}
                disabled={isPending}
                onClick={() => {
                  claim(domain);
                }}
                htmlType="submit"
              >
                Claim
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div style={styles.NFTs}>
          <Skeleton loading={!NFTBalances?.result}>
            {NFTBalances?.result && NFTBalances.result.map(drawnft)}
          </Skeleton>
        </div>
        <Modal
          title={`Transfer ${nftToSend?.name || "NFT"}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => transfer(nftToSend, receiverToSend)}
          confirmLoading={isPending}
          okText="Send"
        >
          <AddressInput
            autoFocus
            placeholder="Receiver"
            onChange={setReceiver}
          />
        </Modal>
        <Modal
          title="Sell"
          visible={isPriceModalVisible}
          disabled={isPending}
          onOk={() => {
            if (!isPending) sell();
          }}
          onCancel={() => {
            setIsPriceModalVisible(false);
          }}
        >
          {isPending ? (
            <Spin />
          ) : (
            <Input
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              placeholder="Avax price"
            />
          )}
        </Modal>
        <Modal
          title="Edit"
          visible={isEditModalVisible}
          disabled={isPending}
          onOk={() => {
            edit();
          }}
          onCancel={() => {
            setIsEditModalVisible(false);
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="a" key="1">
              <h2>erc</h2>
              <Input
                value={tokenName}
                onChange={(e) => {
                  setTokenName(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="name"
              />
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="image url"
              />
              <hr />
              <h2>ip</h2>
              <Input
                value={ip1}
                onChange={(e) => {
                  setIp1(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="ip address"
              />
              <Input
                value={ip2}
                onChange={(e) => {
                  setIp2(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="ip address"
              />
              <Input
                value={ip3}
                onChange={(e) => {
                  setIp3(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="ip address"
              />
              <Input
                value={ip4}
                onChange={(e) => {
                  setIp4(e.target.value.trim());
                  setIp(buildIp());
                }}
                placeholder="ip address"
              />
            </TabPane>
            <TabPane tab="cname" key="2">
              <h2>erc</h2>
              <Input
                value={tokenName}
                onChange={(e) => {
                  setTokenName(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="name"
              />
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="image url"
              />
              <hr />
              <h2>cname</h2>
              <Input
                value={cname}
                onChange={(e) => {
                  setCname(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="cname"
              />
              <h2>ip</h2>
              <Input
                value={ip1}
                onChange={(e) => {
                  setIp1(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="ip address"
              />
              <Input
                value={ip2}
                onChange={(e) => {
                  setIp2(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="ip address"
              />
              <Input
                value={ip3}
                onChange={(e) => {
                  setIp3(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="ip address"
              />
              <Input
                value={ip4}
                onChange={(e) => {
                  setIp4(e.target.value.trim());
                  setIp(buildIpFromCname());
                }}
                placeholder="ip address"
              />
            </TabPane>
            <TabPane tab="ddns" key="3">
              <h2>erc</h2>
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim());
                  setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  });
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim());
                  setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  });
                }}
                placeholder="image url"
              />
              <Input
                value={cname}
                onChange={(e) => {
                  setCname(e.target.value.trim());
                  setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  });
                }}
                placeholder="cname"
              />
              <hr />
              <h2>ip</h2>
              <Input
                onChange={(e) => {
                  setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  });
                }}
                placeholder="tunnel key"
              />
            </TabPane>
            <TabPane tab="tunnel" key="4">
              <h2>erc</h2>
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim());
                  setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  });
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim());
                  setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  });
                }}
                placeholder="image url"
              />
              <Input
                value={cname}
                onChange={(e) => {
                  setCname(e.target.value.trim());
                  setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  });
                }}
                placeholder="cname"
              />
              <hr />
              <h2>ip</h2>
              <Input
                onChange={(e) => {
                  setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  });
                }}
                placeholder="tunnel key"
              />
            </TabPane>
          </Tabs>
        </Modal>
      </Card>
    </div>
  );
}

export default NFTBalance;
