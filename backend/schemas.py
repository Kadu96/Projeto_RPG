from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from uuid import UUID

# --- SCHEMAS DE USUÁRIO ---

class UserBase(BaseModel):
    user_name: str
    user_login: str
    user_email: EmailStr
    is_master: bool = False

class UserCreate(UserBase):
    user_pass: str # Senha em texto puro que será hasheada no backend

class UserResponse(UserBase):
    user_id: int
    user_uuid: UUID
    is_active: bool

    class Config:
        from_attributes = True # Permite converter Model do SQLAlchemy para Pydantic

class UserLogin(BaseModel):
    login_or_email: str
    user_pass: str

# --- SCHEMAS DE PERSONAGEM ---

class CharacterBase(BaseModel):
    character_name: str
    race_id: int
    background_id: int
    # Definimos como Dict para validar os campos JSONB
    character_info: Dict[str, Any] = Field(..., example={"age": 30, "height": 1.79})
    character_details: Optional[Dict[str, Any]] = None
    character_abilities: Optional[Dict[str, Any]] = None
    character_equipment: Optional[Dict[str, Any]] = None

class CharacterCreate(CharacterBase):
    pass # Dados necessários para criar

class CharacterUpdate(BaseModel):
    # Todos os campos opcionais para permitir atualização parcial (PATCH)
    character_name: Optional[str] = None
    character_info: Optional[Dict[str, Any]] = None
    character_details: Optional[Dict[str, Any]] = None
    character_abilities: Optional[Dict[str, Any]] = None
    character_equipment: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class CharacterResponse(CharacterBase):
    character_id: int
    character_uuid: UUID
    race_name: Optional[str] = None
    background_name: Optional[str] = None
    user_id: int
    is_active: bool

    class Config:
        from_attributes = True

# --- SCHEMAS DE RAÇAS E TALENTOS (FEATS) ---

class RaceResponse(BaseModel):
    race_id: int
    race_name: str
    race_traits: Dict[str, Any]
    
    class Config:
        from_attributes = True

class FeatResponse(BaseModel):
    feat_id: int
    feat_name: str
    feat_description: str
    feat_traits: Dict[str, Any]

    class Config:
        from_attributes = True

# --- SCHEMAS DE BACKGROUND (ANTECEDENTES) ---

class BackgroundBase(BaseModel):
    background_name: str
    background_description: str
    background_traits: Dict[str, Any] # Aqui entram os bônus de moedas e perícias que o seu serviço usa

class BackgroundCreate(BackgroundBase):
    pass

class BackgroundResponse(BackgroundBase):
    background_id: int
    is_active: bool

    class Config:
        from_attributes = True