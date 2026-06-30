// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// // 🚨 Deixei comentado para NÃO dar erro no seu terminal enquanto você cria as pastas!
// // Quando criar o módulo de usuários, apague as '//' da linha de baixo:
// // import { UsersModule } from './modules/users/users.module';
// // import { ItensModule } from './modules/itens/itens.module';
// // import { EmprestimosModule } from './modules/emprestimos/emprestimos.module';
// // import { AuthModule } from './modules/auth/auth.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',           // Usuário padrão do MySQL (mude se o seu for diferente)
//       password: 'password',
//       database: 'DB_SISTEM_ESTOQUE',
//       entities: [],
//       synchronize: false,         
//     }),
//     // Conforme for criando os módulos e desmarcando lá em cima, desmarque aqui também:
//     // UsersModule,
//     // ItensModule,
//     // EmprestimosModule,
//     // AuthModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/Users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password', // sua senha
      database: 'DB_SISTEM_ESTOQUE',
      entities: [],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
