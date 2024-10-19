"use client";
import React, { useState } from "react";
import { Card, Button, message, Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

interface UrlCardProps {
  shortUrl: string;
}

export default function ShortUrlCard({ shortUrl }: UrlCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    message.success("Copied to clipboard!");

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card title="Your Shortened URL">
      <div className="flex items-center justify-between">
        <p className="select-text break-all m-0 flex-1">{shortUrl}</p>
        {shortUrl && (
          <Tooltip title={copied ? "Copied!" : "Copy URL"}>
            <Button
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={copyToClipboard}
              type="link"
            />
          </Tooltip>
        )}
      </div>
    </Card>
  );
}
