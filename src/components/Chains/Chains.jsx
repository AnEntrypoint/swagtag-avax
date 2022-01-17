import { useEffect, useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { AvaxLogo } from "./Logos";
import { useChain } from "react-moralis";
import { Redirect  } from "react-router-dom";
const styles = {
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontSize: "14px",
    padding: "0 10px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
  },
};

const menuItems = [
  {
    key: "0xa86a",
    value: "Avalanche",
    icon: <AvaxLogo />,
  },
  {
    key: "0xa869",
    value: "Avalanche Testnet",
    icon: <AvaxLogo />,
  },
];

function Chains() {
  const { switchNetwork, chainId } = useChain();
  const [selected, setSelected] = useState({});
  const [redirect, setRedirect] = useState(null);
  useEffect(() => {
    if (!chainId) return null;
    const newSelected = menuItems.find((item) => item.key === chainId);
    setSelected(newSelected);
  }, [chainId]);

  const handleMenuClick = async (e) => {
    console.log("switch to: ", e.key);
    
    console.log('redirect set');
    await switchNetwork(e.key);
    if(e.key == '0xa869' && !window.location.toString().includes('fuji')) window.location = 'https://www.fuji.avax.ga/dashboard.html';
    if(e.key == '0xa86a' && window.location.toString().includes('fuji')) window.location = 'https://www.avax.ga/dashboard.html';
    setRedirect('/dashboard');
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon} style={styles.item}>
          <span style={{ marginLeft: "5px" }}>{item.value}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
  
  return (
    (
      <div>
        {redirect?<Redirect to={redirect}/>:null}
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button key={selected?.key} icon={selected?.icon} style={{ ...styles.button, ...styles.item }}>
            <span style={{ marginLeft: "5px" }}>{selected?.value||'Please select'}</span>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    )
  );
}

export default Chains;
