/*global kakao*/
import React, { useEffect } from "react";
import "./kakao.css";
import { kakaoMapAPIkey } from "../../dns";

const KakaoMap = ({ id, locationList, data }) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapAPIkey}&autoload=false&libraries=services,clusterer`;
    document.head.appendChild(script);
    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById(id);
        const options = {
          center: new kakao.maps.LatLng(0, 0),
          level: 7
        };
        const map = new kakao.maps.Map(container, options);
        const geocoder = new kakao.maps.services.Geocoder();
        const handleAddress = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x); //x축y축 값
            const marker = new kakao.maps.MarkerImage( //마커 이미지 사이즈
              "https://mp-seoul-image-production-s3.mangoplate.com/web/resources/ikpswdksy8bnweeq.png?fit=around|*:*&crop=*:*;*,*&output-format=png&output-quality=80",
              new kakao.maps.Size(25, 30)
            );
            const setMarker = new kakao.maps.Marker({
              position: coords,
              image: marker //마커생성
            });
            setMarker.setMap(map);
            map.setCenter(coords);
          }
        };
        geocoder.addressSearch("서울 강서구 공항대로 212", handleAddress);
      });
    };
  }, [id]);
  return (
    <div>
      <div id={id}></div>
    </div>
  );
};

export default KakaoMap;
