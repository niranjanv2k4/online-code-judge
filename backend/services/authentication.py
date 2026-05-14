import bcrypt
import jwt
import os

def validate(conn, username, entered_password):
    cursor = conn.cursor()
    result = ""
    token = ""

    cursor.execute("SELECT password_hash FROM users WHERE username=%s", (username, ))
    
    password = cursor.fetchone()

    if password is None:
        result = "INVALID CREDENTIALS"
    else:
        stored_password = password[0]
        
        if bcrypt.checkpw(entered_password.encode(), stored_password.encode()):
            result = "SUCCESS"
            payload= {
                "username" : username
            }
            token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
        else:
            result = "INVALID CREDENTIALS"

    cursor.close()
    return result, token

def new_user(conn, username, entered_password):
    cursor = conn.cursor()

    cursor.execute("SELECT password_hash FROM users WHERE username=%s", (username, ))
    password = cursor.fetchone()

    if password is not None:
        cursor.close()
        return "USER EXISTS", ""
    
    password_hash = bcrypt.hashpw(entered_password.encode(), bcrypt.gensalt())

    cursor.execute(
        "INSERT INTO users(username, password_hash) VALUES(%s, %s)",
        (username, password_hash.decode())
    )
    
    conn.commit()
    cursor.close()
    
    return validate(conn, username, entered_password)

def validate_token(token):
    try:
        jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return True
    except:
        return False

