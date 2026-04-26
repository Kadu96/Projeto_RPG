from sqlalchemy.orm import Session
import models
import uuid
import schemas


def calcular_ficha_inicial(db: Session, char_in: schemas.CharacterCreate, user_id: int):
    # Busca Raça (usando os IDs do seu novo banco)
    raca = db.query(models.Race).filter(models.Race.race_id == char_in.race_id).first()

    # Validação de Segurança: Garante que os IDs existam antes de prosseguir
    if not raca:
        raise ValueError(f"Raça com ID {char_in.race_id} não encontrada.")

    # --- Lógica de Cálculos (Mapeamento, Atributos, Moedas) ---
    mapeamento = {
        "FOR": "forca",
        "DES": "destreza",
        "CON": "constituicao",
        "INT": "inteligencia",
        "SAB": "sabedoria",
        "CAR": "carisma",
    }
    
    # Obter atributos enviados pelo front ou usar 10 como base
    atributos_front = char_in.character_abilities.get("atributos", {}) if char_in.character_abilities else {}
    atributos = {
        "forca": atributos_front.get("forca", 10),
        "destreza": atributos_front.get("destreza", 10),
        "constituicao": atributos_front.get("constituicao", 10),
        "inteligencia": atributos_front.get("inteligencia", 10),
        "sabedoria": atributos_front.get("sabedoria", 10),
        "carisma": atributos_front.get("carisma", 10),
    }
    moedas = {"ouro": 100, "prata": 0, "cobre": 0}
    pericias = {
        "acrobacia": 0,
        "adestramento": 0,
        "arcanismo": 0,
        "atletismo": 0,
        "atuacao": 0,
        "enganacao": 0,
        "furtividade": 0,
        "historia": 0,
        "intimidacao": 0,
        "intuicao": 0,
        "investigacao": 0,
        "medicina": 0,
        "natureza": 0,
        "percepcao": 0,
        "persuasao": 0,
        "presdigitacao": 0,
        "religiao": 0,
        "sobrevivencia": 0,
    }

    # Valores iniciais
    vida_base = next(
        (
            item["valor"]
            for item in raca.race_traits.get("recursos", [])
            if item.get("reserva") == "vida"
        ),
        0,
    )
    mana_base = next(
        (
            item["valor"]
            for item in raca.race_traits.get("recursos", [])
            if item.get("reserva") == "mana"
        ),
        0,
    )
    vigor_base = next(
        (
            item["valor"]
            for item in raca.race_traits.get("recursos", [])
            if item.get("reserva") == "vigor"
        ),
        0,
    )

    if raca and "bonus_attr" in raca.race_traits:
        for item in raca.race_traits["bonus_attr"]:
            attr_nome = mapeamento.get(item["atributo"])
            if attr_nome:
                atributos[attr_nome] += item["valor"]

    # --- Cálculos de Modificadores ---
    mod_for = (atributos["forca"] - 10) // 2
    mod_des = (atributos["destreza"] - 10) // 2
    mod_con = (atributos["constituicao"] - 10) // 2
    mod_int = (atributos["inteligencia"] - 10) // 2
    mod_sab = (atributos["sabedoria"] - 10) // 2
    mod_car = (atributos["carisma"] - 10) // 2

    # Cálculo de Rerservas Iniciais Máximas
    vida_max = vida_base + mod_con
    mana_max = mana_base + max(mod_int, mod_sab, mod_car)
    vigor_max = vigor_base + mod_for + mod_des

    # Monta os objetos JSONB conforme a estrutura do novo banco
    character_info = char_in.character_info  # idade, altura, etc que vem do front

    character_details = {
        "xp": 0,
        "nivel": 1,
        "merito": 0,
        "rank": 0,
        "titulos": [],
        "maestrias": [],
        "moedas": moedas,
        "deslocamento": raca.race_traits.get("deslocamento", "9") if raca else "9",
        "reservas": {
            "vida": {"atual": vida_max, "maximo": vida_max, "dado": vida_base},
            "mana": {"atual": mana_max, "maximo": mana_max, "dado": mana_base},
            "vigor": {"atual": vigor_max, "maximo": vigor_max, "dado": vigor_base},
        },
    }

    character_abilities = {"atributos": atributos, "pericias": pericias}

    character_equipment = {
        "roupa": "Comum",
        "mochila": {"descricao": "Básica", "slotsOcupados": 0, "slotsTotais": 20},
        "armadura": {
            "nome": "",
            "defesa": 0,
            "defFixa": False,
            "descricao": ""
        },
        "acessorios": [],
        "cintura": [],
        "costas": [],
        "peitoral": [],
    }

    # Retorna o objeto pronto para o SQLAlchemy
    return models.Character(
        character_uuid=str(uuid.uuid4()),
        user_id=user_id,
        race_id=char_in.race_id,
        adventure_id=char_in.adventure_id,
        character_name=char_in.character_name,
        character_info=character_info,
        character_details=character_details,
        character_abilities=character_abilities,
        character_equipment=character_equipment,
        is_active=True,
    )
