import React, { useState, useEffect } from "react";
import Product from "../component/product/product";
import Order from "../component/order/order";

const Main = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/lastorder");

    ws.onopen = () => {
      console.log("connect");
    };

    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      console.log(data);
    };

    ws.onclose = () => {
      console.log("close");
    };
  }, []);
  return (
    <div>
      <Product></Product>
      <Order></Order>
    </div>
  );
};

export default Main;
