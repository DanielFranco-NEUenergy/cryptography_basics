from cryptography.fernet import Fernet, MultiFernet
from binascii import unhexlify
import sys

'''
Initial message

message := original message (a string)
message_bytes := original message encoded in bytes
'''
message = "Hello How are you?"
message_bytes = message.encode()
print("message: ", message)
print("message_bytes: ", message_bytes, '\n')

'''
Cryptographic key generation

key := original generated key (in bytes) for encryption layer 1
key1_bytes, key2_bytes, key3_bytes := the original generated keys for encryption layer 2 in bytes ; TODO: see if it can be passed as such to the locksmith smart contract
key1_hex, key2_hex, key3_hex := the keys in hex format (for python hex is a string) ; this is stored by the locksmith smart contract
'''
key = Fernet.generate_key()
print()
key1 = Fernet(Fernet.generate_key())
key2 = Fernet(Fernet.generate_key())
key3 = Fernet(Fernet.generate_key())
key1_bytes = key1._encryption_key
key2_bytes = key2._encryption_key
key3_bytes = key3._encryption_key
key_hex = key.hex()
key1_hex = key1_bytes.hex()
key2_hex = key2_bytes.hex()
key3_hex = key3_bytes.hex()
print("key1: ", key1)
print("key2: ", key2)
print("key3: ", key3)
print("key_bytes: ", key, ' byteSize: ', sys.getsizeof(key), 'bytes')
print("key1_bytes: ", key1_bytes, ' byteSize: ', sys.getsizeof(key1_bytes), 'bytes')
print("key2_bytes: ", key2_bytes)
print("key3_bytes: ", key3_bytes)
print("key_hex: ", key_hex)
print("key1_hex: ", key1_hex)
print("key2_hex: ", key2_hex)
print("key3_hex: ", key3_hex, '\n')

'''
Encryption

token := encrypted message in bytes
token_hex := encrypted bytes message presented in hex format; TODO: see whether it is better to send token_hex or token from the IoT to the customers' servers
'''
fernet_obj1 = Fernet(key)
fernet_obj2 = MultiFernet([key1, key2, key3])               ## TODO: study https://cryptography.io/en/latest/fernet/
token_layerOne = fernet_obj1.encrypt(message_bytes)
token_layerOne_hex = token_layerOne.hex()
token = fernet_obj2.encrypt(token_layerOne)
token_hex = token.hex()
print("token_layerOne: ", token_layerOne, '\n', type(token_layerOne))
print("token_layerOne_hex: ", token_layerOne_hex, '\n', type(token_layerOne_hex))
print("token: ", token, '\n', type(token))
print("token_hex: ", token_hex, '\n', type(token_hex),'\n')


'''
Parenthesis about hex to bytes conversion in python

token_recovered1, token_recovered2 := recovered token in bytes using two methods
'''
token_recovered1 = bytes.fromhex(token_hex)     ## must be equal to token
token_recovered2 = unhexlify(token_hex)
print("Parenthesis ---> token_recovered1: ", token_recovered1, type(token_recovered1))
print("Parenthesis ---> token_recovered2: ", token_recovered2, type(token_recovered2),'\n')


'''
Decryption

unwrapped_token_layerOne := the original message (in bytes) recovered, that is to say, the token decrypted on the customers' servers
message_on_the_other_side := the original string message on the customers' servers
'''
unwrapped_token_layerOne = fernet_obj1.decrypt(fernet_obj2.decrypt(token))          ## fernet_obj2.decrypt(fernet_obj1.decrypt(token_layerOne)) raises exception: InvalidToken
message_on_the_other_side = unwrapped_token_layerOne.decode()
print("unwrapped_token_layerOne: ", unwrapped_token_layerOne)
print("message_on_the_other_side: ", message_on_the_other_side, '\n')

## https://nitratine.net/blog/post/asymmetric-encryption-and-decryption-in-python/
## https://www.trentonsystems.com/blog/symmetric-vs-asymmetric-encryption
## https://www.datacenters.com/news/can-the-blockchain-transform-cybersecurity

## https://github.com/csquared/fernet.js