import GroupContainer from "../../shared/container/GroupContainer";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import PageLayout from "../../shared/PageLayout";
import { fetchHelper } from "../../shared/utils";

export default function Home() {
  const [user, setUser] = useState({});

  const { Header, Content } = Layout;
  const [groups, setGroups] = useState([]);

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
    content: <GroupContainer name="Groups" groups={groups} />,
  });
}
