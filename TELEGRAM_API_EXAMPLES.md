# Telegram API - Example Requests

## 🔧 Testing with curl

### 1. Get Settings

```bash
curl -X GET http://localhost:8000/api/settings/
```

**Response:**
```json
{
  "id": 1,
  "telegram_bot_token": "",
  "telegram_chat_id": "",
  "reminder_days": 7,
  "auto_reminders_enabled": true,
  "gym_phone": "",
  "gym_name": "Sinen Gym",
  "updated_at": "2026-03-12T10:30:00Z"
}
```

### 2. Update Settings

```bash
curl -X PATCH http://localhost:8000/api/settings/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_bot_token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
    "telegram_chat_id": "-1001234567890",
    "gym_phone": "+251912345678",
    "auto_reminders_enabled": true
  }'
```

**Response:**
```json
{
  "id": 1,
  "telegram_bot_token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
  "telegram_chat_id": "-1001234567890",
  "reminder_days": 7,
  "auto_reminders_enabled": true,
  "gym_phone": "+251912345678",
  "gym_name": "Sinen Gym",
  "updated_at": "2026-03-12T10:35:00Z"
}
```

### 3. Send Test Message

```bash
curl -X POST http://localhost:8000/api/telegram/test \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from Sinen Gym! This is a test message. 🏋️"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Test message sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Chat not found"
}
```

### 4. Send Reminders Manually

```bash
curl -X POST http://localhost:8000/api/telegram/send-reminders
```

**Response:**
```json
{
  "status": "success",
  "sent": 5,
  "errors": []
}
```

**With Errors:**
```json
{
  "status": "success",
  "sent": 3,
  "errors": [
    "Ahmed Ali: Chat not found",
    "Sara Mohamed: Bot was blocked by the user"
  ]
}
```

**Disabled:**
```json
{
  "status": "disabled",
  "sent": 0
}
```

### 5. Get Statistics

```bash
curl -X GET http://localhost:8000/api/telegram/stats
```

**Response:**
```json
{
  "configured": true,
  "auto_reminders_enabled": true,
  "sent_today": 12,
  "successful_today": 11,
  "failed_today": 1,
  "total_sent": 156,
  "total_successful": 148,
  "success_rate": 94.9
}
```

### 6. Get Reminder History

```bash
# All reminders
curl -X GET http://localhost:8000/api/telegram-reminders/

# For specific member
curl -X GET http://localhost:8000/api/telegram-reminders/?member_id=5
```

**Response:**
```json
[
  {
    "id": 1,
    "member": 5,
    "member_name": "Ahmed Ali",
    "reminder_type": "d_minus_3",
    "sent_at": "2026-03-12T09:00:00Z",
    "message": "Hi Ahmed Ali, your membership expires in 3 days...",
    "success": true,
    "error_message": null
  },
  {
    "id": 2,
    "member": 5,
    "reminder_type": "d_minus_1",
    "sent_at": "2026-03-14T09:00:00Z",
    "message": "Hi Ahmed Ali, your membership expires tomorrow...",
    "success": true,
    "error_message": null
  }
]
```

## 🧪 Testing with Postman

### Collection Setup

1. Create new collection: "Sinen Gym - Telegram"
2. Set base URL variable: `{{base_url}}` = `http://localhost:8000`

### Request 1: Get Settings
- **Method**: GET
- **URL**: `{{base_url}}/api/settings/`
- **Headers**: None required

### Request 2: Update Settings
- **Method**: PATCH
- **URL**: `{{base_url}}/api/settings/1/`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "telegram_bot_token": "YOUR_BOT_TOKEN",
  "telegram_chat_id": "YOUR_CHAT_ID",
  "gym_phone": "+251912345678"
}
```

### Request 3: Send Test Message
- **Method**: POST
- **URL**: `{{base_url}}/api/telegram/test`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "message": "Test message from Postman! 🚀"
}
```

### Request 4: Trigger Reminders
- **Method**: POST
- **URL**: `{{base_url}}/api/telegram/send-reminders`
- **Headers**: None required
- **Body**: None

### Request 5: Get Stats
- **Method**: GET
- **URL**: `{{base_url}}/api/telegram/stats`
- **Headers**: None required

### Request 6: Get Reminder History
- **Method**: GET
- **URL**: `{{base_url}}/api/telegram-reminders/`
- **Headers**: None required
- **Query Params** (optional):
  - `member_id`: 5

## 🐍 Testing with Python

### Using requests library

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Get Settings
response = requests.get(f"{BASE_URL}/api/settings/")
print(response.json())

# 2. Update Settings
data = {
    "telegram_bot_token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
    "telegram_chat_id": "-1001234567890",
    "gym_phone": "+251912345678"
}
response = requests.patch(f"{BASE_URL}/api/settings/1/", json=data)
print(response.json())

# 3. Send Test Message
data = {"message": "Test from Python! 🐍"}
response = requests.post(f"{BASE_URL}/api/telegram/test", json=data)
print(response.json())

# 4. Trigger Reminders
response = requests.post(f"{BASE_URL}/api/telegram/send-reminders")
print(response.json())

