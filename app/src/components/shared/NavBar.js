import { Layout, Menu, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
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
      <Breadcrumb>
        {elements.map((x, ind) => (
          <Breadcrumb.Item key={ind}>
            <Link to={x.to}>{x.label}</Link>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </Header>
  );
}
