
import { Card} from "antd";

import FormShortenUrl from "./components/FormShortenUrl";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen">
      <Card className="w-[500px]">
        <div className="">
          <FormShortenUrl/>
        </div>
      </Card>
    </div>
  );
}
