from cryptography.fernet import Fernet, MultiFernet

'''
Initial message

message := original message (a string)
message_bytes := original message encoded in bytes
'''
message = "Hello"
message_bytes = message.encode()
print("message: ", message)
print("message_bytes: ", message_bytes, '\n')

'''
Cryptographic key generation

key1_bytes, key2_bytes := the original generated key in bytes ; TODO: see if it can be passed as such to the locksmith smart contract
key1_hex, key2_hex := the keys in hex format (for python hex is a string) ; this is stored by the locksmith smart contract
'''
key1 = Fernet(Fernet.generate_key())
key2 = Fernet(Fernet.generate_key())
key3 = Fernet(Fernet.generate_key())
key1_bytes = key1._encryption_key
key2_bytes = key2._encryption_key
key3_bytes = key3._encryption_key
key1_hex = key1_bytes.hex()
key2_hex = key2_bytes.hex()
key3_hex = key3_bytes.hex()
print("key1: ", key1)
print("key2: ", key2)
print("key3: ", key3)
print("key1_bytes: ", key1_bytes)
print("key2_bytes: ", key2_bytes)
print("key3_bytes: ", key3_bytes)
print("key1_hex: ", key1_hex)
print("key2_hex: ", key2_hex)
print("key3_hex: ", key3_hex, '\n')

'''
Encryption

token := encrypted message in bytes
token_hex := encrypted bytes message presented in hex format; TODO: see whether it is better to send token_hex or token from the IoT to the customers' servers
'''
fernet_obj = MultiFernet([key1, key2, key3])               ## TODO: study https://cryptography.io/en/latest/fernet/
token = fernet_obj.encrypt(message_bytes)
token_hex = token.hex()
print("token: ", token, '\n', type(token))
print("token_hex: ", token_hex, '\n', type(token_hex),'\n')


'''
Decryption

unwrapped_token := the original message (in bytes) recovered, that is to say, the token decrypted on the customers' servers
message_on_the_other_side := the original string message on the customers' servers
'''
unwrapped_token = fernet_obj.decrypt(token)
message_on_the_other_side = unwrapped_token.decode()
print("unwrapped_token: ", unwrapped_token)
print("message_on_the_other_side: ", message_on_the_other_side, '\n')
