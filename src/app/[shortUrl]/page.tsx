
import { notFound } from "next/navigation";
import ShortUrlClient from "./ShortUrlClient";
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

async function findOriginalUrl(
  shortUrl: string
): Promise<ShortUrlResponse | null> {
  const response = await axiosAPI
    .get(`/api/v1/shorten-url/${shortUrl}`)
    .then((res) => {return res.data})
    .catch((error) => {
      if (error.response.status === 410) {
        return { expiredError: true } as ShortUrlResponse;
      }
      if (error.response.status === 404) {
        notFound();
      }
    });
  return response;
}

export default async function ShortUrlPage({
  params,
}: {
  params: { shortUrl: string };
}) {
  const originalUrl = await findOriginalUrl(params.shortUrl);

  if (!originalUrl) {
    notFound();
  }

  return (
    <ShortUrlClient originalUrl={originalUrl} shortUrl={params.shortUrl} />
  );
}
