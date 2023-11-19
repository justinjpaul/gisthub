// CardComponent.js
import React from "react";
import { Card, Badge, Button } from "antd";
import {
  RightOutlined,
  WarningOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import styles from "./card.module.css";

const ProperIcon = ({ did_contribute }) => {
  console.log(did_contribute);
  if (did_contribute === false) {
    return <WarningOutlined />;
  } else {
    return <CheckSquareOutlined />;
  }
};

const correctColor = ({ did_contribute }) => {
  console.log(did_contribute);
  if (did_contribute === false) {
    return "orange";
  } else {
    return "green";
  }
};

const CardComponent = ({
  name,
  body,
  highlight,
  color,
  href,
  did_contribute,
}) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  const cardClass = `${styles["card"]} ${href && styles["clickable-card"]}`;
  console.log(name, did_contribute);
  return highlight ? (
    <Badge.Ribbon
      text={<ProperIcon did_contribute={did_contribute} />}
      color={correctColor({ did_contribute })}
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
