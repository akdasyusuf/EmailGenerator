# Quick Reference Guide

## Available Functions

### `generate_random_email_uuid()`
**Purpose**: Generate random email addresses for testing  
**Parameters**: None  
**Returns**: `str` - Random email like `a1b2c3d@gmail.com`  

```python
from main import generate_random_email_uuid

# Basic usage
email = generate_random_email_uuid()
```

---

## Common Use Cases

### Single Email Generation
```python
email = generate_random_email_uuid()
print(email)  # Output: "a1b2c3d@gmail.com"
```

### Batch Generation
```python
emails = [generate_random_email_uuid() for _ in range(5)]
```

### Test Data Creation
```python
test_users = [
    {"name": "User 1", "email": generate_random_email_uuid()},
    {"name": "User 2", "email": generate_random_email_uuid()},
]
```

---

## Key Properties

- ✅ **Thread-safe**
- ✅ **No external dependencies**
- ✅ **High uniqueness probability**
- ⚠️ **Fixed Gmail domain**
- ⚠️ **7-character prefix only**

---

## Installation
```bash
# No installation required - uses Python standard library only
python main.py  # Test the function
```

---

*For detailed documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*