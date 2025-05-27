-- Adicionar coluna de usuário que criou a não conformidade
ALTER TABLE nao_conformidades
ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id),
ADD COLUMN criado_por VARCHAR(255);

-- Atualizar a função de atualização de timestamp
CREATE OR REPLACE FUNCTION update_atualizado_em_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql'; 