import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/electronApi.js';

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async () => {
    const response = await api.getAllNotes();
    return response;
  }
);

export const saveNote = createAsyncThunk(
  'notes/saveNote',
  async (note) => {
    const response = await api.saveNote(note);
    return response;
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({id, updates}) => {
    const response = await api.updateNote(id, updates);
    return response;
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id) => {
    await api.deleteNote(id);
    return id;
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(saveNote.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        return state.filter(note => note.id !== action.payload);
      });
  },
});

export default noteSlice.reducer;