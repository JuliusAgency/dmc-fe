const initialState = {
  user: null,
  role: "USER",
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    default:
      return state;
  }
};

export default userReducer;
