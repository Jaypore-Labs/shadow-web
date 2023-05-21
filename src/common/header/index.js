import { Button } from "antd";
import React from "react";

export default function Header() {
  return (
    <div className="p-5 border-slate-700 border-solid header-bg border-b border-t-0 border-x-0 flex justify-between">
      <span className="flex items-center">Shadow</span>
      <div>
      <Button type="primary" className=" !text-gray-300">
        Share
      </Button> &nbsp;
      <Button type="primary" className=" !text-gray-300">
        Rate Us
      </Button>
      </div>
    </div>
  );
}
