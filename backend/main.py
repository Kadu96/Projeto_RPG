from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid

import models
import schemas
import services
from database import engine, get_db
from seguranca import (
    gerar_senha_hash, 
    verificar_senha, 
    criar_token_acesso, 
    SECRET_KEY, 
    ALGORITHM
)
from jose import jwt

app = FastAPI(title="RPG Classless API")

# --- MIDDLEWARE CORS ---
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token não fornecido"
        )
    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token inválido: ID de utilizador ausente"
            )
        return int(user_id)
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token inválido ou expirado"
        )

@app.get("/", tags=["Health Check"])
def home():
    return {
        "status": "online",
        "api_version": "1.0.0",
        "docs_url": "/docs"
    } 

# --- ROTAS DE AUTENTICAÇÃO & UTILIZADORES ---

@app.post("/usuario/cadastro", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Verificar se login ou email já existem
    db_user_by_login = db.query(models.User).filter(models.User.user_login == user.user_login).first()
    if db_user_by_login:
        raise HTTPException(status_code=400, detail="Nome de login já cadastrado")
        
    db_user_by_email = db.query(models.User).filter(models.User.user_email == user.user_email).first()
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    hashed_password = gerar_senha_hash(user.user_pass)
    novo_usuario = models.User(
        user_uuid=str(uuid.uuid4()),
        user_name=user.user_name,
        user_login=user.user_login,
        user_email=user.user_email,
        user_pass=hashed_password,
        is_master=user.is_master
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

@app.post("/usuario/login")
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    # Busca por login ou por email
    user = db.query(models.User).filter(
        (models.User.user_login == login_data.login_or_email) | 
        (models.User.user_email == login_data.login_or_email)
    ).first()

    if not user or not verificar_senha(login_data.user_pass, user.user_pass):
        raise HTTPException(status_code=400, detail="Credenciais incorretas")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Utilizador inativo")

    access_token = criar_token_acesso(data={"sub": str(user.user_id)})
    return {"access_token": access_token, "token_type": "bearer"}

# --- ROTAS DE APOIO ---

@app.get("/equipamentos", response_model=List[schemas.EquipmentResponse])
def list_equipments(db: Session = Depends(get_db)):
    return db.query(models.Equipment).filter(models.Equipment.is_active == True).all()

@app.get("/maestrias", response_model=List[schemas.MaestryCatalogResponse])
def list_maestrias(db: Session = Depends(get_db)):
    return db.query(models.MaestryCatalog).filter(models.MaestryCatalog.is_active == True).all()

@app.get("/campanhas", response_model=List[schemas.AdventureResponse])
def list_adventures (
    db: Session =  Depends(get_db)
):
    return db.query(models.Adventure).filter(
        models.Adventure.is_active == True
    ).all()
    
@app.get("/talentos", response_model=List[schemas.FeatResponse])
def list_feats (
    db: Session =  Depends(get_db)
):
    return db.query(models.Feat).filter(
        models.Feat.is_active == True
    ).all()

@app.get("/magias", response_model=List[schemas.SpellResponse])
def list_spells (
    db: Session =  Depends(get_db)
):
    return db.query(models.Spell).filter(
        models.Spell.is_active == True
    ).all()

# --- ROTAS DE PERSONAGENS ---

@app.post("/personagens/salvar", response_model=schemas.CharacterResponse, status_code=status.HTTP_201_CREATED)
def create_character(
    char: schemas.CharacterCreate, 
    db: Session = Depends(get_db), 
    current_user_id: int = Depends(get_current_user_id)
):
    try: 
        new_char = services.calcular_ficha_inicial(db, char_in, current_user_id)

        db.add(new_char)
        db.commit()
        db.refresh(new_char)

        # Recarrega com relações para garantir os nomes no retorno
        db.refresh(new_char, ["raca", "antecedente", "campanha"])
        
        return {
            **new_char.__dict__,
            "race_name": new_char.raca.race_name if new_char.raca else None,
            "background_name": new_char.antecedente.background_name if new_char.antecedente else None,
            "adventure_name": new_char.campanha.adventure_name if new_char.campanha else None
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao gerar ficha: {str(e)}")

@app.get("/personagens", response_model=List[schemas.CharacterResponse])
def list_user_characters(
    db: Session = Depends(get_db), 
    current_user_id: int = Depends(get_current_user_id)
):
    return db.query(models.Character).filter(
        models.Character.user_id == current_user_id,
        models.Character.is_active == True
    ).all()

@app.get("/personagens/{char_uuid}", response_model=schemas.CharacterResponse)
def get_character_by_uuid(
    char_uuid: uuid.UUID, 
    db: Session = Depends(get_db), 
    current_user_id: int = Depends(get_current_user_id)
):
    # Usamos options(joinedload(...)) para trazer os dados das tabelas relacionadas
    char = db.query(models.Character).options(
        joinedload(models.Character.raca),
        joinedload(models.Character.campanha),
        joinedload(models.Character.talento).joinedload(models.AssCharactersFeat.talento)
    ).filter(
        models.Character.character_uuid == char_uuid,
        models.Character.user_id == current_user_id
    ).first()

    if not char:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    return {
        **char.__dict__, 
        "race_name": char.raca.race_name if char.raca else None, 
        "adventure_name": char.campanha.adventure_name if char.campanha else None,
        "talento": char.talento
    }

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


# --- ROTAS DE GERENCIAMENTO DE TALENTOS (FEATS) ---

@app.post("/personagens/{char_uuid}/talentos/{feat_id}")
def toggle_character_feat(
    char_uuid: str,
    feat_id: int,
    is_enabled: bool,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    char = db.query(models.Character).options(
        joinedload(models.Character.campanha),
        joinedload(models.Character.talento).joinedload(models.AssCharactersFeat.talento)
    ).filter(
        models.Character.character_uuid == char_uuid,
        models.Character.user_id == current_user_id
    ).first()
    
    if not char:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")

    assoc = db.query(models.AssCharactersFeat).filter(
        models.AssCharactersFeat.character_id == char.character_id,
        models.AssCharactersFeat.feat_id == feat_id
    ).first()

    if not assoc:
        raise HTTPException(status_code=404, detail="Talento não vinculado")

    assoc.is_enabled = is_enabled
    db.commit()
    db.refresh(char)
   
    return {
        **char.__dict__, 
        "race_name": char.raca.race_name if char.raca else None, 
        "adventure_name": char.campanha.adventure_name if char.campanha else None,
        "talento": char.talento
    } 
    
# --- ROTAS DE GERENCIAMENTO DE EQUIPAMENTOS (EQUIPMENTS) ---

@app.post("/personagens/{char_uuid}/equipamentos/{equipment_id}")
def toggle_character_equipment(
    char_uuid: str,
    equipment_id: int,
    is_equipped: bool,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    char = db.query(models.Character).options(
        joinedload(models.Character.campanha),
        joinedload(models.Character.equipamento).joinedload(models.CharacterEquipment.equipamento)
    ).filter(
        models.Character.character_uuid == char_uuid,
        models.Character.user_id == current_user_id
    ).first()
    
    if not char:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")

    assoc = db.query(models.CharacterEquipment).filter(
        models.CharacterEquipment.character_id == char.character_id,
        models.CharacterEquipment.equipment_id == equipment_id
    ).first()

    if not assoc:
        raise HTTPException(status_code=404, detail="Equipamento não vinculado")

    assoc.is_equipped = is_equipped
    db.commit()
    db.refresh(char)
   
    return {
        **char.__dict__, 
        "race_name": char.raca.race_name if char.raca else None, 
        "adventure_name": char.campanha.adventure_name if char.campanha else None,
        "equipamento": char.equipamento
    } 

# --- ROTAS DE GERENCIAMENTO DE MAGIAS (SPELLS) ---

@app.post("/personagens/{char_uuid}/magias/{spell_id}")
def toggle_character_equipment(
    char_uuid: str,
    spell_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    char = db.query(models.Character).options(
        joinedload(models.Character.campanha),
        joinedload(models.Character.magias_conhecidas).joinedload(models.CharacterSpell.spell)
    ).filter(
        models.Character.character_uuid == char_uuid,
        models.Character.user_id == current_user_id
    ).first()
    
    if not char:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")

    assoc = db.query(models.CharacterSpell).filter(
        models.CharacterSpell.character_id == char.character_id,
        models.CharacterSpell.spell_id == spell_id
    ).first()

    if not assoc:
        raise HTTPException(status_code=404, detail="Magia não vinculado")

    db.commit()
    db.refresh(char)
   
    return {
        **char.__dict__, 
        "race_name": char.raca.race_name if char.raca else None, 
        "adventure_name": char.campanha.adventure_name if char.campanha else None,
        "magias_conhecidas": char.magias_conhecidas
    } 