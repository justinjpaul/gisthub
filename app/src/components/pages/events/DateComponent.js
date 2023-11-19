import { Flex, Space, Button, Upload, Typography, message } from "antd";
import { CalendarOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./event.module.css";
import { formatDate } from "../../shared/utils";

const MyUploadButton = ({ id }) => {
  const props = {
    action: `http://localhost:5050/api/v1/events/${id}/notes`, // Replace with your file upload endpoint
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    withCredentials: true,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Add Note</Button>
    </Upload>
  );
};

export const DateComponent = ({ id, date1, date2 }) => {
  const { Text } = Typography;
  return (
    <Flex className={styles["date-component"]} justify="space-between">
      {/* <Text className={styles["date-component"]}>{name}</Text> */}
      <MyUploadButton id={id} />

      <Space align="center" size={16}>
        <CalendarOutlined />
        {date1 && (
          <>
            <Text className={styles["date-component"]}>
              {formatDate(date1)}
            </Text>
            <Text className={styles["date-component"]}> - </Text>
          </>
        )}

        {date2 && (
          <Text className={styles["date-component"]}>{formatDate(date2)}</Text>
        )}
      </Space>
    </Flex>
  );
};
