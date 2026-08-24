package com.parcel.model;

public class Booking {
    private String bookingId;
    private String customerId;
    private String senderName;
    private String senderAddress;
    private String senderContact;
    private String receiverName;
    private String receiverAddress;
    private String receiverPin;
    private String receiverMobile;
    private double parcelWeightInGram;
    private String parcelContentsDescription;
    private String parcelDeliveryType; // Standard, Express, Same-Day
    private String parcelPackingPreference; // Basic, Premium
    private String parcelPickupTime;
    private String parcelDropoffTime;
    private double parcelServiceCost;
    private String parcelPaymentTime;
    private String bookingDate;
    private String status; // New, Scheduled, PickedUp, Assigned, Booked, InTransit, Delivered, Cancelled
    private String bookedBy; // CUSTOMER or OFFICER
    private String paymentId;
    private String transactionId;

    public Booking() {}

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderAddress() { return senderAddress; }
    public void setSenderAddress(String senderAddress) { this.senderAddress = senderAddress; }

    public String getSenderContact() { return senderContact; }
    public void setSenderContact(String senderContact) { this.senderContact = senderContact; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverAddress() { return receiverAddress; }
    public void setReceiverAddress(String receiverAddress) { this.receiverAddress = receiverAddress; }

    public String getReceiverPin() { return receiverPin; }
    public void setReceiverPin(String receiverPin) { this.receiverPin = receiverPin; }

    public String getReceiverMobile() { return receiverMobile; }
    public void setReceiverMobile(String receiverMobile) { this.receiverMobile = receiverMobile; }

    public double getParcelWeightInGram() { return parcelWeightInGram; }
    public void setParcelWeightInGram(double parcelWeightInGram) { this.parcelWeightInGram = parcelWeightInGram; }

    public String getParcelContentsDescription() { return parcelContentsDescription; }
    public void setParcelContentsDescription(String parcelContentsDescription) { this.parcelContentsDescription = parcelContentsDescription; }

    public String getParcelDeliveryType() { return parcelDeliveryType; }
    public void setParcelDeliveryType(String parcelDeliveryType) { this.parcelDeliveryType = parcelDeliveryType; }

    public String getParcelPackingPreference() { return parcelPackingPreference; }
    public void setParcelPackingPreference(String parcelPackingPreference) { this.parcelPackingPreference = parcelPackingPreference; }

    public String getParcelPickupTime() { return parcelPickupTime; }
    public void setParcelPickupTime(String parcelPickupTime) { this.parcelPickupTime = parcelPickupTime; }

    public String getParcelDropoffTime() { return parcelDropoffTime; }
    public void setParcelDropoffTime(String parcelDropoffTime) { this.parcelDropoffTime = parcelDropoffTime; }

    public double getParcelServiceCost() { return parcelServiceCost; }
    public void setParcelServiceCost(double parcelServiceCost) { this.parcelServiceCost = parcelServiceCost; }

    public String getParcelPaymentTime() { return parcelPaymentTime; }
    public void setParcelPaymentTime(String parcelPaymentTime) { this.parcelPaymentTime = parcelPaymentTime; }

    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBookedBy() { return bookedBy; }
    public void setBookedBy(String bookedBy) { this.bookedBy = bookedBy; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
}
