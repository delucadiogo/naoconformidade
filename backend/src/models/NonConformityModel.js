  static async create(data) {
    try {
      const {
        titulo,
        descricao,
        local,
        data_ocorrencia,
        data_deteccao,
        status,
        tipo,
        gravidade,
        responsavel_id,
        criado_por_id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        data_liberacao,
        acao_tomada,
        situacao,
        fotos
      } = data;

      const query = `
        INSERT INTO nao_conformidades (
          titulo,
          descricao,
          local,
          data_ocorrencia,
          data_deteccao,
          status,
          tipo,
          gravidade,
          responsavel_id,
          criado_por_id,
          data_lancamento,
          nome_produto,
          validade,
          lote,
          tipo_produto,
          data_liberacao,
          acao_tomada,
          situacao,
          fotos
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;

      const values = [
        titulo,
        descricao,
        local,
        data_ocorrencia,
        data_deteccao,
        status,
        tipo,
        gravidade,
        responsavel_id,
        criado_por_id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        data_liberacao,
        acao_tomada,
        situacao,
        fotos
      ];

      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao criar não conformidade:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const {
        titulo,
        descricao,
        local,
        data_ocorrencia,
        data_deteccao,
        status,
        tipo,
        gravidade,
        responsavel_id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        data_liberacao,
        acao_tomada,
        situacao,
        fotos
      } = data;

      const query = `
        UPDATE nao_conformidades
        SET
          titulo = $1,
          descricao = $2,
          local = $3,
          data_ocorrencia = $4,
          data_deteccao = $5,
          status = $6,
          tipo = $7,
          gravidade = $8,
          responsavel_id = $9,
          data_lancamento = $10,
          nome_produto = $11,
          validade = $12,
          lote = $13,
          tipo_produto = $14,
          data_liberacao = $15,
          acao_tomada = $16,
          situacao = $17,
          fotos = $18,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = $19
        RETURNING *
      `;

      const values = [
        titulo,
        descricao,
        local,
        data_ocorrencia,
        data_deteccao,
        status,
        tipo,
        gravidade,
        responsavel_id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        data_liberacao,
        acao_tomada,
        situacao,
        fotos,
        id
      ];

      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT 
          nc.*,
          u.nome as criado_por_nome,
          tp.nome as tipo_produto_rotulo,
          ts.nome as situacao_rotulo,
          a.nome as acao_tomada_rotulo
        FROM nao_conformidades nc
        LEFT JOIN usuarios u ON nc.criado_por_id = u.id
        LEFT JOIN tipos_produto tp ON nc.tipo_produto = tp.valor
        LEFT JOIN tipos_situacao ts ON nc.situacao = ts.valor
        LEFT JOIN acao a ON nc.acao_tomada = a.valor
        WHERE nc.id = $1
      `;

      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar não conformidade:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const query = `
        SELECT 
          nc.*,
          u.nome as criado_por_nome,
          tp.nome as tipo_produto_rotulo,
          ts.nome as situacao_rotulo,
          a.nome as acao_tomada_rotulo
        FROM nao_conformidades nc
        LEFT JOIN usuarios u ON nc.criado_por_id = u.id
        LEFT JOIN tipos_produto tp ON nc.tipo_produto = tp.valor
        LEFT JOIN tipos_situacao ts ON nc.situacao = ts.valor
        LEFT JOIN acao a ON nc.acao_tomada = a.valor
        ORDER BY nc.criado_em DESC
      `;

      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Erro ao listar não conformidades:', error);
      throw error;
    }
  } 