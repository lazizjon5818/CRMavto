// src/user/entities/user.entity.ts
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)), // ENUM'dan to'g'ri foydalanish
    defaultValue: UserRole.USER,
  })
  declare role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isActive: boolean;
}
