const initProduct = {
  numberCart: 0,
  Carts: [],
  totalPrice: 0,
};

export const cart = (state = initProduct, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      let existed_item = state.Carts.find((cartItem) => {
        if (
          cartItem.id === `${action.payload.id}${action.payload.size}` &&
          cartItem.size === action.payload.size
        ) {
          return true;
        }
        return false;
      });
      if (existed_item) {
        state.Carts.map((item, key) => {
          if (item.id == `${action.payload.id}${action.payload.size}`) {
            state.Carts[key].quantity++;
          }
        });
        return {
          ...state,
          numberCart: ++state.numberCart,
          totalPrice: (state.totalPrice += action.payload.price),
        };
        /* I use ++state ins of state++ because prefix and postfix operations
           ++state will increment and then use the value --> a: 1, b: 1
           whereas. state++ will use the value and then increment --> a: 1, b: 0 */
      } else {
        let _cart = {
          id: `${action.payload.id}${action.payload.size}`,
          quantity: 1,
          productName: action.payload.productName,
          imageUri: action.payload.imageUri,
          color: action.payload.color,
          price: action.payload.price,
          size: action.payload.size,
        };
        state.Carts.push(_cart);
        return {
          ...state,
          numberCart: ++state.numberCart,
          totalPrice: (state.totalPrice += action.payload.price),
        };
      }
    case "REMOVE_FROM_CART":
      let quantity_ = action.payload.quantity;
      let price_ = action.payload.price;
      return {
        ...state,
        numberCart: state.numberCart - quantity_,
        totalPrice: state.totalPrice - price_,
        Carts: state.Carts.filter(
          (cartItem) => cartItem.id !== action.payload.id
        ),
      };
    case "INCREASE_QUANTITY":
      state.numberCart++;
      action.payload.quantity++;
      state.totalPrice += action.payload.price;
      return { ...state };
    case "DECREASE_QUANTITY":
      let quantity = action.payload.quantity;
      if (quantity > 1) {
        state.numberCart--;
        action.payload.quantity--;
        state.totalPrice -= action.payload.price;
        return { ...state };
      }
  }
  return state;
};
