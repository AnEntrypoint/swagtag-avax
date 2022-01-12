import { Card, Form, Button, Input, Modal, Spin } from "antd";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useMoralis } from "react-moralis";
import DNS from "contracts/swagtag.js";
import Address from "components/Address/Address";

export default function Dashboard(props) {
  const { account, isAuthenticated, Moralis, chainid } = useMoralis();
  const [ip, setIp] = useState();
  const [price, setPrice] = useState();
  const { contractName, networks, abi } = DNS[chainId];
  const contractAddress = useMemo(() => networks['1'].address, [networks]);
  const [domain, setDomain] = useState(window.landed);
  const [name, setName] = useState();
  const [item, setItem] = useState();
  const [loading, setLoading] = useState();
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [count, setCount] = useState([]);
  const [owned, setOwned] = useState([]);
  let refresh = useCallback(()=>{(async ()=>{
      if(isAuthenticated && account) {
        setLoading(true);
        const ret = await Moralis.executeFunction({
          contractAddress,
          functionName: 'balanceOf',
          params: {owner: account},
          abi
        });
        setCount(ret);
        console.log({ret})
      }
  })()}, [Moralis, abi, account, contractAddress, isAuthenticated]);
  useEffect(()=>{(async () => {
    const own = [];
    for(let index = 0; index < count; index++) {
      const id = await Moralis.executeFunction({
        contractAddress,
        functionName: 'tokenOfOwnerByIndex',
        params: {owner: account, index},
        abi
      });
      console.log('found id, loading', id);
      if(!own[index]) own[index] = '!loading';
      const domain = await Moralis.executeFunction({
        contractAddress,
        functionName: 'getName',
        params: {tokenId:id},
        abi
      });
      console.log('loaded');
      own[index] = {id,domain};
      console.log({own});
      setOwned(Object.assign({},own));
    }
    setLoading(false);
  })()}, [count, Moralis, abi, account, contractAddress])
  useEffect(() => {
    Moralis.enableWeb3().then(refresh)
  }, [account, isAuthenticated, refresh, Moralis]);

  const claim = async (name)=>{
      setLoading(true);
      await Moralis.executeFunction({
        contractAddress,
        functionName: 'mintToken',
        abi,
        params:{name},
      });
      refresh();
      setLoading(false);
  }
  const sell = async ()=>{
    const _price = parseInt(price * 1000000000000000000).toString();
    
    setLoading(true);
     await Moralis.executeFunction({
        contractAddress,
        functionName: 'openTrade',
        abi,
        params:{_item:item, _price},
      });
      refresh();
      setIsPriceModalVisible(false);
      setLoading(false);
  }
  const edit = async ()=>{
      setLoading(true);
      await Moralis.executeFunction({
        contractAddress,
        functionName: 'setAddress',
        abi,
        params:{_name:name, _address:ip},
      })
      setIsEditModalVisible(false);
      setLoading(false);
  }

  const mapper = (k, key) => {
    const {domain} = owned[k];
    return domain !== 
    '!loading'?<Card key={owned[k].id}>
          <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25" }}>
            <div style={{width:"100%"}}>{domain}</div>
            <Button type="primary" onClick={()=>{setIsEditModalVisible(true); setName(domain)}} htmlType="submit">
              Edit
            </Button>
            <Button type="secondary" onClick={()=>{setIsPriceModalVisible(true); setItem(k)}} htmlType="submit">
              Sell
            </Button>
          </div>
    </Card>:<Card key={key}><Button type="primary" loading={true}>
            Loading domain...
          </Button></Card>
  }

  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Contract: {contractName}
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
        <Form layout="vertical" onSubmit={()=>{claim(domain)}} name="Claim domain">
          <Form.Item
            label="Claim domain"
            required
            style={{ marginBottom: "15px" }}
            key="claim"
          >
            <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25" }}>
            <Input value={domain} onChange={(e)=>{setDomain(e.target.value)}} placeholder="input placeholder" />
            <Button type={loading?'secondary':'primary'} disabled={loading} onClick={()=>{claim(domain)}} htmlType="submit">
              Claim
            </Button>
            </div>
          </Form.Item>
        </Form>
      <Modal title="Sell" visible={isPriceModalVisible} disabled={loading} onOk={()=>{if(!loading) sell()}} onCancel={()=>{setIsPriceModalVisible(false)}}>
            {loading?<Spin />:<Input value={price} onChange={(e)=>{setPrice(e.target.value)}} placeholder="input placeholder" />}
      </Modal>
      <Modal title="Edit" visible={isEditModalVisible} disabled={loading} onOk={()=>{if(!loading) edit()}} onCancel={()=>{setIsEditModalVisible(false)}}>
            {loading?<Spin />:<Input value={ip} onChange={(e)=>{setIp(e.target.value)}} placeholder="input placeholder" />}
      </Modal>
        {loading?<Spin />:null}
        {Object.keys(owned).map(mapper)}
      </Card>
    </div>
  );
}
