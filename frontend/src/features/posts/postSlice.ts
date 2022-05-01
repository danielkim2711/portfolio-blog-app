import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';
import { toast } from 'react-toastify';

interface IPost {
  _id: string;
  user: string;
  title: string;
  imageUrl: string;
  body: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostState {
  posts: IPost[];
  post: IPost;
  isLoading: boolean;
}

const initialState: PostState = {
  posts: [],
  post: {} as PostState['post'],
  isLoading: false,
};

export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => {
    try {
      return await postService.getPosts();
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPost = createAsyncThunk(
  'posts/get',
  async (postId: string, thunkAPI) => {
    try {
      return await postService.getPost(postId);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId: string, thunkAPI: any) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.deletePost(postId, token);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state) => {
        state.isLoading = true;
        toast.error('Error, failed to load the posts');
      })
      .addCase(getPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
      })
      .addCase(getPost.rejected, (state) => {
        state.isLoading = true;
        toast.error('Error, failed to load the post');
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload._id
        );
        toast.success('Post successfully deleted');
      })
      .addCase(deletePost.rejected, (state, action: any) => {
        state.isLoading = false;
        toast.error(action.payload);
      });
  },
});

export default postSlice.reducer;
