import GroupContainer from "../../shared/container/GroupContainer";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import PageLayout from "../../shared/PageLayout";
import { fetchHelper } from "../../shared/utils";
import { useCookies } from "react-cookie";

export default function Home() {
  const [name, setName] = useState("");
  const [cookies, setCookie] = useCookies(["session"]);

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
    const userInfo = async () => {
      fetchHelper({ url: `http://localhost:5050/api/v1/users/${cookies}` })
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
    getGroupsHelper();
  }, []);

  return PageLayout({
    header: name,
    content: <GroupContainer name={`Hi ${"you"}`} groups={groups} />,
  });
}
