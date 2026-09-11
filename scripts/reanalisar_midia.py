import os
import json
import asyncio
import sys
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Configuração da API Key e Modelos com Fallback Automático
API_KEY = os.environ.get("GEMINI_API_KEY", "")
CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash"
]

class AnalisePostSchema(BaseModel):
    tema_central: str = Field(
        description="Categoria principal da notícia (ex: Política & Gestão Pública, Segurança Pública, Saúde Pública, Trânsito & Mobilidade, Cotidiano & Cidade, Cultura & Entretenimento, Economia & Negócios, Defesa Civil & Clima, Esporte, Educação & Tecnologia)"
    )
    subtema: str = Field(
        description="Especificação detalhada do assunto (ex: Reforma da Via Cambuí, Câmeras do CSI, Superlotação na UPA)"
    )
    tom_noticia: str = Field(
        description="Tom da reportagem (ex: Informativo, Alerta, Crítico, Comemorativo, Descontraído, Opinativo/Editorial)"
    )
    sentimento_comentarios: str = Field(
        description="Opinião predominante dos leitores nos comentários (ex: Positivo, Negativo, Neutro, Dividido/Polarizado)"
    )
    gatilho_engajamento: str = Field(
        description="O que motivou as pessoas a comentar (ex: Indignação & Reclamação, Utilidade Pública & Oportunidade, Orgulho & Celebração, Humor & Memes, Debate Político & Opinião, Medo & Alerta de Segurança)"
    )
    entidades_citadas: List[str] = Field(
        description="Órgãos públicos, locais, bairros, clubes e empresas mencionadas no post ou comentários"
    )
    pessoas_citadas: List[str] = Field(
        description="Nomes de autoridades, políticos, personalidades, atletas e cidadãos citados"
    )
    cidades_citadas: List[str] = Field(
        description="Cidades e municípios mencionados (ex: São José dos Campos, Jacareí, Taubaté, Ilhabela)"
    )

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

async def analisar_unico_post(client: genai.Client, semaphore: asyncio.Semaphore, post: Dict[str, Any]) -> Dict[str, Any]:
    post_id = str(post.get('id'))
    legenda = post.get('legenda', post.get('caption', ''))
    comentarios = post.get('comentarios_para_analise', '')
    perfil = post.get('perfil', '')
    
    prompt = f"""Você é um analista sênior de mídia social e opinião pública especialista em São José dos Campos (SJC).
Analise com extrema precisão a LEGENDA DA NOTÍCIA e os COMENTÁRIOS E REAÇÕES DA POPULAÇÃO para preencher obrigatoriamente todas as 8 colunas de inteligência.

PERFIL DO VEÍCULO: @{perfil}

LEGENDA DA NOTÍCIA:
{legenda}

COMENTÁRIOS E REAÇÕES DA POPULAÇÃO:
{comentarios if comentarios else "Sem comentários relevantes disponíveis."}

CLASSIFICAÇÃO EXIGIDA PARA AS 8 COLUNAS:
1. tema_central: Escolha uma das 10 categorias padrão ({', '.join(TEMAS_VALIDOS)}).
2. subtema: Especificação detalhada do assunto (ex: Reforma da Via Cambuí, Câmeras do CSI, Superlotação na UPA).
3. tom_noticia: Tom da reportagem (ex: Informativo, Alerta, Crítico, Comemorativo, Descontraído, Opinativo/Editorial).
4. sentimento_comentarios: Opinião predominante dos leitores (ex: Positivo, Negativo, Neutro, Dividido/Polarizado).
5. gatilho_engajamento: Motivo do engajamento (ex: Indignação & Reclamação, Utilidade Pública & Oportunidade, Orgulho & Celebração, Humor & Memes, Debate Político & Opinião, Medo & Alerta de Segurança).
6. entidades_citadas: Lista de órgãos públicos, locais, bairros, clubes e empresas mencionadas.
7. pessoas_citadas: Lista de autoridades, políticos, personalidades, atletas e cidadãos citados.
8. cidades_citadas: Lista de cidades e municípios mencionados (ex: São José dos Campos, Jacareí, Taubaté, Ilhabela).

Responda exclusivamente no formato JSON estrito contendo as 8 chaves.
"""

    async with semaphore:
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
                            response_schema=AnalisePostSchema,
                            temperature=0.1,
                        )
                    )
                )
                
                res_json = json.loads(response.text)
                await asyncio.sleep(1.5)
                
                return {
                    "id": post_id,
                    "tema_central": res_json.get("tema_central", post.get("tema_central")),
                    "subtema": res_json.get("subtema", post.get("subtema")),
                    "tom_noticia": res_json.get("tom_noticia", post.get("tom_noticia")),
                    "sentimento_comentarios": res_json.get("sentimento_comentarios", post.get("sentimento_comentarios")),
                    "gatilho_engajamento": res_json.get("gatilho_engajamento", post.get("gatilho_engajamento")),
                    "entidades_citadas": res_json.get("entidades_citadas", post.get("entidades_citadas", [])),
                    "pessoas_citadas": res_json.get("pessoas_citadas", post.get("pessoas_citadas", [])),
                    "cidades_citadas": res_json.get("cidades_citadas", post.get("cidades_citadas", [])),
                    "_modelo_usado": model
                }
            except Exception as e:
                err_msg = str(e)
                if "RESOURCE_EXHAUSTED" in err_msg or "429" in err_msg:
                    print(f"  [Cota Atingida no Modelo {model}] Alternando para o próximo modelo gratuito...", flush=True)
                    continue
                else:
                    print(f"  Aviso modelo {model} no post {post_id}: {e}", flush=True)
                    continue
                    
        print(f"  ❌ Todos os modelos candidatos esgotaram suas cotas diárias gratuitas de hoje para o post {post_id}.", flush=True)
        return None

