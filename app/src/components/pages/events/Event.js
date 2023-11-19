import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import pageStyles from "../../shared/pages.module.css";

import Background from "../../shared/background/Background";
import { Layout, Divider } from "antd";
import { DateComponent } from "./DateComponent";
import GistComponent from "./GistComponent";
import Details from "./Details";

export default function Event() {
  const { id } = useParams();

  const { Header, Content } = Layout;

  const [eventData, setEventData] = useState({});

  useEffect(() => {
    setEventData({
      name: "Lecture 20",
      group: "EECS 280 hardcoded",
      start_time: new Date().getTime() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      end_time: new Date().getTime() - 29 * 24 * 60 * 60 * 1000,
      contributed: true,
      id: 1,
    });
  }, []);

  return (
    <>
      <Background />

      <Layout className={pageStyles["page-container"]}>
        <Header className={pageStyles["page-header"]}>{eventData.name}</Header>
        <Content>
          <DateComponent name={eventData.group} date={eventData.start_time} />
          <Divider />
          <GistComponent id={eventData.id} />
          <Divider />
          <Details id={eventData.id} />
        </Content>
      </Layout>
    </>
  );
}
