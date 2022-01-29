import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
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
  CaretUpOutlined,
} from "@ant-design/icons";
import AddressInput from "./AddressInput";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import DNS from "contracts/swagtag.js";
import { validateSubdomain } from "helpers/validators.js";
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
  const { Moralis, chainId /*useMoralisWeb3ApiCall, Web3Api*/, account } =
    useMoralis();
  const [ data, setData ] = useState([]);
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ip, setIp] = useState();
  const [refresh, setRefresh] = useState(0);

  const [selected, setSelected] = useState();
  const [domain, setDomain] = useState(window.landed);
  const [price, setPrice] = useState();
  const [contractAddress, setContractAddress] = useState();

  const [config, setConfig] = useState();
  /*const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
    Web3Api.account.getNFTsForContract,
    {
      chainId: "0x4",
      address:account,
      token_address: contractAddress,
    }
  }*/

  useEffect(() => {
    if(!account) return;
    if(!contractAddress) return;
    if(!chainId) return;
    let url;
    if (chainId === "0xa869") url = 'https://balance.fujiavax.ga/'+account;
    if (chainId === "0xa86a") url = 'https://balance.avax.ga/'+account;
  
    const fetcher = async ()=>{
      try {
        setData(await (await fetch(url)).json());
      } catch (e) {
        setData([]);
        console.trace(e);
      }

    }
    fetcher();
  }, [contractAddress, account, Moralis, setData, refresh, chainId]);

  if(!chainId || !DNS[chainId]) return <></>;

  const { networks, abi } = DNS[chainId];
  if(contractAddress !== networks[parseInt(chainId)].address) {
    setContractAddress(networks[parseInt(chainId)].address);
  }

  async function transfer(nft, receiver) {
    setVisibility(false);
    const options = {
      type: nft.contract_type.toLowerCase(),
      tokenId: nft.token_id,
      receiver: receiver,
      contractAddress: nft.token_address,
    };

    setIsPending(true);

    console.log({options});
    try {
      await Moralis.transfer(options);
      setIsPending(false);
    } catch (e) {
      console.trace(e);
      setIsPending(false);
    }

  }

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const claim = async (base) => {
    setIsPending(true);
    let name = base;
    if (!validateSubdomain) {
      alert("invalid swagtag, please stick to plain text only");
      return;
    }
    const out = {
      contractAddress,
      functionName: "mintToken",
      abi,
      params: { _name: name },
      msgValue: parseInt(10000000000000000),
    };
    try {
      await Moralis.executeFunction(out);
      setRefresh(refresh+1);
    } catch (e) {
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
    } catch (e) {
      console.trace(e);
    }
    setIsPending(false);
  };
  const bump = async (nft) => {
    const params = { id: nft.token_id };
    console.log(await Moralis.Cloud.run("Bump", params));
  };
  const approve = async () => {
    setIsPending(true);
    setIsPriceModalVisible(false);
    const out = {
      contractAddress,
      functionName: "setApprovalForAll",
      abi,
      params: { operator: contractAddress, approved: true },
    };
    console.log({ out });
    try {
      await Moralis.executeFunction(out);
    } catch (e) {
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
        params: { owner: account, operator: contractAddress },
      })
    );
    console.log({ data });
    /*if (
      !data &&
      window.confirm("Would you like to approve the swagtag marketplace?")
    ) {
      approve();
    } else {*/
      setSelected(nft);
      setIsPriceModalVisible(true);
      //console.log("showing price modal");
    //}
  };
  const drawnft = (nft, index) => {
    if(!nft.uri) nft.uri = ''
    let domain;
    if (chainId === "0xa869") domain = "https://domains.fujiavax.ga/";
    if (chainId === "0xa86a") domain = "https://domains.avax.ga/";
    let link = nft.uri.toString().replace(domain, "");
    nft.image = nft.image&&nft.image.length?nft.image:null;
    return (
      <Card
        hoverable
        loading={isPending}
        style={{
          width: 320,
          border: "2px solid #e7eaf3"
        }}
        actions={[
          isPending && selected?.uri === nft.uri ? (
            <div></div>
          ) : (
            <Tooltip title="Edit">
              <FileSearchOutlined
                onClick={async () => {
                  setSelected(nft);
                  let data = { ips: [] };
                  setIsPending(true);
                  try {
                    data = await Moralis.executeFunction({
                      contractAddress,
                      functionName: "getAddress",
                      abi,
                      params: {
                        _name: nft.uri
                          .replace("https://domains.avax.ga/", "")
                          .replace("https://domains.fujiavax.ga/", ""),
                      },
                    });
                    console.log(data);
                    data = data.length ? JSON.parse(data) : {};
                  } catch (e) {
                    console.log(e);
                  }
                  if (!data.ips) data.ips = [];
                  setConfig(data);
                  setIsPending(false);

                  setIsEditModalVisible(true);
                }}
                style={{ display: isPending ? "none" : "block" }}
              />
            </Tooltip>
          ),
          isPending && selected?.uri === nft?.uri? (
            <div style={{ textAlign: "center" }}>
            </div>
          ) : (
            <Tooltip title="Transfer NFT">
              <SendOutlined
                style={{ display: isPending ? "none" : "block" }}
                onClick={() => handleTransferClick(nft)}
              />
            </Tooltip>
          ),
          isPending && selected?.uri === nft?.uri ? (
            <div></div>
          ) : (
            <Tooltip title="Sell On Marketplace">
              <ShoppingCartOutlined
                style={{ display: isPending ? "none" : "block" }}
                onClick={() => {
                  showPriceModal(nft);
                }}
              />
            </Tooltip>
          ),
          isPending && selected?.uri === nft?.uri ? (
            <div></div>
          ) : (
            <Tooltip title="Bump">
              <CaretUpOutlined
                style={{ display: isPending ? "none" : "block" }}
                onClick={() => {
                  bump(nft);
                }}
              />
            </Tooltip>
          ),
        ]}
        cover={
          nft.image?<div style={{backgroundColor:"#e2e8f0", textAlign:'center', height:"200px", backgroundImage: `url(${nft.image})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>:<div style={{height:"200px", backgroundColor:"#e2e8f0"}}><img style={{height:"200px", marginLeft:'55px'}} src="data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' style='zoom:0.5; height:400px' %3e%3cg data-name='Layer 11'%3e%3ccircle cx='199.7' cy='199.7' r='199.7' fill='%23e2e8f0'/%3e%3cpath fill='%232f2f2f' d='M189 320c-47 1-88-66-69-109 3-8-3-20-5-30-14-66 62-113 109-100 28 8 50 54 38 82-1 2 1 6 3 8 24 27 26 93 4 118-20 23-79 35-80 31Zm78-85c3-59-27-81-78-62-4 1-11-3-16-4 3-4 5-10 8-11l53-5c5-1 13-2 15-5 7-15-9-47-25-50-40-6-82 10-90 58-7 39 12 56 50 46a71 71 0 0 1 23-2c18 1 34 22 27 35-3 4-2 10-3 15-1 7 0 22-4 22s-3-15-4-23c0-20-16-32-35-28-13 2-27 2-40 5-4 0-12 7-12 8 8 18 13 39 25 53 23 24 51 9 76 2 27-8 28-33 30-54Z'/%3e%3cpath fill='%23f5b5ce' d='M267 235c-2 21-3 46-30 54-25 7-53 22-76-2-12-14-17-35-25-53 0-1 8-8 12-8 13-3 27-3 40-5 19-4 35 8 35 28 1 8-1 23 4 23s3-15 4-22c1-5 0-11 3-15 7-13-9-34-27-35a71 71 0 0 0-23 2c-38 10-57-7-50-46 8-48 50-64 90-58 16 3 32 35 25 50-2 3-10 4-15 5l-53 5c-3 1-5 7-8 11 5 1 12 5 16 4 51-19 81 3 78 62Z'/%3e%3c/g%3e%3c/svg%3e"/></div>
        }
        key={index}
      >
        <Meta style={{ marginTop: '-30px', marginLeft: '-25px', width: '324px', height: '50px',  padding: '14px' }}
    title={<a style={{color:'lightblue'}} target="_blank" href={"https://" + link + "." + ((chainId === "0xa869")?"fuji":"")+"avax.ga"}>{"https://"}<span style={{color:'#E75480'}}>{link}</span>{"." + ((chainId === "0xa869")?"fuji":"")+"avax.ga"}</a>} />
        <h4 style={{minHeight:'20px'}}><b>{nft.title}</b></h4>
        <p style={{minHeight:'100px'}}>{nft.description}</p>
      </Card>
    );
  };

  const edit = async () => {
    setIsEditModalVisible(false);
    setIsPending(true);
    const config = Object.assign({}, ip);
    config.uri = selected.uri;
    console.log(config);
    try {
      await Moralis.executeFunction({
        contractAddress,
        functionName: "setAddress",
        abi,
        params: {
          _name: selected.uri
            .replace("https://domains.avax.ga/", "")
            .replace("https://domains.fujiavax.ga/", ""),
          _address: JSON.stringify(config),
        },
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
          margin:"20px",
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
          <Skeleton loading={!data}>
            {data && data.map(drawnft)}
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
