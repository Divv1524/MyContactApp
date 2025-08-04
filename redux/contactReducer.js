import { ADD_CONTACT, DELETE_CONTACT } from "./constants";

const initialState = {
  contactList: [],
};

export const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      const exists = state.contactList.find(c => c.mobile === action.payload.mobile);
      if (!exists) {
        return {
          ...state,
          contactList: [...state.contactList, action.payload],
        };
      }
      return state;

    case DELETE_CONTACT:
      return {
        ...state,
        contactList: state.contactList.filter((_, index) => index !== action.payload),
      };

    default:
      return state;
  }
};
