from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum, CheckConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM
from database import Base
import datetime

# --- DEFINIÇÃO DE ENUMS (Conforme DDL) ---

enum_afinidade = PG_ENUM(
    'fogo', 'agua', 'terra', 'ar', 'profano', 'sagrado', 'psique', 'espacial', 
    name='enum_afinidade'
)

enum_atributo = PG_ENUM('FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR', name='enum_atributo')

enum_categoria = PG_ENUM(
    'escudo', 'acessorio', 'roupa', 'armadura_leve', 'armadura_media', 'armadura_pesada',
    'arma_simples', 'arma_marcial', 'poçao', 'material', 'miscelanea', 'foco_arcano',
    'municao', 'simbolo_sagrado', 'ferramenta', name='enum_categoria'
)

enum_tipo_dano = PG_ENUM('PERF', 'CONC', 'CORT', name='enum_tipo_dano')

enum_moeda = PG_ENUM('po', 'pp', 'pc', name='enum_moeda')

enum_grau = PG_ENUM(
    'rustico', 'refinado', 'eximio', 'transcendental', 'lendario', 'mitico', 'ascendido',
    name='enum_grau'
)

enum_classe = PG_ENUM('aço', 'terra', 'espiritual', name='enum_classe')

enum_raridade = PG_ENUM('comum', 'raro', 'lendario', 'mitico', 'incomum', name='enum_raridade')

enum_nivel_magia = PG_ENUM(
    'basico', 'iniciante', 'intermediario', 'alto', 'superior', name='enum_nivel_magia'
)

enum_distancia_magia = PG_ENUM('distancia', 'toque', 'area', 'auto', name='enum_distancia_magia')

enum_tipo_tecnica = PG_ENUM('marcial', 'magica', 'psiquica', 'social', name='enum_tipo_tecnica')

class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)
    uuid_usuario = Column(String(255), unique=True, nullable=False)
    login = Column(String(50), nullable=False)
    email_usuario = Column(String(50), unique=True, nullable=False)
    senha_usuario = Column(String(255), nullable=False)
    nome_usuario = Column(String(50), nullable=False)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)
    usuario_dm = Column(Boolean, default=False)
    ativo = Column(Boolean, default=True)

    personagens = relationship("Personagem", back_populates="usuario")
    campanhas_mestradas = relationship("Campanha", back_populates="dm")

class Campanha(Base):
    __tablename__ = "campanha"

    id_campanha = Column(Integer, primary_key=True, index=True)
    nome_campanha = Column(String(100), nullable=False)
    id_usuario_dm = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)
    ativo = Column(Boolean, default=True)

    dm = relationship("Usuario", back_populates="campanhas_mestradas")
    personagens = relationship("Personagem", back_populates="campanha")

