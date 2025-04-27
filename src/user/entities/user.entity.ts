import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Branch } from '../../branch/entities/branch.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
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
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  declare role: UserRole;

  @ForeignKey(() => Branch)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare branchId: number;

  @BelongsTo(() => Branch)
  declare branch: Branch;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;
}