import json
import csv
import os

def sql_escape(text):
    if text is None:
        return "NULL"
    if isinstance(text, (int, float)):
        return str(text)
    s = str(text).replace("'", "''")
    return f"'{s}'"

def atualizar_tudo():
    print("=== ATUALIZANDO BASES DE DADOS DE MÍDIA DE SJC ===")
    
    posts_path = 'midia_sjc/analise_midia_sjc.json'
    checkpoint_path = 'midia_sjc/analise_midia_checkpoint.json'
    js_path = 'midia_sjc/analise_midia_data.js'
    csv_path = 'midia_sjc/analise_midia_sjc.csv'
    sql_path = 'create_and_populate_analise_midia_sjc.sql'
    
    if not os.path.exists(checkpoint_path):
        print("Erro: Arquivo de checkpoint não encontrado.")
        return
        
    with open(posts_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
        
    with open(checkpoint_path, 'r', encoding='utf-8') as f:
        checkpoint = json.load(f)
        
    print(f"Posts originais: {len(posts)}")
    print(f"Posts no checkpoint re-analisado: {len(checkpoint)}")
    
    atualizados = 0
    for p in posts:
        p_id = str(p.get('id'))
        if p_id in checkpoint:
            analise = checkpoint[p_id]
            p['tema_central'] = analise.get('tema_central', p.get('tema_central'))
            p['subtema'] = analise.get('subtema', p.get('subtema'))
            p['tom_noticia'] = analise.get('tom_noticia', p.get('tom_noticia'))
            p['sentimento_comentarios'] = analise.get('sentimento_comentarios', p.get('sentimento_comentarios'))
            p['gatilho_engajamento'] = analise.get('gatilho_engajamento', p.get('gatilho_engajamento'))
            p['entidades_citadas'] = analise.get('entidades_citadas', p.get('entidades_citadas', []))
            p['pessoas_citadas'] = analise.get('pessoas_citadas', p.get('pessoas_citadas', []))
            p['cidades_citadas'] = analise.get('cidades_citadas', p.get('cidades_citadas', []))
            
            p.pop('comentarios_para_analise', None)
            atualizados += 1
            
    print(f"Total de posts atualizados na memória: {atualizados}")
    
    # 1. Salvar JSON principal
    with open(posts_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"1. Atualizado: {posts_path}")
    
    # 2. Salvar JS pré-carregado web (window.PRELOADED_MIDIA_DATA)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write("window.PRELOADED_MIDIA_DATA = ")
        json.dump(posts, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"2. Atualizado: {js_path}")
    
    # 3. Salvar CSV
    if posts:
        headers = list(posts[0].keys())
        with open(csv_path, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            for p in posts:
                row = dict(p)
                if isinstance(row.get('entidades_citadas'), list):
                    row['entidades_citadas'] = ", ".join(row['entidades_citadas'])
                if isinstance(row.get('pessoas_citadas'), list):
                    row['pessoas_citadas'] = ", ".join(row['pessoas_citadas'])
                if isinstance(row.get('cidades_citadas'), list):
                    row['cidades_citadas'] = ", ".join(row['cidades_citadas'])
                writer.writerow(row)
        print(f"3. Atualizado: {csv_path}")

    # 4. Gerar SQL para Supabase
    sql_lines = [
        "-- ==================================================================",
        "-- TABELA analise_midia_sjc - RADAR SOCIAL SÃO JOSÉ DOS CAMPOS (10 CANAIS)",
        f"-- Total de registros: {len(posts)}",
        "-- ==================================================================\n",
        "CREATE TABLE IF NOT EXISTS public.analise_midia_sjc (",
        "    id TEXT PRIMARY KEY,",
        "    perfil TEXT NOT NULL,",
        "    timestamp_brasilia TEXT,",
        "    timestamp_utc TEXT,",
        "    likes INTEGER DEFAULT 0,",
        "    comments INTEGER DEFAULT 0,",
        "    engajamento_total INTEGER DEFAULT 0,",
        "    tema_central TEXT NOT NULL,",
        "    subtema TEXT,",
        "    tom_noticia TEXT NOT NULL,",
        "    sentimento_comentarios TEXT NOT NULL,",
        "    gatilho_engajamento TEXT,",
        "    entidades_citadas TEXT,",
        "    url_post TEXT,",
        "    caption TEXT,",
        "    created_at TIMESTAMPTZ DEFAULT now()",
        ");\n",
        "ALTER TABLE public.analise_midia_sjc ENABLE ROW LEVEL SECURITY;",
        'DROP POLICY IF EXISTS "Allow public read on analise_midia_sjc" ON public.analise_midia_sjc;',
        'CREATE POLICY "Allow public read on analise_midia_sjc" ON public.analise_midia_sjc FOR SELECT USING (true);\n'
    ]

    batch_size = 1000
    for i in range(0, len(posts), batch_size):
        batch = posts[i:i + batch_size]
        sql_lines.append("INSERT INTO public.analise_midia_sjc (id, perfil, timestamp_brasilia, timestamp_utc, likes, comments, engajamento_total, tema_central, subtema, tom_noticia, sentimento_comentarios, gatilho_engajamento, entidades_citadas, url_post, caption)")
        sql_lines.append("VALUES")
        val_lines = []
        for p in batch:
            entidades_str = ", ".join(p['entidades_citadas']) if isinstance(p.get('entidades_citadas'), list) else str(p.get('entidades_citadas', ''))
            val = f"({sql_escape(p.get('id'))}, {sql_escape(p.get('perfil'))}, {sql_escape(p.get('timestamp_brasilia'))}, {sql_escape(p.get('timestamp_utc'))}, {p.get('likes', 0)}, {p.get('comments', 0)}, {p.get('engajamento_total', 0)}, {sql_escape(p.get('tema_central'))}, {sql_escape(p.get('subtema'))}, {sql_escape(p.get('tom_noticia'))}, {sql_escape(p.get('sentimento_comentarios'))}, {sql_escape(p.get('gatilho_engajamento'))}, {sql_escape(entidades_str)}, {sql_escape(p.get('url_post'))}, {sql_escape(p.get('legenda', p.get('caption', '')))})"
            val_lines.append(val)
        sql_lines.append(",\n".join(val_lines) + "")
        sql_lines.append("ON CONFLICT (id) DO UPDATE SET")
        sql_lines.append("  tema_central = EXCLUDED.tema_central,")
        sql_lines.append("  subtema = EXCLUDED.subtema,")
        sql_lines.append("  tom_noticia = EXCLUDED.tom_noticia,")
        sql_lines.append("  sentimento_comentarios = EXCLUDED.sentimento_comentarios,")
        sql_lines.append("  gatilho_engajamento = EXCLUDED.gatilho_engajamento,")
        sql_lines.append("  entidades_citadas = EXCLUDED.entidades_citadas;\n")

    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_lines))
    print(f"4. Atualizado: {sql_path}")
        
    print("\nAtualização de todas as 4 bases concluída com sucesso!")

if __name__ == '__main__':
    atualizar_tudo()
