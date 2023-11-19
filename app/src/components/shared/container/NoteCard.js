import React, { useState } from "react";
import {
  Card,
  Badge,
  Button,
  Modal,
  Flex,
  Space,
  Divider,
  Collapse,
  Panel,
} from "antd";
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
    window.open(filename, "_blank");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const cardClass = `${styles["clickable-card"]} ${
    showFile && styles["large-card"]
  }`;

  const correctText = () => {
    if (relevancyScore > 0.7) {
      return "Great!";
    }
    if (relevancyScore > 0.4) {
      return "Mid";
    }
    return "Needs Work";
  };

  const correctColor = () => {
    if (relevancyScore > 0.7) {
      return "green";
    }
    if (relevancyScore > 0.4) {
      return "yellow";
    }
    return "red";
  };

  console.log(relevancyScore);

  return (
    <>
      {relevancyScore !== undefined && relevancyScore !== null ? (
        <Badge.Ribbon
          text={correctText()}
          color={correctColor()}
          placement="end"
        >
          <Card className={cardClass} onClick={handleModalOpen}>
            <Card.Meta title={name} />
          </Card>
        </Badge.Ribbon>
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
