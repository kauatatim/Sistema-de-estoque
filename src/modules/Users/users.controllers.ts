import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users — cadastrar usuário
  @Post()
  criar(@Body() dto: any) {
    return this.usersService.criar(dto);
  }

  // GET /users — listar todos
  @Get()
  listar() {
    return this.usersService.listar();
  }

  // GET /users/:id — buscar por id
  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.usersService.buscarPorId(Number(id));
  }
}
