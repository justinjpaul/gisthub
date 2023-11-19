import CardComponent from "./CardComponent";
import "../../../../node_modules/antd/dist/reset.css";
import styles from "./container.module.css";
import { Layout, Row, Col } from "antd";

export default function EventContainer({ name, events }) {
  const { Header, Content } = Layout;

  return (
    <Layout className={styles["group-container"]}>
      <Header className={styles["group-header"]}>{name}</Header>
      <Content style={{ padding: "24px" }}>
        <Row gutter={[16, 16]}>
          {events.map((card, index) => {
            return (
              <Col key={index} span={8}>
                <CardComponent {...card} />
              </Col>
            );
          })}
        </Row>
      </Content>
    </Layout>
  );
}
