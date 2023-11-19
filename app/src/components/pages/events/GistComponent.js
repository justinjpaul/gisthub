import { useEffect, useState } from "react";

import CardComponent from "../../shared/container/CardComponent";
import { Modal, Button, Space, Flex, Typography } from "antd";
import { FullscreenOutlined, DownloadOutlined } from "@ant-design/icons";

import styles from "./event.module.css";

import { useGetFileContent, FileView } from "../../shared/fileview/FileView";

export default function GistComponent(id) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Text } = Typography;
  const filename = "/sample.md";

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };
  const handleDownload = () => {
    console.log("implement download later");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Flex justify="space-between">
        <Text className={styles["date-component"]}>The GIST</Text>
        <Space size="small">
          <Button type="primary" onClick={handleDownload}>
            <DownloadOutlined />
          </Button>
          <Button type="primary" onClick={handleModalOpen}>
            <FullscreenOutlined />
          </Button>
        </Space>
      </Flex>
      <div className={styles["gist"]}>
        <CardComponent body={<FileView filename={filename} />} />
      </div>
      {isModalVisible && (
        <Modal
          title="Gist Viewer"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width="80vw"
        >
          <div className="markdown-content-modal">
            <CardComponent body={<FileView filename={filename} />} />
          </div>
        </Modal>
      )}
    </>
  );
}
