import GroupContainer from "../../shared/container/GroupContainer";
import { useEffect, useState } from "react";
import { Button, Modal, Divider } from "antd";
import PageLayout from "../../shared/PageLayout";
import { fetchHelper } from "../../shared/utils";
import { PlusCircleOutlined } from "@ant-design/icons";
import GroupForm from "./GroupForm";

export default function Home() {
  const [user, setUser] = useState({});

  const [groups, setGroups] = useState([]);

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
    const getGroupsHelper = async () => {
      fetchHelper({ url: "http://localhost:5050/api/v1/groups/" })
        .then((x) => {
          setGroups(
            x.groups.map((y) => ({
              ...{ ...y },
              ...{ href: `/group/${y._id}` },
            }))
          );
        })
        .catch(() => {
          console.log("no access page");
        });
    };
    const getUserInfo = async () => {
      fetchHelper({
        url: `http://localhost:5050/api/v1/users/me`,
      })
        .then((x) => {
          console.log(x);
          setUser(x);
        })
        .catch(() => {
          console.log("no access page");
        });
    };
    getUserInfo();
    getGroupsHelper();
  }, []);

  return PageLayout({
    header: `Hi ${user.first_name}`,
    content: (
      <>
        <div>
          <Button onClick={showModal}>
            Join Group <PlusCircleOutlined />
          </Button>
          <Modal
            // title="My Modal"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <GroupForm onSubmit={handleCancel} />
          </Modal>
        </div>
        <Divider />
        <GroupContainer name="Groups" groups={groups} />
      </>
    ),
  });
}
