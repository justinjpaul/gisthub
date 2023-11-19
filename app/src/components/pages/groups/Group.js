import { useParams } from "react-router-dom";

import styles from "./group.module.css";
import pageStyles from "../../shared/pages.module.css";

import Background from "../../shared/background/Background";
import EventContainer from "../../shared/container/EventContainer";
import { useEffect, useState } from "react";
import {
  isHappening,
  hasPast,
  inFuture,
  fetchHelper,
} from "../../shared/utils";
import { Layout, Divider } from "antd";

export default function Group() {
  const { id } = useParams();
  const name = "hardcoded group";
  const [events, setEvents] = useState([]);
  const { Header, Content } = Layout;

  useEffect(() => {
    if (id === undefined) {
      return;
    }

    const getEventsHelper = async () => {
      fetchHelper({
        url: `http://localhost:5050/api/v1/groups/${id}/events`,
      })
        .then((x) => {
          setEvents(x.events);
        })
        .catch(() => {
          console.log("no access page");
        });
    };
    getEventsHelper();
  }, [id]);

  const getCurrent = () => {
    return events
      .filter((x) => isHappening(x.start, x.end))
      .map((x) => ({
        ...{ ...x, ...{ href: `/event/${x._id}`, buttonText: "contribute" } },
      }));
  };
  const getPast = () => {
    return events
      .filter((x) => hasPast(x.end))
      .map((x) => ({
        ...{
          ...x,
          ...{
            href: `/event/${x._id}`,
            buttonText: x.did_contribute
              ? "contributed"
              : "missing contribution",
          },
        },
      }));
  };
  const getFuture = () => {
    return events
      .filter((x) => inFuture(x.start, x.end))
      .map((x) => ({
        ...{ ...x, ...{ href: `/event/${x._id}`, buttonText: "view" } },
      }));
  };

  return (
    <>
      <Background />

      <Layout className={pageStyles["page-container"]}>
        <Header className={pageStyles["page-header"]}>{name}</Header>
        <Content>
          <EventContainer name="Happening Now" events={getCurrent()} />
          <Divider />
          <EventContainer name="Past Events" events={getPast()} />
          <Divider />
          <EventContainer name="Upcoming Events" events={getFuture()} />
        </Content>
      </Layout>
    </>
  );
}
