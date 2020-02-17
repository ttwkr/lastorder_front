import React from "react";
import KakaoMap from "../kakaomap/kakaomap";

import "./order.css";

const Order = ({ data }) => {
  const list = data.slice(0, 10).map(curr => {
    if (curr.product.L.lenght >= 1) {
      console.log(curr);
      curr.product.L.map(curr => {
        return <div>{curr.M.name.S}</div>;
      });
    }
    return (
      <div className="order">
        <div>{curr.user}</div>
        <div>{curr.store}</div>
        <div>
          {curr.product.L.map(curr => {
            console.log(curr);
            return <div>{curr.M.name.S}</div>;
          })}
        </div>
        <div>{curr.status}</div>
        <div>{curr.created_at}</div>
      </div>
    );
  });
  return (
    <div>
      <h2>Order</h2>
      <div>{list}</div>
      <KakaoMap id="order_map"></KakaoMap>
    </div>
  );
};

export default Order;
