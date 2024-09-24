//import { values } from "mobx"
import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import dayjs from 'dayjs'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { v4 as uuidv4 } from 'uuid';

export const User = types.model("res.users", {
    id: types.identifierNumber,
    name: types.string,
})
export const Employee = types.model("hr.employee", {
    id: types.identifierNumber,
    name: types.string,
})
export const Profile = types.model("hr.profile", {
    user: User,
    employee: Employee,
    managers: types.array(User),
})
export const Report = types.model("hr.expense.sheet", {
    id: types.identifierNumber,
    name: types.string,
    state: types.string,
    display_name: types.string,
    advance_sheet_id: types.maybe(types.union(types.boolean, types.array(types.union(types.integer, types.string)))),
    employee_id: types.optional(types.array(types.union(types.integer, types.string)), []),
    user_id: types.maybe(types.union(types.boolean, types.array(types.union(types.integer, types.string)))),
    expense_line_ids: types.array(types.integer),
    advance: types.boolean,
    payment_mode: types.union(types.boolean, types.string),
    advance_sheet_residual: types.number,
    total_amount: types.number,
    clearing_residual: types.maybe(types.number),
    write_date: types.string,
    accounting_date: types.union(types.string, types.boolean),
    write_uid: types.array(types.union(types.string, types.integer)),
    create_uid: types.array(types.union(types.string, types.integer)),
    payment_link: types.maybe(types.union(types.string, types.boolean)),
    payment_ref: types.maybe(types.union(types.string, types.boolean)),
})

export const Expense = types.model("hr.expense", {
    id: types.identifierNumber,
    name: types.string,
    date: types.union(types.string, types.boolean),
    state: types.string,
    advance: types.boolean,
    reference: types.union(types.string, types.boolean),
    total_amount: types.number,
    unit_amount: types.number,
    quantity: types.number,
    product_id: types.maybe(types.array(types.union(types.integer, types.string))),
    employee_id: types.maybe(types.array(types.union(types.integer, types.string))),
    analytic_account_id: types.union(types.array(types.union(types.integer, types.string)), types.boolean),
    sheet_id: types.maybe(types.array(types.union(types.integer, types.string))),
    account_id: types.maybe(types.array(types.union(types.integer, types.string))),
    payment_ref: types.maybe(types.union(types.string, types.boolean)),
})

export const ExpenseStore = types
    .model({
        report: types.maybe(Report),
        expenses: types.map(Expense),
        advance: types.maybe(Report),
        profile: types.maybe(Profile),
    })
    .actions(self => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addExpenseLine(line: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const _line: any = Expense.create(line)
            self.expenses.set(_line.id, _line)
        },

    }))

export const AdvanceStore = types
    .model({
        report: types.maybe(Report),
        expenses: types.map(Expense),
        clearings: types.map(Report),
        profile: types.maybe(Profile)
    })
    .actions(self => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addClearingLine(line: IReport) {

            const _line: IReport = Report.create(line)
            self.clearings.set(_line.id, _line)
        },
        addExpenseLine(line: IExpense) {

            const _line: IExpense = Expense.create(line)
            self.expenses.set(_line.id, _line)
        },

    }))
export interface IAdvanceStore extends Instance<typeof AdvanceStore> { }
export interface IAdvanceStoreSnapshotIn extends SnapshotIn<typeof AdvanceStore> { }
export interface IAdvanceStoreSnapshotOut extends SnapshotOut<typeof AdvanceStore> { }
export interface IExpenseStore extends Instance<typeof ExpenseStore> { }
export interface IExpenseStoreSnapshotIn extends SnapshotIn<typeof ExpenseStore> { }
export interface IExpenseStoreSnapshotOut extends SnapshotOut<typeof ExpenseStore> { }
export interface IReport extends Instance<typeof Report> { }
export interface IReportSnapshotIn extends SnapshotIn<typeof Report> { }
export interface IReportSnapshotOut extends SnapshotOut<typeof Report> { }
export interface IExpense extends Instance<typeof Expense> { }
export interface IExpenseSnapshotIn extends SnapshotIn<typeof Expense> { }
export interface IExpenseSnapshotOut extends SnapshotOut<typeof Expense> { }
export interface IUser extends Instance<typeof User> { }
export interface IUserSnapshotIn extends SnapshotIn<typeof User> { }
export interface IUserSnapshotOut extends SnapshotOut<typeof User> { }
export interface IEmployee extends Instance<typeof Employee> { }
export interface IEmployeeSnapshotIn extends SnapshotIn<typeof Employee> { }
export interface IEmployeeSnapshotOut extends SnapshotOut<typeof Employee> { }
export interface IProfile extends Instance<typeof Profile> { }
export interface IProfileSnapshotIn extends SnapshotIn<typeof Profile> { }
export interface IProfileSnapshotOut extends SnapshotOut<typeof Profile> { } 