import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Layout, Divider } from "antd";
import { DateComponent } from "./DateComponent";
import GistComponent from "./GistComponent";
import Details from "./Details";
import { fetchHelper } from "../../shared/utils";
import PageLayout from "../../shared/PageLayout";

export default function Event() {
  const { id } = useParams();

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
  }, [id]);

  return PageLayout({
    header: eventData.name,
    content: (
      <>
        {id !== undefined && <DateComponent id={id} date={eventData.start} />}
        {eventData.gists !== undefined && (
          <>
            <Divider />
            <GistComponent gists={eventData.gists} />
          </>
        )}
        <Divider />
        {eventData.notes !== undefined && (
          <Details studentNotes={eventData.notes} />
        )}
      </>
    ),
  });
}
