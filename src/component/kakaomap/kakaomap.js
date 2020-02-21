/*global kakao*/
import React, { useEffect } from "react";
import "./kakao.css";

const KakaoMap = ({ id, location }) => {
  useEffect(() => {
    kakao.maps.load(() => {
      const container = document.getElementById(id);
      const options = {
        center: new kakao.maps.LatLng(0, 0),
        level: 14
      };
      const map = new kakao.maps.Map(container, options);

      // 마커 클러스터 부분
      const clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 7
      });

      const locationFunction = loc => {
        const markers = loc.map(curr => {
          return new kakao.maps.Marker({
            position: new kakao.maps.LatLng(curr.lat, curr.lng)
          });
        });
        clusterer.addMarkers(markers);
      };
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
      locationFunction(location);
    });
  }, [id, location]);
  return (
    <div>
      <div id={id}></div>
    </div>
  );
};

export default KakaoMap;
