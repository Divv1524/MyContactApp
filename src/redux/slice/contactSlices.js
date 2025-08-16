import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define contact type
const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

//Helper to build storage key based on userId
const getContactsKey = (userId) => `contacts_${userId}`;

//Load contacts for a specific user
export const loadContacts = createAsyncThunk(
  'contacts/loadContacts',
  async (userId, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem(getContactsKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      return rejectWithValue('Failed to load contacts');
    }
  }
);


// 🔹 Add contact
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async ({ userId, contact }, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem(getContactsKey(userId));
      const contacts = stored ? JSON.parse(stored) : [];

      const newContact = {
        id: Date.now().toString(),
        ...contact,
      };

      const updated = [...contacts, newContact];
      await AsyncStorage.setItem(getContactsKey(userId), JSON.stringify(updated));

      return newContact;
    } catch (err) {
      return rejectWithValue('Failed to add contact');
    }
  }
);

// 🔹 Update contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ userId, contactId, updatedData }, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem(getContactsKey(userId));
      let contacts = stored ? JSON.parse(stored) : [];

      contacts = contacts.map(c => (c.id === contactId ? { ...c, ...updatedData } : c));

      await AsyncStorage.setItem(getContactsKey(userId), JSON.stringify(contacts));
      return { contactId, updatedData };
    } catch (err) {
      return rejectWithValue('Failed to update contact');
    }
  }
);

// 🔹 Delete contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async ({ userId, contactId }, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem(getContactsKey(userId));
      let contacts = stored ? JSON.parse(stored) : [];

      contacts = contacts.filter(c => c.id !== contactId);

      await AsyncStorage.setItem(getContactsKey(userId), JSON.stringify(contacts));
      return contactId;
    } catch (err) {
      return rejectWithValue('Failed to delete contact');
    }
  }
);


const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearContacts: (state) => {
      state.contacts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.loading = false;
      })
      .addCase(loadContacts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const { contactId, updatedData } = action.payload;
        state.contacts = state.contacts.map(c =>
          c.id === contactId ? { ...c, ...updatedData } : c
        );
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload);
      });
  },
});
export const { clearContacts } = contactSlice.actions;

export default contactSlice.reducer;
