-- ============================================================================
-- RADAR SÃO JOSÉ DOS CAMPOS - CORREÇÃO DE SEGURANÇA DO CRM SUPABASE (VERSÃO HARDENED)
-- ============================================================================
-- ATENÇÃO: As políticas antigas que concediam 'GRANT ALL TO anon' e 'USING (true)'
-- foram REVOGADAS em conformidade com o ACHADO 02 da Auditoria de Segurança.
--
-- Para aplicar a migração canônica, execute o arquivo:
-- data/migrations/009_hardening_crm_rls.sql
-- ============================================================================

-- Redireciona a execução para as regras seguras definidas na migration 009
\i data/migrations/009_hardening_crm_rls.sql
