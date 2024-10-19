"use client";
import { Button, DatePicker, Form, Input, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import ShortUrlCard from "./ShortUrlCard";
import { axiosAPI } from "../../lib/axios";
import { useState } from "react";

export default function FormShortenUrl() {
  const [shortUrl, setShortUrl] = useState<string>("");

  const onFinish = (values: any) => {
    axiosAPI.post("/api/v1/shorten-url", values).then((response) => {
      console.log(response);
      setShortUrl(`${process.env.NEXT_PUBLIC_SITE_URL}/${response.data.short_url}`);
    });
  };

  return (
    <Form className="flex flex-col gap-2" onFinish={onFinish}>
      <Typography>Input the URL to be shortened</Typography>
      <Form.Item
        name="long_url"
        rules={[{ required: true, message: "URL is required" }]}
      >
        <Input placeholder="Input URL" />
      </Form.Item>
      <Typography>Optional feature</Typography>
      <Form.Item name="password">
        <Input.Password
          placeholder="Input password protection"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item name="expiry_date">
        <DatePicker />
      </Form.Item>
      <Form.Item name="custom_code">
        <Input placeholder="Input custom shortcode" />
      </Form.Item>

      <Form.Item label=" " colon={false} className="flex self-end">
        <Button type="primary" htmlType="submit">
          Shorten URL
        </Button>
      </Form.Item>

      <div className="mt-2">
        <ShortUrlCard shortUrl={shortUrl} />
      </div>
    </Form>
  );
}
