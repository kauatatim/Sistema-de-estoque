import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../Users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(emailGoogle: string, senha: string) {
    const usuario = await this.usersService.buscarPorEmail(emailGoogle);
    if (!usuario) throw new UnauthorizedException('E-mail ou senha inválidos.');

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new UnauthorizedException('E-mail ou senha inválidos.');

    const payload = {
      sub: usuario.id,
      nome: usuario.nome,
      emailGoogle: usuario.emailGoogle,
      tipo_perfil: usuario.tipoPerfil,
    };

    return {
      access_token: this.jwtService.sign(payload),
      perfil: usuario.tipoPerfil,
      nome: usuario.nome,
    };
  }
}
