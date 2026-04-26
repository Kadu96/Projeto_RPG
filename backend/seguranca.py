import os
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 


# Configuração do algoritmo de criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_senha_hash(senha: str):  
    return pwd_context.hash(senha)

def verificar_senha(senha_pura: str, senha_hash: str):
    return pwd_context.verify(senha_pura, senha_hash)

def criar_token_acesso(data: dict):
    para_codificar = data.copy()
    expiracao = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    para_codificar.update({"exp": expiracao})
    return jwt.encode(para_codificar, SECRET_KEY, algorithm=ALGORITHM)