export interface User {
  customerId: string;
  name: string;
  email: string;
  countryCode: string;
  mobile: string;
  address: string;
  zipCode: string;
  password?: string;
  role: string;
  preferences: string;
}

export interface Booking {
  bookingId: string;
  customerId: string;
  senderName: string;
  senderAddress: string;
  senderContact: string;
  receiverName: string;
  receiverAddress: string;
  receiverPin: string;
  receiverMobile: string;
  parcelWeightInGram: number;
  parcelContentsDescription: string;
  parcelDeliveryType: string;
  parcelPackingPreference: string;
  parcelPickupTime: string;
  parcelDropoffTime: string;
  parcelServiceCost: number;
  parcelPaymentTime: string;
  bookingDate: string;
  status: string;
  bookedBy: string;
  paymentId: string;
  transactionId: string;
}

export interface Payment {
  paymentId: string;
  transactionId: string;
  bookingId: string;
  amount: number;
  cardType: string;
  cardLastFour: string;
  transactionDate: string;
  status: string;
}

export interface Feedback {
  feedbackId: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  description: string;
  rating: number;
  dateTime: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  customerId: string;
  name: string;
  email: string;
  role: string;
  address: string;
  mobile: string;
  countryCode: string;
}
