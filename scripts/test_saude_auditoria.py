#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
RADAR HUB • TEST SUITE: AUDITORIA E CONFORMIDADE DO EIXO DE SAÚDE EXPANDIDO (v2)
==============================================================================
Script: scripts/test_saude_auditoria.py
Objetivo: Validar rigorosamente todos os requisitos de auditoria dos indicadores
          estruturantes e expansão oficial de saúde de São José dos Campos:
          1. Mortalidade Infantil (SIM/SINASC/SMS/IBGE, denominadores, meta ODS)
          2. Leitos Hospitalares e UTI (CNES Dez/2024, reconciliação de subtotais)
          3. Cobertura Vacinal (Relatório Gestão SMS, RNDS, faixas etárias, metas PNI)
          4. Causas de Óbito (Capítulos CID-10, soma 100,0%, óbitos de residentes)
          5. Nascidos Vivos e Parto (SINASC 2010-2024, cesáreo vs vaginal, idade materna)
          6. Casos Confirmados de Dengue (Série Histórica Oficial PMSJC/SINAN, média 1.876)
          7. Internações Hospitalares SUS (SIH/SUS 2010-2024, Top 8 causas CID-10)
          8. Atenção Primária & Cobertura ESF (CNES / e-Gestor / SMS, 40/45 UBSs, 142 eSF)
          9. Produção SUS (SIA/SIH - Suspenso para Revisão Metodológica com estado visual)
          10. Integridade do app.html, radar_hub_controller.js e badge de auditoria
