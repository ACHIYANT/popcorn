import React from "react";
// import { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import RatingNew from "./RatingNew";
// import StarRating from "./StarRating";
// import Rating from './Rating';
// function Test() {
//   const [rating, setRating] = useState(0);
//   function handleSetRating(rate) {
//     setRating(rate);
//   }
//   return (
//     <div>
//       <StarRating maxRating={10} color="blue" onSetRating={handleSetRating} />
//       <p>Hi this movie got the {rating} stars.</p>
//     </div>
//   );
// }
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <RatingNew maxRating={5} size={48} color={'red'} textColor={'yellow'} defaultRating={3} messages={['a','b','c','d','e']} className="rating"/> */}
    {/* <StarRating maxRating={5} />
    <StarRating
      maxRating={5}
      color="red"
      size={90}
      className="test"
      messages={["Terrible 😥", "Bad 😔", "Okay 😟", "Good 🙂", "Amazing 😊"]}
      defaultRating={3}
    />
    <Rating maxRating={7} color={'green'} size={180} messages={['a','b','c','d','e','f','g']} defaultRating={5} textColor="black"/> */}
    {/* <Test /> */}
   </React.StrictMode>
);