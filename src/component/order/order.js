import React, { useState, useEffect } from "react";
import { wsorder } from "../../websocket";
import KakaoMap from "../kakaomap/kakaomap";
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

  let ordercount = [0, 0];
  let receiveMapData = [];

  if (data.length > 0) {
    // 통계 - order status
    ordercount[0] = data[0]["orderStatus"]["order"];
    ordercount[1] = data[0]["orderStatus"]["receipt"];
    // 통계 - 지역별 order
    receiveMapData = data[0]["todaydata"];
  }
  // order data 10개로 제한
  let realtimedata = [];
  for (let i = 0; i < data.length; i++) {
    if(i === 11){
      break;
    }
    realtimedata.push(data[i]["data"]);
  }
  const lastdata = realtimedata.flat();

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
          <KakaoMap id="order_map" location={receiveMapData} />
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