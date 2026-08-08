from os import path
from docker import client
import io, tarfile, docker, time, threading, socket, json, uuid

from services.redis_client import r

def process_code(code, language, input, expected):

    
    language = language.lower()
    id = uuid.uuid4().hex

    job = {
        "id" : id,
        "language" : language,
        "code": code,
        "input": input,
        "expected": expected
    }

    r.rpush("jobs", json.dumps(job))

    return id, "QUEUED"


        
    

    



            


    