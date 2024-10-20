// app/short-url/[shortUrl]/ShortUrlClient.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { axiosAPI } from "@/lib/axios";

interface ShortUrlResponse {
  long_url: string;
  short_url: string;
  password: string;
  has_password: boolean;
  expiry_date: string;
  custom_code: string;
  expiredError: boolean;
}

export default function ShortUrlClient({
  originalUrl,
  shortUrl,
}: {
  originalUrl: ShortUrlResponse;
  shortUrl: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(false);
  const [expiredError, setExpiredError] = useState(originalUrl.expiredError);
  const [requiredPassword, setRequiredPassword] = useState(
    originalUrl.has_password
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!requiredPassword && !expiredError) {
      setTimeout(() => {
        router.push(originalUrl.long_url);
      }, 2000);
    }
  }, [requiredPassword, expiredError, originalUrl.long_url, router]);

  const onFinish = (value: any) => {
    setLoading(true);
    axiosAPI
      .post(`/api/v1/shorten-url/${shortUrl}`, value)
      .then((response) => {
        if (response.data.long_url) {
          router.push(response.data.long_url);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
      {expiredError ? (
        <p>This URL has been expired</p>
      ) : requiredPassword ? (
        <Card title="Password protected">
          <Form onFinish={onFinish} className="flex flex-col">
            <Form.Item name="password" style={{ marginBottom: "5px" }}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label=" "
              colon={false}
              className="flex self-end"
              style={{ marginBottom: "5px" }}
            >
              {error && <p>Invalid password</p>}
            </Form.Item>

            <Form.Item colon={false} style={{ marginBottom: "5px" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify password"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <div className="flex items-center gap-2">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
}
