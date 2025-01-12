import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";

@Table({
      tableName: 'budgets'
})

class BudgetModel extends Model {
      @Column({
            type: DataType.STRING(100)
      })
      declare name: string

      @Column({
            type: DataType.DECIMAL
      })
      declare amount: number
};

export default BudgetModel;