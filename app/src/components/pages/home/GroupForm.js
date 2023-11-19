import React from "react";
import { Form, Input, Button, Checkbox, DatePicker } from "antd";
import { fetchHelper } from "../../shared/utils";

export default function GroupForm({ onSubmit }) {
  const onFinish = (values) => {
    // Add your login logic here, e.g., send the form values to a backend for authentication
    fetchHelper({
      url: `http://localhost:5050/api/v1/groups/${values.group_id}/join`,
      method: "POST",
      body: values,
    })
      .then(onSubmit())
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
      <h2>Join Group Form</h2>
      <Form
        name="Join Group Form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item label="Group Id" name="group_id" required>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Join new group!
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
