import PageLayout from "../../shared/PageLayout";
import LoginForm from "./LoginForm";

export default function Landing() {
  return PageLayout({
    content: <LoginForm />,
  });
}
