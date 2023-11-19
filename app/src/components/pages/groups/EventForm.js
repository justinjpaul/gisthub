import React from "react";
import { Form, Input, Button, Checkbox, DatePicker } from "antd";
import { fetchHelper } from "../../shared/utils";

export default function EventForm({ id }) {
  const onFinish = (values) => {
    // Add your login logic here, e.g., send the form values to a backend for authentication
    fetchHelper({
      url: `http://localhost:5050/api/v1/groups/${id}/events`,
      method: "POST",
      body: values,
    })
      //   .then((window.location.href = "/"))
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
      <h2>New Event Form</h2>
      <Form
        name="Add Event Form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item label="Name" name="name" required>
          <Input />
        </Form.Item>

        <Form.Item label="Start Date" name="start" required>
          <DatePicker />
        </Form.Item>
        <Form.Item label="End Date" name="end">
          <DatePicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add new Event!
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
