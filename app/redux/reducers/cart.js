export const cart = (state = [], action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      let existed_item = state.find((cartItem) => {
        if (
          cartItem.id === action.payload.id &&
          cartItem.size === action.payload.size
        ) {
          return true;
        }
        return false;
      });
      if (existed_item) {
        state.map((item, key) => {
          if (item.id == action.payload.id) {
            state[key].quantity++;
          }
        });
        return [...state];
      } else {
        let _cart = {
          id: action.payload.id,
          quantity: 1,
          name: action.payload.name,
          imageUri: action.payload.imageUri,
          color: action.payload.color,
          price: action.payload.price,
          size: action.payload.size,
        };
        state.push(_cart);
        return [...state];
      }
    case "REMOVE_FROM_CART":
      return state.filter((cartItem) => cartItem.id !== action.payload.id);
    case "INCREASE_QUANTITY":
      action.payload.quantity++;
      return [...state];
    case "DECREASE_QUANTITY":
      let quantity = action.payload.quantity;
      if (quantity > 1) {
        action.payload.quantity--;
        return [...state];
      }
  }
  return state;
};
