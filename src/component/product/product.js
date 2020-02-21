import React, { useState, useCallback, useEffect } from "react";
import { dns } from "../../dns";
import axios from "axios";
import { wsproduct } from "../../websocket";
import KakaoMap from "../kakaomap/kakaomap";
import "./product.css";

const Product = () => {
  const [productdata, setProductdata] = useState([]); // 백엔드로 부터 받아오는 데이터 관리
  const [count, setCount] = useState({}); // 통계관리
  //업체 상품등록 위치 관리
  const [location, setLocation] = useState({
    lat: 37.27943075229118,
    lng: 127.01763998406159
  });
  // 업체 상품등록 위치 리스트 관리
  const [locationList, setLocationList] = useState([
    {
      lat: 37.27943075229118,
      lng: 127.01763998406159
    }
  ]);

  // GET으로 api에 현재날짜의 데이터 요청
  const getList = async () => {
    await axios.get(`http://${dns}:8000/productlist`).then(res => {
      setProductdata(res.data.data);
      setCount(res.data.count);
      setLocationList(res.data.location);
    });
  };
  const product_backdata = useCallback(
    data => {
      setProductdata([data, ...productdata]);
    },
    [productdata]
  );

  const product_location = (long, lati) => {
    setLocation({
      lat: Number(lati),
      lng: Number(long)
    });
  };

  const location_list = useCallback(
    (long, lati) => {
      product_location(long, lati);
      setLocationList([location, ...locationList]);
    },
    [location, locationList]
  );

  const product_count = data => {
    setCount(data);
  };

  useEffect(() => {
    getList();
  }, []);

  // 한번 열어 주고 끝
  // 소켓을 연다
  useEffect(() => {
    wsproduct.onopen = () => {
      console.log("product connect");
    };
  });

  useEffect(() => {
    wsproduct.onmessage = e => {
      const backdata = JSON.parse(e.data);
      const type = backdata.data.type;
      if (type === "INSERT" || type === "MODIFY") {
        product_backdata(backdata.data);
        product_count(backdata.data.count);
        location_list(backdata.data.store_lng, backdata.data.store_lat);
      }
    };
  }, [locationList, location_list, product_backdata]); // data가 바뀔때마다 리렌더링한다

  return (
    <div className="product_main">
      <h2>product</h2>
      <div>
        {productdata.slice(0, 10).map((curr, i) => {
          return (
            <div key={i} className="product">
              <div>{curr.product_id}</div>
              <div>{curr.store_name}</div>
              <div>{curr.product}</div>
              <div>{curr.price}</div>
              <div>{curr.quantity}</div>
              <div>{curr.status}</div>
              <div>{curr.created_at}</div>
            </div>
          );
        })}
        <div className="count">
          <div>{count.today_count}</div>
          <div>{count.status_1_count}</div>
          <div>{count.status_2_count}</div>
        </div>
      </div>
      <KakaoMap id="product_map" location={locationList}></KakaoMap>
    </div>
  );
};

export default Product;
