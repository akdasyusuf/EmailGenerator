# Random Email Generator

A simple Python utility for generating random email addresses using UUID-based unique identifiers. Perfect for testing, development, and creating temporary user accounts.

## 🚀 Quick Start

```python
from main import generate_random_email_uuid

# Generate a random email
email = generate_random_email_uuid()
print(email)  # Output: "a1b2c3d@gmail.com"
```

## 📋 Features

- **UUID-based Generation**: Uses UUID4 for high uniqueness probability
- **Thread-Safe**: Safe for concurrent usage
- **Zero Dependencies**: Uses only Python standard library
- **Fast Performance**: Constant-time O(1) operation
- **Simple API**: Single function, easy to integrate

## 📦 Installation

No installation required! Simply clone the repository and start using:

```bash
git clone <repository-url>
cd <project-directory>
python3 main.py  # Test the function
```

**Requirements**: Python 3.6 or higher

## 📖 Documentation

### 📚 Complete Documentation
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Comprehensive API documentation with detailed examples, usage guidelines, and best practices

### ⚡ Quick Reference
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Fast lookup guide for developers

### 🔍 Function Reference

| Function | Description | Returns |
|----------|-------------|---------|
| `generate_random_email_uuid()` | Generates random email with UUID prefix | `str` |

## 🔧 Usage Examples

### Basic Usage
```python
import main

email = main.generate_random_email_uuid()
print(f"Generated: {email}")
```

### Batch Generation
```python
# Generate multiple emails
emails = [main.generate_random_email_uuid() for _ in range(5)]
print(emails)
```

### Test Data Creation
```python
# Create test users
test_users = []
for i in range(10):
    user = {
        'id': i + 1,
        'email': main.generate_random_email_uuid(),
        'created_at': datetime.now()
    }
    test_users.append(user)
```

## 🎯 Use Cases

- **Testing**: Generate test email addresses for unit tests
- **Development**: Create temporary user accounts during development
- **Data Generation**: Populate databases with sample data
- **Prototyping**: Quick email generation for mockups and prototypes

## ⚙️ Technical Details

- **Algorithm**: UUID4 generation → hyphen removal → 7-character truncation → domain append
- **Uniqueness**: Extremely high probability (~1 in 268 million for 7-char prefix)
- **Performance**: Microsecond execution time
- **Thread Safety**: Fully thread-safe
- **Memory**: Minimal memory footprint

## 🚨 Important Notes

- **Fixed Domain**: Currently uses `@gmail.com` (hardcoded)
- **Testing Only**: Not for production email validation
- **No Verification**: Generated emails are not validated or checked
- **7-Character Limit**: Email prefix is limited to 7 characters

## 🔮 Future Enhancements

- [ ] Configurable domain support
- [ ] Variable prefix length options
- [ ] Email format validation
- [ ] Collision detection
- [ ] Batch generation optimizations

## 📄 License

[Add your license information here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

**Documentation Status**: ✅ Complete  
**Last Updated**: 2024  
**Version**: 1.0.0