# 5. Get Statistics
response = requests.get(f"{BASE_URL}/api/telegram/stats")
print(response.json())

# 6. Get Reminder History
response = requests.get(f"{BASE_URL}/api/telegram-reminders/")
print(response.json())

# Get reminders for specific member
response = requests.get(f"{BASE_URL}/api/telegram-reminders/?member_id=5")
print(response.json())
```

## 🧪 Integration Test Script

```python
#!/usr/bin/env python3
"""
Telegram Integration Test Script
Tests all Telegram endpoints
"""

import requests
import sys

BASE_URL = "http://localhost:8000"

def test_get_settings():
    """Test getting settings"""
    print("Testing GET settings...")
    response = requests.get(f"{BASE_URL}/api/settings/")
    assert response.status_code == 200
    print("✅ GET settings passed")
    return response.json()

def test_update_settings(bot_token, chat_id):
    """Test updating settings"""
    print("Testing PATCH settings...")
    data = {
        "telegram_bot_token": bot_token,
        "telegram_chat_id": chat_id,
        "gym_phone": "+251912345678"
    }
    response = requests.patch(f"{BASE_URL}/api/settings/1/", json=data)
    assert response.status_code == 200
    print("✅ PATCH settings passed")
    return response.json()

def test_send_test_message():
    """Test sending test message"""
    print("Testing POST test message...")
    data = {"message": "Integration test message 🧪"}
    response = requests.post(f"{BASE_URL}/api/telegram/test", json=data)
    
    if response.status_code == 200:
        print("✅ POST test message passed")
        return True
    else:
        print(f"❌ POST test message failed: {response.json()}")
        return False

def test_get_stats():
    """Test getting statistics"""
    print("Testing GET stats...")
    response = requests.get(f"{BASE_URL}/api/telegram/stats")
    assert response.status_code == 200
    print("✅ GET stats passed")
    return response.json()

def test_send_reminders():
    """Test sending reminders"""
    print("Testing POST send reminders...")
    response = requests.post(f"{BASE_URL}/api/telegram/send-reminders")
    assert response.status_code == 200
    print("✅ POST send reminders passed")
    return response.json()

def test_get_reminder_history():
    """Test getting reminder history"""
    print("Testing GET reminder history...")
    response = requests.get(f"{BASE_URL}/api/telegram-reminders/")
    assert response.status_code == 200
    print("✅ GET reminder history passed")
    return response.json()

def main():
    """Run all tests"""
    print("🧪 Starting Telegram Integration Tests\n")
    
    try:
        # Test 1: Get Settings
        settings = test_get_settings()
        print(f"Current settings: {settings}\n")
        
        # Test 2: Update Settings (if not configured)
        if not settings.get('telegram_bot_token'):
            print("⚠️  Bot token not configured. Skipping message tests.\n")
            bot_token = input("Enter bot token (or press Enter to skip): ")
            chat_id = input("Enter chat ID (or press Enter to skip): ")
            
            if bot_token and chat_id:
                test_update_settings(bot_token, chat_id)
                print()
        
        # Test 3: Send Test Message
        if settings.get('telegram_bot_token'):
            test_send_test_message()
            print()
        
        # Test 4: Get Statistics
        stats = test_get_stats()
        print(f"Statistics: {stats}\n")
        
        # Test 5: Send Reminders
        result = test_send_reminders()
        print(f"Reminders result: {result}\n")
        
        # Test 6: Get Reminder History
        history = test_get_reminder_history()
        print(f"Reminder history count: {len(history)}\n")
        
        print("✅ All tests passed!")
        return 0
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

## 🔍 Error Responses

### Invalid Bot Token
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Invalid Chat ID
```json
{
  "success": false,
  "error": "Chat not found"
}
```

### Bot Blocked
```json
{
  "success": false,
  "error": "Bot was blocked by the user"
}
```

### Missing Configuration
```json
{
  "success": false,
  "error": "Chat ID not configured"
}
```

### Network Error
```json
{
  "success": false,
  "error": "Network error: Connection timeout"
}
```

## 📝 Notes

- All endpoints return JSON
- POST endpoints require `Content-Type: application/json`
- Settings endpoint uses PATCH for updates (not PUT)
- Reminder history can be filtered by member_id
- Statistics are calculated in real-time
- Test messages don't create reminder records

## 🚀 Quick Test Sequence

```bash
# 1. Check if configured
curl http://localhost:8000/api/telegram/stats

# 2. If not configured, update settings
curl -X PATCH http://localhost:8000/api/settings/1/ \
  -H "Content-Type: application/json" \
  -d '{"telegram_bot_token":"YOUR_TOKEN","telegram_chat_id":"YOUR_CHAT_ID"}'

# 3. Send test message
curl -X POST http://localhost:8000/api/telegram/test \
  -H "Content-Type: application/json" \
  -d '{"message":"Test! 🎉"}'

# 4. Check stats again
curl http://localhost:8000/api/telegram/stats

# 5. Trigger reminders
curl -X POST http://localhost:8000/api/telegram/send-reminders

# 6. View history
curl http://localhost:8000/api/telegram-reminders/
```

---

Happy testing! 🧪
