import { KNOWLEDGE_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const knowledgeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKnowledgePosts: builder.query({
      query: () => ({
        url: KNOWLEDGE_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Knowledge'],
    }),
    getKnowledgePostDetails: builder.query({
      query: (postId) => ({
        url: `${KNOWLEDGE_URL}/${postId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createKnowledgePost: builder.mutation({
      query: () => ({
        url: KNOWLEDGE_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Knowledge'],
    }),
    updateKnowledgePost: builder.mutation({
      query: (data) => ({
        url: `${KNOWLEDGE_URL}/${data.postId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Knowledge'],
    }),
    deleteKnowledgePost: builder.mutation({
      query: (postId) => ({
        url: `${KNOWLEDGE_URL}/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Knowledge'],
    }),
    createKnowledgeComment: builder.mutation({
      query: (data) => ({
        url: `${KNOWLEDGE_URL}/${data.postId}/comments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Knowledge'],
    }),
  }),
});

export const {
  useGetKnowledgePostsQuery,
  useGetKnowledgePostDetailsQuery,
  useCreateKnowledgePostMutation,
  useUpdateKnowledgePostMutation,
  useDeleteKnowledgePostMutation,
  useCreateKnowledgeCommentMutation,
} = knowledgeApiSlice;
