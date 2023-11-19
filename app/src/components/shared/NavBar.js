import { Layout, Button } from "antd";
import pageStyles from "./pages.module.css";

export default function NavBar({ props }) {
  const { Header } = Layout;

  const elements = [
    { label: "home", to: "/" },
    { label: "groupName", to: "/group/id" },
    { label: "eventName", to: "/event/id" },
  ];

  return (
    <Header className={pageStyles["page-header"]}>
      <Button
        size="large"
        type="primary"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        GistHub
      </Button>
    </Header>
  );
}
