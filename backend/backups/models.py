import enum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Index, Numeric, DateTime, text
from sqlalchemy.dialects.postgresql import JSONB, ENUM
from sqlalchemy.orm import relationship
from database import Base  # Mantendo a sua instância declarativa padrão

# ==========================================
# 1. ENUMS (Mapeamento dos Types do DDL)
# ==========================================

class EquipmentCategory(enum.Enum):
    weapon = 'weapon'
    armor = 'armor'
    shield = 'shield'
    consumable = 'consumable'
    tool = 'tool'
    adventuring_gear = 'adventuring_gear'
    quest_item = 'quest_item'

class EquipmentSlotType(enum.Enum):
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

class MaestryCategory(enum.Enum):
    elemental = 'elemental'
    weapon = 'weapon'
    armor = 'armor'
    tool = 'tool'
    utility = 'utility'

class MaestryType(enum.Enum):
    base = 'base'
    advanced = 'advanced'
    superior = 'superior'

class SpellAffinity(enum.Enum):
    aqua = 'aqua'
    ignis = 'ignis'
    terra = 'terra'
    ventus = 'ventus'
    lux = 'lux'
    umbra = 'umbra'
    force = 'force'
    none = 'none'

class SpellRangeType(enum.Enum):
    self = 'self'
    touch = 'touch'
    ranged = 'ranged'
    special = 'special'

class SpellType(enum.Enum):
    arcane = 'arcane'
    divine = 'divine'
    natural = 'natural'
    profane = 'profane'
    unique = 'unique'


