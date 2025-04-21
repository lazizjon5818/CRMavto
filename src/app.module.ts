import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // .env faylini o'qish
    ConfigModule.forRoot(),
    
    // Sequelize bilan PostgreSQL ulanishi
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,  // .env faylidan olamiz
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,  // portni tekshirib, default qiymatni berish
      username: process.env.DB_USERNAME,  // .env faylidan olamiz
      password: process.env.DB_PASSWORD,  // .env faylidan olamiz
      database: process.env.DB_NAME,  // .env faylidan olamiz
      autoLoadModels: true,
      synchronize: true,
    }),
    
    UserModule,
    
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