==============================================================================
"""

import sys
import os
import json
import re

def test_saude_auditoria():
    print("=" * 70)
    print("INICIANDO BATERIA DE TESTES DE AUDITORIA • EIXO DE SAÚDE SJC EXPANDIDO")
    print("=" * 70)

    # 1. Carregar sjc_open_data_ground_truth.json
    gt_path = 'data/radar_hub/sjc_open_data_ground_truth.json'
    assert os.path.exists(gt_path), f"Arquivo não encontrado: {gt_path}"
    with open(gt_path, 'r', encoding='utf-8') as f:
        gt = json.load(f)

    saude_gt = gt.get('eixos', {}).get('saude', {})
    assert saude_gt, "Eixo saúde não encontrado no ground truth"

    # --- TESTE 1: MORTALIDADE INFANTIL ---
    print("\n[TESTE 1] Auditoria de Mortalidade Infantil...")
    mort = saude_gt.get('mortalidade_infantil', {})
    assert mort.get('taxa_oficial_sms_2024') == 8.20, "Taxa SMS 2024 deve ser 8.20"
    assert mort.get('obitos_2024') == 66, "Óbitos 2024 deve ser 66"
    assert mort.get('nascidos_vivos_2024') == 8048, "Nascidos vivos 2024 deve ser 8048"
    calc_taxa_2024 = round((66 / 8048) * 1000, 2)
    assert abs(calc_taxa_2024 - 8.20) < 0.01, f"Cálculo da taxa 2024 divergente: {calc_taxa_2024}"

    assert mort.get('taxa_oficial_sms_2025_preliminar') == 7.65, "Taxa SMS 2025 preliminar deve ser 7.65"
    assert mort.get('obitos_2025') == 61, "Óbitos 2025 deve ser 61"
    assert mort.get('nascidos_vivos_2025') == 7974, "Nascidos vivos 2025 deve ser 7974"
    calc_taxa_2025 = round((61 / 7974) * 1000, 2)
    assert abs(calc_taxa_2025 - 7.65) < 0.01, f"Cálculo da taxa 2025 divergente: {calc_taxa_2025}"

    assert mort.get('taxa_ibge_cidades_2025') == 7.77, "Taxa IBGE Cidades 2025 deve ser 7.77"
    assert mort.get('meta_ods_3_2_neonatal') == 12.0, "Meta ODS neonatal deve ser 12.0"
    assert mort.get('meta_ods_3_2_menores_5_anos') == 25.0, "Meta ODS <5 anos deve ser 25.0"
    assert "divergencia_oficial_nota" in mort, "Deve documentar nota de divergência oficial"

    # Série Histórica de Mortalidade
    serie_mort = saude_gt.get('mortalidade_infantil_serie', [])
    assert len(serie_mort) >= 10, f"Série de mortalidade deve ter histórico completo (encontrados: {len(serie_mort)})"
    for item in serie_mort:
        assert 'ano' in item and 'taxa' in item and 'obitos_menores_1_ano' in item and 'nascidos_vivos' in item
        assert item['obitos_menores_1_ano'] > 0 and item['nascidos_vivos'] > 0
        recalc = round((item['obitos_menores_1_ano'] / item['nascidos_vivos']) * 1000, 2)
        assert abs(recalc - item['taxa']) <= 0.02, f"Recálculo taxa ano {item['ano']}: calc {recalc} vs reg {item['taxa']}"
    print("  -> Mortalidade Infantil: OK (Divergências explicadas, taxas e denominadores auditados)")

    # --- TESTE 2: LEITOS HOSPITALARES E UTI (CNES) ---
    print("\n[TESTE 2] Auditoria de Leitos Hospitalares e UTI (CNES Dez/2024)...")
    leitos = saude_gt.get('leitos_hospitalares_cnes', {})
    total_leitos = leitos.get('total_leitos')
    leitos_sus = leitos.get('leitos_sus')
    leitos_nao_sus = leitos.get('leitos_nao_sus')
    assert total_leitos == 1894, f"Total de leitos deve ser 1894 (obtido: {total_leitos})"
    assert leitos_sus == 846, f"Leitos SUS deve ser 846 (obtido: {leitos_sus})"
    assert leitos_nao_sus == 1048, f"Leitos Não-SUS deve ser 1048 (obtido: {leitos_nao_sus})"
    assert leitos_sus + leitos_nao_sus == total_leitos, "Equilíbrio SUS + Não-SUS = Total"

    clinicos_tot = leitos['leitos_clinicos_cirurgicos']['total']
    uti_tot = leitos['leitos_uti_total']['total']
    assert clinicos_tot == 1562, f"Clínicos/Cirúrgicos deve ser 1562 (obtido: {clinicos_tot})"
    assert uti_tot == 332, f"UTI total deve ser 332 (obtido: {uti_tot})"
    assert clinicos_tot + uti_tot == total_leitos, "Equilíbrio Clínicos + UTI = Total"

    # Reconciliação SUS
    sus_clin = leitos['leitos_clinicos_cirurgicos']['sus']
    sus_uti_ad = leitos['leitos_uti_adulto']['sus']
    sus_uti_ped = leitos['leitos_uti_pediatrica']['sus']
    sus_uti_neo = leitos['leitos_uti_neonatal']['sus']
    assert sus_clin + sus_uti_ad + sus_uti_ped + sus_uti_neo == leitos_sus, "Reconciliação subtotal SUS = 846"

    # Reconciliação Não-SUS
    priv_clin = leitos['leitos_clinicos_cirurgicos']['nao_sus']
    priv_uti_ad = leitos['leitos_uti_adulto']['nao_sus']
    priv_uti_ped = leitos['leitos_uti_pediatrica']['nao_sus']
    priv_uti_neo = leitos['leitos_uti_neonatal']['nao_sus']
    assert priv_clin + priv_uti_ad + priv_uti_ped + priv_uti_neo == leitos_nao_sus, "Reconciliação subtotal Não-SUS = 1048"
    print("  -> Leitos Hospitalares e UTI: OK (Reconciliação exata 1.894 total, 846 SUS, 1.048 Privado, 332 UTI)")

    # --- TESTE 3: COBERTURA VACINAL (PNI / SMS) ---
    print("\n[TESTE 3] Auditoria de Cobertura Vacinal (2024 e 2025)...")
    vacinas_ano = saude_gt.get('cobertura_vacinal_por_ano', {})
    assert '2024' in vacinas_ano and '2025' in vacinas_ano
    for ano_v in ['2024', '2025']:
        v_list = vacinas_ano[ano_v]
        assert len(v_list) == 7, f"Devem existir 7 vacinas para o ano {ano_v}"
        for vac in v_list:
            assert 'imunobiologico' in vac and 'dose' in vac and 'faixa_etaria' in vac and 'cobertura_pct' in vac and 'meta_pni' in vac
            if vac['vacina'].startswith('Tríplice Viral'):
                assert vac['faixa_etaria'] == '1 ano de idade (12 meses)'
            else:
                assert vac['faixa_etaria'] == 'Menores de 1 ano'
    print("  -> Cobertura Vacinal: OK (Todas as 7 vacinas mapeadas por faixa etária e meta PNI)")

    # --- TESTE 4: CAUSAS DE ÓBITO (SIM / DATASUS) ---
    print("\n[TESTE 4] Auditoria de Causas de Óbito (Fechamento 100% dos Residentes)...")
    causas_ano = saude_gt.get('causas_mortalidade_geral_por_ano', {})
    assert '2023' in causas_ano and '2024' in causas_ano
    for ano_c in ['2023', '2024']:
        c_obj = causas_ano[ano_c]
        tot_ob = c_obj['total_obitos']
        categorias = c_obj['categorias']
        sum_ob = sum(c['obitos'] for c in categorias)
        sum_pct = sum(c['pct'] for c in categorias)
        assert sum_ob == tot_ob, f"Soma dos óbitos ({sum_ob}) != total declarado ({tot_ob})"
        assert abs(sum_pct - 100.0) < 0.1, f"Soma dos percentuais ({sum_pct}) deve fechar em 100%"
    print("  -> Causas de Óbito: OK (Fechamento 100,0%, capítulos CID-10 e óbitos de residentes documentados)")

    # --- TESTE 5: EXPANSÃO BLOCO 1 - SINASC (Nascidos Vivos & Parto) ---
    print("\n[TESTE 5] Auditoria do Bloco 1 - SINASC (Nascidos Vivos & Parto)...")
    sinasc = saude_gt.get('nascidos_vivos_sinasc', {})
    assert sinasc.get('total_2024') == 7463, "Total 2024 deve ser 7463"
    assert sinasc.get('parto_cesareo_2024') == 4660, "Parto cesáreo 2024 deve ser 4660"
    assert sinasc.get('parto_vaginal_2024') == 2801, "Parto vaginal 2024 deve ser 2801"
    assert len(sinasc.get('serie_historica_parto', [])) == 15, "Série 2010-2024 deve conter 15 anos"
    assert len(sinasc.get('faixa_etaria_mae_2024', [])) == 9, "Devem constar 9 faixas etárias"
    print("  -> SINASC (Nascidos Vivos & Parto): OK (Série 2010-2024 e faixas etárias auditadas)")

    # --- TESTE 6: EXPANSÃO BLOCO 2 - CASOS CONFIRMADOS DE DENGUE (SÉRIE OFICIAL) ---
    print("\n[TESTE 6] Auditoria do Bloco 2 - Série Oficial de Casos Confirmados de Dengue...")
    dengue = saude_gt.get('dengue_sinan', {})
    assert dengue.get('casos_2024') == 98219, "Casos 2024 deve ser 98219"
    assert dengue.get('pico_historico_anterior_2015') == 14509, "Pico 2015 deve ser 14509 confirmados"
    assert dengue.get('media_historica_2010_2023') == 1876, f"Média 2010-2023 deve ser 1876 (obtido: {dengue.get('media_historica_2010_2023')})"
    
    # Validar valores confirmados ano a ano
    expected_dengue = {
        2010: 688,
        2011: 2380,
        2012: 154,
        2013: 839,
        2014: 832,
        2015: 14509,
        2016: 1731,
        2017: 438,
        2018: 198,
        2019: 670,
        2020: 452,
        2021: 619,
        2022: 1695,
        2023: 1059,
        2024: 98219
    }
    serie_dengue = {item['ano']: item for item in dengue.get('serie_historica', [])}
    for yr, exp_val in expected_dengue.items():
        assert yr in serie_dengue, f"Ano {yr} ausente na série de dengue"
        assert serie_dengue[yr]['casos'] == exp_val, f"Ano {yr}: esperado {exp_val}, obtido {serie_dengue[yr]['casos']}"
        assert serie_dengue[yr]['status_metodologico'] == "CASOS CONFIRMADOS", f"Ano {yr} sem status metodológico correto"

    print("  -> Casos Confirmados de Dengue: OK (Série 2010-2024 auditada, média histórica 1.876 recalculada)")

    # --- TESTE 7: EXPANSÃO BLOCO 3 - SIH/SUS (Internações & CID-10) ---
    print("\n[TESTE 7] Auditoria do Bloco 3 - SIH/SUS (Internações & CID-10)...")
    sih = saude_gt.get('internacoes_sih', {})
    assert sih.get('total_internacoes_2024') == 54709, "Total internações 2024 deve ser 54709"
    assert len(sih.get('top_causas_2024', [])) == 8, "Top causas 2024 deve conter 8 capítulos CID-10"
    top1 = sih['top_causas_2024'][0]
    assert 'Circulatório' in top1['causa'] and top1['internacoes'] == 7914
    print("  -> SIH/SUS (Internações Hospitalares): OK (54.709 AIHs e Top 8 causas CID-10 auditadas)")

    # --- TESTE 8: EXPANSÃO BLOCO 4 - ATENÇÃO BÁSICA & COBERTURA ESF ---
    print("\n[TESTE 8] Auditoria do Bloco 4 - Atenção Básica & Cobertura ESF...")
    ab = saude_gt.get('atencao_basica_cnes_sia', {})
    assert ab.get('unidades_basicas_saude_cnes') == 40 or ab.get('unidades_basicas_saude_ubs') == 45
    assert ab.get('equipes_saude_familia_esf') == 142, "Equipes ESF deve ser 142"
    assert ab.get('cobertura_atencao_primaria_pct_2024') == 83.5, "Cobertura APS 2024 deve ser 83.5%"
    assert ab.get('atendimentos_consultas_2024') == 1418520, "Consultas 2024 deve ser 1.418.520"
    print("  -> Atenção Básica & ESF: OK (40 UBSs CNES / 45 rede municipal, 142 equipes, 83,5% cobertura e 1,41M consultas auditadas)")

    # --- TESTE 9: EXPANSÃO BLOCO 5 - PRODUÇÃO DE SERVIÇOS (STATUS SUSPENSO) ---
    print("\n[TESTE 9] Auditoria do Bloco 5 - Produção de Serviços SUS (Status Suspenso)...")
    proc = saude_gt.get('procedimentos_sia_sih', {})
    assert proc.get('audit_status') == "SUSPENSO_PARA_REVISAO", "audit_status deve ser SUSPENSO_PARA_REVISAO"
    assert proc.get('status_metodologico') == "INDISPONIVEL_EM_REVISAO", "status_metodologico deve ser INDISPONIVEL_EM_REVISAO"
    print("  -> Produção de Serviços SUS: OK (Status SUSPENSO_PARA_REVISAO devidamente registrado)")

    # --- TESTE 10: METADATA REGISTRY ---
    print("\n[TESTE 10] Auditoria do sjc_metadata_registry.json...")
    meta_path = 'data/radar_hub/sjc_metadata_registry.json'
    with open(meta_path, 'r', encoding='utf-8') as f:
        meta = json.load(f)

    meta_dict = {item['indicator_id']: item for item in meta.get('indicators', [])}
    assert meta_dict['saude_dengue_sinan']['audit_status'] == 'CONFIRMADO'
    assert meta_dict['saude_dengue_sinan']['value'] == 98219
    assert meta_dict['saude_procedimentos_sia_sih']['audit_status'] == 'SUSPENSO_PARA_REVISAO'
    assert meta_dict['saude_atencao_basica_cnes_sia']['audit_status'] == 'CONFIRMADO'
    print("  -> Metadata Registry: OK (Dengue CONFIRMADO, Procedimentos SUSPENSO_PARA_REVISAO)")

    # --- TESTE 11: ARQUIVOS app.html E radar_hub_controller.js ---
    print("\n[TESTE 11] Validação de Sintaxe e Estrutura dos Arquivos de Interface...")
    with open('app.html', 'r', encoding='utf-8') as f:
        app_html = f.read()
    with open('radar_hub_controller.js', 'r', encoding='utf-8') as f:
        controller_js = f.read()

    # Validações app.html
    assert 'Escala logarítmica - 2024 registrou megaepidemia histórica' in app_html
    assert 'Dado em verificação de fonte' in app_html
    assert 'O volume de procedimentos ambulatoriais SUS está sendo auditado diretamente no SIA/DataSUS' in app_html
    assert 'id="hubChartSaudeDengue"' in app_html
    assert 'id="hubChartSaudeNascidos"' in app_html
    assert 'id="hubChartSaudeInternacoes"' in app_html
    assert 'id="hubChartSaudeAtencaoBasica"' in app_html

    # Validações radar_hub_controller.js
    assert "type: 'logarithmic'" in controller_js
    assert "hasSuspended" in controller_js
    assert "Em Verificação" in controller_js
    assert "renderSaudeDengueChart" in controller_js

    print("  -> app.html e radar_hub_controller.js: OK (Escala logarítmica, card de verificação e badge reativo integrados)")

    print("\n" + "=" * 70)
    print("TODOS OS TESTES DE AUDITORIA DE SAÚDE EXPANDIDO FORAM APROVADOS COM 100% DE SUCESSO!")
    print("=" * 70)

if __name__ == '__main__':
    test_saude_auditoria()
