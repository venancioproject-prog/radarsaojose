import os
import json
import asyncio
import sys
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env se existir
load_dotenv()

# Obter API Key da variável de ambiente GEMINI_API_KEY
API_KEY = os.environ.get("GEMINI_API_KEY", "")
CANDIDATE_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash"
]

class ItemAnaliseSchema(BaseModel):
    id: str = Field(description="ID exato da publicação")
    tema_central: str = Field(description="Categoria principal da notícia")
    subtema: str = Field(description="Especificação detalhada do assunto")
    tom_noticia: str = Field(description="Tom da reportagem")
    sentimento_comentarios: str = Field(description="Opinião predominante dos leitores nos comentários")
    gatilho_engajamento: str = Field(description="Motivo do engajamento dos leitores")
    entidades_citadas: List[str] = Field(description="Órgãos públicos, locais, bairros, clubes e empresas mencionadas")
    pessoas_citadas: List[str] = Field(description="Nomes de autoridades, políticos, personalidades, atletas e cidadãos citados")
    cidades_citadas: List[str] = Field(description="Cidades e municípios mencionados")

class LoteAnaliseSchema(BaseModel):
    analises: List[ItemAnaliseSchema] = Field(description="Lista contendo a análise completa de cada post do bloco")

TEMAS_VALIDOS = [
    "Política & Gestão Pública",
    "Segurança Pública",
    "Saúde Pública",
    "Trânsito & Mobilidade",
    "Cotidiano & Cidade",
    "Cultura & Entretenimento",
    "Economia & Negócios",
    "Defesa Civil & Clima",
    "Esporte",
    "Educação & Tecnologia"
]

def carregar_dados():
    posts_path = 'midia_sjc/analise_midia_sjc.json'
    comentarios_path = 'midia_sjc/todos_comentarios_posts_sjc.json'
    
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
        
    comentarios_map = {}
    if os.path.exists(comentarios_path):
        with open(comentarios_path, 'r', encoding='utf-8') as f:
            comentarios_list = json.load(f)
            for c in comentarios_list:
                p_id = str(c.get('post_id') or c.get('id', ''))
                if p_id:
                    comentarios_map[p_id] = c.get('comentarios_completos', '')
                    
    for p in posts:
        p_id = str(p.get('id', ''))
        if p_id in comentarios_map and comentarios_map[p_id]:
            p['comentarios_para_analise'] = comentarios_map[p_id]
        else:
            p['comentarios_para_analise'] = p.get('comentarios_texto', '')
            
    return posts

