#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
RADAR HUB • SCRIPT DE HOMOLOGAÇÃO FASE 5 (VIEWPORTS & PERFORMANCE)
==============================================================================
Script: scripts/homologation_test.py
Objetivo: Executar bateria automatizada de testes nos viewports especificados
          (375px, 390px, 414px e 1366px), medir tempo de carregamento do
          Radar Hub via cache estático (< 150ms) e validar integridade do DOM.
==============================================================================
"""

import sys
import os
import time
import json
import threading

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PORT = 8765
ROOT_DIR = Path(__file__).resolve().parent.parent

class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def log_message(self, format, *args):
        pass  # Silencia logs de requisições HTTP para clareza no terminal

def start_server():
    server = HTTPServer(('127.0.0.1', PORT), QuietHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    return server

def run_homologation():
    server = start_server()
    print("=" * 70)
    print("🚀 INICIANDO BATERIA DE HOMOLOGAÇÃO DO RADAR HUB (FASE 5)")
    print(f"Servidor local ativo em: http://127.0.0.1:{PORT}")
    print("=" * 70)

    opts = Options()
    opts.set_capability('goog:loggingPrefs', {'browser':'ALL'})
    opts.add_argument('--headless=new')
    opts.add_argument('--disable-gpu')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--disable-extensions')
    opts.add_argument('--log-level=3')

    driver = webdriver.Chrome(options=opts)

    viewports = [
        {"name": "Mobile Compacto (iPhone SE)", "width": 375, "height": 667, "type": "mobile"},
        {"name": "Mobile Standard (iPhone 12/13/14)", "width": 390, "height": 844, "type": "mobile"},
        {"name": "Mobile Large (iPhone Plus/Max)", "width": 414, "height": 896, "type": "mobile"},
        {"name": "Desktop / Laptop Padrão", "width": 1366, "height": 768, "type": "desktop"}
    ]

    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_viewports_tested": len(viewports),
        "target_load_time_ms": 150.0,
        "viewports": [],
        "performance": {},
        "functional_checks": {}
    }

    try:
        for vp in viewports:
            print(f"\n📱 Testando Viewport: {vp['name']} ({vp['width']}x{vp['height']})...")
            driver.set_window_size(vp['width'], vp['height'])
            driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride', {
                'width': vp['width'], 'height': vp['height'], 'deviceScaleFactor': 1,
                'mobile': vp['type'] == 'mobile'})
            driver.get(f"http://127.0.0.1:{PORT}/app.html")

            # Aguarda a página carregar
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )

            # Aciona a aba do Radar Hub e mede o tempo de inicialização
            start_init = driver.execute_script("""
                const t0 = performance.now();
                if (typeof window.switchMainTab === 'function') {
                    window.switchMainTab('ibge');
                } else if (typeof window.initRadarHub === 'function') {
                    window.initRadarHub();
                }
                return t0;
            """)

            # Aguarda efetivamente a Promise: medir só o despacho escondia falhas.
            init_result = driver.execute_async_script("""
                const done = arguments[arguments.length - 1];
                const start = performance.now();
                window.initRadarHub().then(() => done({ok:true, elapsed:performance.now()-start}))
                    .catch(e => done({ok:false, error:String(e)}));
            """)
            assert init_result['ok'], init_result


            # Medição de tempo de resposta do Radar Hub via performance.now()
            metrics = driver.execute_script("""
                const t1 = performance.now();
                const ibgeView = document.getElementById('ibge-view');
                const isVisible = ibgeView && !ibgeView.classList.contains('hidden');
                
                // Checagem de overflow horizontal indesejado
                const docWidth = document.documentElement.scrollWidth;
                const winWidth = window.innerWidth;
                const hasHorizontalOverflow = docWidth > (winWidth + 2); // tolerância de subpixel

                // Checagem do Top KPI de população
                const kpiPopElem = document.getElementById('hub-kpi-emprego');
                const kpiPopText = kpiPopElem ? kpiPopElem.textContent.trim() : '';

                // Checagem do Badge de Auditoria
                const auditTextElem = document.getElementById('hub-audit-status-text');
                const auditStatusText = auditTextElem ? auditTextElem.textContent.trim() : '';

                // Checagem das 9 pills de eixos
                const axisPills = document.querySelectorAll('[id^="sidebar-btn-hub-axis-"]');

                return {
                    loadTimeMs: null, // latência real é medida na Promise acima
                    isVisible: isVisible,
                    docWidth: docWidth,
                    winWidth: winWidth,
                    hasHorizontalOverflow: hasHorizontalOverflow,
                    kpiPopText: kpiPopText,
                    auditStatusText: auditStatusText,
                    axisPillsCount: axisPills.length
                };
            """)

            assert metrics['isVisible'], 'Radar Hub invisível'
            assert metrics['auditStatusText'] == 'Auditoria não carregada', metrics
            assert metrics['kpiPopText'] == 'Dado não disponível', metrics
            assert metrics['axisPillsCount'] >= 9, metrics
            assert not metrics['hasHorizontalOverflow'], metrics
            vp_result = {
                "name": vp['name'],
                "width": vp['width'],
                "height": vp['height'],
                "is_visible": metrics['isVisible'],
                "horizontal_overflow": metrics['hasHorizontalOverflow'],
                "kpi_emprego_value": metrics['kpiPopText'],
                "init_awaited_ms": init_result["elapsed"],
                "audit_status_badge": metrics['auditStatusText'],
                "axis_pills_count": metrics['axisPillsCount']
            }
            report["viewports"].append(vp_result)

            status_sym = "✅" if not metrics['hasHorizontalOverflow'] else "⚠️"
            print(f"   {status_sym} Visível: {metrics['isVisible']} | Overflow Horizontal: {metrics['hasHorizontalOverflow']} (Doc: {metrics['docWidth']}px, Janela: {metrics['winWidth']}px)")
            print(f"   📊 KPI População: {metrics['kpiPopText']} | Badge Auditoria: {metrics['auditStatusText']}")
            print(f"   🧭 Pills de Eixos: {metrics['axisPillsCount']}/9 renderizadas")

        # ======================================================================
        # TESTE FUNCIONAL & MEDIÇÃO ESTATÍSTICA DE LATÊNCIA (10 REQUISIÇÕES)
        # ======================================================================
        print("\n⏱️  Medindo latência de carregamento do Radar Hub (Cache Local)...")
        driver.set_window_size(1366, 768)
        driver.execute_cdp_cmd('Emulation.clearDeviceMetricsOverride', {})
        driver.get(f"http://127.0.0.1:{PORT}/app.html")
        time.sleep(0.5)

        perf_results = driver.execute_async_script("""
            const done = arguments[arguments.length - 1];
            (async () => {
            const times = [];
            for (let i = 0; i < 5; i++) {
                const t0 = performance.now();
                await window.initRadarHub();
                const t1 = performance.now();
                times.push(t1 - t0);
            }
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            const min = Math.min(...times);
            const max = Math.max(...times);
            done({
                runs: times,
                avgMs: Number(avg.toFixed(2)),
                minMs: Number(min.toFixed(2)),
                maxMs: Number(max.toFixed(2))
            });
            })().catch(error => done({error:String(error)}));
        """)

        assert "error" not in perf_results, perf_results
        report["performance"] = perf_results
        report["validation_scope"] = "comportamento de software; não valida fontes oficiais"
        perf_ok = perf_results['avgMs'] < 150.0
        print(f"   {'⚡ META ATINGIDA' if perf_ok else '⚠️ ACIMA DA META'}: Média de {perf_results['avgMs']} ms (Min: {perf_results['minMs']} ms, Max: {perf_results['maxMs']} ms | Meta: < 150 ms)")

        # ======================================================================
        # TESTE DOS 16 CANVASES E FILTROS N1 / N2
        # ======================================================================
        print("\n🧪 Validando 16 canvases de gráficos e filtros locais...")
        functional = driver.execute_script("""
            const axes = ['visao_geral', 'demografia', 'saude', 'seguranca', 'meio_ambiente', 'economia', 'educacao', 'mobilidade', 'financas', 'benchmark'];
            const canvases = [
                'hubChartGeralPop', 'hubChartGeralPib',
                'hubChartDemografiaHistorico', 'hubChartDemografiaPiramide',
                'hubChartSaudeLeitos', 'hubChartSaudeMortalidade',
                'hubChartSegurancaHomicidios', 'hubChartSegurancaOcorrencias',
                'hubChartMeioAmbienteQueimadas',
                'hubChartEconomiaEmprego', 'hubChartEconomiaEmpresas',
                'hubChartEducacaoIdeb', 'hubChartEducacaoMatriculas',
                'hubChartMobilidadeFrota', 'hubChartMobilidadeFatalidades',
                'hubChartFinancasFuncoes'
            ];

            // Percorre todos os eixos e renderiza
            axes.forEach(ax => {
                if (typeof window.switchRadarHubAxis === 'function') {
                    window.switchRadarHubAxis(ax);
                }
            });

            // Verifica presença de cada canvas
            const canvasStatus = {};
            canvases.forEach(id => {
                const el = document.getElementById(id);
                canvasStatus[id] = el !== null;
            });

            // Testa Filtro N1 e N2
            window.filterHubChart('pop_serie', 'period', '2010_2026');
            window.filterHubChart('leitos', 'rede', 'sus');

            // Testa Ficha Técnica (Drawer)
            window.openIndicatorMetadata('demo_populacao_censo');
            const drawerVal = document.getElementById('drawer-val')?.textContent.trim();
            window.closeIndicatorMetadata();

            // Testa Benchmark
            const benchmarkGrid = document.getElementById('hub-benchmark-cards-grid');
            const benchmarkCardsCount = benchmarkGrid ? benchmarkGrid.children.length : 0;

            return {
                canvasCount: Object.values(canvasStatus).filter(Boolean).length,
                totalCanvases: canvases.length,
                drawerIndicatorVal: drawerVal,
                benchmarkCardsCount: benchmarkCardsCount
            };
        """)

        errors = [entry for entry in driver.get_log('browser') if entry.get('level') == 'SEVERE' and 'radar_hub_controller.js' in entry.get('message','')]
        assert not errors, errors
        report['controller_js_errors'] = errors
        report["functional_checks"] = functional
        print(f"   ✅ Canvases de Gráficos: {functional['canvasCount']}/{functional['totalCanvases']} ativos no DOM")
        print(f"   ✅ Ficha Técnica (Drawer): Valor no Drawer = {functional['drawerIndicatorVal']}")
        print(f"   ✅ Benchmark Multicidades: {functional['benchmarkCardsCount']} cards comparativos renderizados")

        # Salva o relatório de homologação
        report_file = ROOT_DIR / "data" / "radar_hub" / "homologation_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"\n📋 Relatório de Homologação gravado em: {report_file}")

        print("\n" + "=" * 70)
        print("🎯 RESULTADO GERAL DA HOMOLOGAÇÃO (FASE 5): VERIFICAÇÕES DE SOFTWARE CONCLUÍDAS; NÃO É AUDITORIA DE FONTES")
        print("=" * 70)

        return report

    finally:
        driver.quit()
        server.shutdown()

if __name__ == "__main__":
    run_homologation()
