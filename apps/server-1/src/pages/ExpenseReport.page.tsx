import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Timeline, Dialog, Title, Modal, Container, Box, LoadingOverlay, Grid, Group, Button, ActionIcon, TextInput, NumberInput, Text, FileInput, Select, NavLink } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { observer } from "mobx-react-lite";
import { getSnapshot } from "mobx-state-tree"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ExpenseStore, IExpenseStore, IReport, IExpense, IProfile, } from "../../models/store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ColDef } from "ag-grid-community";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AgGridReact } from 'ag-grid-react';
import { IconEye, IconTrash, IconPercentage10, IconLink } from '@tabler/icons-react';
import * as Yup from 'yup';
import { Formik, } from 'formik';
import { useDisclosure } from '@mantine/hooks';
import { submitReport, workflow, getReportStateOptions, getAccounts, getAdvanceSheetFor, getAdvanceReports, getAnalyticAccounts, getExpenseReport, getExpensesFor, getProducts, getProfile, getExpenseStateOptions, getUom, PrintExpenseReport } from "../lib/utilities"
import { DateInput } from '@mantine/dates';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { v4 as uuidv4 } from 'uuid';
const ReportSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    advance_sheet_id: Yup.string().required('Required'),

});
const ExpenseSchema = Yup.object().shape({
    name: Yup.string().required('Description is required'),
    product_id: Yup.string().required('Product is required'),
    unit_amount: Yup.number().required('Unit Price is required'),
    quantity: Yup.number().required('Quantity is required'),
    date: Yup.date().required('Expense Date is required'),
    account_id: Yup.string().required('Account is required'),
    analytic_account_id: Yup.string().required('Analytic Account is required'),

});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EyeComponent = (props: any) => {
    
    return <ActionIcon variant="subtle" onClick={()=>{
        console.log('Dialog',props)
    }}>
        <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrashComponent = (props: any) => {
    
    return <ActionIcon variant="subtle"  onClick={()=>{
        console.log('Delete',props)
    }}>
        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
};
export function ExpenseReport() {
    const { id } = useParams();
    const [ref, setRef] = useState(uuidv4())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    let store: IExpenseStore = ExpenseStore.create({})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [report, setReport] = useState<IReport | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [expenses, setExpenses] = useState<IExpense[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [advance, setAdvance] = useState<IReport | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<IProfile | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [advances, setAdvances] = useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [uom, setUom] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [analyticAccounts, setAnalyticAccounts] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [accounts, setAccounts] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [states, setStates] = useState<Map<string, string>>(new Map())


    const q1 = useQuery({
        queryKey: [`expense-reports-${id}-${ref}`], queryFn: async () => {
            const data = await getExpenseReport(id)
            return data
        }
    })
    const q2 = useQuery({
        queryKey: [`expenses-${id}-${ref}`], queryFn: async () => {
            const data = await getExpensesFor(id)
            return data
        }
    })
    const q3 = useQuery({
        queryKey: [`advance-${id}-${ref}`], queryFn: async () => {
            const data = await getAdvanceSheetFor(id)
            return data
        }
    })
    const q4 = useQuery({
        queryKey: [`profile-${id}`], queryFn: async () => {
            const data = await getProfile()
            return data
        }
    })
    const q5 = useQuery({
        queryKey: [`advances-${id}`], queryFn: async () => {
            const data = await getAdvanceReports()
            return data
        }
    })
    const q6 = useQuery({
        queryKey: [`products`], queryFn: async () => {
            const data = await getProducts()
            return data
        }
    })
    const q7 = useQuery({
        queryKey: [`uom`], queryFn: async () => {
            const data = await getUom()
            return data
        }
    })
    const q8 = useQuery({
        queryKey: [`analytic-accounts`], queryFn: async () => {
            const data = await getAnalyticAccounts()
            return data
        }
    })
    const q9 = useQuery({
        queryKey: [`accounts`], queryFn: async () => {
            const data = await getAccounts()
            return data
        }
    })
    const q10 = useQuery({
        queryKey: [`expense-state-options`], queryFn: async () => {
            const data = await getExpenseStateOptions()
            return data
        }
    })

    useEffect(() => {
        if (q1.data) {
            const _report = q1.data[0];
            
            setReport(_report)
        }
        if (q2.data) {
            const _expenses = q2.data;
            
            setExpenses(_expenses)
        }
        if (q3.data) {
            const _advance = q3.data[0];
            setAdvance(_advance)
        }
        if (q4.data) {
            const _profile = q4.data;
            setProfile(_profile)
        }
        if (q5.data) {
            const _advances = [];
            for (const o of q5.data) {
                if (['post', 'done'].includes(o.state)) {
                    
                    _advances.push({ value: String(o.id), label: `${o.payment_ref}` })
                }

            }
            setAdvances(_advances)
        }
        if (q6.data) {
            const _products = []
            for (const o of q6.data) {
                _products.push({ value: String(o.id), label: o.name })
            }
            setProducts(_products)
        }
        if (q7.data) {
            const _uom = [];
            for (const o of q7.data) {
                _uom.push({ value: String(o.id), label: o.name })
            }
            setUom(_uom)
        }
        if (q8.data) {
            const _analyticAccounts = [];

            for (const o of q8.data) {
                _analyticAccounts.push({ value: String(o.id), label: o.name })
            }
            setAnalyticAccounts(_analyticAccounts)
        }
        if (q9.data) {
            const _accounts = [];

            for (const o of q9.data) {
                _accounts.push({ value: String(o.id), label: [o.code, o.name].join(' ') })

            }

            setAccounts(_accounts)
        }

        if (q10.data) {
            const _states = new Map<string, string>();

            for (const [k, v] of q10.data) {
                _states.set(k, v)
            }
            setStates(_states)
        }


    }, [q1.data, q2.data, q3.data, q4.data, q5.data, q6.data, q7.data, q8.data, q9.data, q10.data,])

    store = ExpenseStore.create({ report, advance, profile, })
    for (const o of expenses) {
        store.addExpenseLine(o)

    }

    return (
        <Container size="lg">
            <Title order={4}>Expense Report/{id}</Title>
            <FormView
                store={store}
                advances={advances}
                accounts={accounts}
                analyticAccounts={analyticAccounts}
                products={products}
                uom={uom}
                states={states}
                setRef={setRef}
            />
        </Container>

    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormView = observer((props: any) => {
    dayjs.extend(relativeTime);
    const [reportStates, setReportStates] = useState<[string, string][]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const theme = useMantineTheme();
    const { id } = useParams();
    const [opened, handlers] = useDisclosure(false);
    const [openmsg, msghandlers] = useDisclosure(false);
    const [message, setMessage] = useState<string>("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [managers, setManagers] = useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //const [advances, setAdvances] = useState<any[]>([])
    const { store, advances, products, accounts, analyticAccounts, uom, states, setRef } = props
    const _store: IExpenseStore = getSnapshot(store)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const [rowData, setRowData] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const [colDefs, setColDefs] = useState<ColDef<any>[]>([

    ]);
    const defaultColDef: ColDef = {
        flex: 1,
    };

    const q1 = useQuery({
        queryKey: [`report-state-options`], queryFn: async () => {
            const data = await getReportStateOptions()
            return data
        }
    })
    const getStageNumber = (k: string) => {
        let index = -1
        for (let i = 0; i < reportStates.length; i++) {
            if (reportStates[i][0] === k) {
                index = i
                break;
            }
        }
        return index
    }
    useEffect(() => {
        if (Object.keys(_store.expenses).length > 0) {
            setRowData(Object.values(_store.expenses))
        }
        if (_store.profile) {
            const _managers = []
            if (_store.profile.managers) {
                for (const o of _store.profile.managers) {
                    _managers.push({ value: String(o.id), label: o.name })
                }
            }
            setManagers(_managers)
        }
        setColDefs([
            { field: "date", headerName: "Expense date", valueGetter: p => p.data.date ? p.data.date : "" },
            { field: "name", headerName: "Description", filter: 'agTextColumnFilter', },
            { field: "product_id", headerName: "Product", valueGetter: p => p.data.product_id[1] },
            { field: "employee_id", headerName: "Employee", valueGetter: p => p.data.employee_id[1] },
            { field: "analytic_account_id", headerName: "Analytic Account", filter: 'agTextColumnFilter', valueGetter: p => p.data.analytic_account_id ? p.data.analytic_account_id[1] : "" },
            { field: "total_amount", headerName: "Total", type: 'rightAligned' },
            { field: "state", headerName: "Status", filter: 'agTextColumnFilter', valueGetter: p => states.get(p.data.state) },
            { field: 'id', headerName: "View/Edit", cellRenderer: EyeComponent },
            { field: 'id', headerName: "Trash", cellRenderer: TrashComponent },
        ])
        if (q1.data) {
            const _states: [string, string][] = q1.data

            setReportStates(_states)
        }
    }, [_store.expenses, _store.profile, states, q1.data])
    if (!_store.profile) {
        return null;
    }
    return (
        <Container size="lg" m="sm">
            <Box pos="relative">
                <LoadingOverlay visible={!(_store.report || id === "new")} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Grid>
                    <Grid.Col span={10}>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                name: _store.report ? _store.report?.name : "",
                                employee_id: _store.profile?.employee,
                                user_id: String(typeof (_store.report?.user_id) === 'object' ? _store.report?.user_id[0] : _store.profile?.user.id),
                                advance_sheet_id: String(typeof (_store.report?.advance_sheet_id) === 'object' ? _store.report?.advance_sheet_id[0] : ""),
                                advance: _store.report?.advance ? _store.report?.advance : false,
                                state: _store.report?.state ? _store.report?.state : "draft",
                                payment_mode: "own_account",
                                advance_sheet_residual: _store.report ? _store.report?.advance_sheet_residual : ""

                            }}
                            validationSchema={ReportSchema}

                            onSubmit={async (values,) => {
                                const formData = new FormData();
                                formData.append('name', values.name)
                                formData.append('advance_sheet_id', values.advance_sheet_id)
                                
                                try {

                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    let res: any | null = null
                                    if (id === 'new') {

                                        res = await axios.post(`/expenses/add-expense-report/`,
                                            formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        })

                                        if (res.status === 200) {
                                            console.log('success', res)
                                            location.href = `#expense-reports/${res.data[0].id}`
                                        }
                                    }
                                    else {

                                        res = await axios.post(`/expenses/update-expense-report/${id}`,
                                            formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        })

                                        if (res.status === 200) {
                                            console.log('success', res)
                                            setRef(uuidv4())
                                        }
                                    }

                                } catch (e) {
                                    console.log(e)
                                }




                            }}

                        >
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid>
                                        <Grid.Col span={8}>
                                            <TextInput
                                                label="Expense Report Summary"
                                                name="name"
                                                id="name"
                                                value={props.values.name}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                withAsterisk
                                            />
                                            {props.errors.name && props.touched.name ? <Text size='xs' c='red'>{props.errors.name}</Text> : null}
                                        </Grid.Col>
                                        <Grid.Col span={4} >
                                            <Group justify="right">
                                                <Button size="compact-sm" variant="filled" onClick={() => {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    const paymentRef = advances.filter((o: any) => {
                                                        
                                                        return (o.value === props.values.advance_sheet_id)
                                                    })
                                                    PrintExpenseReport({ ..._store, paymentRef })
                                                }}>
                                                    Print
                                                </Button>
                                            </Group>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <TextInput
                                                label="Employee"
                                                name="employee_id"
                                                id="employee_id"
                                                value={props.values.employee_id.name}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                disabled
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Select
                                                label="Payment Reference"
                                                name="advance_sheet_id"
                                                id="advance_sheet_id"
                                                placeholder="Pick value"
                                                value={props.values.advance_sheet_id}
                                                onChange={(e) => {
                                                    props.setFieldValue("advance_sheet_id", e)
                                                }}
                                                data={advances}
                                            />
                                            {props.errors.advance_sheet_id && props.touched.advance_sheet_id ? <Text size='xs' c='red'>{props.errors.advance_sheet_id}</Text> : null}
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Text>`</Text>
                                            {props.values.advance_sheet_id === "" ?
                                                null : <ActionIcon component='a' href={`#advance-reports/${props.values.advance_sheet_id}`}>
                                                    <IconLink size="1rem" stroke={1.5} />
                                                </ActionIcon>}

                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Select
                                                label="Manager"
                                                name="user_id"
                                                id="user_id"
                                                placeholder="Pick value"
                                                value={props.values.user_id}
                                                onChange={(e) => {
                                                    props.setFieldValue("user_id", e)
                                                }}
                                                data={managers}
                                                disabled
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <TextInput
                                                label="Amount remaining"
                                                name="advance_sheet_residual"
                                                id="advance_sheet_residual"
                                                value={props.values.advance_sheet_residual}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                disabled
                                            />
                                        </Grid.Col>

                                        <Grid.Col span={4}></Grid.Col>
                                        <Grid.Col span={4}>
                                            {/* <TextInput
                                                style={{
                                                    backgroundColor: theme.colors.blue[1],
                                                    color: theme.colors.blue[9],
                                                }}
                                                label="Status"
                                                name="state"
                                                id="state"
                                                value={states.get(_store.report?.state)}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                disabled
                                            /> */}
                                        </Grid.Col>
                                        <Grid.Col span={12}>Expenses</Grid.Col>
                                        <Grid.Col span={9}>
                                            <Modal opened={opened} onClose={handlers.close} size="auto" title="Add Expense">
                                                <Formik
                                                    initialValues={{
                                                        name: '',
                                                        product_id: '',
                                                        product_uom_id: '1',
                                                        unit_amount: 0,
                                                        quantity: 1,
                                                        reference: '',
                                                        date: new Date(),
                                                        employee_id: '',
                                                        account_id: import.meta.env.VITE_DEFAULT_EXPENSE_ACCOUNT_ID,
                                                        analytic_account_id: '',
                                                        total_amount: 0,
                                                        amount_residual: '',
                                                        payment_mode: 'own_account',
                                                        attachments: [],
                                                        sheet_id: _store.report?.id

                                                    }}
                                                    validationSchema={ExpenseSchema}

                                                    onSubmit={async (values,) => {
                                                        values.total_amount = values.unit_amount * values.quantity
                                                        
                                                        //handlers.toggle()
                                                        const formData = new FormData();
                                                        formData.append('name', values.name)
                                                        formData.append('product_id', values.product_id)
                                                        formData.append('unit_amount', String(values.unit_amount))
                                                        formData.append('quantity', String(values.quantity))
                                                        formData.append('product_uom_id', values.product_uom_id)
                                                        formData.append('total_amount', String(values.total_amount))
                                                        formData.append('account_id', values.account_id)
                                                        formData.append('analytic_account_id', values.analytic_account_id)
                                                        formData.append('payment_mode', values.payment_mode)
                                                        formData.append('advance', "0")
                                                        formData.append('date', dayjs(values.date).format("YYYY-MM-DD"))
                                                        formData.append('sheet_id', String(values.sheet_id))
                                                        for (let i = 0; i < values.attachments.length; i++) {
                                                            formData.append(`attachments[${i}]`, values.attachments[i])
                                                        }

                                                        try {
                                                            const res = await axios.post(`/expenses/add-expense/`,
                                                                formData, {
                                                                headers: {
                                                                    'Content-Type': 'multipart/form-data'
                                                                }
                                                            })

                                                            if (res.status === 200) {
                                                                
                                                                if (res.data.message) {
                                                                    
                                                                    setMessage(res.data.message)
                                                                    msghandlers.toggle()
                                                                } else {
                                                                    handlers.toggle()
                                                                    setRef(uuidv4())
                                                                }
                                                            }
                                                        } catch (e) {
                                                            console.log(e)
                                                        }

                                                    }}

                                                >
                                                    {props => (
                                                        <form onSubmit={props.handleSubmit}>
                                                            <Grid>
                                                                <Grid.Col span={8}>
                                                                    <TextInput
                                                                        label="Description"
                                                                        name="name"
                                                                        id="name"
                                                                        value={props.values.name}
                                                                        onChange={props.handleChange}
                                                                        onBlur={props.handleBlur}
                                                                    />
                                                                    {props.errors.name && props.touched.name ? <Text size='md' c='red'>{props.errors.name}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <Select
                                                                        label="Product"
                                                                        name="product_id"
                                                                        id="product_id"
                                                                        placeholder="Pick value"
                                                                        value={props.values.product_id}
                                                                        onChange={(e) => {
                                                                            props.setFieldValue("product_id", e)
                                                                        }}
                                                                        data={products}
                                                                    />
                                                                    {props.errors.product_id && props.touched.product_id ? <Text size='md' c='red'>{props.errors.product_id}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <TextInput
                                                                        label="Bill Reference"
                                                                        name="reference"
                                                                        id="reference"
                                                                        value={props.values.reference}
                                                                        onChange={props.handleChange}
                                                                        onBlur={props.handleBlur}
                                                                        disabled
                                                                    />
                                                                    {props.errors.reference && props.touched.reference ? <Text size='md' c='red'>{props.errors.reference}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <NumberInput
                                                                        label="Unit Price"
                                                                        name="unit_amount"
                                                                        id="unit_amount"
                                                                        value={props.values.unit_amount}
                                                                        onChange={(e) => {
                                                                            props.setFieldValue("unit_amount", e)
                                                                        }}
                                                                        onBlur={props.handleBlur}
                                                                    />
                                                                    {props.errors.unit_amount && props.touched.unit_amount ? <Text size='md' c='red'>{props.errors.unit_amount}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <DateInput
                                                                        label="Expense date"
                                                                        id="date"
                                                                        name="date"
                                                                        placeholder="Pick date"
                                                                        value={props.values.date}
                                                                        onChange={(e) => {
                                                                            props.setFieldValue("date", e)
                                                                        }}
                                                                    />
                                                                    {props.errors.date && props.touched.date ? <Text size='md' c='red'><>{props.errors.date}</></Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={2}>
                                                                    <NumberInput
                                                                        label="Quantity"
                                                                        name="quantity"
                                                                        id="quantity"
                                                                        value={props.values.quantity}

                                                                        onChange={(e) => {
                                                                            props.setFieldValue("quantity", e)
                                                                        }}
                                                                        onBlur={props.handleBlur}
                                                                    />
                                                                    {props.errors.quantity && props.touched.quantity ? <Text size='md' c='red'>{props.errors.quantity}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={2}>
                                                                    <Select
                                                                        label="Units"
                                                                        name="product_uom_id"
                                                                        id="product_uom_id"
                                                                        placeholder="Pick value"
                                                                        value={props.values.product_uom_id}
                                                                        onChange={(e) => {
                                                                            props.setFieldValue("product_uom_id", e)
                                                                        }}
                                                                        data={uom}
                                                                        disabled
                                                                    />
                                                                </Grid.Col>

                                                                <Grid.Col span={4}>
                                                                    <Select
                                                                        label="Account"
                                                                        name="account_id"
                                                                        id="account_id"
                                                                        placeholder="Pick value"
                                                                        value={props.values.account_id}
                                                                        onChange={(e) => {
                                                                            props.setFieldValue("account_id", e)
                                                                            
                                                                        }}
                                                                        data={accounts}
                                                                    />
                                                                    {props.errors.account_id && props.touched.account_id ? <Text size='md' c='red'><>{props.errors.account_id}</></Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <NumberInput
                                                                        label="Total amount"
                                                                        name="total_amount"
                                                                        id="total_amount"
                                                                        value={props.values.unit_amount * props.values.quantity}
                                                                        onChange={props.handleChange}
                                                                        onBlur={props.handleBlur}
                                                                        disabled

                                                                    />
                                                                    {props.errors.total_amount && props.touched.total_amount ? <Text size='md' c='red'>{props.errors.total_amount}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <TextInput
                                                                        label="Employee"
                                                                        name="employee_id"
                                                                        id="employee_id"
                                                                        value={_store.report?.employee_id ? _store.report?.employee_id[1] : ""}
                                                                        onChange={props.handleChange}
                                                                        onBlur={props.handleBlur}
                                                                        disabled
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={4}>
                                                                    <TextInput
                                                                        label="Amount due"
                                                                        name="amount_residual"
                                                                        id="amount_residual"
                                                                        value={props.values.amount_residual}
                                                                        onChange={props.handleChange}
                                                                        onBlur={props.handleBlur}
                                                                        disabled
                                                                    />
                                                                    {props.errors.amount_residual && props.touched.amount_residual ? <Text size='md' c='red'>{props.errors.amount_residual}</Text> : null}
                                                                </Grid.Col>

                                                                <Grid.Col span={4}>
                                                                    <Select
                                                                        label="Analytic Account"
                                                                        name="analytic_account_id"
                                                                        id="analytic_account_id"
                                                                        placeholder="Pick value"
                                                                        value={props.values.analytic_account_id}
                                                                        onChange={(e) => {
                                                                            props.setFieldValue("analytic_account_id", e)
                                                                        }}
                                                                        data={analyticAccounts}
                                                                    />
                                                                    {props.errors.analytic_account_id && props.touched.analytic_account_id ? <Text size='md' c='red'>{props.errors.analytic_account_id}</Text> : null}
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={8}>
                                                                    <FileInput
                                                                        label="Attachments"
                                                                        id="attachments"
                                                                        name="attachments"
                                                                        value={props.values.attachments}
                                                                        onChange={(e) => {
                                                                            
                                                                            props.setFieldValue("attachments", e)
                                                                        }}
                                                                        leftSectionPointerEvents="none"
                                                                        clearable
                                                                        multiple
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col span={4}></Grid.Col>
                                                                <Grid.Col span={11}>
                                                                    <Group justify='left'>
                                                                        <Dialog opened={openmsg} withCloseButton withBorder onClose={msghandlers.close}
                                                                            size="lg" radius="sm">
                                                                            <Text size="xs" m="md" fw={700} c="blue">
                                                                                {message}
                                                                            </Text>
                                                                        </Dialog>
                                                                    </Group>
                                                                </Grid.Col>

                                                                <Grid.Col span={1}>
                                                                    <Group justify="right">
                                                                        <Button fullWidth size='xs' type='submit'>Save</Button>
                                                                    </Group>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </form>)}

                                                </Formik>
                                            </Modal>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Group justify="right">
                                                <Button disabled={!(_store.report?.state === "draft")} size="compact-sm" variant="filled" onClick={handlers.open}>
                                                    Create Expense
                                                </Button>
                                            </Group>
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            <Container size="lg" style={{ height: '60vh', padding: 0 }} >
                                                <div
                                                    className={
                                                        "ag-theme-quartz"
                                                    }
                                                    style={{ width: "100%", height: "100%" }}
                                                >
                                                    <AgGridReact
                                                        rowData={rowData}
                                                        columnDefs={colDefs}
                                                        defaultColDef={defaultColDef}
                                                    />
                                                </div>
                                            </Container>
                                        </Grid.Col>

                                        <Grid.Col span={8}></Grid.Col>
                                        <Grid.Col span={4}>
                                            <Group justify="right">
                                                <Text>Total amount</Text><Text>{_store.report ? _store.report?.total_amount : 0}</Text>
                                            </Group>
                                        </Grid.Col>
                                        <Grid.Col span={2}>
                                        </Grid.Col>
                                        <Grid.Col span={8}>
                                            <Group justify="center">
                                                <Button size="compact-sm" variant="filled"
                                                    disabled={workflow("submit", _store.report?.state)}
                                                    onClick={async () => {
                                                        const res = await submitReport(id)
                                                        if (res.message) {
                                                            console.log('success', res)
                                                            setRef(uuidv4())

                                                        }
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </Group>
                                        </Grid.Col>
                                        <Grid.Col span={2}>
                                            <Group justify="right">
                                                <Button size="compact-sm" type="submit" variant="filled"

                                                    disabled={workflow("save", _store.report?.state)}
                                                >
                                                    Save
                                                </Button>
                                            </Group>
                                        </Grid.Col>
                                    </Grid>
                                </form>)}

                        </Formik>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Timeline active={getStageNumber(_store.report ? _store.report.state : "")} bulletSize={24} lineWidth={2}>
                            {reportStates.map(o => (
                                <Timeline.Item bullet={<IconPercentage10 size={12} />} key={o[0]} title={o[1]} >
                                    <Text size="xs" mt={4}>{dayjs().to(dayjs(_store.report?.write_date))}</Text>
                                </Timeline.Item>
                            ))}

                        </Timeline>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>

    )

})