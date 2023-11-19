import "../../../../node_modules/antd/dist/reset.css";
import styles from "./container.module.css";
import { Layout, Row, Col } from "antd";
import { NoteCard } from "./NoteCard";

export default function DetailsContainer({ name, notes }) {
  const { Header, Content } = Layout;

  return (
    <Layout className={styles["group-container"]}>
      {/* <Header className={styles["group-header"]}>{name}</Header> */}
      <Content style={{ padding: "24px" }}>
        <Row gutter={[16, 16]}>
          {notes.map((card, index) => {
            console.log(card);
            return (
              <Col key={index} span={8}>
                <NoteCard name={card.author_name} filename={card.object_key} />
              </Col>
            );
          })}
        </Row>
      </Content>
    </Layout>
  );
}
