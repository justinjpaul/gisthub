import { Typography } from "antd";

import styles from "./event.module.css";
import { NoteCard } from "../../shared/container/NoteCard";

export default function GistComponent(id) {
  const filename = "/sample.md";
  const { Text } = Typography;

  return (
    <>
      <Text className={styles["date-component"]}>The GIST</Text>
      <NoteCard name="GIST" filename={filename} showFile={true} />
    </>
  );
}
