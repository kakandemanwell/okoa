
import axios from 'axios';
import { PageOrientation, PageSize, Margins, TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import dayjs from 'dayjs'
pdfMake.fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },
};
export interface IdName {
    id: string | number,
    name: string
}
export const getReportStateOptions = async () => {
    const res = await axios.get(`/expenses/report-state-options`)
    return res.data
}
export const getExpenseStateOptions = async () => {
    const res = await axios.get(`/expenses/expense-state-options`)
    return res.data
}
export const getProducts = async () => {
    const res = await axios.get(`/expenses/products`)
    return res.data
}

export const getUom = async () => {
    const res = await axios.get(`/expenses/uom`)
    return res.data
}

export const getAnalyticAccounts = async () => {
    const res = await axios.get(`/expenses/analytic-accounts`)
    return res.data
}
export const getAccounts = async () => {
    const res = await axios.get(`/expenses/accounts`)
    return res.data
}


export const getExpenseReport = async (id: string | undefined) => {
    const res = await axios.get(`/expenses/expense-reports/${id}`)
    return res.data
}

export const getExpensesFor = async (id: string | undefined) => {
    const res = await axios.get(`/expenses/expenses/for/${id}`)
    return res.data
}

export const getAdvanceSheetFor = async (id: string | undefined) => {
    const res = await axios.get(`/expenses/expense-reports/${id}`)
    return res.data
}
export const getProfile = async () => {
    const res = await axios.get(`/expenses/profile`)
    return res.data
}

export const getAdvancesForUser = async () => {
    const res = await axios.get(`/expenses/advance-reports/`)
    return res.data
}


export const getExpenseReports = async () => {
    const res = await axios.get(`/expenses/expense-reports`)
    return res.data
}


export const getAdvanceReports = async () => {
    const res = await axios.get(`/expenses/advance-reports`)
    return res.data
}

export const getAdvanceReportPDF = async (id: string | undefined) => {
    if (!id) return null
    const res = await axios.get(`/expenses/advance-pdf-report/${id}`)
    return res.data
}

export const getClearingSheetsFor = async (id: string | undefined) => {
    const res = await axios.get(`/expenses/clearing-expense-reports/${id}`)
    return res.data
}
export const submitReport = async (id: string | undefined) => {
    const res = await axios.get(`/expenses/submit-reports/${id}`)
    return res.data
}
export const getCompany = async (id: string | undefined) => {
    const res = await axios.get(`/expenses/companies/${id}`)
    return res.data
}


export const workflow = (button: string, k: string | undefined) => {

    if (k === 'draft') {
        return false
    }
    if (button === "save" && k === undefined) {
        return false
    }
    return true
}

