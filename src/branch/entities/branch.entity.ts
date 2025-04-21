import { Column, Model, Table, DataType } from 'sequelize-typescript';

// Branch yaratish uchun interfeys
export interface BranchCreationAttributes {
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
}

@Table({ tableName: 'branches' })
export class Branch extends Model<Branch, BranchCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;
}