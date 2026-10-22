from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Union, Any
from datetime import datetime
from enum import Enum
from decimal import Decimal

# --- ENUMS (Espelhando exatamente o models.py) ---

class AfinidadeEnum(str, Enum):
    fogo = "fogo"
    agua = "agua"
    terra = "terra"
    ar = "ar"
    profano = "profano"
    sagrado = "sagrado"
    psique = "psique"
    espacial = "espacial"

class AtributoEnum(str, Enum):
    FOR = "FOR"
    DES = "DES"
    CON = "CON"
    INT = "INT"
    SAB = "SAB"
    CAR = "CAR"

class CategoriaEnum(str, Enum):
    escudo = "escudo"
    acessorio = "acessorio"
    roupa = "roupa"
    armadura_leve = "armadura_leve"
    armadura_media = "armadura_media"
    armadura_pesada = "armadura_pesada"
    arma_simples = "arma_simples"
    arma_marcial = "arma_marcial"
    poçao = "poçao"
    material = "material"
    miscelanea = "miscelanea"
    foco_arcano = "foco_arcano"
    municao = "municao"
    simbolo_sagrado = "simbolo_sagrado"
    ferramenta = "ferramenta"

class MoedaEnum(str, Enum):
    po = "po"
    pp = "pp"
    pc = "pc"

class GrauEnum(str, Enum):
    rustico = "rustico"
    refinado = "refinado"
    eximio = "eximio"
    transcendental = "transcendental"
    lendario = "lendario"
    mitico = "mitico"
    ascendido = "ascendido"

class ClasseEnum(str, Enum):
    aço = "aço"
    terra = "terra"
    espiritual = "espiritual"

class RaridadeEnum(str, Enum):
    comum = "comum"
    raro = "raro"
    lendario = "lendario"
    mitico = "mitico"
    incomum = "incomum"

class NivelMagiaEnum(str, Enum):
    basico = "basico"
    iniciante = "iniciante"
    intermediario = "intermediario"
    alto = "alto"
    superior = "superior"

class DistanciaMagiaEnum(str, Enum):
    distancia = "distancia"
    toque = "toque"
    area = "area"
    auto = "auto"

class TipoTecnicaEnum(str, Enum):
    marcial = "marcial"
    magica = "magica"
    psiquica = "psiquica"
    social = "social"

# --- USER SCHEMAS ---

class UserBase(BaseModel):
    nome_usuario: str
    login: str
    email_usuario: EmailStr
    usuario_dm: bool = False

class UserCreate(UserBase):
    senha_usuario: str

class UserLogin(BaseModel):
    login_or_email: str
    senha_usuario: str

class UserResponse(UserBase):
    id_usuario: int
    uuid_usuario: str
    criado_em: datetime
    ativo: bool

    model_config = ConfigDict(from_attributes=True)

# --- ADVENTURE SCHEMAS ---

class CampanhaBase(BaseModel):
    nome_campanha: str

class CampanhaResponse(CampanhaBase):
    id_campanha: int
    id_usuario_dm: int
    criado_em: datetime
    ativo: bool

    model_config = ConfigDict(from_attributes=True)

# --- CATALOG SCHEMAS (FEAT, EQUIPMENT, SPELL) ---

class TalentoResponse(BaseModel):
    id_talento: int
    nome_talento: str
    descricao_talento: str
    nivel_minimo: int
    atributo_requerido: Optional[AtributoEnum] = None
    atributo_minimo: Optional[int] = None
    ativo: bool

    model_config = ConfigDict(from_attributes=True)

class EquipamentoResponse(BaseModel):
    id_equipamento: int
    nome_equipamento: str
    descricao_equipamento: str
    categoria: CategoriaEnum
    peso: Decimal
    tamanho: int
    moeda_preco: MoedaEnum
    valor_preco: int
    nivel_minimo: int
    grau: GrauEnum
    classe: ClasseEnum
    raridade: RaridadeEnum
    maestria_tipo: Optional[str] = None
    atributo_requerido: Optional[AtributoEnum] = None
    atributo_minimo: Optional[int] = None
    classe_armadura: Optional[int] = None
    consumivel: bool
    unico: bool
    ativo: bool

    model_config = ConfigDict(from_attributes=True)

