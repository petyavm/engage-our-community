-- ============================================================
-- REAL DONATION INFO UPDATE
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

DELETE FROM donation_info;

INSERT INTO donation_info (key, label, value) VALUES
  ('holder', 'Титуляр', 'Сдружение Училищно Настоятелство към 163 ОУ „Черноризец Храбър"'),
  ('bank', 'Банка', 'Общинска банка АД'),
  ('iban', 'IBAN', 'BG13SOMB91301049673401'),
  ('bic', 'BIC/SWIFT', 'SOMBBGSF'),
  ('reason', 'Основание', 'Дарение');
