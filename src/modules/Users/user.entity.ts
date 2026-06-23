import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'ID_Usuario' })
  id: number;

  @Column({ name: 'Nome_Usuario', length: 100 })
  nome: string;

  @Column({ name: 'Email', length: 250, unique: true })
  email: string;

  @Column({ name: 'Senha', length: 250 })
  senha: string;
}