// CardComponent.js
import React from "react";
import { Card, Badge, Button } from "antd";
import {
  RightOutlined,
  WarningOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import styles from "./card.module.css";

const ProperIcon = ({ text }) => {
  if (text === "missing contribution") {
    return <WarningOutlined style={{ color: "orange" }} />;
  } else if (text === "contributed") {
    return <CheckSquareOutlined style={{ color: "green" }} />;
  }

  return <RightOutlined />;
};

const CardComponent = ({ name, body, highlight, color, href, buttonText }) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  const cardClass = `${styles["card"]} ${href && styles["clickable-card"]}`;
  console.log(name, href, cardClass);

  return highlight ? (
    <Badge.Ribbon
      // className={styles["ribbon"]}
      text={highlight}
      color={color}
      placement="end"
    >
      <Card className={cardClass} onClick={handleClick}>
        <Card.Meta title={name} description={body} />
      </Card>
    </Badge.Ribbon>
  ) : (
    <Card className={cardClass} onClick={handleClick}>
      <Card.Meta title={name} description={body} />
    </Card>
  );
};

export default CardComponent;
