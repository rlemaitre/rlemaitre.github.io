---
created: 2025-07-13T14:32:25+02:00
updated: 2025-07-13T18:50:06+02:00
title: Domain Identity Protocol
publish: false
tags:
  - identity
  - indieweb
---
**A decentralised identity system based on domain ownership and PGP cryptography**
## Table of Contents
1. [Overview](#overview)
2. [Core Principle](#core-principle)
3. [File Format](#file-format)
4. [Validation Rules](#validation-rules)
5. [Domain Scope](#domain-scope)
6. [Transport Security](#transport-security)
7. [Key Rotation and Revocation](#key-rotation-and-revocation)
8. [Caching and Updates](#caching-and-updates)
9. [Error Codes](#error-codes)
10. [Implementation Examples](#implementation-examples)
11. [Future Compatibility](#future-compatibility)

## Overview

The Domain Identity Protocol provides a simple, decentralised way to prove ownership of both a domain name and a PGP key pair. This creates a cryptographically verifiable identity that doesn't rely on any central authority.

**Use cases:**
- Signing content and recommendations
- Establishing trust networks
- Decentralised authentication
- Web of trust without central PKI
## Core Principle

> [!quote]
> 
> I control this domain AND this PGP key, therefore this combination proves my identity.

The protocol combines:
- **Domain control**: Ability to publish content at `domain.com/.well-known/identity.json`
- **Cryptographic proof**: PGP signature proving possession of the private key
## File Format
### Location
Identity files MUST be published at:
```
https://example.com/.well-known/identity.json
```
### JSON Structure
```json
{
  "version": "1.0",
  "domain": "example.com",
  "identity": {
    "pgp_key": "-----BEGIN PGP PUBLIC KEY BLOCK-----\nversion: GnuPG v2\n\nmQINBGYrEx...\n-----END PGP PUBLIC KEY BLOCK-----",
    "fingerprint": "ABC1 2345 6789 0DEF GHIJ  KLMN OPQR STUV WXYZ 0123",
    "key_id": "WXYZ0123",
    "algorithm": "RSA-4096",
    "created": "2025-06-01T10:00:00Z",
    "expires": "2027-06-01T10:00:00Z"
  },
  "published": "2025-06-01T10:00:00Z",
  "signature": "-----BEGIN PGP SIGNATURE-----\nversion: GnuPG v2\n\niQIcBAABCgAG...\n-----END PGP SIGNATURE-----"
}
```
### Field Definitions
#### Required Fields
| Field                  | Type   | Description                                              |
| ---------------------- | ------ | -------------------------------------------------------- |
| `version`              | string | Protocol version, currently "1.0"                        |
| `domain`               | string | Domain name, must match hosting domain exactly           |
| `identity.pgp_key`     | string | Complete PGP public key in ASCII armor format            |
| `identity.fingerprint` | string | PGP key fingerprint (with or without spaces)             |
| `published`            | string | ISO 8601 UTC timestamp of publication                    |
| `signature`            | string | PGP signature of the JSON content (excluding this field) |
#### Optional Fields
| Field                | Type      | Description                                       |
| -------------------- | --------- | ------------------------------------------------- |
| `identity.key_id`    | string    | Short key ID for convenience                      |
| `identity.algorithm` | string    | Key algorithm and size (e.g., "RSA-4096")         |
| `identity.created`   | timestamp | ISO 8601 UTC timestamp of key creation            |
| `identity.expires`   | timestamp | ISO 8601 UTC timestamp of key expiration (if any) |
## Validation Rules
### 1. JSON Syntax
- File MUST be valid JSON
- Content-Type SHOULD be `application/json`
### 2. Required Fields
- All required fields MUST be present
- No field MAY be null or empty string
### 3. Domain Correspondence
- The `domain` field MUST exactly match the final resolved domain serving the file (after following redirections)
- Case-insensitive comparison
- No wildcard or subdomain inheritance
### 4. PGP Key Validation
- `pgp_key` MUST be a valid PGP public key
- Key MUST NOT be expired at validation time
- Key SHOULD use RSA-4096 or higher (RSA-2048 minimum)
### 5. Fingerprint Verification
- `fingerprint` MUST match the provided PGP key
- Spaces in fingerprint are ignored for comparison
### 6. Timestamp Validation
- `published` MUST NOT be in the future
- Tolerance of ±5 minutes for clock skew
### 7. Signature Verification
- Create unsigned version by removing `signature` field
- Verify signature against unsigned JSON using provided public key
- Signature MUST be valid and made with the identity key
## Domain Scope
### Strict Domain Binding
An identity is valid **ONLY** for the exact domain where it's published:
- `example.com/.well-known/identity.json` → Valid for `example.com`
- `blog.example.com/.well-known/identity.json` → Valid for `blog.example.com`
- `www.example.com/.well-known/identity.json` → Valid for `www.example.com`
### No Subdomain Inheritance
There is NO automatic inheritance between domains and subdomains. Each domain/subdomain requiring an identity MUST publish its own identity file.
### Canonical Domain and Redirections
When a domain serves identical content on both apex and www variants (or other aliases), the identity file SHOULD be served from one canonical location with HTTP redirections from aliases.
**Example:**
- `example.com/.well-known/identity.json` → serves the identity file
- `www.example.com/.well-known/identity.json` → 301 redirect to canonical location
**Client behavior:**
- Clients MUST follow HTTP 301/302 redirections when resolving identity files
- The final resolved domain MUST match the `domain` field in the identity file
- Maximum of 5 redirections to prevent infinite loops
### Key Reuse Across Domains
The same PGP key MAY be used across multiple domains. This creates distinct **domain identities** that share the same **cryptographic identity**.
**Example:**
- `alice.com` with key ABC123 → Domain identity #1
- `alice-blog.com` with key ABC123 → Domain identity #2
- Same person, different domain contexts
**Privacy considerations:** Using the same key across domains may reveal that they belong to the same person. Consider generating separate keys if this linkability is undesirable.
**Legitimate use cases:**
- Domain migration while maintaining cryptographic continuity
- Separate personal/professional contexts with shared identity
- Consolidating multiple online presences under one cryptographic identity
**Implementation note:** Tools MAY detect shared keys across domains and inform users about potential identity relationships, but MUST treat each domain identity as distinct for validation and reputation purposes.
## Transport Security
### HTTPS Recommendation
- HTTPS is **strongly recommended** but not required
- Clients SHOULD warn users when validating HTTP-served identities
- HTTP serves to enable adoption where TLS setup is difficult
### Client Behavior
**For HTTPS identities:**
- Validate normally
- Require valid TLS certificate
**For HTTP identities:**
- Display security warning
- Allow user to choose whether to accept
- Log the insecure nature of the validation
**For protocol changes:**
- `HTTPS`→`HTTP`: Security alert
- `HTTP`→`HTTPS`: Informational notice
## Key Rotation and Revocation
### Normal Key Rotation
When a key is expiring or needs replacement:
1. Generate new PGP key pair
2. Create new identity file with new key
3. **Sign with the OLD key** to prove continuity
4. Publish new identity file
5. Optionally publish key revocation to public keyservers
#### Rotation Format
```json
{
  "version": "1.0",
  "domain": "example.com",
  "identity": {
    // ... new key details
  },
  "previous_key": "ABC1 2345 6789 0DEF GHIJ  KLMN OPQR STUV WXYZ 0123",
  "published": "2025-06-15T10:00:00Z",
  "signature": "..." // Signed with OLD key
}
```
### Emergency Revocation
When the private key is compromised and cannot be used:
#### Step 1: Domain-based Revocation
Publish `/.well-known/revocation.txt`:
```
REVOKED: Identity key ABC1234567890DEFGHIJ compromised on 2025-06-01T15:30:00Z
Reason: Private key suspected compromised
New identity will be published after grace period
Grace period: 72 hours from revocation
Contact: [alternative contact method if desired]
```
#### Step 2: Grace Period
- Wait minimum 72 hours before publishing new identity
- Clients SHOULD reject the old key during this period
- Allows time for revocation to propagate
#### Step 3: New Identity
- Publish new identity with new key
- Cannot prove continuity cryptographically
- Relies on domain control for authenticity
## Caching and Updates
### Recommended TTL
| Situation | TTL | Reason |
|-----------|-----|--------|
| Normal identity | 24 hours | Identities change rarely |
| Key expiring soon (<30 days) | 1 hour | May need rotation |
| After revocation | 5 minutes | Quick propagation needed |
### HTTP Headers
Servers SHOULD provide appropriate caching headers:
```http
Cache-Control: public, max-age=86400
ETag: "sha256-abc123..."
Last-Modified: Thu, 01 Jun 2025 10:00:00 GMT
```
Clients SHOULD respect these headers and use conditional requests.
## Error Codes
### Validation Errors
| Code | Description |
|------|-------------|
| `INVALID_JSON` | File is not valid JSON |
| `MISSING_FIELD` | Required field is missing |
| `DOMAIN_MISMATCH` | Domain field doesn't match final resolved domain |
| `INVALID_PGP_KEY` | PGP key is malformed or invalid |
| `FINGERPRINT_MISMATCH` | Fingerprint doesn't match the key |
| `INVALID_SIGNATURE` | Signature verification failed |
| `FUTURE_TIMESTAMP` | Published timestamp is in the future |
| `EXPIRED_KEY` | PGP key has expired |
| `TOO_MANY_REDIRECTS` | Exceeded maximum redirections (5) |
| `KEYSERVER_MISMATCH` | Cross-validation: keyserver fingerprint differs from domain |
### Security Warnings
| Code | Description |
|------|-------------|
| `HTTP_INSECURE` | Identity served over HTTP instead of HTTPS |
| `REVOKED_KEY` | Key has been revoked (revocation.txt exists) |
| `WEAK_KEY` | Key size below recommended strength |
## Implementation Examples
### Creating an Identity
```bash
# 1. Generate PGP key
gpg --batch --generate-key <<EOF
Key-Type: RSA
Key-Length: 4096
Name-Real: John Doe
Name-Email: john@example.com
Expire-Date: 2y
%commit
EOF

# 2. Export public key
gpg --armor --export john@example.com > public-key.asc

# 3. Create identity file (without signature)
cat > identity-unsigned.json <<EOF
{
  "version": "1.0",
  "domain": "example.com",
  "identity": {
    "pgp_key": "$(cat public-key.asc)",
    "fingerprint": "$(gpg --fingerprint john@example.com | grep fingerprint | cut -d= -f2 | tr -d ' ')"
  },
  "published": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# 4. Sign the file
gpg --detach-sign --armor identity-unsigned.json

# 5. Combine signature into final file
jq --rawfile sig identity-unsigned.json.asc '. + {signature: $sig}' identity-unsigned.json > identity.json

# 6. Upload to /.well-known/identity.json
```
### Validating an Identity
```bash
# 1. Download identity file (following redirections)
curl -L -s https://example.com/.well-known/identity.json > identity.json

# 2. Extract and import public key
jq -r '.identity.pgp_key' identity.json | gpg --import

# 3. Verify domain matches (after any redirections)
DOMAIN=$(jq -r '.domain' identity.json)
if [ "$DOMAIN" != "example.com" ]; then
  echo "ERROR: Domain mismatch"
  exit 1
fi

# 4. Create unsigned version for verification
jq 'del(.signature)' identity.json > identity-unsigned.json

# 5. Verify signature
jq -r '.signature' identity.json | gpg --verify - identity-unsigned.json

echo "Identity validation successful"
```
## Future Compatibility
### Versioning
- The `version` field ensures forward compatibility
- New versions MAY add optional fields
- New versions MUST NOT break existing required fields
- Clients SHOULD accept higher minor versions (1.1, 1.2) but warn on major versions (2.0)
### Extension Mechanism
Future versions may add an `extensions` object for new features:
```json
{
  "version": "1.1",
  // ... existing fields
  "extensions": {
    "delegation": {
      "subdomains": ["*.blog.example.com"],
      "signature": "..."
    },
    "backup_keys": [
      {
        "fingerprint": "...",
        "purpose": "revocation"
      }
    ]
  }
}
```
### Deprecation Policy
- Features will be marked deprecated for at least one major version
- Clients SHOULD warn about deprecated features
- Removal only occurs in major version increments
## Security Considerations
### Trust Model
- This protocol provides **authentication** (proving control of domain + key)
- It does NOT provide **authorization** (what the identity is allowed to do)
- Trust must be established through other means (web of trust, reputation systems)
- **Domain identities** are distinct even when sharing the same key - reputation and trust should be tracked per domain, not per key
### Attack Scenarios
| Attack | Mitigation |
|--------|------------|
| DNS hijacking | Use HTTPS, monitor for unexpected changes |
| Server compromise | Private key stored separately from web server |
| Key compromise | Emergency revocation mechanism |
| Man-in-the-middle | HTTPS strongly recommended |
| Replay attacks | Timestamps and signature verification |
| Key linkability | Use separate keys for unrelated domains if privacy is critical |
### Best Practices
1. **Use HTTPS** whenever possible
2. **Store private keys securely**, preferably offline
3. **Monitor for unexpected changes** to your published identity
4. **Set key expiration dates** to force regular rotation
5. **Generate revocation certificates** when creating keys
6. **Consider key separation** for unrelated domains to maintain privacy
## References
- [RFC 5785: Defining Well-Known Uniform Resource Identifiers (URIs)](https://tools.ietf.org/html/rfc5785)
- [RFC 4880: OpenPGP Message Format](https://tools.ietf.org/html/rfc4880)
- [RFC 3339: Date and Time on the Internet: Timestamps](https://tools.ietf.org/html/rfc3339)
