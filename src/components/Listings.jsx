import { Card, Button } from "antd";
import { useMoralis } from "react-moralis";

export default function Listings(props) {
  const { Moralis } = useMoralis();

  const getList = () => {
    Moralis.Cloud.run("List", {}).then(console.log);
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
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            swagtags
          </div>
        }
        size="large"
        style={{
          width: "100%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      ><Button onClick={getList}>test</Button></Card>
    </div>
  );
}
