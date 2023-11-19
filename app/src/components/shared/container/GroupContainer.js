import CardComponent from "./CardComponent";
import "../../../../node_modules/antd/dist/reset.css";
import styles from "./container.module.css";
import { Layout, Row, Col } from "antd";

export default function GroupContainer({ name, groups }) {
  const { Header, Content } = Layout;
  console.log(groups);
  return (
    <Layout className={styles["group-container"]}>
      <Header className={styles["group-header"]}>{name}</Header>
      {groups && (
        <Content style={{ padding: "24px" }}>
          <Row gutter={[16, 16]}>
            {groups.map((card, index) => (
              <Col key={index} span={8}>
                <CardComponent {...{ ...card, ...{ color: "red" } }} />
              </Col>
            ))}
          </Row>
        </Content>
      )}
    </Layout>
  );
}
