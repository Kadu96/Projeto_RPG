import os 
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Recupera os dados das variáveis de ambiente
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")


# Configuração do banco de dados
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Recupera a Secret Key para o Token
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256") # Fallback para HS256 se não encontrar

# Cria o Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=5,            # Mantém até 5 conexões abertas no pool
    max_overflow=10,        # Permite abrir mais 10 se houver pico de uso
    pool_pre_ping=True      # Testa a conexão antes de usar (evita erro de 'connection lost')
)

# Cria a sessão local para interagir com o banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos do SQLAlchemy
Base = declarative_base()

# Dependência para o FastAPI
# Isso garante que a conexão abra ao chegar a rota e FECHE ao terminar o processamento
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()