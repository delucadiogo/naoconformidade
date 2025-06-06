-- Adiciona o campo situacao na tabela nao_conformidades
ALTER TABLE nao_conformidades
ADD COLUMN IF NOT EXISTS situacao VARCHAR(100);

-- Atualiza registros existentes com um valor padrão
UPDATE nao_conformidades
SET situacao = 'Pendente'
WHERE situacao IS NULL; 