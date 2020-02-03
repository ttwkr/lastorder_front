import React from "react";
import Product from "./component/product/product";
import Order from "./component/order/order";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <h1>HI</h1>
      <Product></Product>
      <Order></Order>
    </div>
  );
};

export default App;
