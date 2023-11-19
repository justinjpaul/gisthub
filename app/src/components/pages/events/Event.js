import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import pageStyles from "../../shared/pages.module.css";

import Background from "../../shared/background/Background";
import { Layout, Divider } from "antd";
import { DateComponent } from "./DateComponent";
import GistComponent from "./GistComponent";
import Details from "./Details";
import { fetchHelper } from "../../shared/utils";

export default function Event() {
  const { id } = useParams();

  const { Header, Content } = Layout;

  const [eventData, setEventData] = useState({});

  useEffect(() => {
    console.log("id", id);
    if (id === undefined) {
      return;
    }

    const getEventsHelper = async () => {
      fetchHelper({
        url: `http://localhost:5050/api/v1/events/${id}`,
      })
        .then((x) => {
          setEventData(x);
          console.log(x);
        })
        .catch(() => {
          console.log("no access page");
        });
    };
    getEventsHelper();

    // setEventData({
    //   name: "Lecture 20",
    //   group: "EECS 280 hardcoded",
    //   start_time: new Date().getTime() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    //   end_time: new Date().getTime() - 29 * 24 * 60 * 60 * 1000,
    //   contributed: true,
    //   id: 1,
    // });
  }, [id]);

  return (
    <>
      <Background />

      <Layout className={pageStyles["page-container"]}>
        <Header className={pageStyles["page-header"]}>{eventData.name}</Header>
        <Content>
          <DateComponent name={"hardcode"} date={eventData.start} />
          {eventData.gists !== undefined && (
            <>
              <Divider />
              <GistComponent gists={eventData.gists} />
            </>
          )}
          <Divider />
          <Details id={id} />
        </Content>
      </Layout>
    </>
  );
}
