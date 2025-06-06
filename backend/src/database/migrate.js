const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
  try {
    console.log('Iniciando migrações...');

    // Criar tabela de controle de migrações se não existir
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ler todos os arquivos de migração
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Executar cada migração
    for (const file of migrationFiles) {
      const migrationName = path.basename(file, '.sql');
      
      // Verificar se a migração já foi executada
      const { rows } = await db.query(
        'SELECT id FROM migrations WHERE name = $1',
        [migrationName]
      );

      if (rows.length === 0) {
        console.log(`Executando migração: ${migrationName}`);
        
        // Ler e executar o arquivo SQL
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await db.query(sql);

        // Registrar a migração como executada
        await db.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migrationName]
        );

        console.log(`Migração ${migrationName} executada com sucesso`);
      } else {
        console.log(`Migração ${migrationName} já foi executada anteriormente`);
      }
    }

    console.log('Todas as migrações foram executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
    throw error;
  } finally {
    await db.end();
  }
}

// Executar as migrações
runMigrations().catch(console.error); 