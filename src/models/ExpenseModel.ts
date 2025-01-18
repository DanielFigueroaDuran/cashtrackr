import { Table, Column, Model, DataType, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import BudgetModel from "./BudgetModel";

@Table({
      tableName: 'expenses'
})

class ExpenseModel extends Model {

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

      @ForeignKey(() => BudgetModel)
      declare budgetId: number

      @BelongsTo(() => BudgetModel)
      declare budget: BudgetModel
};

export default ExpenseModel;