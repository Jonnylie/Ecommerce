import { combineReducers } from "redux";
import { user } from "./user";
import { cart } from "./cart";

const Reducers = combineReducers({
  userState: user,
  cartState: cart,
});

export default Reducers;
