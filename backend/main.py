
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

import models
import schemas
import services
from database import engine, get_db
from seguranca import gerar_senha_hash, verificar_senha, criar_token_acesso, SECRET_KEY, ALGORITHM
from jose import jwt

app = FastAPI(title="RPG Classless API")

# CORS Middleware para permitir requisições do frontend React
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FUNÇÃO AUXILIAR DE SEGURANÇA ---

def get_current_user_id(authorization: Optional[str] = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido")
    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return int(user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

@app.get("/", tags=["Health Check"])
def home():
    return {
        "status": "online",
        "api_version": "1.0.0",
        "docs_url": "/docs"
    } 

# --- ROTAS DE CONSULTA AUXILIAR ---

@app.get("/racas", response_model=List[schemas.RaceResponse])
def list_races(
    db: Session = Depends(get_db)
):
    return db.query(models.Race).filter(
        models.Race.is_active == True
    ).all()

@app.get("/antecedentes", response_model=List[schemas.BackgroundResponse])
def list_backgrounds (
    db: Session =  Depends(get_db)
):
    return db.query(models.Background).filter(
        models.Background.is_active == True
    ).all()

# --- ROTAS DE USUÁRIO ---

@app.post("/usuario/cadastro")
def cadastrar_usuario(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # validação de usuário/email já existente
    db_user = db.query(models.User).filter(
        (models.User.user_login == user.user_login) |
        (models.User.user_email == user.user_email)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário ou E-mail já cadastrados!")
    
    new_user = models.User(
        user_uuid=str(uuid.uuid4()),
        user_name=user.user_name,
        user_login=user.user_login,
        user_email=user.user_email,
        user_pass=gerar_senha_hash(user.user_pass),
        is_master=user.is_master
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/usuario/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        (models.User.user_login == user_credentials.login_or_email) | 
        (models.User.user_email == user_credentials.login_or_email)
    ).first()
    
    if not user or not verificar_senha(user_credentials.user_pass, user.user_pass):
        raise HTTPException(status_code=401, detail="Login ou senha incorretos")
    
    access_token = criar_token_acesso(data={"sub": str(user.user_id)})
    return {"access_token": access_token, "token_type": "bearer"}

# --- ROTAS DE PERSONAGEM (CRUD) ---

@app.post("/personagens/salvar", response_model=schemas.CharacterResponse)
def create_character(
    char_in: schemas.CharacterCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    try: 
        new_char = services.calcular_ficha_inicial(db, char_in, current_user_id)

        db.add(new_char)
        db.commit()
        db.refresh(new_char)
        return new_char
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao gerar ficha: {str(e)}")

@app.get("/personagens", response_model=List[schemas.CharacterResponse])
def list_my_characters(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return db.query(models.Character).filter(
        models.Character.user_id == current_user_id,
        models.Character.is_active == True
    ).all()

@app.get("/personagens/{char_uuid}", response_model=schemas.CharacterResponse)
def get_character(
    char_uuid: str, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    char = db.query(models.Character).filter(
        models.Character.character_uuid == char_uuid,
        models.Character.user_id == current_user_id
    ).first()
    if not char:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    return {**char.__dict__, "race_name": char.raca.race_name, "background_name": char.antecedente.background_name}

@app.patch("/personagens/{char_uuid}", response_model=schemas.CharacterResponse)
def update_character(
    char_uuid: str,
    char_update: schemas.CharacterUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    db_char = db.query(models.Character).filter(
        models.Character.character_uuid == char_uuid,
        models.Character.user_id == current_user_id
    ).first()
    
    if not db_char:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    # Atualiza apenas os campos enviados no JSON (Partial Update)
    update_data = char_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_char, key, value)
    
    db.commit()
    db.refresh(db_char)
    return db_char