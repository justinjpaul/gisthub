import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { fetchHelper } from "../../shared/utils";

export default function LoginForm() {
  const onFinish = (values) => {
    // Add your login logic here, e.g., send the form values to a backend for authentication
    fetchHelper({
      url: "http://localhost:5050/api/v1/login",
      method: "POST",
      body: values,
    })
      .then((window.location.href = "/"))
      .catch(console.log("nah bro"));
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
    },
  };

  return (
    <div style={{ width: 300, margin: "auto", marginTop: 50 }}>
      <h2>Login Form</h2>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email" }]}
          required
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
