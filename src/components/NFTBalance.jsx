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
  Image,
  Button,
  Tabs,
} from "antd";
import {
  FileSearchOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import AddressInput from "./AddressInput";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
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
  const { Moralis, chainId, /*useMoralisWeb3ApiCall, Web3Api, account*/ } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();
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
  const [domain, setDomain] = useState(window.landed);
  const [price, setPrice] = useState();

  /*const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
    Web3Api.account.getNFTsForContract,
    {
      chainId: "0x4",
      address:account,
      token_address: contractAddress,
    }
  }*/

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
    setIsPriceModalVisible(false);
    await Moralis.executeFunction({
      contractAddress,
      functionName: "openTrade",
      abi,
      params: { _item: nft.token_id, _price },
    });
    setIsPending(false);
  };
  const edit = async () => {
    setIsPending(true);
    setIsEditModalVisible(false);
    await Moralis.executeFunction({
      contractAddress,
      functionName: "setAddress",
      abi,
      params: { _name: nft.token_uri, _address: ip },
    });
    setIsPending(false);
  };

  const drawnft = (nft, index) => {
    let domain;
    if (chainId === "0xa869") domain = "https://domains.fuji.avax.ga/";
    if (chainId === "0xa86a") domain = "https://domains.avax.ga/";
    if (!nft.token_uri.startsWith(domain)) return;
    if (nft.token_uri.includes("#")) return;
    let link = nft.token_uri.toString().replace(domain, "");
    if (!link.length) return;
    if (!link) return;
    if (nft.token_address.toLowerCase() !== contractAddress.toLowerCase())
      return null;
    nft = verifyMetadata(nft);
    return (
      <Card
        hoverable
        style={{
          width: 240,
          border: "2px solid #e7eaf3",
        }}
        actions={[
          <Tooltip title="Edit">
            {isPending ? (
              <div style={{textAlign:'center'}}>
                <Spin />
              </div>
            ) : null}
            <FileSearchOutlined
              onClick={async () => {
                setNft(nft);
                let data = { ips: [] };
                setIsPending(true);
                try {
                  data = JSON.parse(
                    await Moralis.executeFunction({
                      contractAddress,
                      functionName: "getAddress",
                      abi,
                      params: { _name: nft.token_uri },
                    })
                  );
                } catch (e) {}
                setIsPending(false);
                if (data.tokenName) setTokenName(data.tokenName);
                if (data.description) setDescription(data.description);
                if (data.image) setImage(data.image);
                if (data.ips[0]) setIp1(data.ips[0]);
                if (data.ips[1]) setIp2(data.ips[1]);
                if (data.ips[2]) setIp3(data.ips[2]);
                if (data.ips[3]) setIp4(data.ips[3]);
                if (data.cname) setCname(data.cname);
                if (data.ddns) setIp(data.ddns);
                if (data.tunnel) setIp(data.tunnel);
                setIsEditModalVisible(true);
              }}
              style={{ display: isPending ? "none" : "block" }}
            />
          </Tooltip>,
          <Tooltip title="Transfer NFT">
            <SendOutlined
              style={{ display: isPending ? "none" : "block" }}
              onClick={() => handleTransferClick(nft)}
            />
          </Tooltip>,
          <Tooltip title="Sell On Marketplace">
            <ShoppingCartOutlined
              style={{ display: isPending ? "none" : "block" }}
              onClick={() => {
                setNft(nft);
                setIsPriceModalVisible(true);
              }}
            />
          </Tooltip>,
        ]}
        cover={
          <Image
            preview={false}
            src={nft?.image || "error"}
            fallback="data:image/png;base64,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"
            alt=""
            style={{ height: "300px" }}
          />
        }
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
              placeholder="avax price"
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
                  setTokenName(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="name"
              />
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="image url"
              />
              <hr />
              <h2>dns</h2>
              <Input
                value={ip1}
                onChange={(e) => {
                  setIp1(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="ip address"
              />
              <Input
                value={ip2}
                onChange={(e) => {
                  setIp2(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="ip address"
              />
              <Input
                value={ip3}
                onChange={(e) => {
                  setIp3(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="ip address"
              />
              <Input
                value={ip4}
                onChange={(e) => {
                  setIp4(e.target.value.trim(), ()=>setIp(buildIp()));
                }}
                placeholder="ip address"
              />
            </TabPane>
            <TabPane tab="cname" key="2">
              <h2>erc</h2>
              <Input
                value={tokenName}
                onChange={(e) => {
                  setTokenName(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="name"
              />
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="image url"
              />
              <hr />
              <h2>cname</h2>
              <Input
                value={cname}
                onChange={(e) => {
                  setCname(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="cname"
              />
              <h2>dns</h2>
              <Input
                value={ip1}
                onChange={(e) => {
                  setIp1(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="ip address"
              />
              <Input
                value={ip2}
                onChange={(e) => {
                  setIp2(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="ip address"
              />
              <Input
                value={ip3}
                onChange={(e) => {
                  setIp3(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="ip address"
              />
              <Input
                value={ip4}
                onChange={(e) => {
                  setIp4(e.target.value.trim(), ()=>setIp(buildIpFromCname()));
                }}
                placeholder="ip address"
              />
            </TabPane>
            <TabPane tab="ddns" key="3">
              <h2>erc</h2>
              <Input
                value={tokenName}
                onChange={(e) => {
                  setTokenName(e.target.value.trim(), ()=>setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  }));
                }}
                placeholder="name"
              />
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim(), ()=>setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  }));
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim(), ()=>setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  }));
                }}
                placeholder="image url"
              />
              <hr />
              <h2>dns</h2>
              <Input
                onChange={(e) => {
                  setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  })
                }}
                placeholder="ddns key"
              />
            </TabPane>
            <TabPane tab="tunnel" key="4">
              <h2>erc</h2>
              <Input
                value={tokenName}
                onChange={(e) => {
                  setTokenName(e.target.value.trim(), ()=>setIp({
                    tokenName,
                    description,
                    image,
                    ddns: e.target.value.trim(),
                  }));
                }}
                placeholder="name"
              />
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.trim(), ()=>setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  }));
                }}
                placeholder="description"
              />
              <Input
                value={image}
                onChange={(e) => {
                  setImage(e.target.value.trim(), ()=>setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  }));
                }}
                placeholder="image url"
              />
              <hr />
              <h2>dns</h2>
              <Input
                onChange={(e) => {
                  setIp({
                    tokenName,
                    description,
                    image,
                    tunnel: e.target.value.trim(),
                  })
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
