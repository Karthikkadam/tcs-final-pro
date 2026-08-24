import requests
import json

BASE_URL = "http://localhost:8080/api"

def test_api():
    print("========================================")
    print("Testing Spring Boot Backend API Endpoints")
    print("========================================")

    # 1. Officer Login
    print("\n1. Testing Officer Login (OFC00001 / Admin@123)...")
    res = requests.post(f"{BASE_URL}/auth/login", json={"customerId": "OFC00001", "password": "Admin@123"})
    print("Status:", res.status_code, "Response:", res.json())
    assert res.status_code == 200 and res.json().get("role") == "OFFICER"

    # 2. Customer Registration
    print("\n2. Testing Customer Registration...")
    import time
    ts = int(time.time())
    reg_data = {
        "name": "Jane Doe",
        "email": f"jane_{ts}@example.com",
        "countryCode": "+91",
        "mobile": "9876543210",
        "address": "456 Park St, Kolkata 700016",
        "zipCode": "700016",
        "password": "Password@123",
        "preferences": "Email notifications for all updates"
    }
    res = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    print("Status:", res.status_code, "Response:", res.json())
    cust_id = res.json().get("customerId")
    assert res.status_code == 200 and cust_id is not None

    # 3. Customer Login
    print("\n3. Testing Customer Login...")
    res = requests.post(f"{BASE_URL}/auth/login", json={"customerId": cust_id, "password": "Password@123"})
    print("Status:", res.status_code, "Response:", res.json())
    assert res.status_code == 200 and res.json().get("name") == "Jane Doe"

    # 4. Cost Calculation
    # Example calculation from spreadsheet:
    # 2000g, Express Delivery (80), Premium Packing (30)
    # (50 + 0.02*2000 + 80 + 30) * 1.05 = 200 * 1.05 = 210
    print("\n4. Testing Cost Calculation Formula...")
    calc_data = {"weight": 2000, "deliveryType": "Express", "packingPreference": "Premium", "isOfficer": False}
    res = requests.post(f"{BASE_URL}/bookings/calculate-cost", json=calc_data)
    print("Customer Cost (expected 210.0):", res.json())
    assert res.json().get("cost") == 210.0

    # Officer cost with 50 admin fee: (50 + 40 + 80 + 30 + 50) * 1.05 = 250 * 1.05 = 262.5
    calc_data_officer = {"weight": 2000, "deliveryType": "Express", "packingPreference": "Premium", "isOfficer": True}
    res = requests.post(f"{BASE_URL}/bookings/calculate-cost", json=calc_data_officer)
    print("Officer Cost (expected 262.5):", res.json())
    assert res.json().get("cost") == 262.5

    # 5. Customer Create Booking
    print("\n5. Testing Customer Create Booking...")
    booking_data = {
        "customerId": cust_id,
        "senderName": "Jane Doe",
        "senderAddress": "456 Park St, Kolkata",
        "senderContact": "9876543210",
        "receiverName": "Robert Brown",
        "receiverAddress": "789 MG Road, Bengaluru 560001",
        "receiverPin": "560001",
        "receiverMobile": "9845012345",
        "parcelWeightInGram": 2000,
        "parcelContentsDescription": "Books and Gifts",
        "parcelDeliveryType": "Express",
        "parcelPackingPreference": "Premium",
        "parcelPickupTime": "2026-08-25T10:00",
        "parcelDropoffTime": "2026-08-26T18:00"
    }
    res = requests.post(f"{BASE_URL}/bookings/customer", json=booking_data)
    print("Status:", res.status_code, "Response:", res.json())
    booking_id = res.json().get("bookingId")
    assert res.status_code == 200 and booking_id is not None

    # 6. Payment Processing
    print("\n6. Testing Payment Processing...")
    pay_data = {
        "bookingId": booking_id,
        "cardNumber": "4532111122223333",
        "expiryDate": "12/28",
        "cvv": "123",
        "cardholderName": "Jane Doe",
        "cardType": "Credit"
    }
    res = requests.post(f"{BASE_URL}/payments", json=pay_data)
    print("Status:", res.status_code, "Response:", res.json())
    assert res.status_code == 200 and res.json().get("transactionStatus") == "Success"

    # 7. Check Booking Status after Payment (should be 'Booked')
    print("\n7. Verifying Booking Status after Payment...")
    res = requests.get(f"{BASE_URL}/bookings/{booking_id}")
    print("Booking Status (expected 'Booked'):", res.json().get("status"))
    assert res.json().get("status") == "Booked"

    # 8. Update Delivery Status (Officer update to 'InTransit' then 'Delivered')
    print("\n8. Testing Officer Update Status...")
    res = requests.put(f"{BASE_URL}/bookings/{booking_id}/status", json={"status": "InTransit"})
    print("InTransit Update:", res.json())
    res = requests.put(f"{BASE_URL}/bookings/{booking_id}/status", json={"status": "Delivered"})
    print("Delivered Update:", res.json())
    assert res.json().get("booking", {}).get("status") == "Delivered"

    # 9. Update Pickup/Dropoff Schedule
    print("\n9. Testing Officer Update Schedule...")
    res = requests.put(f"{BASE_URL}/bookings/{booking_id}/schedule", json={"pickupTime": "2026-08-25T11:30", "dropoffTime": "2026-08-26T16:00"})
    print("Schedule Update:", res.json())
    assert res.json().get("success") == True

    # 10. Submit Feedback
    print("\n10. Testing Feedback Submission for Delivered Parcel...")
    fb_data = {
        "bookingId": booking_id,
        "customerId": cust_id,
        "customerName": "Jane Doe",
        "description": "Excellent express delivery service! Arrived right on schedule.",
        "rating": 5
    }
    res = requests.post(f"{BASE_URL}/feedback", json=fb_data)
    print("Status:", res.status_code, "Response:", res.json())
    assert res.status_code == 200

    # 11. Retrieve Feedback
    print("\n11. Testing Get All Feedback (Officer view)...")
    res = requests.get(f"{BASE_URL}/feedback/all")
    print("All Feedback records:", len(res.json()))
    assert len(res.json()) >= 1

    # 12. Officer Book on Behalf of Customer
    print("\n12. Testing Officer Booking on Behalf...")
    officer_bkg = {
        "customerId": cust_id,
        "senderName": "Jane Doe",
        "senderAddress": "456 Park St, Kolkata",
        "senderContact": "9876543210",
        "receiverName": "Sam Wilson",
        "receiverAddress": "101 Anna Salai, Chennai 600002",
        "receiverPin": "600002",
        "receiverMobile": "9876540000",
        "parcelWeightInGram": 1000,
        "parcelContentsDescription": "Sample Fabrics",
        "parcelDeliveryType": "Standard",
        "parcelPackingPreference": "Basic",
        "parcelPickupTime": "2026-08-25T09:00",
        "parcelDropoffTime": "2026-08-27T17:00"
    }
    res = requests.post(f"{BASE_URL}/bookings/officer", json=officer_bkg)
    print("Officer Booking created:", res.json())
    officer_bkg_id = res.json().get("bookingId")
    assert res.json().get("booking", {}).get("status") == "Assigned"

    # 13. Cancel Booking Test
    # Customer cancels their own booking (let's create a booked one to cancel)
    print("\n13. Testing Cancellation Workflow...")
    res = requests.put(f"{BASE_URL}/bookings/{officer_bkg_id}/cancel", json={"customerId": cust_id, "role": "OFFICER"})
    print("Officer Cancel Result:", res.json())
    assert res.json().get("success") == True

    print("\n========================================")
    print("ALL 13 BACKEND API TESTS PASSED 100%!")
    print("========================================")

if __name__ == "__main__":
    test_api()
