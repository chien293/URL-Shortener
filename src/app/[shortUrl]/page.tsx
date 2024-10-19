"use client";
import { axiosAPI } from "@/lib/axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";

interface ShortUrlResponse {
  long_url: string;
  short_url: string;
  password: string;
  has_password: boolean;
  expiry_date: string;
  custom_code: string;
}
async function findOriginalUrl(
  shortUrl: string
): Promise<ShortUrlResponse | null> {
  const originUrl: ShortUrlResponse = await axiosAPI
    .get(`/api/v1/shorten-url/${shortUrl}`)
    .then((response) => {
      return response.data;
    });

  return originUrl ? originUrl : null;
}

export default function ShortUrlPage({
  params,
}: {
  params: { shortUrl: string };
}) {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(false);
  const [requiredPassword, setRequiredPassword] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      const originalUrl = await findOriginalUrl(params.shortUrl);
      console.log(originalUrl, " origin ");

      if (originalUrl) {
        if (originalUrl.has_password) {
          setRequiredPassword(true);
        } else router.push(originalUrl.long_url);
      } else {
        router.push("/404");
      }
    };

    fetchUrl();
  }, [params.shortUrl]);

  const onFinish = (value: any) => {
    console.log(value, " value ");
    axiosAPI
      .post(`/api/v1/shorten-url/${params.shortUrl}`, value)
      .then((response) => {
        if (response.data.long_url) {
          router.push(response.data.long_url);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(true);
        }
      });
  };

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
      {requiredPassword ? (
        <Card title="Password protected">
          <Form onFinish={onFinish}>
            <Form.Item name="password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item label=" " colon={false} className="flex self-end">
              <Button type="primary" htmlType="submit">
                Shorten URL
              </Button>
            </Form.Item>
            {error && <p>Invalid password</p>}
          </Form>
        </Card>
      ) : (
        <div>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
}
