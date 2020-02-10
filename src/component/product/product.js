import React from "react";
import KakaoMap from "../kakaomap/kakaomap";

const Product = ({ data }) => {
  return (
    <div>
      <h2>product</h2>
      {data.map((curr, i) => {
        return <div key={i}>{curr}</div>;
      })}
      <KakaoMap></KakaoMap>
    </div>
  );
};

export default Product;
