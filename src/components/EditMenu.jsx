//import useStateWithCallback from "hooks/useStateCallback.js";
import { Modal, Input, Tabs } from "antd";
import React, { useEffect, useState, useCallback } from "react";



const { TabPane } = Tabs;
const tester =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Shows a edit menu for a swagtag NFT
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function EditMenu(props) {
  const { setIp } = props;
  const [ip1, setIp1] = useState(props.config.ips[0]);
  const [ip2, setIp2] = useState(props.config.ips[1]);
  const [ip3, setIp3] = useState(props.config.ips[2]);
  const [ip4, setIp4] = useState(props.config.ips[3]);

  const [cname, setCname] = useState(props.config.cname);

  const [title, setTitle] = useState(props.config.title);
  const [discord, setDiscord] = useState(props.config.discord);
  const [telegram, setTelegram] = useState(props.config.telegram);
  const [twitter, setTwitter] = useState(props.config.twitter);
  const [description, setDescription] = useState(props.config.description);
  const [image, setImage] = useState(props.config.image);
  const [ddns, setDdns] = useState(props.config.ddns);
  const [tunnel, setTunnel] = useState(props.config.tunnel);
  const [mode, setMode] = useState("a");
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(true);

  const buildIp = useCallback(() => {
    if (!title || !title.length) throw new Error("name is required");
    if (!description || !description.length) throw new Error("description is required");
    if (!ip1) throw new Error("has to have at least one ip");
    if (ip1 && !tester.test(ip1)) throw new Error("ip invalid");
    if (ip2 && !tester.test(ip2)) throw new Error("second ip invalid");
    if (ip3 && !tester.test(ip3)) throw new Error("third ip invalid");
    if (ip4 && !tester.test(ip4)) throw new Error("fourth ip invalid");
    const ips = [];
    ips.push(ip1);
    if (ip2) ips.push(ip2);
    if (ip3) ips.push(ip3);
    if (ip4) ips.push(ip4);
    return { title, description, image, ips, mode };
  }, [description, image, ip1, ip2, ip3, ip4, mode, title, discord, telegram, twitter]);

  const buildIpFromCname = useCallback(
    (state) => {
      if (!cname) throw new Error("has to have a cname");
      const out = buildIp();
      out.cname = cname;
      out.mode = "cname";
      return out;
    },
    [cname, buildIp]
  );

  const updateCNAME = () => {
    if (mode !== "cname") return;
    try {
      setIp(buildIpFromCname());
      setDisabled(false);
      setError("");
    } catch (e) {
      setError(e.message);
      setDisabled(true);
    }
  };
  const updateA = () => {
    if (mode !== "a") return;
    try {
      const out = buildIp();
      setIp(out);
      setDisabled(false);
      setError("");
    } catch (e) {
      setError(e.message);
      setDisabled(true);
    }
  };
  const updateDDNS = () => {
    console.log("update", mode);
    if (mode !== "ddns") return;
    console.log("ddns mode");
    try {
      if (ddns.length !== 57) throw new Error("invalid public key");
      setIp({ title, description, image, ddns, mode, discord, telegram, twitter });
      setDisabled(false);
      setError("");
    } catch (e) {
      setError(e.message);
      setDisabled(true);
    }
  };
  const updateTunnel = () => {
    if (mode !== "tunnel") return;
    try {
      if (tunnel.length !== 52) throw new Error("invalid public key");
      setIp({ title, description, image, tunnel, mode, discord, telegram, twitter });
      setDisabled(false);
      setError("");
    } catch (e) {
      setError(e.message);
      setDisabled(true);
    }
  };
  useEffect(updateDDNS, [ddns, description, image, mode, setIp, title, discord, telegram, twitter]);
  useEffect(updateCNAME, [description, image, mode, buildIpFromCname, setIp, discord, telegram, twitter]);
  useEffect(updateTunnel, [description, image, mode, setIp, title, tunnel, discord, telegram, twitter]);
  useEffect(updateA, [buildIp, setDisabled, setError, setIp, mode, discord, telegram, twitter, title, image, description]);

  return (
    <Modal
      title="Edit"
      visible={props.visible}
      okButtonProps={{ disabled: props.pending || disabled }}
      onOk={props.edit}
      onCancel={props.close}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="name"
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
      />
      <Input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="image url"
      />
      <Input
        value={discord}
        onChange={(e) => setDiscord(e.target.value)}
        placeholder="discord"
      />
      <Input
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        placeholder="telegram"
      />
      <Input
        value={twitter}
        onChange={(e) => setTwitter(e.target.value)}
        placeholder="twitter"
      />
      <Tabs centered defaultActiveKey={mode} onTabClick={(t) => setMode(t)}>
        <TabPane tab="a" key="a">
          <Input
            value={ip1}
            onChange={(e) => setIp1(e.target.value)}
            placeholder="ip address"
          />
          <Input
            value={ip2}
            onChange={(e) => setIp2(e.target.value)}
            placeholder="ip address"
          />
          <Input
            value={ip3}
            onChange={(e) => setIp3(e.target.value)}
            placeholder="ip address"
          />
          <Input
            value={ip4}
            onChange={(e) => setIp4(e.target.value)}
            placeholder="ip address"
          />
        </TabPane>
        <TabPane tab="cname" key="cname" onClick={() => setMode("cname")}>
          <Input
            value={cname}
            onChange={(e) => setCname(e.target.value)}
            placeholder="cname"
          />
          <Input
            value={ip1}
            onChange={(e) => setIp1(e.target.value)}
            placeholder="ip address"
          />
          <Input
            value={ip2}
            onChange={(e) => setIp2(e.target.value)}
            placeholder="ip address"
          />
          <Input
            value={ip3}
            onChange={(e) => setIp3(e.target.value)}
            placeholder="ip address"
          />
          <Input
            value={ip4}
            onChange={(e) => setIp4(e.target.value)}
            placeholder="ip address"
          />
        </TabPane>
        <TabPane tab="ddns" onClick={() => setMode("ddns")} key="ddns">
          <Input
            value={ddns}
            onChange={(e) => setDdns(e.target.value)}
            placeholder="ddns key"
          />
        </TabPane>
        <TabPane tab="tunnel" onClick={() => setMode("tunnel")} key="tunnel">
          <Input
            value={tunnel}
            onChange={(e) => setTunnel(e.target.value)}
            placeholder="tunnel key"
          />
        </TabPane>
      </Tabs>

      <div style={{textAlign:'center'}}>{error?.toString()}</div>
    </Modal>
  );
}

export default EditMenu;
