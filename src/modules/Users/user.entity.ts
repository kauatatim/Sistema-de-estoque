import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nome: string;

  @Column({ name: 'email_google', length: 150, unique: true })
  emailGoogle: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ length: 50, nullable: true })
  matricula: string;

  @Column({
    name: 'tipo_perfil',
    type: 'enum',
    enum: ['ALUNO', 'PROFESSOR', 'PEDAGOGO', 'DIRETOR'],
  })
  tipoPerfil: string;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;
}