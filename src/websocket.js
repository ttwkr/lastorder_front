import dns from "./dns";

const wsproduct = new WebSocket(`ws://${dns}:8000/ws/product/`);

export default wsproduct;
