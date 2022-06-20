// https://www.demo2s.com/node.js/node-js-fernet-javascript-implementation-of-fernet-symmetric-encryptio.html

const fernet = require('fernet')
let _crypto/*  w w   w.   d e    m o  2   s .  c  o  m */
try {
    _crypto = crypto
} catch (error) {
    _crypto = require('crypto').webcrypto
}

const ALGORITHM = { name: 'RSA-OAEP', hash: { name: 'SHA-256'}}

export async function encrypt_value(public_key, cleartext) {
    console.log("public_key: ", public_key)
    const raw_symmetric_key = _crypto.getRandomValues(new Uint8Array(32))
    const symmetric_key = btoa(String.fromCharCode(...raw_symmetric_key)) // btoa
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
    const decoded_public_key = Uint8Array.from(atob(public_key), c => c.charCodeAt(0))
    const pubkey = await _crypto.subtle.importKey(
        'spki',
        decoded_public_key.buffer,
        ALGORITHM,
        false,
        ['encrypt']
    )
    const encrypted_key = await _crypto.subtle.encrypt(
        ALGORITHM,
        pubkey,
        Uint8Array.from(symmetric_key, c => c.charCodeAt(0))
    )
    const secret = new fernet.Secret(symmetric_key)
    const token = new fernet.Token({
        secret,
        time: new Date(),
        iv: _crypto.getRandomValues(new Uint8Array(16))
   })
    const payload = token.encode(cleartext)
    return btoa(JSON.stringify({
        key: btoa(String.fromCharCode(...new Uint8Array(encrypted_key))),
        payload: payload,
   }))
}