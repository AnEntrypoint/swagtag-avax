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
} from "antd";
import {
  FileSearchOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import AddressInput from "./AddressInput";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import DNS from "contracts/swagtag.js";
import {validateSubdomain} from "helpers/validators.js";
import EditMenu from "components/EditMenu.jsx";
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
  const { Moralis, chainId /*useMoralisWeb3ApiCall, Web3Api*/, account } =
    useMoralis();
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ip, setIp] = useState();

  const [selected, setSelected] = useState();
  const [domain, setDomain] = useState(window.landed);
  const [price, setPrice] = useState();

  const [config, setConfig] = useState();
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

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const claim = async (base) => {
    setIsPending(true);
    let name = base;
    //if (chainId === "0xa869") name = "https://domains.fuji.avax.ga/" + base;
    //if (chainId === "0xa86a") name = "https://domains.avax.ga/" + base;
    if(!validateSubdomain) {
      alert('invalid swagtag, please stick to plan text only');
      return;
    }
    const out = {
      contractAddress,
      functionName: "mintToken",
      abi,
      params: { name },
      msgValue: parseInt(10000000000000000),
    };
    try {
      await Moralis.executeFunction(out);
    } catch(e) {
      console.trace(e);
    }
    setIsPending(false);
  };
  const sell = async () => {
    const _price = parseInt(price * 1000000000000000000).toString();

    setIsPending(true);
    setIsPriceModalVisible(false);
    const out = {
      contractAddress,
      functionName: "openTrade",
      abi,
      params: { _item: selected.token_id, _price },
    };
    console.log({ out });
    try {
      await Moralis.executeFunction(out);
    } catch(e) {
      console.trace(e);
    }
    setIsPending(false);
  };

  const approve = async () => {
    setIsPending(true);
    setIsPriceModalVisible(false);
    const out = {
      contractAddress,
      functionName: "setApprovalForAll",
      abi,
      params: { operator: contractAddress, approved:true },
    };
    console.log({ out });
    try {
      await Moralis.executeFunction(out);
    } catch(e) {
      console.trace(e);
    }
    setIsPending(false);
  };
  const showPriceModal = async (nft) => {
    const data = JSON.parse(
      await Moralis.executeFunction({
        contractAddress,
        functionName: "isApprovedForAll",
        abi,
        params: { owner : account, operator : contractAddress },
      })
    );
    console.log({data});
    if (!data) if(window.confirm('Would you like to approve the swagtag marketplace?')) approve();
    else {
      setSelected(nft);
      setIsPriceModalVisible(true);
    }
  }
  const drawnft = (nft, index) => {
    let domain;
    if (chainId === "0xa869") domain = "https://domains.fuji.avax.ga/";
    if (chainId === "0xa86a") domain = "https://domains.avax.ga/";
    //if (!nft.token_uri.startsWith('https://domains.avax.ga/') ||) return;
    //if (nft.token_uri.includes("#")) return;
    if(!nft.token_uri) return null;
    let link = nft.token_uri.toString().replace(domain, "");
    if (!link.length) return;
    if (!link) return;
    console.log({link})
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
          isPending && selected?.token_uri === nft.token_uri ? (
            <div style={{ textAlign: "center" }}></div>
          ) : (
            <Tooltip title="Edit">
              <FileSearchOutlined
                onClick={async () => {
                  setSelected(nft);
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
                  setConfig(data);
                  setIsPending(false);
                  setIsEditModalVisible(true);
                }}
                style={{ display: isPending ? "none" : "block" }}
              />
            </Tooltip>
          ),
          isPending && selected.token_uri === nft.token_uri ? (
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          ) : (
            <Tooltip title="Transfer NFT">
              <SendOutlined
                style={{ display: isPending ? "none" : "block" }}
                onClick={() => handleTransferClick(nft)}
              />
            </Tooltip>
          ),
          isPending && selected.token_uri === nft.token_uri ? (
            <div style={{ textAlign: "center" }}></div>
          ) : (
            <Tooltip title="Sell On Marketplace">
              <ShoppingCartOutlined
                style={{ display: isPending ? "none" : "block" }}
                onClick={()=>{showPriceModal(nft)}}
              />
            </Tooltip>
          ),
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

  const edit = async () => {
    setIsEditModalVisible(false);
    setIsPending(true);
    console.log({ ip });
    try {
      await Moralis.executeFunction({
        contractAddress,
        functionName: "setAddress",
        abi,
        params: { _name: selected.token_uri, _address: JSON.stringify(ip) },
      });
    } catch (e) {
      console.trace(e);
    }
    setIsPending(false);
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
          onOk={async () => {
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
              onChange={(e) => setPrice(e.target.value)}
              placeholder="avax price"
            />
          )}
        </Modal>
        {isEditModalVisible ? (
          <EditMenu
            config={config}
            nft={selected}
            setIp={setIp}
            visible={isEditModalVisible}
            pending={isPending}
            edit={edit}
            close={() => {
              setIsEditModalVisible(false);
            }}
          />
        ) : null}
      </Card>
    </div>
  );
}

export default NFTBalance;
