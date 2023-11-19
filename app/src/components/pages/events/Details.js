import { Typography } from "antd";
import styles from "./event.module.css";
import DetailsContainer from "../../shared/container/DetailsContainer";

export default function Details(id) {
  const { Text } = Typography;

  const studentNotes = [
    { name: "justin's", filename: "/sample1.txt" },
    { name: "joseph's", filename: "/sample2.txt" },
    { name: "jist's", filename: "/sample.md" },
  ];

  return (
    <>
      <Text className={styles["date-component"]}>The Details</Text>
      <DetailsContainer notes={studentNotes} />
    </>
  );
}
