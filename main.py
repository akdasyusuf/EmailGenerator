import uuid
def generate_random_email_uuid():
    domain = "@gmail.com"
    unique_id = str(uuid.uuid4()).replace("-", "")[:7]
    return unique_id + domain
# Example usage
random_email = generate_random_email_uuid()
print(random_email)