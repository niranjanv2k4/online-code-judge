import bcrypt

def validate(conn, username, entered_password):
    cursor = conn.cursor()
    result = ""

    cursor.execute("SELECT password_hash FROM users WHERE username=%s", (username, ))
    
    password = cursor.fetchone()

    if password is None:
        result = "INVALID CREDENTIALS"
    else:
        stored_password = password[0]
        
        if bcrypt.checkpw(entered_password.encode(), stored_password.encode()):
            result = "SUCCESS"
        else:
            result = "INVALID CREDENTIALS"

    cursor.close()
    return result

def new_user(conn, username, entered_password):
    cursor = conn.cursor()
    res = ""

    cursor.execute("SELECT password_hash FROM users WHERE username=%s", (username, ))
    password = cursor.fetchone()

    if password is not None:
        res = "USER EXISTS"
        cursor.close()
        return res
    
    password_hash = bcrypt.hashpw(entered_password.encode(), bcrypt.gensalt())

    cursor.execute(
        "INSERT INTO users(username, password_hash) VALUES(%s, %s)",
        (username, password_hash.decode())
    )
    
    conn.commit()
    cursor.close()
    return "REGISTERED"

