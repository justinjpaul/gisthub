import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Flex,
  Space,
  Tabs,
  Collapse,
} from "antd";
import styles from "./card.module.css";
import { FileView } from "../fileview/FileView";
import { DownloadOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import CardComponent from "./CardComponent";
import { formatDate } from "../utils";

// to-do add relevancy score
export const GistCard = ({ name, gists, relevancyScore }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const getFilename = () => {
    return gists[activeTab].blob_key;
  };
  const getDate = () => {
    console.log("get date", gists[activeTab]);
    return gists[activeTab].timestamp;
  };
  const handleDownload = () => {
    window.open(getFilename(), "_blank");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const cardClass = `${styles["clickable-card"]} ${styles["large-card"]}`;

  const { TabPane } = Tabs;
  return (
    <>
      <Card className={cardClass}>
        <p>{formatDate(getDate())}</p>
        <Tabs type="card" activeKey={activeTab} onChange={handleTabChange}>
          {gists.map((item, index) => (
            <TabPane tab={index + 1} key={index}>
              <Card className={cardClass} onClick={handleModalOpen}>
                <Card.Meta
                  title={name}
                  description={<FileView filename={getFilename()} />}
                />
              </Card>
            </TabPane>
          ))}
        </Tabs>
      </Card>

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
          <CardComponent body={<FileView filename={getFilename()} />} />
        </Modal>
      )}
    </>
  );
};
