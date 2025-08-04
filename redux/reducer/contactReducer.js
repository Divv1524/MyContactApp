import { ADD_CONTACT, DELETE_CONTACT } from "../constants/constants";

const initialState = {
  contactList: [],
};

//The reducer listens for action types and updates the state immutably.
export const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      const exists = state.contactList.find(c => c.mobile === action.payload.mobile); //check duplicacy
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

    case 'UPDATE_CONTACT':
      const updatedList = [...state.contactList];
      updatedList[action.payload.index] = action.payload.updatedContact;
      return { ...state, contactList: updatedList };


    default:
      return state;
  }
};