# ==========================================
# 2. MODELOS / TABELAS
# ==========================================

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    user_uuid = Column(String(50), nullable=False, unique=True)
    user_name = Column(String(100), nullable=False)
    user_login = Column(String(50), nullable=False, unique=True)
    user_pass = Column(String(255), nullable=False)
    user_email = Column(String(50), nullable=False, unique=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_master = Column(Boolean, nullable=False, default=False)

    # Relacionamentos
    personagens = relationship("Character", back_populates="usuario", cascade="all, delete-orphan")


class Adventure(Base):
    __tablename__ = "adventures"

    adventure_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    adventure_name = Column(String(50), nullable=False)
    adventure_description = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    adventure_create = Column(DateTime, nullable=False)
    user_id_create = Column(Integer, nullable=False)

    # Relacionamentos
    personagens = relationship("Character", back_populates="aventura")

    __table_args__ = (
        Index('adventures_index_0', 'adventure_id'),
    )


class Feat(Base):
    __tablename__ = "feats"

    feat_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    feat_name = Column(String(50), nullable=False)
    feat_description = Column(String(255), nullable=False)
    feat_requisite = Column(JSONB, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    # Relacionamentos
    personagens_associados = relationship("AssCharacterFeat", back_populates="talento", cascade="all, delete-orphan")

    __table_args__ = (
        Index('feats_index_0', 'feat_id', 'is_active'),
        Index('idx_feat_requisite_gin', 'feat_requisite', postgresql_using='gin'),
    )


class MaestryCatalog(Base):
    __tablename__ = "maestries_catalog"

    maestry_slug = Column(String(30), primary_key=True, nullable=False)
    maestry_name = Column(String(50), nullable=False)
    category = Column(ENUM(MaestryCategory, name="maestry_category", inherit_schema=True), nullable=False)
    m_type = Column(ENUM(MaestryType, name="maestry_type", inherit_schema=True), nullable=False, default=MaestryType.base)
    description = Column(String(500), nullable=False)
    unlock_requisite = Column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    grouped_bonus = Column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    is_active = Column(Boolean, nullable=False, default=True)

    # Relacionamentos
    equipamentos = relationship("Equipment", back_populates="maestria_catalogo")
    personagens_maestrias = relationship("CharacterMaestry", back_populates="maestria_catalogo")


class Spell(Base):
    __tablename__ = "spells"

    spell_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    spell_name = Column(String(50), nullable=False, unique=True)
    spell_description = Column(String(500), nullable=False)
    magic_type = Column(ENUM(SpellType, name="spell_type", inherit_schema=True), nullable=False)
    affinity = Column(ENUM(SpellAffinity, name="spell_affinity", inherit_schema=True), nullable=False, default=SpellAffinity.none)
    spell_circle = Column(Integer, nullable=False, default=1)
    mana_cost = Column(Integer, nullable=False, default=0)
    activation_time = Column(String(30), nullable=False, default='1 Action')
    range_type = Column(ENUM(SpellRangeType, name="spell_range_type", inherit_schema=True), nullable=False, default=SpellRangeType.ranged)
    range_value = Column(Integer, nullable=True)
    duration = Column(String(30), nullable=False, default='Instantaneous')
    is_concentration = Column(Boolean, nullable=False, default=False)
    req_maestria_tier = Column(Integer, nullable=False, default=0)
    req_maestria_fragments = Column(Integer, nullable=False, default=0)
    spell_requisite = Column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    mechanics = Column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    is_active = Column(Boolean, nullable=False, default=True)

    # Relacionamentos através da tabela associativa pura
    personagens = relationship("Character", secondary="character_spells", back_populates="magias_conhecidas")


class Equipment(Base):
    __tablename__ = "equipments"

    equipment_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    equip_name = Column(String(50), nullable=False)
    equip_description = Column(String(255), nullable=False)
    category = Column(ENUM(EquipmentCategory, name="equipment_category", inherit_schema=True), nullable=False)
    slot_target = Column(ENUM(EquipmentSlotType, name="equipment_slot_type", inherit_schema=True), nullable=False, default=EquipmentSlotType.none)
    equip_size = Column(Integer, nullable=False, default=1)
    equip_weight = Column(Numeric(5, 2), nullable=False, default=0.00)
    equip_requisite = Column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    is_unique = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    maestry_slug = Column(String(30), ForeignKey("maestries_catalog.maestry_slug", onupdate="CASCADE"), nullable=True)

    # Relacionamentos
    maestria_catalogo = relationship("MaestryCatalog", back_populates="equipamentos")
    inventarios_personagens = relationship("CharacterEquipment", back_populates="equipamento")


class Character(Base):
    __tablename__ = "personagens"

    character_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    character_uuid = Column(String(255), nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    character_name = Column(String(50), nullable=False, unique=True)
    character_info = Column(JSONB, nullable=False)
    character_details = Column(JSONB, nullable=False)
    character_abilities = Column(JSONB, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    adventure_id = Column(Integer, ForeignKey("adventures.adventure_id", ondelete="SET NULL"), nullable=True)
    url_image = Column(String, nullable=True)

    # Relacionamentos
    usuario = relationship("User", back_populates="personagens")
    aventura = relationship("Adventure", back_populates="personagens")
    talentos_vinculados = relationship("AssCharacterFeat", back_populates="personagem", cascade="all, delete-orphan")
    equipamentos_inventario = relationship("CharacterEquipment", back_populates="personagem", cascade="all, delete-orphan")
    maestrias_personagem = relationship("CharacterMaestry", back_populates="personagem", cascade="all, delete-orphan")
    magias_conhecidas = relationship("Spell", secondary="character_spells", back_populates="personagens")

    __table_args__ = (
        Index('characters_index_0', 'user_id', 'is_active'),
        Index('idx_character_abilities_gin', 'character_abilities', postgresql_using='gin'),
        Index('idx_character_details_gin', 'character_details', postgresql_using='gin'),
        Index('idx_character_info_gin', 'character_info', postgresql_using='gin'),
    )


# ==========================================
# 3. TABELAS DE ASSOCIAÇÃO / VÍNCULOS
# ==========================================

class AssCharacterFeat(Base):
    __tablename__ = "ass_characters_feat"

    ass_characters_feat_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    character_id = Column(Integer, ForeignKey("personagens.character_id", ondelete="CASCADE"), nullable=False)
    feat_id = Column(Integer, ForeignKey("feats.feat_id", ondelete="CASCADE"), nullable=False)
    is_enabled = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)

    # Relacionamentos
    personagem = relationship("Character", back_populates="talentos_vinculados")
    talento = relationship("Feat", back_populates="personagens_associados")

    __table_args__ = (
        Index('ass_characters_feats_carregamento_ficha_idx', 'character_id', 'is_active', 'is_enabled', 'feat_id'),
        Index('ass_characters_feats_ficha_idx', 'character_id', 'is_active', 'is_enabled', 'feat_id'),
        Index('ass_characters_traits_index_1', 'character_id', 'feat_id', unique=True),
    )


class CharacterEquipment(Base):
    __tablename__ = "character_equipments"

    character_equipment_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    character_id = Column(Integer, ForeignKey("personagens.character_id", ondelete="CASCADE"), nullable=False)
    equipment_id = Column(Integer, ForeignKey("equipments.equipment_id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    is_equipped = Column(Boolean, nullable=False, default=False)
    current_durability = Column(Integer, nullable=True)
    custom_name = Column(String(50), nullable=True)

    # Relacionamentos
    personagem = relationship("Character", back_populates="equipamentos_inventario")
    equipamento = relationship("Equipment", back_populates="inventarios_personagens")

    __table_args__ = (
        Index('character_equipments_calc_peso_idx', 'character_id', 'is_equipped'),
        Index('idx_character_equipments_slots_ativos', 'character_id', 'is_equipped'),
    )


class CharacterMaestry(Base):
    __tablename__ = "character_maestries"

    character_maestry_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    character_id = Column(Integer, ForeignKey("personagens.character_id", ondelete="CASCADE"), nullable=False)
    maestry_slug = Column(String(30), ForeignKey("maestries_catalog.maestry_slug", onupdate="CASCADE"), nullable=False)
    current_tier = Column(Integer, nullable=False, default=1)
    current_fragments = Column(Integer, nullable=False, default=0)

    # Relacionamentos
    personagem = relationship("Character", back_populates="maestrias_personagem")
    maestria_catalogo = relationship("MaestryCatalog", back_populates="personagens_maestrias")

    __table_args__ = (
        Index('character_maestries_character_id_maestry_slug_key', 'character_id', 'maestry_slug', unique=True),
    )


class CharacterSpell(Base):
    """ Tabela associativa puramente Relacional para o Mapeamento Many-to-Many entre Personagens e Magias """
    __tablename__ = "character_spells"

    character_id = Column(Integer, ForeignKey("personagens.character_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    spell_id = Column(Integer, ForeignKey("spells.spell_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    learned_at = Column(DateTime, nullable=False, server_default=text("now()"))