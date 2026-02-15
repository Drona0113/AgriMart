import { RAZORPAY_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const razorpayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRazorpayKey: builder.query({
      query: () => ({
        url: `${RAZORPAY_URL}/key`,
      }),
      keepUnusedDataFor: 5,
    }),
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: `${RAZORPAY_URL}/order`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: `${RAZORPAY_URL}/verify`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRazorpayKeyQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = razorpayApiSlice;
