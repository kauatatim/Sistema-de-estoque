CREATE DATABASE DB_SISTEM_ESTOQUE;
USE DB_SISTEM_ESTOQUE;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email_google VARCHAR(150) NOT NULL UNIQUE,
    matricula VARCHAR(50),
    tipo_perfil ENUM('ALUNO','PROFESSOR','PEDAGOGO','DIRETOR') NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aluno (
    usuario_id INT PRIMARY KEY,
    curso VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE professor (
    usuario_id INT PRIMARY KEY,
    departamento VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE pedagogo (
    usuario_id INT PRIMARY KEY,
    area_atuacao VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE diretor (
    usuario_id INT PRIMARY KEY,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE categoria_equipamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE equipamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria_id INT NOT NULL,
    codigo_patrimonio VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('DISPONIVEL','EMPRESTADO','MANUTENCAO')
        NOT NULL DEFAULT 'DISPONIVEL',
    cadastrado_por INT NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_por INT,
    data_atualizacao DATETIME,

    FOREIGN KEY (categoria_id) REFERENCES categoria_equipamento(id),
    FOREIGN KEY (cadastrado_por) REFERENCES usuario(id),
    FOREIGN KEY (atualizado_por) REFERENCES usuario(id)
);

CREATE TABLE emprestimo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_solicitacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao_prevista DATETIME,
    data_devolucao_real DATETIME,
    status ENUM('PENDENTE','APROVADO','REJEITADO','DEVOLVIDO')
        NOT NULL DEFAULT 'PENDENTE',
    usuario_id INT NOT NULL,
    equipamento_id INT NOT NULL,
    aprovado_por INT,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (equipamento_id) REFERENCES equipamento(id),
    FOREIGN KEY (aprovado_por) REFERENCES usuario(id)
);

CREATE INDEX idx_emprestimo_status ON emprestimo(status);
CREATE INDEX idx_equipamento_status ON equipamento(status);
CREATE INDEX idx_emprestimo_usuario ON emprestimo(usuario_id);
CREATE INDEX idx_equipamento_categoria ON equipamento(categoria_id);

DELIMITER $$

CREATE TRIGGER trg_emprestimo_atualiza_equipamento
AFTER UPDATE ON emprestimo
FOR EACH ROW
BEGIN
    IF NEW.status = 'APROVADO' THEN
        UPDATE equipamento
        SET status = 'EMPRESTADO'
        WHERE id = NEW.equipamento_id;

    ELSEIF NEW.status IN ('DEVOLVIDO','REJEITADO') THEN
        UPDATE equipamento
        SET status = 'DISPONIVEL'
        WHERE id = NEW.equipamento_id;
    END IF;
END$$

DELIMITER ;

CREATE VIEW vw_status_equipamentos AS
SELECT
    e.id,
    e.nome,
    c.nome AS categoria,
    e.codigo_patrimonio,
    e.status,
    u.nome AS emprestado_para,
    emp.data_devolucao_prevista
FROM equipamento e
JOIN categoria_equipamento c
    ON c.id = e.categoria_id
LEFT JOIN emprestimo emp
    ON emp.equipamento_id = e.id
    AND emp.status = 'APROVADO'
LEFT JOIN usuario u
    ON u.id = emp.usuario_id;

INSERT INTO usuario (nome, email_google, matricula, tipo_perfil)
VALUES
('Maria Silva', 'maria.silva@escola.com', '2024001', 'ALUNO'),
('João Souza', 'joao.souza@escola.com', NULL, 'PROFESSOR'),
('Ana Pedagoga', 'ana.pedagoga@escola.com', NULL, 'PEDAGOGO'),
('Carla Diretora', 'carla.diretora@escola.com', NULL, 'DIRETOR');

INSERT INTO aluno (usuario_id, curso)
VALUES (1, 'Desenvolvimento de Sistemas');

INSERT INTO professor (usuario_id, departamento)
VALUES (2, 'Informática');

INSERT INTO pedagogo (usuario_id, area_atuacao)
VALUES (3, 'Orientação Educacional');

INSERT INTO diretor (usuario_id)
VALUES (4);

INSERT INTO categoria_equipamento (nome)
VALUES
('Mouse'),
('Teclado'),
('Tablet'),
('Notebook'),
('Monitor');

INSERT INTO equipamento
(nome, categoria_id, codigo_patrimonio, status, cadastrado_por)
VALUES
('Mouse Logitech M170', 1, 'PAT-0001', 'DISPONIVEL', 4),
('Teclado Multilaser', 2, 'PAT-0002', 'DISPONIVEL', 4),
('Tablet Samsung A8', 3, 'PAT-0003', 'DISPONIVEL', 4);