export const getDashboard = async (x: Date | null, y: Date | null) => {
    if (!x) { return null }
    if (!y) { return null }
    console.log(x, y)
    const formData = new FormData();
    formData.append('x', dayjs(x).format('YYYY-MM-DD'))
    formData.append('y', dayjs(y).format('YYYY-MM-DD'))
    const res = await axios.post(`/expenses/dashboard`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    return res.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrintExpenseReport = (props: any) => {
    console.log(props)
    const { report, expenses, paymentRef } = props
    if (!report) return null
    //const expenseTable=expenses
    const entries = []
    for (const [k, v] of Object.entries(expenses)) {
        k;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entries.push([(v as any).date, (v as any).reference, (v as any).name, (v as any).product_id[1], '', '', (v as any).analytic_account_id[1], { text: (v as any).total_amount, alignment: 'right' }])
    }

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4' as PageSize,
        pageOrientation: 'landscape' as PageOrientation,
        pageMargins: [10, 10, 10, 20] as Margins,
        footer: {
            columns: [
                { text: 'Expanding the Horizons', alignment: 'center', fontSize: 10 }
            ]
        },
        content: [
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    widths: ['*'],
                    body: [
                        [{ image: "logo", width: 100 }],


                    ]
                },
            },
            { text: '', margin: 5, bold: true, alignment: 'left', },

            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: [
                        [
                            { text: "Name", bold: true },
                            { text: `` },
                            {},
                            {}
                        ],
                        [
                            { text: "Claim Description", bold: true },
                            { text: `${report?.name}` },
                            { text: "Date", bold: true },
                            { text: `${report?.accounting_date ? report?.accounting_date : ''}`, alignment: 'left' },
                        ],
                    ]
                },
            },

            { text: 'Expenses', bold: true, alignment: 'left', },
            {
                layout: {
                    defaultBorder: true,
                },
                table: {
                    widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: `Expense date`, bold: true }, { text: `Reference`, bold: true }, { text: `Description`, bold: true }, { text: `Product`, bold: true }, { text: `Receipted`, bold: true }, { text: `Code`, bold: true }, { text: `Analytic Account`, bold: true }, { text: `Total Amount`, bold: true }],
                        ...entries,
                        [{ text: 'Total', colSpan: 7, bold: true, alignment: 'right' }, {}, {}, {}, {}, {}, {}, { text: `${new Intl.NumberFormat('en-US',).format(report.total_amount,)}`, alignment: 'right', }]


                    ]
                },
            },
            { text: '', margin: 5, bold: true, alignment: 'left', fontSize: 24 },
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: [
                        [
                            { text: "Submitted by", bold: true },
                            { text: `${report.employee_id[1]}` },
                            { text: "Payment Reference", bold: true },
                            { text: `${paymentRef.length > 0 ? paymentRef[0].label : ""}` },
                        ],
                        [
                            { text: "Approved by", bold: true },
                            { text: `${String(typeof (report?.user_id) === 'object' ? report?.user_id[1] : "________________________")}` },
                            { text: "Payment Voucher/Receipt#", bold: true },
                            { text: "________________________", alignment: 'left' },
                        ],
                        [
                            { text: "MD/Director's approval", bold: true },
                            { text: "________________________", alignment: 'left' },
                            { text: "Dated", bold: true },
                            { text: "________________________", alignment: 'left' },
                        ],
                    ]
                },
            },

        ],

        defaultStyle: {
            font: 'Roboto',
            fontSize: 10,
        },
        images: {
            logo: import.meta.env.VITE_DEFAULT_LOGO
        }
    };
    pdfMake.createPdf(docDefinition).download(`Expense Report - ${report.id}.pdf`);



}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrintAdvanceReport = async (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, reportStates } = props
    const states: Map<string, string> = new Map(reportStates)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = await getAdvanceReportPDF(id)
    console.log("PDF", id, data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { report, line, clearing_sheet_ids, expenses } = data

    const res_company = await getCompany(report[0].company_id[0])
    const company = res_company.company[0]
    console.log("Company", company)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _expenses: any[][] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _clearing_sheet_ids: Map<string, any> = new Map()
    for (const o of clearing_sheet_ids) {

        _clearing_sheet_ids.set(String(o.id), o)
    }
    for (const o of Object.entries(expenses)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const entries: any[] = o[1] as any[]
        const sheet = _clearing_sheet_ids.get(String(o[0]))
        for (let i = 0; i < entries.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const a = entries[i]
            if (i === 0) {
                _expenses.push([
                    o[0],
                    sheet.accounting_date ? sheet.accounting_date : '',
                    sheet.name,
                    sheet.employee_id[1],
                    sheet.user_id ? sheet.user_id[1] : "",
                    states.get(sheet.state),
                    a.reference,
                    a.analytic_account_id[1],
                    a.product_id[1],
                    { text: new Intl.NumberFormat('en-US',).format(a.unit_amount,), alignment: 'right' },
                    { text: a.quantity, alignment: 'right' },
                    { text: new Intl.NumberFormat('en-US',).format(a.total_amount), alignment: 'right' },
                    ''])
            }
            else {
                _expenses.push(['', '', '', '', '', '',
                    a.reference,
                    a.analytic_account_id[1],
                    a.product_id[1],
                    { text: new Intl.NumberFormat('en-US',).format(a.unit_amount,), alignment: 'right' },
                    { text: a.quantity, alignment: 'right' },
                    { text: new Intl.NumberFormat('en-US',).format(a.total_amount), alignment: 'right' },
                    ''])
            }
            if (i === (entries.length - 1)) {
                _expenses.push([{ text: '', colSpan: 6 }, {}, {}, {}, {}, {}, { text: 'Total', alignment: 'right', bold: true, colSpan: 6 }, {}, {}, {}, {}, {},
                { text: new Intl.NumberFormat('en-US',).format(sheet.total_amount), alignment: 'right' },
                ])
            }

        }
    }
    _expenses.push([{ text: 'Total Amount Cleared', colSpan: 12, alignment: 'right', bold: true }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
    { text: new Intl.NumberFormat('en-US',).format(report[0].total_amount - report[0].clearing_residual), alignment: 'right' },
    ])
    _expenses.push([{ text: 'Total Amount Due', colSpan: 12, alignment: 'right', bold: true },
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
    { text: new Intl.NumberFormat('en-US',).format(report[0].clearing_residual), alignment: 'right' },
    ])

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4' as PageSize,
        pageOrientation: 'landscape' as PageOrientation,
        pageMargins: [10, 10, 10, 20] as Margins,
        footer: {
            columns: [
                { text: 'Expanding the Horizons', alignment: 'center', fontSize: 10 }
            ]
        },
        content: [
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    widths: ['auto', 'auto', '*'],
                    body: [
                        [{ image: "logo", width: 100, rowSpan: 4 }, { text: company.name, alignment: 'left',bold:true }, {}],

                        [{}, { text: company.street, alignment: 'left',bold:true }, {}],

                        [{}, { text: company.street2, alignment: 'left',bold:true }, {}],

                        [{}, { text: company.email, alignment: 'left',bold:true }, {}],


                    ]
                },
            },
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: [
                        [
                            { text: "Name", bold: true },
                            { text: `` },
                            {},
                            {}
                        ],
                        [
                            { text: "Description", bold: true },
                            { text: `${report[0].name}` },
                            { text: "Date", bold: true },
                            { text: `${report[0].accounting_date ? report[0].accounting_date : ''}`, alignment: 'left' },
                        ],
                    ]
                },
            },
            { text: 'Advance report', marginTop: 5, bold: true, alignment: 'left', fontSize: 16 },
            {
                layout: {
                    defaultBorder: true,
                },
                table: {
                    widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            { text: `ID`, bold: true, },
                            { text: `Expense date`, bold: true, },
                            { text: `Report Summary`, bold: true, },
                            { text: `Employee`, bold: true, },
                            { text: `Approved by`, bold: true, },
                            { text: `Payment Reference`, bold: true, },
                            { text: `Status`, bold: true, },
                            { text: `Total Amount`, alignment: 'right', bold: true, }],
                        [
                            { text: `${report[0].id}` },
                            { text: `${report[0].accounting_date ? report[0].accounting_date : ''}` },
                            { text: `${report[0].name}` },
                            { text: `${report[0].employee_id[1]}` },
                            { text: `${report[0].user_id ? report[0].user_id[1] : ""}` },
                            { text: `${report[0].payment_ref}` },
                            { text: `${states.get(report[0].state)}` },
                            { text: new Intl.NumberFormat('en-US',).format(report[0].total_amount), alignment: 'right' },

                        ],

                    ]
                },
            },
            { text: 'Expenses reports', bold: true, marginTop: 5, alignment: 'left', fontSize: 16 },
            {
                layout: {
                    defaultBorder: true,
                },
                table: {
                    widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: "", colSpan: 6 }, {}, {}, {}, {}, {}, { text: "Expenses", colSpan: 6, bold: true, }, {}, {}, {}, {}, {}, {}],
                        [
                            { text: `ID`, bold: true, },
                            { text: `Expense date`, bold: true, },
                            { text: `Report Summary`, bold: true, },
                            { text: `Employee`, bold: true, },
                            { text: `Approved by`, bold: true, },
                            { text: `Status`, bold: true, },
                            { text: `Bill Reference`, bold: true, },
                            { text: "Analytic Account", bold: true, },
                            { text: "Product", bold: true, },
                            { text: "Unit price", bold: true, },
                            { text: "Quantity", bold: true, },
                            { text: "Amount", bold: true, },
                            { text: `Total Amount`, bold: true, }],
                        ..._expenses


                    ]
                },
            },
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: [
                        [
                            { text: "Submitted by", bold: true },
                            { text: `${report[0].employee_id[1]}` },
                            { text: "Payment Reference", bold: true },
                            { text: `${report[0].payment_ref}` },
                        ],
                        [
                            { text: "Approved by", bold: true },
                            { text: `${report[0].user_id ? report[0].user_id[1] : ""}` },
                            { text: "Payment Voucher/Receipt#", bold: true },
                            { text: "________________________", alignment: 'left' },
                        ],
                        [
                            { text: "MD/Director's approval", bold: true },
                            { text: "________________________", alignment: 'left' },
                            { text: "Dated", bold: true },
                            { text: "________________________", alignment: 'left' },
                        ],
                    ]
                },
            },


        ],

        defaultStyle: {
            font: 'Roboto',
            fontSize: 10,
        },
        images: {
            logo: import.meta.env.VITE_DEFAULT_LOGO
        }
    };
    pdfMake.createPdf(docDefinition).download(`Advance Report - ${report[0].id}.pdf`);



}
