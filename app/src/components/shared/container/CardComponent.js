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
  return highlight ? (
    <Badge.Ribbon
      // className={styles["ribbon"]}
      text={highlight}
      color={color}
      placement="end"
    >
      <Card
        className={styles["card"]}
        actions={
          href && [
            <Button
              key="button"
              type="link"
              // className={styles.button}
              href={href}
            >
              {buttonText} <ProperIcon text={buttonText} />
            </Button>,
          ]
        }
      >
        <Card.Meta title={name} description={body} />
      </Card>
    </Badge.Ribbon>
  ) : (
    <Card
      className={styles["card"]}
      actions={
        href && [
          <Button
            key="button"
            type="link"
            // className={styles.button}
            href={href}
          >
            {buttonText} <ProperIcon text={buttonText} />
          </Button>,
        ]
      }
    >
      <Card.Meta title={name} description={body} />
    </Card>
  );
};

export default CardComponent;
