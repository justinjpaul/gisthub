import React from "react";
import Background from "./background/Background";
import pageStyles from "./pages.module.css";

import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Breadcrumb } from "antd";
import NavBar from "./NavBar";

export default function PageLayout({
  header,
  content,
  showSider = false,
  typeHeader = true,
}) {
  const { Header, Content, Sider } = Layout;

  const items1 = ["1", "2", "3"].map((key) => ({
    key,
    label: `nav ${key}`,
  }));
  const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
      const key = String(index + 1);
      return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,
        children: new Array(4).fill(null).map((_, j) => {
          const subKey = index * 4 + j + 1;
          return {
            key: subKey,
            label: `option${subKey}`,
          };
        }),
      };
    }
  );
  return (
    <>
      <Background />

      <Layout className={pageStyles["page-container"]}>
        <NavBar />
        <Layout className={pageStyles["page-container"]}>
          {showSider && (
            <Sider width={200} collapsible theme="dark">
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                //   style={{
                //     height: "100%",
                //   }}
                items={items2}
              />
            </Sider>
          )}

          {content && (
            <Layout className={pageStyles["page-container-80"]}>
              {header && (
                <Header
                  className={`${pageStyles["page-header"]} ${pageStyles["typing-effect"]}`}
                >
                  {header}
                </Header>
              )}
              <Content>{content}</Content>
            </Layout>
          )}
        </Layout>
      </Layout>
    </>
  );
}
