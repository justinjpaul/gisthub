import { useEffect, useState } from "react";
import CardComponent from "../../shared/container/CardComponent";
import { Modal, Button, Flex, Typography } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

import styles from "./event.module.css";
import "github-markdown-css"; // Add GitHub Markdown styles
import { FileView } from "../../shared/fileview/FileView";

import DetailsContainer from "../../shared/container/DetailsContainer";

export default function Details(id) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = (filename) => {
    setSelectedFile(filename);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const { Text } = Typography;

  const studentNotes = [
    { name: "justin's", filename: "/sample1.txt" },
    { name: "joseph's", filename: "/sample2.txt" },
    { name: "jist's", filename: "/sample.md" },
  ];

  const formatStudentNotes = () => {};

  const filename = "";
  const fileContent = "";
  return (
    <>
      <Text className={styles["date-component"]}>The Details</Text>
      <DetailsContainer notes={studentNotes} />
      {isModalVisible && (
        <Modal
          title="Gist Viewer"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width="80vw"
        >
          <div className="markdown-content-modal">
            <CardComponent body={FileView(filename, fileContent)} />
          </div>
        </Modal>
      )}
    </>
  );
}
