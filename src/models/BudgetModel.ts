import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull } from "sequelize-typescript";
import ExpenseModel from "./ExpenseModel";
import UserModel from './UserModel';

@Table({
      tableName: 'budgets'
})

class BudgetModel extends Model {

      @AllowNull(false)
      @Column({
            type: DataType.STRING(100)
      })
      declare name: string

      @AllowNull(false)
      @Column({
            type: DataType.DECIMAL
      })
      declare amount: number

      @HasMany(() => ExpenseModel, {
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'

      })
      declare expenses: ExpenseModel[]

      @ForeignKey(() => UserModel)
      declare userId: number

      @BelongsTo(() => UserModel)
      declare user: UserModel
};

export default BudgetModel;