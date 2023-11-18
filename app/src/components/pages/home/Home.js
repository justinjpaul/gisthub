import styles from "./home.module.css";

import Background from "../../shared/background/Background";
import Popout from "../../shared/popout/Popout";
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
        href: "/event/eecs388/",
      },
      {
        name: "eecs 280",
        body: "280 info",
        href: "/event/eecs280/",
        highlight: null,
      },
      { name: "eecs 281", body: "281 info", highlight: "live" },
      { name: "eecs 482", body: "482 info", highlight: null },
      { name: "eecs 485", body: "485 info", highlight: "live" },
    ]);
  }, []);

  return (
    <>
      <Background />

      <div className={styles["container"]}>
        {/* insert typing animation later */}
        <h1 className={styles["name"]}>Hi {name} </h1>
        <br />
        <br />
        <div className={styles["group-container"]}>
          <h2 className={styles["group-header"]}>Groups</h2>
          {/* <hr /> */}
          <div className={styles["group-flex"]}>
            {groups.map((props, ind) => (
              <Popout
                key={ind}
                name={props.name}
                body={props.body}
                href={props.href}
                style={styles["group-item"]}
                highlight={props.highlight}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
