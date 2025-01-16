import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import BudgetModel from "./BudgetModel";

@Table({
      tableName: 'expenses'
})

class ExpenseModel extends Model {
      @Column({
            type: DataType.STRING(100)
      })
      declare name: string

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