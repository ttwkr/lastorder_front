import React, { useState, useEffect } from "react";
import { wsorder } from "../../websocket";
import KakaoMap from "../kakaomap/kakaomap";
// import OrderMap from "../kakaomap/ordermap";

import "./order.css";

const Order = () => {
  const [orderdata, setOrderdata] = useState([]);

  // websocket open
  useEffect(() => {
    wsorder.onopen = () => {
      console.log("order connect");
    };
  });

  // websocket message
  useEffect(() => {
    wsorder.onmessage = e => {
      var wsOrderData = JSON.parse(e.data);
      var data = wsOrderData["message"];

      setOrderdata([data, ...orderdata]);
    };
  }, [orderdata]);

  return (
    <div>
      <OrderComponent data={orderdata} />
    </div>
  );
};

const OrderComponent = ({ data }) => {
  // order status
  console.log("data is ", data);
  let ordercount = [0, 0];
  if (data.length > 0) {
    ordercount[0] = data[0]["orderStatus"]["order"];
    ordercount[1] = data[0]["orderStatus"]["receipt"];
  }

  // order data
  let realtimedata = [];
  for (let i = 0; i < data.length; i++) {
    realtimedata.push(data[i]["data"]);
  }
  const lastdata = realtimedata.flat();
  if (lastdata.length > 10) {
    lastdata.pop();
  }

  // map data
  let receiveMapData = null;
  if (data.length > 0) {
    receiveMapData = data[0]["todaydata"];
  }

  return (
    <div>
      <h2>Order</h2>
      <div className="order-area">
        <div className="order-two-area">
          <div className="order-table">
            <table className="order-table-status">
              <thead>
                <tr>
                  <th>주문</th>
                  <th>접수</th>
                  <th>완료</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ordercount[0]}</td>
                  <td>{ordercount[1]}</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="order-table">
            <table className="order-table-data">
              <thead>
                <tr className="order-column-title">
                  <th>order_id</th>
                  <th>업체명</th>
                  <th>상태</th>
                  <th>시간</th>
                </tr>
              </thead>
              <tbody>
                {lastdata.map((el, i) => {
                  return (
                    <OrderElement
                      order_id={el.order_id}
                      shop_name={el.shop_name}
                      status={el.status}
                      created_at={el.created_at}
                      key={i}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="order-two-area">
          <KakaoMap id="order_map" data={receiveMapData} />
        </div>
      </div>
    </div>
  );
};

const OrderElement = ({ order_id, shop_name, status, created_at }) => {
  return (
    <tr className="order-column-title">
      <td>{order_id}</td>
      <td>{shop_name}</td>
      <td>{status}</td>
      <td>{created_at}</td>
    </tr>
  );
};

export default Order;
