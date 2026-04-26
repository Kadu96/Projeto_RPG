from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List, Union
from uuid import UUID
from datetime import datetime

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
    adventure_id: Optional[int] = None
    url_image: Optional[str] = None
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
    url_image: Optional[str] = None
    character_info: Optional[Dict[str, Any]] = None
    character_details: Optional[Dict[str, Any]] = None
    character_abilities: Optional[Dict[str, Any]] = None
    character_equipment: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class FeatResponse(BaseModel):
    feat_id: int
    feat_name: str
    feat_description: str

    class Config:
        from_attributes = True

class AssFeatResponse(BaseModel):
    is_enabled: bool
    talento: FeatResponse # Aqui ele traz os dados do talento de dentro da associação

    class Config:
        from_attributes = True

class CharacterResponse(CharacterBase):
    character_id: int
    character_uuid: UUID
    race_name: Optional[str] = None
    adventure_name: Optional[str] = None
    user_id: int
    is_active: bool
    talento: Optional[List[AssFeatResponse]] = [] # Corresponde ao relationship no models.py
    class Config:
        from_attributes = True

class RaceResponse(BaseModel):
    race_id: int
    race_name: str
    race_traits: Dict[str, Any]
    
    class Config:
        from_attributes = True

# --- CAMPANHAS ---
class AdventureBase(BaseModel):
    adventure_name: str
    adventure_description: str

class AdventureCreate(AdventureBase):
    pass

class AdventureResponse(AdventureBase):
    adventure_id: int
    adventure_create: datetime
    user_id_create: int
    is_active: bool

    class Config:
        from_attributes = True
