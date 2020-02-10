import React, { useState, useEffect } from "react";
import dns from "../dns";
import Product from "../component/product/product";
import Order from "../component/order/order";

const Main = () => {
  // 데이터 관리해주는 부분
  const [productdata, setProductdata] = useState([]);
  const [orderdata, setOrderdata] = useState([]);

  // 웹소켓 연결 부분
  // 업체 물품 등록 부분
  useEffect(() => {
    const wsproduct = new WebSocket(`ws://${dns}:8000/ws/product/`);

    wsproduct.onopen = () => {
      console.log("product connect");
    };

    wsproduct.onmessage = e => {
      const backdata = JSON.parse(e.data);
      setProductdata([backdata.data, ...productdata]);
    };

    wsproduct.onclose = () => {
      console.log("product close");
    };

    //뒷정리 해준다
    return () => {
      wsproduct.close();
    };
  }, [productdata]); // data가 바뀔때마다 리렌더링한다

  // // 주문 현황 부분
  // useEffect(() => {
  //   const wsorder = new WebSocket(`ws://${dns}:8000/ws/order/`);

  //   wsorder.onopen = () => {
  //     console.log("order connect");
  //   };

  //   wsorder.onmessage = e => {
  //     console.log(2);
  //     const backdata = JSON.parse(e.data);
  //     setOrderdata(orderdata.concat(backdata.data));
  //     console.log(backdata);
  //   };

  //   wsorder.onclose = () => {
  //     console.log("order close");
  //   };

  //   //뒷정리 해준다
  //   return () => {
  //     wsorder.close();
  //   };
  // }, [orderdata]); // data가 바뀔때마다 리렌더링한다
  return (
    <div>
      <Product data={productdata}></Product>
      <Order></Order>
    </div>
  );
};

export default Main;