class CompendiumResponse(BaseModel):
    id_compendium: int
    nome_compendium: str
    descricao_compendium: str
    afinidade1: Optional[AfinidadeEnum] = None
    afinidade2: Optional[AfinidadeEnum] = None
    afinidade3: Optional[AfinidadeEnum] = None
    nivel: NivelMagiaEnum
    custo_mana: int
    alcance_tipo: DistanciaMagiaEnum
    alcance: Optional[int] = None
    conjuracao: str
    duracao: int
    concentracao: bool
    tier_maestria_minima: int
    frag_maestria_minima: int
    inteligencia_minima: int
    requer_arcanismo: bool

    model_config = ConfigDict(from_attributes=True)
    
class HabilidadeResponse(BaseModel):
    id_habilidade: int
    nome_habilidade: str
    descricao_habilidade: str
    tipo_tecnica: TipoTecnicaEnum
    nivel_minimo: int
    rank_minimo: int
    tipo_maestria_req1: Optional[str] = None
    tipo_maestria_req2: Optional[str] = None
    tipo_maestria_req3: Optional[str] = None
    tipo_maestria_req4: Optional[str] = None
    atributo1_requerido: Optional[AtributoEnum] = None
    atributo2_requerido: Optional[AtributoEnum] = None
    atributo3_requerido: Optional[AtributoEnum] = None
    atributo1_minimo: Optional[int] = None
    atributo2_minimo: Optional[int] = None
    atributo3_minimo: Optional[int] = None
    mana_custo: Optional[int] = None
    vigor_custo: Optional[int] = None
    ativo: bool

    model_config = ConfigDict(from_attributes=True)
    
class PropriedadeArmaResponse (BaseModel):
    id_propriedade_arma: int
    nome_propriedade_arma: str
    descricao_propriedade_arma: str

    model_config = ConfigDict(from_attributes=True)

# --- CHARACTER SCHEMAS ---

class PersonagemBase (BaseModel):
    id_usuario: int
    id_campanha: int
    nome_personagem: str
    idade_personagem: int
    sexo_personagem: str
    altura_personagem: Decimal
    peso_personagem: Decimal
    alinhamento_personagem: str
    nome_raca: str
    afinidade_primaria: AfinidadeEnum
    afinidade_secundaria: AfinidadeEnum
    nivel_personagem: int = 1
    xp_atual: int = 0
    merito_atual: int = 0
    atributo_for: int
    atributo_des: int
    atributo_con: int
    atributo_int: int
    atributo_sab: int
    atributo_car: int

class PersonagemCreate (PersonagemBase):
    pass

class PersonagemResponse (PersonagemBase):
    id_personagem: int
    uuid_personagem: str
    criado_em: datetime
    alterado_em: Optional[datetime] = None
    ativo: bool
    
    model_config = ConfigDict(from_attributes=True)

# --- CHARACTER RESPONSE SCHEMAS ---

class PersonagemTalentoResponse(BaseModel):
    id_personagem_talento: int
    habilitado: bool
    id_talento: TalentoResponse
    model_config = ConfigDict(from_attributes=True)

class InventarioResponse(BaseModel):
    id_inventario: int
    equipado: bool
    quantidade: int
    equipamento: EquipamentoResponse
    model_config = ConfigDict(from_attributes=True)

class GrimorioResponse(BaseModel):
    id_grimorio: int
    id_compendium: CompendiumResponse
    model_config = ConfigDict(from_attributes=True)

class PersonagemMaestriaResponse(BaseModel):
    id_personagem_maestria: int
    nome_personagem_maestria: str
    descricao_personagem_maestria: str
    tier: int
    fragmento: int
    model_config = ConfigDict(from_attributes=True)

class PersonagemTituloResponse(BaseModel):
    id_personagem_titulo: int
    nome_titulo: str
    descricao_titulo: str
    titulo_principal: bool
    ativo: bool
    model_config = ConfigDict(from_attributes=True)

class PersonagemUpdate(BaseModel):
    nome_personagem: Optional[str] = None
    idade_personagem: Optional[int] = None
    sexo_personagem: Optional[str] = None
    altura_personagem: Optional[Decimal] = None
    peso_personagem: Optional[Decimal] = None
    alinhamento_personagem: Optional[str] = None
    nivel_personagem: Optional[int] = None
    xp_atual: Optional[int] = None
    merito_atual: Optional[int] = None
    atributo_for: Optional[int] = None
    atributo_des: Optional[int] = None
    atributo_con: Optional[int] = None
    atributo_int: Optional[int] = None
    atributo_sab: Optional[int] = None
    atributo_car: Optional[int] = None
    ativo: Optional[bool] = None