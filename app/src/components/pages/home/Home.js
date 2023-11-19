import styles from "./home.module.css";
import pageStyles from "../../shared/pages.module.css";

import Background from "../../shared/background/Background";
import GroupContainer from "../../shared/container/GroupContainer";
import { useEffect, useState } from "react";

export default function Home() {
  const name = "hardcoded";

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

      <div className={pageStyles["page-container"]}>
        {/* insert typing animation later */}
        <h1 className={styles["name"]}>Hi {name} </h1>
        <br />
        <br />
        <GroupContainer name="Groups" groups={groups} />
      </div>
    </>
  );
}
