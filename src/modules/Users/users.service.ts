import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async criar(dto: any): Promise<any> {
    const existe = await this.usersRepo.findOne({ 
      where: { emailGoogle: dto.emailGoogle } 
    });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const senhaCriptografada = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usersRepo.create({
      nome: dto.nome,
      emailGoogle: dto.emailGoogle,
      senha: senhaCriptografada,
      matricula: dto.matricula,
      tipoPerfil: dto.tipoPerfil,
    });
    await this.usersRepo.save(usuario);

    if (dto.tipoPerfil === 'ALUNO') {
      await this.dataSource.query(
        'INSERT INTO aluno (usuario_id, curso) VALUES (?, ?)', 
        [usuario.id, dto.curso ?? null]
      );
    } else if (dto.tipoPerfil === 'PROFESSOR') {
      await this.dataSource.query(
        'INSERT INTO professor (usuario_id, departamento) VALUES (?, ?)', 
        [usuario.id, dto.departamento ?? null]
      );
    } else if (dto.tipoPerfil === 'PEDAGOGO') {
      await this.dataSource.query(
        'INSERT INTO pedagogo (usuario_id, area_atuacao) VALUES (?, ?)', 
        [usuario.id, dto.areaAtuacao ?? null]
      );
    } else if (dto.tipoPerfil === 'DIRETOR') {
      await this.dataSource.query(
        'INSERT INTO diretor (usuario_id) VALUES (?)', 
        [usuario.id]
      );
    }

    const { senha, ...resultado } = usuario;
    return resultado;
  }

  async listar(): Promise<any[]> {
    const usuarios = await this.usersRepo.find();
    return usuarios.map(({ senha, ...u }) => u);
  }

  async buscarPorId(id: number): Promise<User> {
    const usuario = await this.usersRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  async buscarPorEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { emailGoogle: email } });
  }
}