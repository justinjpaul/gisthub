import { Typography } from "antd";

import styles from "./event.module.css";
import { NoteCard } from "../../shared/container/NoteCard";

export default function GistComponent({ gists }) {
  console.log(gists);
  const { Text } = Typography;

  return (
    <>
      <Text className={styles["date-component"]}>The GIST</Text>
      {gists[0] !== undefined && (
        <NoteCard name="GIST" filename={gists[0].blob_key} showFile={true} />
      )}
    </>
  );
}
