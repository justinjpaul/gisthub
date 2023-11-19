import { Typography } from "antd";
import styles from "./event.module.css";
import DetailsContainer from "../../shared/container/DetailsContainer";

export default function Details({ studentNotes }) {
  const { Text } = Typography;

  console.log(studentNotes);
  return (
    <>
      <Text className={styles["date-component"]}>The Details</Text>
      <DetailsContainer notes={studentNotes} />
    </>
  );
}
