from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# Configuração do algoritmo de criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CHAVE_MESTRA: No mundo real, use algo secreto e vindo de um arquivo .env
SECRET_KEY = "DndClassless123!"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Token dura 1 dia

def gerar_senha_hash(senha: str):  
    return pwd_context.hash(senha)

def verificar_senha(senha_pura: str, senha_hash: str):
    return pwd_context.verify(senha_pura, senha_hash)

def criar_token_acesso(data: dict):
    para_codificar = data.copy()
    expiracao = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    para_codificar.update({"exp": expiracao})
    return jwt.encode(para_codificar, SECRET_KEY, algorithm=ALGORITHM)