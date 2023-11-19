import { Flex, Space, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import styles from "./event.module.css";
import { formatDate } from "../../shared/utils";

export const DateComponent = ({ name, date }) => {
  const { Text } = Typography;

  console.log(date);
  return (
    date && (
      <Flex className={styles["date-component"]} justify="space-between">
        <Text className={styles["date-component"]}>{name}</Text>
        <Space align="center" size={16}>
          <CalendarOutlined />
          <Text className={styles["date-component"]}>{formatDate(date)}</Text>
        </Space>
      </Flex>
    )
  );
};
