import React, { useState, useMemo } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import { Card, Tooltip, Modal, Skeleton, Spin, Input, Form, Button } from "antd";
import { FileSearchOutlined, SendOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AddressInput from "./AddressInput";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import DNS from "contracts/DNS.json";

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
  const { Moralis } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();
  const { networks, abi } = DNS;
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const contractAddress = useMemo(() => networks['1'].address, [networks]);
  const [ip, setIp] = useState();
  const [nft, setNft] = useState();
  const [domain, setDomain] = useState();
  const [price, setPrice] = useState();

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

  const claim = async (name)=>{
      setIsPending(true);
      await Moralis.executeFunction({
        contractAddress,
        functionName: 'mintToken',
        msgValue:parseInt(10000000000000000),
        abi,
        params:{name},
      });
      setIsPending(false);
  }
  const sell = async ()=>{
    const _price = parseInt(price * 1000000000000000000).toString();
    
    setIsPending(true);
     await Moralis.executeFunction({
        contractAddress,
        functionName: 'openTrade',
        abi,
        params:{_item:nft.token_id, _price},
      });
      setIsPriceModalVisible(false);
      setIsPending(false);
  }
  const edit = async ()=>{
      setIsPending(true);
      await Moralis.executeFunction({
        contractAddress,
        functionName: 'setAddress',
        abi,
        params:{_name:nft.token_uri, _address:ip},
      })
      setIsEditModalVisible(false);
      setIsPending(false);
  }

  const drawnft = (nft, index) => {
        //Verify Metadata
        nft = verifyMetadata(nft);
        console.log('address',nft.token_address.toLowerCase(), contractAddress.toLowerCase())
        if(nft.token_address.toLowerCase() === contractAddress.toLowerCase()) {
        return (
            <Card
            hoverable
            style={{
                width: 240,
                border: "2px solid #e7eaf3"
            }}
            actions={[
                <Tooltip title="Edit">
                <FileSearchOutlined
                    onClick={() => {setNft(nft); setIsEditModalVisible(true)}}
                />
                </Tooltip>,
                <Tooltip title="Transfer NFT">
                <SendOutlined onClick={() => handleTransferClick(nft)} />
                </Tooltip>,
                <Tooltip title="Sell On Marketplace">
                <ShoppingCartOutlined onClick={() => {setNft(nft); setIsPriceModalVisible(true);}} />
                </Tooltip>,
            ]}
            key={index}
            >
            <Meta title={(<a href={'https://'+nft.token_uri+'.avax.ga'}>{nft.token_uri}</a>)} />
            </Card>
        ) 
        } else {
            return null;
        }
    }
  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={"Your domains"}
        size="large"
        style={{
          width: "100%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        <Form layout="vertical" onSubmit={()=>{claim(domain)}} name="Claim domain">
          <Form.Item
            label="Claim domain"
            required
            style={{ marginBottom: "15px" }}
            key="claim"
          >
            <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25" }}>
            <Input value={domain} onChange={(e)=>{setDomain(e.target.value)}} placeholder="input placeholder" />
            <Button type={isPending?'secondary':'primary'} disabled={isPending} onClick={()=>{claim(domain)}} htmlType="submit">
              Claim
            </Button>
            </div>
          </Form.Item>
        </Form>
      <div style={styles.NFTs}>
        <Skeleton loading={!NFTBalances?.result}>
          {NFTBalances?.result &&
            NFTBalances.result.map(drawnft)}
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
        <AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
      </Modal>
      <Modal title="Sell" visible={isPriceModalVisible} disabled={isPending} onOk={()=>{if(!isPending) sell()}} onCancel={()=>{setIsPriceModalVisible(false)}}>
            {isPending?<Spin />:<Input value={price} onChange={(e)=>{setPrice(e.target.value)}} placeholder="Avax price" />}
      </Modal>
      <Modal title="Edit" visible={isEditModalVisible} disabled={isPending} onOk={()=>{if(!isPending) edit()}} onCancel={()=>{setIsEditModalVisible(false)}}>
            Configure your domain
            {isPending?<Spin />:<Input value={ip} onChange={(e)=>{setIp(e.target.value)}} placeholder="Configuration" />}
      </Modal>
      </Card>
    </div>
  );
}

export default NFTBalance;