async def main(limite: Optional[int] = None, concorrencia: int = 1):
    print(f"=== INICIANDO RE-ANÁLISE DE POSTS DE SJC (MULTI-MODELO FALLBACK) ===", flush=True)
    if not API_KEY:
        print("Erro: Defina a variável GEMINI_API_KEY no ambiente ou no arquivo .env", flush=True)
        return
        
    posts = carregar_dados()
    if limite:
        print(f"Modo de limite ativado: Processando os primeiros {limite} posts.", flush=True)
        posts = posts[:limite]
    else:
        print(f"Modo completo: Processando {len(posts)} posts.", flush=True)
        
    checkpoint_path = 'midia_sjc/analise_midia_checkpoint.json'
    processados = carregar_checkpoint(checkpoint_path)
    print(f"Posts já analisados e salvos no Checkpoint: {len(processados)}", flush=True)
    
    posts_para_processar = [p for p in posts if str(p.get('id')) not in processados]
    total_para_proc = len(posts_para_processar)
    print(f"Posts restantes nesta etapa: {total_para_proc}", flush=True)
    
    if not posts_para_processar:
        print("Todos os posts selecionados já foram analisados!", flush=True)
        return

    client = genai.Client(api_key=API_KEY)
    semaphore = asyncio.Semaphore(concorrencia)
    
    tasks = [analisar_unico_post(client, semaphore, p) for p in posts_para_processar]
    
    salvos_count = 0
    for future in asyncio.as_completed(tasks):
        res = await future
        if res and res.get('id'):
            processados[str(res['id'])] = res
            salvos_count += 1
            salvar_checkpoint(processados, checkpoint_path)
            
            modelo_str = res.get('_modelo_usado', 'gemini')
            print(f"\n========================================================", flush=True)
            print(f"[{salvos_count}/{total_para_proc}] POST ID: {res['id']} (Modelo: {modelo_str})", flush=True)
            print(f"  1. Tema Central: {res['tema_central']}", flush=True)
            print(f"  2. Subtema: {res['subtema']}", flush=True)
            print(f"  3. Tom da Notícia: {res['tom_noticia']}", flush=True)
            print(f"  4. Sentimento Comentários: {res['sentimento_comentarios']}", flush=True)
            print(f"  5. Gatilho Engajamento: {res['gatilho_engajamento']}", flush=True)
            print(f"  6. Entidades Citadas: {res['entidades_citadas']}", flush=True)
            print(f"  7. Pessoas Citadas: {res['pessoas_citadas']}", flush=True)
            print(f"  8. Cidades Citadas: {res['cidades_citadas']}", flush=True)
            print(f"========================================================", flush=True)
                
    print(f"\nConcluído! Checkpoint atualizado com {len(processados)} posts.", flush=True)

if __name__ == '__main__':
    limite_arg = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else None
    asyncio.run(main(limite=limite_arg))
