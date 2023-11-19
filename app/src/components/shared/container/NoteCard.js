import React, { useState } from "react";
import { Card, Badge, Button, Modal } from "antd";
import styles from "./card.module.css";
import { FileView, useGetFileContent } from "../fileview/FileView";

export const NoteCard = ({ name, filename }) => {
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

  return (
    <>
      <Card className={styles["card"]} onClick={handleModalOpen}>
        <Card.Meta title={name} />
      </Card>
      {isModalVisible && (
        <Modal
          title={`${name} notes`}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width="80vw"
        >
          <div className="markdown-content-modal">
            <FileView filename={filename} />
          </div>
        </Modal>
      )}
    </>
  );
};
