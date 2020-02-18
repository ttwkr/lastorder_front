import React, { useState, useCallback, useEffect } from "react";
import { dns } from "../../dns";
import axios from "axios";
import { wsproduct } from "../../websocket";
import KakaoMap from "../kakaomap/kakaomap";
import "./product.css";

const Product = () => {
  const [getdbData, setGetdbData] = useState([]);
  const [productdata, setProductdata] = useState([]);
  const [count, setCount] = useState({});
  const [location, setLocation] = useState({
    lat: 37.27943075229118,
    lng: 127.01763998406159
  });
  const [locationList, setLocationList] = useState([
    {
      lat: 37.27943075229118,
      lng: 127.01763998406159
    }
  ]);

  const getList = async () => {
    await axios.get(`http://${dns}:8000/productlist`).then(res => {
      console.log(res.data);
      setGetdbData(res.data.data);
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
  // 웹소켓 연결 부분
  // 업체 물품 등록 부분

  // 한번 열어 주고 끝
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
        // product_location(backdata.data.store_lat, backdata.data.store_lng);
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
        <div>
          {getdbData.slice(0, 10).map((curr, i) => {
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
        </div>
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
