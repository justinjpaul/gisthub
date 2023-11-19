import pageStyles from "../../shared/pages.module.css";

import Background from "../../shared/background/Background";
import GroupContainer from "../../shared/container/GroupContainer";
import { useEffect, useState } from "react";
import { Layout } from "antd";

export default function Home() {
  const name = "hardcoded";

  const { Header, Content } = Layout;
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setGroups([
      {
        name: "eecs 388",
        body: "388 info",
        highlight: "live",
        href: "/group/eecs388/",
        buttonText: "",
      },
      {
        name: "eecs 280",

        href: "/group/eecs280/",
        highlight: null,
      },
      { name: "eecs 281", highlight: "live" },
      { name: "eecs 482", body: "482 info", highlight: null },
      { name: "eecs 485", body: "485 info", highlight: "live" },
    ]);
  }, []);

  return (
    <>
      <Background />

      <Layout className={pageStyles["page-container"]}>
        <Header className={pageStyles["page-header"]}>{name}</Header>
        <Content>
          <GroupContainer name="Groups" groups={groups} />
        </Content>
      </Layout>
    </>
  );
}
