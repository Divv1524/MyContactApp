import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define contact type
const initialState = {
  contactList: [],
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action) => {
      state.contactList.push(action.payload);
    },
    deleteContact: (state, action) => {
      state.contactList.splice(action.payload, 1);
    },
    updateContact: (state, action) => {
      const { index, updatedContact } = action.payload;
      if (state.contactList[index]) {
        state.contactList[index] = updatedContact;
      }
    },
    setContacts: (state, action) => {
      state.contactList = action.payload;
    },
    clearContacts: (state) => {
      state.contactList = [];
    },
  },
});

export const {
  addContact,
  deleteContact,
  updateContact,
  setContacts,
  clearContacts,
} = contactSlice.actions;

export default contactSlice.reducer;
