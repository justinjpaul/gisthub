import GroupContainer from "../../shared/container/GroupContainer";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import PageLayout from "../../shared/PageLayout";

export default function Home() {
  const name = "hardcoded home";

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

  return PageLayout({
    header: name,
    content: <GroupContainer name="Groups" groups={groups} />,
  });
}