class Personagem(Base):
    __tablename__ = "personagem"

    id_personagem = Column(Integer, primary_key=True, index=True)
    uuid_personagem = Column(String(255), unique=True, nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_campanha = Column(Integer, ForeignKey("campanha.id_campanha", ondelete="CASCADE"), nullable=False)
    
    nome_personagem = Column(String(100), unique=True, nullable=False)
    idade_personagem = Column(Integer, nullable=False)
    sexo_personagem = Column(String(1), nullable=False)
    altura_personagem = Column(Numeric(3, 2), nullable=False)
    peso_personagem = Column(Numeric(3, 2), nullable=False)
    alinhamento_personagem = Column(String(50), nullable=False)
    nome_raca = Column(String(100), nullable=False)
    idiomas = Column(String(255))
    
    afinidade_primaria = Column(enum_afinidade, nullable=False)
    afinidade_secundaria = Column(enum_afinidade, nullable=False)
    
    nivel_personagem = Column(Integer, default=1, nullable=False)
    exp_atual = Column(Integer, default=0, nullable=False)
    merito_atual = Column(Integer, default=0, nullable=False)
    
    atributo_for = Column(Integer, default=8, nullable=False)
    atributo_des = Column(Integer, default=8, nullable=False)
    atributo_con = Column(Integer, default=8, nullable=False)
    atributo_int = Column(Integer, default=8, nullable=False)
    atributo_sab = Column(Integer, default=8, nullable=False)
    atributo_car = Column(Integer, default=8, nullable=False)
    
    criado_em = Column(DateTime, default=datetime.datetime.utcnow)
    alterado_em = Column(DateTime, onupdate=datetime.datetime.utcnow)
    ativo = Column(Boolean, default=True)

    # Relacionamentos
    usuario = relationship("Usuario", back_populates="personagens")
    campanha = relationship("Campanha", back_populates="personagens")
    talento = relationship("PersonagemTalento", back_populates="personagem")
    titulos = relationship("PersonagemTitulo", back_populates="personagem")
    equipamento = relationship("Inventario", back_populates="personagem")
    magias_conhecidas = relationship("Grimorio", back_populates="personagem")
    habilidades = relationship("PersonagemHabilidade", back_populates="personagem")
    maestrias = relationship("PersonagemMaestria", back_populates="personagem")

    __table_args__ = (CheckConstraint('nivel_personagem >= 1'),)

class Talento(Base):
    __tablename__ = "talento"

    id_talento = Column(Integer, primary_key=True, index=True)
    nome_talento = Column(String(50), nullable=False)
    descricao_talento = Column(String(255), nullable=False)
    nivel_minimo = Column(Integer, default=1, nullable=False)
    atributo_requerido = Column(enum_atributo)
    atributo_minimo = Column(Integer)
    ativo = Column(Boolean, default=True)

    personagens = relationship("PersonagemTalento", back_populates="talento")

class PersonagemTalento(Base):
    __tablename__ = "personagem_talento"

    id_personagem_talento = Column(Integer, primary_key=True, index=True)
    id_personagem = Column(Integer, ForeignKey("personagem.id_personagem", ondelete="CASCADE"), nullable=False)
    id_talento = Column(Integer, ForeignKey("talento.id_talento", ondelete="CASCADE"), nullable=False)
    habilitado = Column(Boolean, default=False, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)

    personagem = relationship("Personagem", back_populates="talento")
    talento = relationship("Talento", back_populates="personagens")

class Equipamento(Base):
    __tablename__ = "equipamento"

    id_equipamento = Column(Integer, primary_key=True, index=True)
    nome_equipamento = Column(String(50), nullable=False)
    descricao_equipamento = Column(String(100), nullable=False)
    categoria = Column(enum_categoria, nullable=False)
    peso = Column(Numeric(3, 2), nullable=False)
    tamanho = Column(Integer, default=1, nullable=False)
    moeda_preco = Column(enum_moeda, nullable=False)
    valor_preco = Column(Integer, nullable=False)
    nivel_minimo = Column(Integer, default=1, nullable=False)
    grau = Column(enum_grau, nullable=False)
    classe = Column(enum_classe, nullable=False)
    raridade = Column(enum_raridade, nullable=False)
    maestria_tipo = Column(String(50))
    atributo_requerido = Column(enum_atributo)
    atributo_minimo = Column(Integer)
    classe_armadura = Column(Integer, default=10)
    consumivel = Column(Boolean, default=False, nullable=False)
    unico = Column(Boolean, default=False, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)

    propriedades = relationship("EquipamentoPropriedadeArma", back_populates="equipamento")
    inventarios = relationship("Inventario", back_populates="equipamento")

class PropriedadeArma(Base):
    __tablename__ = "propriedade_arma"
    
    id_propriedade_arma = Column(Integer, primary_key=True)
    nome_propriedade_arma = Column(String(50), nullable=False)
    descricao_propriedade_arma = Column(String(255), nullable=False)

class EquipamentoPropriedadeArma(Base):
    __tablename__ = "equipamento_propriedade_arma"
    
    id_equipamento_propriedade_arma = Column(Integer, primary_key=True, index=True)
    id_equipamento = Column(Integer, ForeignKey("equipamento.id_equipamento", ondelete="CASCADE"), nullable=False)
    id_propriedade = Column(Integer, ForeignKey("propriedade_arma.id_propriedade_arma", ondelete="CASCADE"), nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)

    equipamento = relationship("Equipamento", back_populates="propriedades")

class PersonagemTitulo(Base):
    __tablename__ = "personagem_titulo"

    id_personagem_titulo = Column(Integer, primary_key=True)
    id_personagem = Column(Integer, ForeignKey("personagem.id_personagem", ondelete="CASCADE"), nullable=False)
    nome_titulo = Column(String(50), nullable=False)
    descricao_titulo = Column(String(255), nullable=False)
    titulo_principal = Column(Boolean, default=False, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)

    personagem = relationship("Personagem", back_populates="titulos")

class Inventario(Base):
    __tablename__ = "inventario"

    id_inventario = Column(Integer, primary_key=True, index=True)
    id_personagem = Column(Integer, ForeignKey("personagem.id_personagem", ondelete="CASCADE"), nullable=False)
    id_equipamento = Column(Integer, ForeignKey("equipamento.id_equipamento", ondelete="CASCADE"), nullable=False)
    equipado = Column(Boolean, default=False, nullable=False)
    quantidade = Column(Integer, default=0, nullable=False)

    personagem = relationship("Personagem", back_populates="equipamento")
    equipamento = relationship("Equipamento", back_populates="inventarios")

class Compendium(Base):
    __tablename__ = "compendium"

    id_compendium = Column(Integer, primary_key=True, index=True)
    nome_compendium = Column(String(50), nullable=False)
    descricao_compendium = Column(String(255), nullable=False)
    afinidade1 = Column(enum_afinidade)
    afinidade2 = Column(enum_afinidade)
    afinidade3 = Column(enum_afinidade)
    nivel = Column(enum_nivel_magia, nullable=False)
    custo_mana = Column(Integer, default=0, nullable=False)
    alcance_tipo = Column(enum_distancia_magia, nullable=False)
    alcance = Column(Integer)
    conjuracao = Column(String(50), nullable=False)
    duracao = Column(Integer, nullable=False)
    concentracao = Column(Boolean, default=False, nullable=False)
    tier_maestria_minima = Column(Integer, nullable=False)
    frag_maestria_minima = Column(Integer, nullable=False)
    inteligencia_minima = Column(Integer, default=10, nullable=False)
    requer_arcanismo = Column(Boolean, default=False, nullable=False)

    personagens = relationship("Grimorio", back_populates="spell")

class Grimorio(Base):
    __tablename__ = "grimorio"

    id_grimorio = Column(Integer, primary_key=True, index=True)
    id_personagem = Column(Integer, ForeignKey("personagem.id_personagem", ondelete="CASCADE"), nullable=False)
    id_compendium = Column(Integer, ForeignKey("compendium.id_compendium", ondelete="CASCADE"), nullable=False)

    personagem = relationship("Personagem", back_populates="magias_conhecidas")
    spell = relationship("Compendium", back_populates="personagens")

class Habilidade(Base):
    __tablename__ = "habilidade"

    id_habilidade = Column(Integer, primary_key=True, index=True)
    nome_habilidade = Column(String(50), nullable=False)
    descricao_habilidade = Column(String(100), nullable=False)
    tipo_tecnica = Column(enum_tipo_tecnica, nullable=False)
    nivel_minimo = Column(Integer, default=1, nullable=False)
    rank_minimo = Column(Integer, default=1, nullable=False)
    tipo_maestria_req1 = Column(String(255))
    tipo_maestria_req2 = Column(String(50))
    tipo_maestria_req3 = Column(String(255))
    tipo_maestria_req4 = Column(String(255))
    atributo1_requerido = Column(enum_atributo)
    atributo1_minimo = Column(Integer)
    atributo2_requerido = Column(enum_atributo)
    atributo2_minimo = Column(Integer)
    atributo3_requerido = Column(enum_atributo)
    atributo3_minimo = Column(Integer)
    mana_custo = Column(Integer)
    vigor_custo = Column(Integer)
    ativo = Column(Boolean, default=True, nullable=False)

    personagens = relationship("PersonagemHabilidade", back_populates="ability")
class PersonagemHabilidade(Base):
    __tablename__ = "personagem_habilidade"

    id_personagem_habilidade = Column(Integer, primary_key=True, index=True)
    id_personagem = Column(Integer, ForeignKey("personagem.id_personagem", ondelete="CASCADE"), nullable=False)
    id_habilidade = Column(Integer, ForeignKey("habilidade.id_habilidade", ondelete="CASCADE"), nullable=False)

    personagem = relationship("Personagem", back_populates="habilidades")
    ability = relationship("Habilidade", back_populates="personagens")

class PersonagemMaestria(Base):
    __tablename__ = "personagem_maestria"

    id_personagem_maestria = Column(Integer, primary_key=True, index=True)
    id_personagem = Column(Integer, ForeignKey("personagem.id_personagem", ondelete="CASCADE"), nullable=False)
    nome_personagem_maestria = Column(String(255), nullable=False)
    descricao_personagem_maestria = Column(String(255), nullable=False)
    tier = Column(Integer, nullable=False)
    fragmento = Column(Integer, nullable=False)

    personagem = relationship("Personagem", back_populates="maestrias")

    __table_args__ = (CheckConstraint('tier BETWEEN 0 AND 10'),)
