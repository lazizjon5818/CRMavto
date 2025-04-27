import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SalesModule } from './sales/sales.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import * as cookieParser from 'cookie-parser';


@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BranchModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    configure(consumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}


// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { BranchModule } from './branch/branch.module';
// import { AuthModule } from './auth/auth.module';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { User } from './user/entities/user.entity';
// import { Branch } from './branch/entities/branch.entity';
// import { CustomLoggerService } from './common/logger.service';
// import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     SequelizeModule.forRoot({
//       dialect: 'postgres',
//       host: process.env.DB_HOST || 'localhost',
//       port: parseInt(process.env.DB_PORT, 10) || 5432,
//       username: process.env.DB_USERNAME || 'postgres',
//       password: process.env.DB_PASSWORD || 'password',
//       database: process.env.DB_NAME || 'postgres',
//       models: [User, Branch],
//       autoLoadModels: true,
//       synchronize: false,
//     }),
//     UserModule,
//     BranchModule,
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService, CustomLoggerService],
// })
// export class AppModule {
//   configure(consumer) {
//     consumer.apply(cookieParser()).forRoutes('*');
//   }
// }