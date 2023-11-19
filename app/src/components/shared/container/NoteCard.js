import React, { useState } from "react";
import { Card, Badge, Button, Modal, Flex, Space, Divider } from "antd";
import styles from "./card.module.css";
import { FileView } from "../fileview/FileView";
import { DownloadOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import CardComponent from "./CardComponent";

// to-do add relevancy score
export const NoteCard = ({
  name,
  filename,
  relevancyScore,
  showFile = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleDownload = () => {
    console.log("implement download later");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const cardClass = `${styles["clickable-card"]} ${
    showFile && styles["large-card"]
  }`;

  return (
    <>
      {showFile ? (
        <Card className={cardClass} onClick={handleModalOpen}>
          <CardComponent body={<FileView filename={filename} />} />
          <Card.Meta title={name} />
        </Card>
      ) : (
        <Card className={cardClass} onClick={handleModalOpen}>
          <Card.Meta title={name} />
        </Card>
      )}
      {isModalVisible && (
        <Modal
          title={
            <>
              <Flex justify="space-between">
                <div>{`${name} notes`}</div>
                <Space>
                  <Button
                    type="primary"
                    key="download"
                    onClick={handleDownload}
                  >
                    <DownloadOutlined />
                  </Button>
                  <Button type="primary" key="exit" onClick={handleModalClose}>
                    <FullscreenExitOutlined />
                  </Button>
                </Space>
              </Flex>
            </>
          }
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          closeIcon={null}
          width="80vw"
        >
          <CardComponent body={<FileView filename={filename} />} />
        </Modal>
      )}
    </>
  );
};
