import { useParams } from "react-router-dom";

import styles from "./group.module.css";
import pageStyles from "../../shared/pages.module.css";

import { Divider } from "antd";
import Background from "../../shared/background/Background";
import EventContainer from "../../shared/container/EventContainer";
import { useEffect, useState } from "react";
import { isHappening, hasPast, inFuture } from "../../shared/utils";

export default function Group() {
  const { id } = useParams();
  const name = "hardcoded";
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents([
      {
        name: "Lecture 20",
        start_time: new Date().getTime() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        end_time: new Date().getTime() - 29 * 24 * 60 * 60 * 1000,
        contributed: true,
        id: 1,
      }, // Not live
      {
        name: "Lecture 21",
        start_time: new Date().getTime() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        end_time: new Date().getTime() - 1 * 24 * 60 * 60 * 1000,
        contributed: false,
        id: 2,
      }, // not live
      {
        name: "Lecture 22",
        start_time: new Date().getTime() - 2 * 60 * 1000, // 2 min ago
        end_time: new Date().getTime() + 5 * 60 * 1000,
        contributed: true,
        id: 3,
      }, // live
      {
        name: "Lecture 23",
        start_time: new Date().getTime() + 5 * 60 * 1000, // in 5 min
        end_time: new Date().getTime() + 15 * 60 * 1000,
        contributed: false,
        id: 4,
      }, // not live
    ]);
  }, []);

  const getCurrent = () => {
    return events
      .filter((x) => isHappening(x.start_time, x.end_time))
      .map((x) => ({
        ...{ ...x, ...{ href: `/event/${x.id}`, buttonText: "contribute" } },
      }));
  };
  const getPast = () => {
    return events
      .filter((x) => hasPast(x.end_time))
      .map((x) => ({
        ...{
          ...x,
          ...{
            href: `/event/${x.id}`,
            buttonText: x.contributed ? "contributed" : "missing contribution",
          },
        },
      }));
  };
  const getFuture = () => {
    return events
      .filter((x) => inFuture(x.start_time, x.end_time))
      .map((x) => ({
        ...{ ...x, ...{ href: `/event/${x.id}`, buttonText: "view" } },
      }));
  };

  return (
    <>
      <Background />

      <div className={pageStyles["page-container"]}>
        {/* insert typing animation later */}
        <h1 className={styles["name"]}>{name} </h1>
        <Divider />
        <EventContainer name="Happening Now" events={getCurrent()} />
        <Divider />
        <EventContainer name="Past Events" events={getPast()} />
        <Divider />
        <EventContainer name="Upcoming Events" events={getFuture()} />
      </div>
    </>
  );
}