def carregar_checkpoint(checkpoint_path='midia_sjc/analise_midia_checkpoint.json'):
    if os.path.exists(checkpoint_path):
        try:
            with open(checkpoint_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Aviso ao carregar checkpoint: {e}", flush=True)
    return {}

def salvar_checkpoint(dados_processados, checkpoint_path='midia_sjc/analise_midia_checkpoint.json'):
    with open(checkpoint_path, 'w', encoding='utf-8') as f:
        json.dump(dados_processados, f, ensure_ascii=False, indent=2)

async def analisar_bloco_posts(client: genai.Client, bloco_posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    bloco_formatado = []
    for p in bloco_posts:
        bloco_formatado.append({
            "id": str(p.get("id")),
            "perfil": p.get("perfil", ""),
            "legenda": p.get("legenda", p.get("caption", "")),
            "comentarios": p.get("comentarios_para_analise", "")
        })
        
    prompt = f"""Você é um analista sênior de inteligência de mídia social e opinião pública especialista em São José dos Campos (SJC).

Sua missão é analisar o bloco abaixo contendo {len(bloco_posts)} publicações de notícias e reações da população.
Para CADA publicação do bloco, analise meticulosamente a legenda e os comentários para extrair as 8 colunas de inteligência.

BLOCO DE NOTÍCIAS PARA ANÁLISE:
{json.dumps(bloco_formatado, ensure_ascii=False, indent=1)}

REGRAS DE CLASSIFICAÇÃO PARA CADA ITEM:
1. tema_central: Escolha uma das 10 categorias padrão ({', '.join(TEMAS_VALIDOS)}).
2. subtema: Especificação detalhada do assunto.
3. tom_noticia: Tom da reportagem (Informativo, Alerta, Crítico, Comemorativo, Descontraído, Opinativo/Editorial).
4. sentimento_comentarios: Opinião predominante dos leitores nos comentários (Positivo, Negativo, Neutro, Dividido/Polarizado).
5. gatilho_engajamento: Motivo do engajamento (Indignação & Reclamação, Utilidade Pública & Oportunidade, Orgulho & Celebração, Humor & Memes, Debate Político & Opinião, Medo & Alerta de Segurança).
6. entidades_citadas: Lista de órgãos públicos, locais, bairros, clubes e empresas mencionadas.
7. pessoas_citadas: Lista de autoridades, políticos, personalidades, atletas e cidadãos citados.
8. cidades_citadas: Lista de cidades e municípios mencionados.

MUITO IMPORTANTE: Retorne obrigatoriamente um objeto JSON com a chave 'analises' contendo exatamente {len(bloco_posts)} itens correspondentes aos IDs recebidos.
"""

    for model in CANDIDATE_MODELS:
        try:
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(
                None,
                lambda m=model: client.models.generate_content(
                    model=m,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=LoteAnaliseSchema,
                        temperature=0.1,
                    )
                )
            )
            
            res_json = json.loads(response.text)
            lista_analises = res_json.get("analises", [])
            
            for item in lista_analises:
                item["_modelo_usado"] = model
                
            return lista_analises
        except Exception as e:
            err_msg = str(e)
            if "RESOURCE_EXHAUSTED" in err_msg or "429" in err_msg:
                print(f"  [Cota Atingida no Modelo {model}] Alternando imediatamente para o próximo modelo...", flush=True)
                continue
            else:
                print(f"  Aviso modelo {model} erro: {e}", flush=True)
                continue
                    
    print(f"  Erro: Todos os modelos da lista atingiram limites diários de hoje.", flush=True)
    return []

async def main(tamanho_bloco: int = 50):
    print(f"=== INICIANDO RE-ANÁLISE EM BLOCOS (JANELA DE CONTEXTO GIGANTE GEMINI) ===", flush=True)
    if not API_KEY:
        print("Erro: GEMINI_API_KEY não configurada no ambiente ou .env", flush=True)
        return

    posts = carregar_dados()
    checkpoint_path = 'midia_sjc/analise_midia_checkpoint.json'
    processados = carregar_checkpoint(checkpoint_path)
    
    print(f"Total de posts na base: {len(posts)}", flush=True)
    print(f"Posts já salvos no Checkpoint: {len(processados)}", flush=True)
    
    posts_para_processar = [p for p in posts if str(p.get('id')) not in processados]
    total_restante = len(posts_para_processar)
    print(f"Posts restantes a analisar: {total_restante}", flush=True)
    
    if not posts_para_processar:
        print("Todos os 7.543 posts já estão analisados no checkpoint!", flush=True)
        return

    client = genai.Client(api_key=API_KEY)
    
    blocos = [posts_para_processar[i:i + tamanho_bloco] for i in range(0, total_restante, tamanho_bloco)]
    total_blocos = len(blocos)
    print(f"Dividido em {total_blocos} blocos de até {tamanho_bloco} posts por requisição.", flush=True)
    
    concluidos = 0
    for idx, bloco in enumerate(blocos, 1):
        print(f"\n[Bloco {idx}/{total_blocos}] Enviando {len(bloco)} posts em 1 única requisição...", flush=True)
        resultados = await analisar_bloco_posts(client, bloco)
        
        if resultados:
            for r in resultados:
                p_id = str(r.get('id'))
                if p_id:
                    processados[p_id] = r
            
            salvar_checkpoint(processados, checkpoint_path)
            concluidos += len(resultados)
            print(f"[Bloco {idx}/{total_blocos}] Sucesso! +{len(resultados)} posts analisados e salvos (Total no Checkpoint: {len(processados)})", flush=True)
            await asyncio.sleep(2)
        else:
            print(f"[Bloco {idx}/{total_blocos}] Não foi possível processar este bloco. Continuando...", flush=True)
            
    print(f"\nConcluído! Checkpoint total: {len(processados)} posts.", flush=True)

if __name__ == '__main__':
    tamanho_arg = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 50
    asyncio.run(main(tamanho_bloco=tamanho_arg))
