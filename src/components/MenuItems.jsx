import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useMoralis } from "react-moralis";

function MenuItems() {
  const { isAuthenticated, chainId } = useMoralis();
  const { pathname } = useLocation();
  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      {isAuthenticated&&(chainId==='0xa869'||chainId==='0xa86a')?(<Menu.Item key="/nft">
        <NavLink to="/nft">Domains</NavLink>
      </Menu.Item>):null}
      {isAuthenticated&&(chainId==='0xa869'||chainId==='0xa86a')?(<Menu.Item key="/market">
        <NavLink to="/market">Market</NavLink>
      </Menu.Item>):null}
      {!isAuthenticated||(chainId!=='0xa869'&&chainId!=='0xa86a')?(<Menu.Item key="/welcome">
        <NavLink to="/welcome">Welcome</NavLink>
      </Menu.Item>):null}
    </Menu>
  );
}

export default MenuItems;
