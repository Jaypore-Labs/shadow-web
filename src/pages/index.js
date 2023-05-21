import { Col, Row } from "antd";
import { useRouter } from "next/router";
import React from "react";

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      router.push("/main");
    }, 2000);
  }, []);
  return (
    <Row>
      <Col sm={24} className="w-screen h-screen">
        <div className="flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl font-bold">Welcome to Screenshot</h1>
        </div>
      </Col>
    </Row>
  );
}
