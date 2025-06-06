  static async create(req, res) {
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
      } = req.body;

      const nonConformity = await NonConformityModel.create({
        titulo,
        descricao,
        local,
        data_ocorrencia,
        data_deteccao,
        status,
        tipo,
        gravidade,
        responsavel_id,
        criado_por_id: req.user.id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        data_liberacao,
        acao_tomada,
        situacao,
        fotos
      });

      res.status(201).json(nonConformity);
    } catch (error) {
      console.error('Erro ao criar não conformidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
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
      } = req.body;

      const nonConformity = await NonConformityModel.update(id, {
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
      });

      if (!nonConformity) {
        return res.status(404).json({ error: 'Não conformidade não encontrada' });
      }

      res.json(nonConformity);
    } catch (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } 