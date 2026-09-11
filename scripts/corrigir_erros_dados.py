import json
import os

def corrigir():
    print("=== CORRIGINDO ERROS E DIGITAÇÕES NAS BASES ===")
    
    checkpoint_path = 'midia_sjc/analise_midia_checkpoint.json'
    json_path = 'midia_sjc/analise_midia_sjc.json'
    
    mapa_temas = {
        'Candidato & Cidadania': 'Política & Gestão Pública',
        'Seguridad Pública': 'Segurança Pública',
        'Eduração & Tecnologia': 'Educação & Tecnologia',
        'SaÃºde PÃºblica': 'Saúde Pública',
        'TrÃ¢nsito & Mobilidade': 'Trânsito & Mobilidade'
    }
    
    mapa_sentimentos = {
        'Crítico': 'Negativo',
        'CrÃ­tico': 'Negativo'
    }
    
    mapa_gatilhos = {
        'Medio & Alerta de Segurança': 'Medo & Alerta de Segurança',
        'Outros': 'Utilidade Pública & Oportunidade',
        'Nenhum': 'Utilidade Pública & Oportunidade',
        'PrestaÃ§Ã£o de Contas & Cidadania': 'Debate Político & Opinião'
    }
    
    # 1. Corrigir Checkpoint
    if os.path.exists(checkpoint_path):
        with open(checkpoint_path, 'r', encoding='utf-8') as f:
            checkpoint = json.load(f)
            
        corrigidos_cp = 0
        for item in checkpoint.values():
            if item.get('tema_central') in mapa_temas:
                item['tema_central'] = mapa_temas[item['tema_central']]
                corrigidos_cp += 1
            if item.get('sentimento_comentarios') in mapa_sentimentos:
                item['sentimento_comentarios'] = mapa_sentimentos[item['sentimento_comentarios']]
                corrigidos_cp += 1
            if item.get('gatilho_engajamento') in mapa_gatilhos:
                item['gatilho_engajamento'] = mapa_gatilhos[item['gatilho_engajamento']]
                corrigidos_cp += 1
                
        with open(checkpoint_path, 'w', encoding='utf-8') as f:
            json.dump(checkpoint, f, ensure_ascii=False, indent=2)
        print(f"Checkpoint corrigido! ({corrigidos_cp} correções realizadas)")
        
    # 2. Corrigir JSON principal
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            posts = json.load(f)
            
        corrigidos_json = 0
        for p in posts:
            if p.get('tema_central') in mapa_temas:
                p['tema_central'] = mapa_temas[p['tema_central']]
                corrigidos_json += 1
            if p.get('sentimento_comentarios') in mapa_sentimentos:
                p['sentimento_comentarios'] = mapa_sentimentos[p['sentimento_comentarios']]
                corrigidos_json += 1
            if p.get('gatilho_engajamento') in mapa_gatilhos:
                p['gatilho_engajamento'] = mapa_gatilhos[p['gatilho_engajamento']]
                corrigidos_json += 1
                
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)
        print(f"JSON principal corrigido! ({corrigidos_json} correções realizadas)")

if __name__ == '__main__':
    corrigir()
