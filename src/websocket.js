// import dns from "./dns";
import { dns } from "./dns";

const wsproduct = new WebSocket(`ws://${dns}:8000/ws/product/`);
const wsorder = new WebSocket(`ws://${dns}:8000/ws/order/`);

export { wsproduct, wsorder };

// export default wsproduct;
