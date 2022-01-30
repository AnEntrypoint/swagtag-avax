import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useMoralis } from "react-moralis";

function MenuItems() {
  const { isAuthenticated, chainId} = useMoralis();
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        background: "#ebf8ff",
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/home">
        <a href="https://www.avax.ga">home</a>
      </Menu.Item>
      {isAuthenticated&&(chainId==='0xa869'||chainId==='0xa86a')?(<Menu.Item key="/nft">
        <NavLink to="/nft">swagtags</NavLink>
      </Menu.Item>):null}
      {isAuthenticated&&(chainId==='0xa869'||chainId==='0xa86a')?(<Menu.Item key="/market">
        <NavLink to="/market">market</NavLink>
      </Menu.Item>):null}
      {!isAuthenticated||(chainId!=='0xa869'&&chainId!=='0xa86a')?(<Menu.Item key="/welcome">
        <NavLink to="/welcome">welcome</NavLink>
      </Menu.Item>):null}
    </Menu>
  );
}

export default MenuItems;
