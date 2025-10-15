---
created: 2025-07-13T14:38:07+02:00
updated: 2025-09-04T18:11:31+02:00
title: Domain Identity Authentication Protocol
publish: false
---
**A web authentication system based on the Domain Identity Protocol**
## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Authentication Methods](#authentication-methods)
4. [Challenge-Response Authentication](#challenge-response-authentication)
5. [Client Certificate Authentication](#client-certificate-authentication)
6. [Security Considerations](#security-considerations)
7. [Implementation Examples](#implementation-examples)
8. [Error Handling](#error-handling)

## Overview

The Domain Identity Authentication Protocol enables web services to authenticate users based on their Domain Identity Protocol identities. Users prove ownership of both a domain and its associated PGP key to gain access to services.

**Key benefits:**
- No passwords to remember or store
- Cryptographically strong authentication
- Decentralized identity management
- No user database required on services

---

## Prerequisites

### Required Components

1. **Domain Identity** - User must have a valid Domain Identity published at `domain.com/.well-known/identity.json`
2. **PGP Key Pair** - Private key for signing challenges or generating certificates
3. **Service Support** - Web service must implement Domain Identity validation

### Supported Authentication Methods

This protocol supports two authentication methods:

1. **Challenge-Response** - Manual signing of cryptographic challenges
2. **Client Certificates** - Automated browser-based authentication (recommended)

---

## Authentication Methods

### Method Comparison

| Aspect | Challenge-Response | Client Certificates |
|--------|-------------------|-------------------|
| **User Experience** | Manual copy/paste | Automatic browser popup |
| **Security** | High | High |
| **Setup Complexity** | Low | Medium |
| **Browser Support** | Universal | Universal |
| **Offline Capable** | Yes | Yes |
| **Recommended For** | Technical users, CLIs | General users, web apps |

---

## Challenge-Response Authentication

### Workflow

1. **Initiation**: User provides their domain to the service
2. **Identity Discovery**: Service fetches and validates domain identity
3. **Challenge Generation**: Service creates a cryptographic challenge
4. **User Signing**: User signs challenge with their private key
5. **Verification**: Service verifies signature and creates session

### Challenge Format

```json
{
  "service": "https://myapp.com",
  "challenge": "auth-request",
  "domain": "alice.com",
  "timestamp": "2025-06-01T15:30:00Z",
  "nonce": "abc123def456...",
  "expires": "2025-06-01T15:35:00Z"
}
```

#### Challenge Fields

| Field | Type | Description |
|-------|------|-------------|
| `service` | string | URL of the authenticating service |
| `challenge` | string | Fixed value "auth-request" |
| `domain` | string | User's domain being authenticated |
| `timestamp` | string | Challenge creation time (ISO 8601 UTC) |
| `nonce` | string | Unique random value (min 32 bytes hex) |
| `expires` | string | Challenge expiration time (5 minutes max) |

### API Endpoints

#### POST `/auth/challenge`

Initiate authentication and receive challenge.

**Request:**
```json
{
  "domain": "alice.com"
}
```

**Response (Success):**
```json
{
  "challenge": {
    "service": "https://myapp.com",
    "challenge": "auth-request",
    "domain": "alice.com",
    "timestamp": "2025-06-01T15:30:00Z",
    "nonce": "abc123def456...",
    "expires": "2025-06-01T15:35:00Z"
  },
  "instructions": "Sign this challenge with your PGP key and submit the signature"
}
```

**Response (Error):**
```json
{
  "error": "INVALID_DOMAIN_IDENTITY",
  "message": "Unable to validate identity for domain alice.com"
}
```

#### POST `/auth/verify`

Submit signed challenge for verification.

**Request:**
```json
{
  "nonce": "abc123def456...",
  "signature": "-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256\n\n{\"service\":\"https://myapp.com\"...}\n-----BEGIN PGP SIGNATURE-----\n...\n-----END PGP SIGNATURE-----"
}
```

**Response (Success):**
```json
{
  "authenticated": true,
  "domain": "alice.com",
  "session_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600
}
```

### User Instructions

**For command line users:**
```bash
# 1. Save challenge to file
echo '{"service":"https://myapp.com"...}' > challenge.json

# 2. Sign with PGP
gpg --clearsign --armor challenge.json

# 3. Submit the .asc file content to the service
```

**For GUI users:**
```
1. Copy the challenge text
2. Open your PGP software (GPG Suite, Kleopatra, etc.)
3. Select "Sign Text" and paste the challenge
4. Copy the signed result back to the web form
```

---

## Client Certificate Authentication

### Overview

Client certificate authentication provides a seamless user experience by leveraging browser-native certificate management. Users generate X.509 certificates linked to their Domain Identity and browsers automatically present them when requested.

### Certificate Requirements

#### Certificate Subject
```
CN=alice.com
emailAddress=alice@alice.com  (optional)
```

#### Key Requirements
- **Public key MUST match** the PGP public key in the domain's identity file
- **Self-signed certificates** are acceptable
- **Validity period** SHOULD match PGP key expiration
- **Key algorithm** SHOULD be RSA-4096 or equivalent

### Certificate Generation

#### Using OpenSSL

```bash
# 1. Extract private key from PGP (if reusing same key)
gpg --export-secret-keys alice@alice.com | \
    openssl pkcs8 -inform PEM -outform PEM > alice.key

# 2. Generate certificate signing request
openssl req -new -key alice.key -out alice.csr \
    -subj "/CN=alice.com/emailAddress=alice@alice.com"

# 3. Self-sign the certificate
openssl x509 -req -in alice.csr -signkey alice.key \
    -out alice.crt -days 730

# 4. Create PKCS#12 bundle for browser import
openssl pkcs12 -export -out alice.p12 \
    -inkey alice.key -in alice.crt -name "alice.com Domain Identity"
```

#### Using Domain Identity Tools

```bash
# Recommended: Use domain identity toolchain
domain-identity cert generate --domain alice.com --output alice.p12
```

### Browser Installation

#### Chrome/Chromium
1. Settings → Privacy and Security → Security → Manage Certificates
2. Click "Import" in Personal Certificates
3. Select the `.p12` file and enter password
4. Certificate appears in list

#### Firefox
1. Preferences → Privacy & Security → Certificates → View Certificates
2. Click "Import" in Your Certificates tab
3. Select the `.p12` file and enter password
4. Certificate appears in list

#### Safari (macOS)
1. Double-click the `.p12` file
2. Keychain Access opens automatically
3. Enter password and select keychain
4. Certificate installed in login keychain

### Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name myapp.com;
    
    # Enable client certificate authentication
    ssl_verify_client optional;
    ssl_client_certificate /etc/ssl/certs/ca-certificates.crt;
    
    # Pass certificate information to backend
    location /api/ {
        proxy_set_header X-Client-Cert $ssl_client_escaped_cert;
        proxy_set_header X-Client-CN $ssl_client_s_dn_cn;
        proxy_set_header X-Client-Fingerprint $ssl_client_fingerprint;
        proxy_set_header X-Client-Verify $ssl_client_verify;
        proxy_pass http://backend;
    }
    
    # Require client certificate for protected areas
    location /secure/ {
        ssl_verify_client on;
        proxy_pass http://backend;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:443>
    ServerName myapp.com
    
    SSLEngine on
    SSLCertificateFile /path/to/server.crt
    SSLCertificateKeyFile /path/to/server.key
    
    # Enable client certificate authentication
    SSLVerifyClient optional
    SSLCACertificateFile /etc/ssl/certs/ca-certificates.crt
    
    # Pass certificate information
    SSLOptions +StdEnvVars +ExportCertData
    
    # Protected location requiring client cert
    <Location "/secure">
        SSLVerifyClient require
    </Location>
</VirtualHost>
```

### Backend Validation

```javascript
const express = require('express');
const crypto = require('crypto');

async function validateClientCertificate(req, res, next) {
    const clientCert = req.headers['x-client-cert'];
    const clientCN = req.headers['x-client-cn'];
    const clientVerify = req.headers['x-client-verify'];
    
    // No client certificate presented
    if (!clientCert || clientVerify !== 'SUCCESS') {
        return next();
    }
    
    try {
        // 1. Parse the certificate
        const certPem = Buffer.from(clientCert, 'base64').toString('utf-8');
        const cert = new crypto.X509Certificate(certPem);
        
        // 2. Extract domain from CN
        const domain = clientCN;
        if (!domain) {
            throw new Error('No domain in certificate CN');
        }
        
        // 3. Fetch and validate domain identity
        const identity = await fetchDomainIdentity(domain);
        await validateDomainIdentity(identity, domain);
        
        // 4. Extract certificate public key
        const certPublicKey = cert.publicKey.export({ 
            format: 'pem', 
            type: 'spki' 
        });
        
        // 5. Convert PGP key to PEM format for comparison
        const pgpPublicKey = await pgpKeyToPem(identity.identity.pgp_key);
        
        // 6. Verify keys match
        if (normalizePublicKey(certPublicKey) === normalizePublicKey(pgpPublicKey)) {
            req.user = {
                domain: domain,
                identity: identity,
                authenticated: true,
                method: 'client-certificate'
            };
        } else {
            console.warn(`Public key mismatch for domain ${domain}`);
        }
        
        next();
    } catch (error) {
        console.error('Certificate validation failed:', error);
        next();
    }
}

// Middleware to require authentication
function requireAuth(req, res, next) {
    if (!req.user || !req.user.authenticated) {
        return res.status(401).json({ 
            error: 'AUTHENTICATION_REQUIRED',
            message: 'This endpoint requires domain identity authentication' 
        });
    }
    next();
}

// Usage
app.use(validateClientCertificate);
app.get('/api/profile', requireAuth, (req, res) => {
    res.json({
        domain: req.user.domain,
        identity: req.user.identity
    });
});
```

---

## Security Considerations

### Challenge-Response Security

#### Challenge Properties
- **Uniqueness**: Each challenge MUST contain a unique nonce
- **Temporal Bounds**: Challenges MUST expire within 5 minutes
- **Service Binding**: Service URL prevents cross-service attacks
- **Replay Prevention**: Used nonces MUST be tracked and rejected

#### Signature Validation
- **Complete Verification**: Validate both signature and challenge content
- **Timestamp Validation**: Reject expired or future-dated challenges
- **Domain Verification**: Ensure signed domain matches identity domain

### Client Certificate Security

#### Certificate Validation
- **Domain Binding**: Certificate CN MUST match identity domain
- **Key Correspondence**: Certificate public key MUST match identity PGP key
- **Expiration Checking**: Validate certificate is not expired
- **Revocation Checking**: Check for certificate revocation if applicable

#### Browser Security
- **User Consent**: Browsers require user approval for certificate presentation
- **Selective Disclosure**: Certificates only presented when server requests
- **Secure Storage**: Private keys protected by OS-level security

### General Security

#### Identity Validation
- **Domain Ownership**: Validate control of domain through HTTPS
- **PGP Verification**: Verify PGP signatures in identity files
- **Cross-Validation**: Use keyserver verification when available
- **Cache Security**: Implement secure caching with appropriate TTLs

#### Attack Mitigation
- **Rate Limiting**: Prevent brute force authentication attempts
- **Logging**: Audit authentication attempts and failures
- **Monitoring**: Alert on suspicious authentication patterns
- **Secure Transport**: Require HTTPS for all authentication endpoints

---

## Implementation Examples

### Express.js Implementation

```javascript
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Redis = require('redis');

const app = express();
const redis = Redis.createClient();

// Domain Identity validation functions
async function fetchDomainIdentity(domain) {
    const response = await fetch(`https://${domain}/.well-known/identity.json`);
    if (!response.ok) {
        throw new Error(`Failed to fetch identity for ${domain}`);
    }
    return await response.json();
}

async function validateDomainIdentity(identity, domain) {
    // Implement validation logic from Domain Identity Protocol spec
    // Returns true if valid, throws error if invalid
}

// Challenge-Response Authentication
app.post('/auth/challenge', async (req, res) => {
    const { domain } = req.body;
    
    if (!domain) {
        return res.status(400).json({ error: 'MISSING_DOMAIN' });
    }
    
    try {
        // Validate domain identity
        const identity = await fetchDomainIdentity(domain);
        await validateDomainIdentity(identity, domain);
        
        // Generate challenge
        const challenge = {
            service: `https://${req.headers.host}`,
            challenge: 'auth-request',
            domain: domain,
            timestamp: new Date().toISOString(),
            nonce: crypto.randomBytes(32).toString('hex'),
            expires: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        };
        
        // Store challenge temporarily
        await redis.setex(`auth:${challenge.nonce}`, 300, JSON.stringify({
            challenge,
            identity
        }));
        
        res.json({
            challenge,
            instructions: 'Sign this challenge with your PGP key and submit the signature'
        });
        
    } catch (error) {
        res.status(400).json({
            error: 'INVALID_DOMAIN_IDENTITY',
            message: error.message
        });
    }
});

app.post('/auth/verify', async (req, res) => {
    const { nonce, signature } = req.body;
    
    if (!nonce || !signature) {
        return res.status(400).json({ error: 'MISSING_PARAMETERS' });
    }
    
    try {
        // Retrieve challenge
        const challengeData = await redis.get(`auth:${nonce}`);
        if (!challengeData) {
            return res.status(400).json({ error: 'CHALLENGE_NOT_FOUND' });
        }
        
        const { challenge, identity } = JSON.parse(challengeData);
        
        // Verify signature
        const isValid = await verifyPGPSignature(
            JSON.stringify(challenge),
            signature,
            identity.identity.pgp_key
        );
        
        if (!isValid) {
            return res.status(401).json({ error: 'INVALID_SIGNATURE' });
        }
        
        // Check expiration
        if (new Date() > new Date(challenge.expires)) {
            return res.status(401).json({ error: 'CHALLENGE_EXPIRED' });
        }
        
        // Create session token
        const sessionToken = jwt.sign(
            { 
                domain: challenge.domain,
                authenticated: true,
                method: 'challenge-response'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Clean up challenge
        await redis.del(`auth:${nonce}`);
        
        res.json({
            authenticated: true,
            domain: challenge.domain,
            session_token: sessionToken,
            expires_in: 3600
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'VERIFICATION_FAILED',
            message: error.message
        });
    }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
    res.json({
        domain: req.user.domain,
        authenticated: req.user.authenticated,
        method: req.user.method
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'ACCESS_TOKEN_REQUIRED' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'INVALID_ACCESS_TOKEN' });
        }
        req.user = user;
        next();
    });
}
```

### Python Flask Implementation

```python
import json
import time
import uuid
import redis
import requests
from flask import Flask, request, jsonify
from cryptography import x509
from cryptography.hazmat.primitives import serialization
import gnupg

app = Flask(__name__)
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def fetch_domain_identity(domain):
    """Fetch and validate domain identity."""
    response = requests.get(f'https://{domain}/.well-known/identity.json')
    response.raise_for_status()
    return response.json()

def validate_domain_identity(identity, domain):
    """Validate domain identity according to Domain Identity Protocol."""
    # Implement validation logic
    pass

def verify_pgp_signature(message, signature, public_key):
    """Verify PGP signature."""
    gpg = gnupg.GPG()
    key_result = gpg.import_keys(public_key)
    verified = gpg.verify(signature)
    return verified.valid

@app.route('/auth/challenge', methods=['POST'])
def create_challenge():
    data = request.get_json()
    domain = data.get('domain')
    
    if not domain:
        return jsonify({'error': 'MISSING_DOMAIN'}), 400
    
    try:
        # Validate domain identity
        identity = fetch_domain_identity(domain)
        validate_domain_identity(identity, domain)
        
        # Generate challenge
        challenge = {
            'service': f'https://{request.headers.get("Host")}',
            'challenge': 'auth-request',
            'domain': domain,
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'nonce': str(uuid.uuid4()).replace('-', ''),
            'expires': time.strftime('%Y-%m-%dT%H:%M:%SZ', 
                                   time.gmtime(time.time() + 300))
        }
        
        # Store challenge
        redis_client.setex(
            f'auth:{challenge["nonce"]}',
            300,
            json.dumps({'challenge': challenge, 'identity': identity})
        )
        
        return jsonify({
            'challenge': challenge,
            'instructions': 'Sign this challenge with your PGP key and submit the signature'
        })
        
    except Exception as e:
        return jsonify({
            'error': 'INVALID_DOMAIN_IDENTITY',
            'message': str(e)
        }), 400

@app.route('/auth/verify', methods=['POST'])
def verify_challenge():
    data = request.get_json()
    nonce = data.get('nonce')
    signature = data.get('signature')
    
    if not nonce or not signature:
        return jsonify({'error': 'MISSING_PARAMETERS'}), 400
    
    try:
        # Retrieve challenge
        challenge_data = redis_client.get(f'auth:{nonce}')
        if not challenge_data:
            return jsonify({'error': 'CHALLENGE_NOT_FOUND'}), 400
        
        challenge_info = json.loads(challenge_data)
        challenge = challenge_info['challenge']
        identity = challenge_info['identity']
        
        # Verify signature
        message = json.dumps(challenge, sort_keys=True)
        is_valid = verify_pgp_signature(
            message, 
            signature, 
            identity['identity']['pgp_key']
        )
        
        if not is_valid:
            return jsonify({'error': 'INVALID_SIGNATURE'}), 401
        
        # Check expiration
        expires = time.strptime(challenge['expires'], '%Y-%m-%dT%H:%M:%SZ')
        if time.time() > time.mktime(expires):
            return jsonify({'error': 'CHALLENGE_EXPIRED'}), 401
        
        # Create session (implement your preferred session management)
        session_token = create_session_token(challenge['domain'])
        
        # Clean up
        redis_client.delete(f'auth:{nonce}')
        
        return jsonify({
            'authenticated': True,
            'domain': challenge['domain'],
            'session_token': session_token,
            'expires_in': 3600
        })
        
    except Exception as e:
        return jsonify({
            'error': 'VERIFICATION_FAILED',
            'message': str(e)
        }), 500

def create_session_token(domain):
    """Create session token (implement according to your needs)."""
    # Implement JWT or other session token creation
    pass
```

---

## Error Handling

### Error Response Format

All error responses follow a consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error description",
  "details": {
    "additional": "context-specific information"
  }
}
```

### Error Codes

#### Authentication Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_DOMAIN` | 400 | Domain parameter not provided |
| `INVALID_DOMAIN_IDENTITY` | 400 | Domain identity validation failed |
| `DOMAIN_NOT_FOUND` | 404 | Domain identity file not accessible |
| `CHALLENGE_NOT_FOUND` | 400 | Challenge nonce not found or expired |
| `CHALLENGE_EXPIRED` | 401 | Challenge has exceeded expiration time |
| `INVALID_SIGNATURE` | 401 | PGP signature verification failed |
| `MISSING_PARAMETERS` | 400 | Required parameters missing from request |
| `VERIFICATION_FAILED` | 500 | Server error during verification process |

#### Certificate Authentication Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NO_CLIENT_CERTIFICATE` | 401 | No client certificate presented |
| `INVALID_CLIENT_CERTIFICATE` | 401 | Client certificate validation failed |
| `CERTIFICATE_EXPIRED` | 401 | Client certificate has expired |
| `KEY_MISMATCH` | 401 | Certificate key doesn't match domain identity |
| `UNTRUSTED_CERTIFICATE` | 401 | Certificate not signed by trusted CA |

#### General Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_REQUIRED` | 401 | Endpoint requires authentication |
| `ACCESS_TOKEN_REQUIRED` | 401 | Bearer token missing from request |
| `INVALID_ACCESS_TOKEN` | 403 | Access token invalid or expired |
| `INSUFFICIENT_PRIVILEGES` | 403 | Authenticated but lacking required permissions |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many authentication attempts |

### Client Error Handling

```javascript
// JavaScript client example
async function authenticateWithDomain(domain) {
    try {
        // Request challenge
        const challengeResponse = await fetch('/auth/challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain })
        });
        
        if (!challengeResponse.ok) {
            const error = await challengeResponse.json();
            throw new Error(`Authentication failed: ${error.message}`);
        }
        
        const { challenge } = await challengeResponse.json();
        
        // Present challenge to user for signing
        const signature = await promptUserForSignature(challenge);
        
        // Submit signature
        const verifyResponse = await fetch('/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nonce: challenge.nonce, 
                signature 
            })
        });
        
        if (!verifyResponse.ok) {
            const error = await verifyResponse.json();
            throw new Error(`Verification failed: ${error.message}`);
        }
        
        const { session_token } = await verifyResponse.json();
        
        // Store token for subsequent requests
        localStorage.setItem('auth_token', session_token);
        
        return true;
        
    } catch (error) {
        console.error('Authentication error:', error.message);
        return false;
    }
}
```

---

## References

- [Domain Identity Protocol v1.0](./domain-identity-protocol.md)
- [RFC 5246: The Transport Layer Security (TLS) Protocol Version 1.2](https://tools.ietf.org/html/rfc5246)
- [RFC 5280: Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile](https://tools.ietf.org/html/rfc5280)
- [RFC 4880: OpenPGP Message Format](https://tools.ietf.org/html/rfc4880)

---

*This specification is released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)*