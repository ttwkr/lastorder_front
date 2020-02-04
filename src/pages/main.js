import React, { useState, useEffect } from "react";
import Product from "../component/product/product";
import Order from "../component/order/order";

const Main = () => {
  const [data, setData] = useState("");
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/lastorder");

    ws.onopen = () => {
      console.log("connect");
    };

    ws.onmessage = e => {
      setData(JSON.parse(e.data));
      console.log(data);
    };

    ws.onclose = () => {
      console.log("close");
    };
  }, [data]);
  return (
    <div>
      <Product data={data}></Product>
      <Order></Order>
    </div>
  );
};

export default Main;
