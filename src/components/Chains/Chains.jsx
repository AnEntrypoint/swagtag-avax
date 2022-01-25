import { useEffect, useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { AvaxLogo } from "./Logos";
import { useChain } from "react-moralis";
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

const networks = {
  mainnet: [
    {
      key: "0xa86a",
      value: "Avalanche",
      icon: <AvaxLogo />,
    },
  ],
  testnet: [
    {
      key: "0xa869",
      value: "Avalanche Testnet",
      icon: <AvaxLogo />,
    },
  ],
};

function Chains(props) {
  const { switchNetwork, chainId } = useChain();
  const [selected, setSelected] = useState({});
  const menuItems = [];
  if (!props.net) {
    if (chainId === "0xa869" && !window.location.toString().includes("fuji"))
      window.location =
        "https://www.fujiavax.ga/dashboard.html" + window.location.hash;
    if (chainId === "0xa86a" && window.location.toString().includes("fuji"))
      window.location =
        "https://www.avax.ga/dashboard.html" + window.location.hash;
    for(let net of networks.testnet) menuItems.push(net);
    for(let net of networks.mainnet) menuItems.push(net);
  } else {
    if(props.net === 'testnet') for(let net of networks.testnet) menuItems.push(net);
    if(props.net === 'mainnet') for(let net of networks.mainnet) menuItems.push(net);
  }
  const newSelected = menuItems.find((item) => item.key === chainId);
  useEffect(() => {
    if (!chainId) return null;
    if(newSelected !== selected) setSelected(newSelected);
  }, [chainId, newSelected, selected]);

  const handleMenuClick = async (e) => {
    console.log("switch to: ", e.key);

    await switchNetwork(e.key);
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
    <div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          key={selected?.key}
          icon={selected?.icon}
          style={{ ...styles.button, ...styles.item }}
        >
          <span style={{ marginLeft: "5px" }}>
            {selected?.value || "Please select"}
          </span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
}

export default Chains;
