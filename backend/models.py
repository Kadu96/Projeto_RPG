from sqlalchemy import Column, DateTime, Integer, String, Boolean, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship
from database import Base # Assumindo que sua instância declarativa está em database.py

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    user_uuid = Column(String, nullable=False, unique=True)
    user_name = Column(String, nullable=False)
    user_login = Column(String, nullable=False, unique=True)
    user_pass = Column(String, nullable=False)
    user_email = Column(String, nullable=False, unique=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_master = Column(Boolean, nullable=False, default=False)

class Race(Base):
    __tablename__ = "races"

    race_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    race_name = Column(String, nullable=False)
    race_description = Column(String, nullable=False)
    race_traits = Column(MutableDict.as_mutable(JSONB), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    personagens = relationship("Character", back_populates="raca")

class Background(Base):
    __tablename__ = "backgrounds"

    background_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    background_name = Column(String, nullable=False)
    background_description = Column(String, nullable=False)
    background_traits = Column(MutableDict.as_mutable(JSONB), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    personagens = relationship("Character", back_populates="antecedente")

class Feat(Base):
    __tablename__ = "feats"

    feat_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    feat_name = Column(String, nullable=False)
    feat_description = Column(String, nullable=False)
    feat_requisite = Column(MutableDict.as_mutable(JSONB), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    personagem = relationship("AssCharactersFeat", back_populates="talento")

class Character(Base):
    __tablename__ = "characters"

    character_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    character_uuid = Column(String, nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    race_id = Column(Integer, ForeignKey("races.race_id", ondelete="SET NULL", onupdate="CASCADE"), nullable=False)
    background_id = Column(Integer, ForeignKey("backgrounds.background_id", ondelete="SET NULL", onupdate="CASCADE"), nullable=False)
    adventure_id = Column(Integer, ForeignKey("adventures.adventure_id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)
    character_name = Column(String, nullable=False, unique=True)
    
    # Uso de MutableDict para permitir detecção de mudanças internas no JSONB
    character_info = Column(MutableDict.as_mutable(JSONB), nullable=False)
    character_details = Column(MutableDict.as_mutable(JSONB), nullable=False)
    character_abilities = Column(MutableDict.as_mutable(JSONB), nullable=False)
    character_equipment = Column(MutableDict.as_mutable(JSONB), nullable=False)
    
    is_active = Column(Boolean, nullable=False, default=True)

    raca = relationship("Race", back_populates="personagens")
    antecedente = relationship("Background", back_populates="personagens")
    talento = relationship("AssCharactersFeat", back_populates="personagem")
    campanha = relationship("Adventure", back_populates="personagem")

    # Índice conforme definido no DrawDB
    __table_args__ = (
        Index('characters_index_0', "user_id", "is_active"),
    )

class AssCharactersFeat(Base):
    __tablename__ = "ass_characters_feat"

    ass_characters_feat_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)
    character_id = Column(Integer, ForeignKey("characters.character_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    feat_id = Column(Integer, ForeignKey("feats.feat_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    is_enabled = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)

    personagem = relationship("Character", back_populates="talento")
    talento = relationship("Feat", back_populates="personagem")

    # Índices conforme definido no DrawDB
    __table_args__ = (
        Index('ass_characters_feat_index_0', "feat_id", "is_active", "is_enabled", "character_id"),
        Index('ass_characters_feat_index_1', "character_id", "feat_id", unique=True),
    )
    
class Adventure(Base):
    __tablename__ = "adventures"
    
    adventure_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, unique=True)    
    adventure_name = Column(String(50))
    adventure_description = Column(String(255))
    is_active = Column(Boolean, nullable=False, default=True)
    adventure_create = Column(DateTime, nullable=False) 
    user_id_create = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)

    personagem = relationship("Character", back_populates="campanha")