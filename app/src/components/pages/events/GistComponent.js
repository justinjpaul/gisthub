import { Typography } from "antd";

import styles from "./event.module.css";
import { GistCard } from "../../shared/container/GistCard";

export default function GistComponent({ gists }) {
  console.log(gists);
  const { Text } = Typography;

  return (
    <>
      <Text className={styles["date-component"]}>The GIST</Text>
      {gists !== undefined && (
        <GistCard name="GIST" gists={gists.sort((x) => -x.timestamp)} />
      )}
    </>
  );
}
