"use client";
import { Button, DatePicker, Form, Input, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import ShortUrlCard from "./ShortUrlCard";
import { axiosAPI } from "../../lib/axios";
import { ChangeEvent, useCallback, useState } from "react";
import debounce from "lodash/debounce";

export default function FormShortenUrl() {
  const [form] = Form.useForm();

  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [tempShortUrl, setTempShortUrl] = useState<string>("");
  const [customCode, setCustomCode] = useState<string>("");

  const onFinish = (values: any) => {
    axiosAPI
      .post("/api/v1/shorten-url", { ...values, custom_code: tempShortUrl })
      .then((response) => {
        setShortUrl(
          `${process.env.FE_URL}${response.data.short_url}`
        );
      });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongUrl(e.target.value);
  };

  const sendCustomCodeToServer = useCallback(
    debounce(async (code: string) => {
      const response = await axiosAPI.post("/api/v1/shorten-url/custom-code", {
        custom_code: code,
      });
      setTempShortUrl(response.data.custom_code);
      //form.setFieldValue("custom_code", response.data.custom_code);
    }, 1000),
    []
  );

  const handleInputCustomCode = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
  
    setCustomCode(value);
    if (value.length !== 0) sendCustomCodeToServer(value);
    else setTempShortUrl("");
  };

  return (
    <Form className="flex flex-col gap-2" onFinish={onFinish} form={form}>
      <Typography>Input the URL to be shortened</Typography>
      <Form.Item
        name="long_url"
        rules={[{ required: true, message: "URL is required" }]}
      >
        <Input placeholder="Input URL" onChange={handleUrlChange} />
      </Form.Item>
      <Typography>Optional feature</Typography>
      <Form.Item name="password" style={{ marginBottom: "12px" }}>
        <Input.Password
          placeholder="Input password protection"
          disabled={!longUrl}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item name="expiry_date" style={{ marginBottom: "12px" }}>
        <DatePicker disabled={!longUrl} />
      </Form.Item>
      <Form.Item name="custom_code" style={{ marginBottom: "7px" }}>
        <Input
          value={customCode}
          onChange={handleInputCustomCode}
          disabled={!longUrl}
          placeholder="Input custom shortcode"
          maxLength={40}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: "0px" }}>
        {tempShortUrl.length > 0 && (
          <p>Your custom code will be displayed as {tempShortUrl}</p>
        )}
      </Form.Item>

      <Form.Item colon={false} className="flex self-end">
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
