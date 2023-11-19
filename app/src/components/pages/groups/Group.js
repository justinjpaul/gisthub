import { useParams } from "react-router-dom";
import EventContainer from "../../shared/container/EventContainer";
import { useEffect, useState } from "react";
import {
  isHappening,
  hasPast,
  inFuture,
  fetchHelper,
} from "../../shared/utils";
import { Divider, Button, Modal } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import PageLayout from "../../shared/PageLayout";
import EventForm from "./EventForm";

export default function Group() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [group, setGroup] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
    const getGroupHelper = async () => {
      fetchHelper({
        url: `http://localhost:5050/api/v1/groups/${id}`,
      })
        .then((x) => {
          console.log(x);
          setGroup(x);
        })
        .catch(() => {
          console.log("no access page");
        });
    };
    getEventsHelper();
    getGroupHelper();
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

  return PageLayout({
    header: group.name !== undefined ? group.name : "",
    content: (
      <>
        <div>
          <Button type="primary" onClick={showModal}>
            Add Event <FileAddOutlined />
          </Button>
          <Modal
            // title="My Modal"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <EventForm id={id} />
          </Modal>
        </div>
        <Divider />
        <EventContainer name="Happening Now" events={getCurrent()} />
        <Divider />
        <EventContainer name="Past Events" events={getPast()} />
        <Divider />
        <EventContainer name="Upcoming Events" events={getFuture()} />
      </>
    ),
  });
}
