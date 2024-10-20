
import { Card} from "antd";

import FormShortenUrl from "./components/FormShortenUrl";

export default function Home() {
  return (
    <div className="flex lg:items-center lg:justify-center min-w-screen min-h-screen">
      <Card title="URL Shortener" className="w-[500px]">
        <div className="">
          <FormShortenUrl/>
        </div>
      </Card>
    </div>
  );
}
