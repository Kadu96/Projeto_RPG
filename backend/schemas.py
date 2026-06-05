from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from enum import Enum

# ==========================================
# 0. ENUMS PARA VALIDAÇÃO DE ENTRADA/SAÍDA
# ==========================================

class EquipmentCategory(str, Enum):
    weapon = 'weapon'
    armor = 'armor'
    shield = 'shield'
    consumable = 'consumable'
    tool = 'tool'
    adventuring_gear = 'adventuring_gear'
    quest_item = 'quest_item'

class EquipmentSlotType(str, Enum):
    head = 'head'
    torso = 'torso'
    hands = 'hands'
    legs = 'legs'
    feet = 'feet'
    main_hand = 'main_hand'
    off_hand = 'off_hand'
    two_handed = 'two_handed'
    neck = 'neck'
    ring = 'ring'
    none = 'none'

class MaestryCategory(str, Enum):
    elemental = 'elemental'
    weapon = 'weapon'
    armor = 'armor'
    tool = 'tool'
    utility = 'utility'

class MaestryType(str, Enum):
    base = 'base'
    advanced = 'advanced'
    superior = 'superior'

class SpellAffinity(str, Enum):
    aqua = 'aqua'
    ignis = 'ignis'
    terra = 'terra'
    ventus = 'ventus'
    lux = 'lux'
    umbra = 'umbra'
    force = 'force'
    none = 'none'

class SpellRangeType(str, Enum):
    self = 'self'
    touch = 'touch'
    ranged = 'ranged'
    special = 'special'

class SpellType(str, Enum):
    arcane = 'arcane'
    divine = 'divine'
    natural = 'natural'
    profane = 'profane'
    unique = 'unique'


# ==========================================
# 1. SCHEMAS DE USUÁRIO
# ==========================================

class UserBase(BaseModel):
    user_name: str
    user_login: str
    user_email: EmailStr
    is_master: bool = False

class UserCreate(UserBase):
    user_pass: str  # Senha em texto puro para ser processada/hasheada no backend

class UserResponse(UserBase):
    user_id: int
    user_uuid: UUID
    is_active: bool

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    login_or_email: str
    user_pass: str


# ==========================================
# 2. SCHEMAS DE CAMPANHA (ADVENTURES)
# ==========================================

class AdventureBase(BaseModel):
    adventure_name: str
    adventure_description: Optional[str] = None
    is_active: bool = True

class AdventureCreate(AdventureBase):
    adventure_create: datetime = Field(default_factory=datetime.utcnow)
    user_id_create: int

class AdventureResponse(AdventureBase):
    adventure_id: int
    adventure_create: datetime
    user_id_create: int

    class Config:
        from_attributes = True


# ==========================================
# 3. SCHEMAS DE TALENTOS (FEATS)
# ==========================================

class FeatBase(BaseModel):
    feat_name: str
    feat_description: str
    feat_requisite: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

class FeatCreate(FeatBase):
    pass

class FeatResponse(FeatBase):
    feat_id: int

    class Config:
        from_attributes = True


# ==========================================
# 4. SCHEMAS DE MAESTRIAS (MAESTRIES)
# ==========================================

class MaestryCatalogBase(BaseModel):
    maestry_slug: str
    maestry_name: str
    category: MaestryCategory
    m_type: MaestryType = MaestryType.base
    description: str
    unlock_requisite: Dict[str, Any] = Field(default_factory=dict)
    grouped_bonus: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

class MaestryCatalogResponse(MaestryCatalogBase):
    class Config:
        from_attributes = True


# ==========================================
# 5. SCHEMAS DE MAGIAS (SPELLS)
# ==========================================

class SpellBase(BaseModel):
    spell_name: str
    spell_description: str
    magic_type: SpellType
    affinity: SpellAffinity = SpellAffinity.none
    spell_circle: int = 1
    mana_cost: int = 0
    activation_time: str = '1 Action'
    range_type: SpellRangeType = SpellRangeType.ranged
    range_value: Optional[int] = None
    duration: str = 'Instantaneous'
    is_concentration: bool = False
    req_maestria_tier: int = 0
    req_maestria_fragments: int = 0
    spell_requisite: Dict[str, Any] = Field(default_factory=dict)
    mechanics: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

class SpellCreate(SpellBase):
    pass

class SpellResponse(SpellBase):
    spell_id: int

    class Config:
        from_attributes = True


# ==========================================
# 6. SCHEMAS DE EQUIPAMENTOS (EQUIPMENTS)
# ==========================================

class EquipmentBase(BaseModel):
    equip_name: str
    equip_description: str
    category: EquipmentCategory
    slot_target: EquipmentSlotType = EquipmentSlotType.none
    equip_size: int = 1
    equip_weight: float = 0.00
    equip_requisite: Dict[str, Any] = Field(default_factory=dict)
    is_unique: bool = False
    is_active: bool = True
    maestry_slug: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentResponse(EquipmentBase):
    equipment_id: int

    class Config:
        from_attributes = True


# ==========================================
# 7. SCHEMAS DAS TABELAS ASSOCIATIVAS (VÍNCULOS)
# ==========================================

class AssCharacterFeatResponse(BaseModel):
    is_enabled: bool
    is_active: bool
    talento: FeatResponse  # Mapeia o relacionamento de `Feat` dentro do relacionamento intermediário

    class Config:
        from_attributes = True


class CharacterEquipmentResponse(BaseModel):
    character_equipment_id: int
    quantity: int
    is_equipped: bool
    current_durability: Optional[int] = None
    custom_name: Optional[str] = None
    equipamento: EquipmentResponse  # Carrega as propriedades estáticas do item

    class Config:
        from_attributes = True


class CharacterMaestryResponse(BaseModel):
    character_maestry_id: int
    current_tier: int
    current_fragments: int
    maestria_catalogo: MaestryCatalogResponse  # Carrega os dados estáticos da maestria

    class Config:
        from_attributes = True


# ==========================================
# 8. SCHEMAS DE PERSONAGEM (CHARACTERS)
# ==========================================

class CharacterBase(BaseModel):
    character_name: str
    race_id: int
    adventure_id: Optional[int] = None
    url_image: Optional[str] = None
    # Tipos JSONB perfeitamente representados por dicionários Python estruturados
    character_info: Dict[str, Any] = Field(..., example={"sex": "M", "age": 25, "description": "..."})
    character_details: Dict[str, Any] = Field(..., example={"xp": 0, "level": 1, "pv": 12})
    character_abilities: Dict[str, Any] = Field(..., example={"forca": 10, "destreza": 14})

class CharacterCreate(CharacterBase):
    user_id: int

class CharacterUpdate(BaseModel):
    character_name: Optional[str] = None
    adventure_id: Optional[int] = None
    url_image: Optional[str] = None
    character_info: Optional[Dict[str, Any]] = None
    character_details: Optional[Dict[str, Any]] = None
    character_abilities: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class CharacterResponse(CharacterBase):
    character_id: int
    character_uuid: UUID
    user_id: int
    is_active: bool
    
    # Relações que serão resolvidas via SQLAlchemy ORM Relationships:
    talentos_vinculados: List[AssCharacterFeatResponse] = []
    equipamentos_inventario: List[CharacterEquipmentResponse] = []
    maestrias_personagem: List[CharacterMaestryResponse] = []
    magias_conhecidas: List[SpellResponse] = []

    class Config:
        from_attributes = True