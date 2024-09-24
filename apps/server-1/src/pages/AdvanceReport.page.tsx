import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Timeline, useMantineTheme, Title, Container, Box, LoadingOverlay, Grid, Group, Button, ActionIcon, TextInput, NumberInput, Text, FileInput, Select } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { observer } from "mobx-react-lite";
import { getSnapshot } from "mobx-state-tree"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AdvanceStore, IAdvanceStore, IReport, IExpense, IProfile } from "../../models/store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ColDef } from "ag-grid-community";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AgGridReact } from 'ag-grid-react';
import { IconEye, IconPercentage10 } from '@tabler/icons-react';
import * as Yup from 'yup';
import { Formik, } from 'formik';
import { workflow, submitReport, getAdvancesForUser, getAnalyticAccounts, getClearingSheetsFor, getExpenseReport, getExpensesFor, getProducts, getProfile, getExpenseStateOptions, getUom, getReportStateOptions, PrintAdvanceReport } from "../lib/utilities"
import { DateInput } from '@mantine/dates';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { v4 as uuidv4 } from 'uuid';
const ReportSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    advance_unit_amount: Yup.number().required('Unit Price is required'),
    advance_date: Yup.date().required('Expense Date is required'),

});

export function AdvanceReport() {
    const { id } = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [uState, setUstate] = useState<string>(uuidv4())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    let store: IAdvanceStore = AdvanceStore.create({})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [report, setReport] = useState<IReport | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [expenses, setExpenses] = useState<IExpense[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [clearings, setClearings] = useState<IReport[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<IProfile | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [uom, setUom] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [analyticAccounts, setAnalyticAccounts] = useState<object[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [states, setStates] = useState<Map<string, string>>(new Map())
    const q1 = useQuery({
        queryKey: [`advance-report-${id}-${uState}`], queryFn: async () => {
            if (id === 'new') return {}
            const data = await getExpenseReport(id)
            return data
        }
    })
    const q2 = useQuery({
        queryKey: [`expenses-${id}-${uState}`], queryFn: async () => {
            if (id === 'new') return []
            const data = await getExpensesFor(id)
            return data
        }
    })
    const q3 = useQuery({
        queryKey: [`clearing-expense-sheets-${id}-${uState}`], queryFn: async () => {
            if (id === 'new') return []
            const data = await getClearingSheetsFor(id)
            return data
        }
    })
    const q4 = useQuery({
        queryKey: [`profile`], queryFn: async () => {
            const data = await getProfile()
            return data
        }
    })
    const q5 = useQuery({
        queryKey: [`advances`], queryFn: async () => {
            const data = await getAdvancesForUser()
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
            const _clearings = q3.data;
            setClearings(_clearings)
        }
        if (q4.data) {
            const _profile = q4.data;
            setProfile(_profile)
        }
        if (q5.data) {
            // const _advances = q5.data;
            // setAdvances(_advances)
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

        if (q10.data) {
            const _states = new Map<string, string>();

            for (const [k, v] of q10.data) {
                _states.set(k, v)
            }
            setStates(_states)
        }


    }, [q1.data, q2.data, q3.data, q4.data, q5.data, q6.data, q7.data, q8.data, q10.data])

    store = AdvanceStore.create({ report, profile, })
    for (const o of clearings) {
        store.addClearingLine(o)

    }
    for (const o of expenses) {
        store.addExpenseLine(o)

    }
    return (
        <Container size="lg">
            <Title order={4}>Advance Report/{id}</Title>
            <FormView
                store={store}
                analyticAccounts={analyticAccounts}
                products={products}
                uom={uom}
                states={states}
                setUstate={setUstate}
            />
        </Container>

    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormView = observer((props: any) => {
    dayjs.extend(relativeTime);
    const [reportStates, setReportStates] = useState<[string, string][]>([])
    const q1 = useQuery({
        queryKey: [`report-state-options`], queryFn: async () => {
            const data = await getReportStateOptions()
            return data
        }
    })
    const { store, setUstate } = props
    const _store: IAdvanceStore = getSnapshot(store)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const theme = useMantineTheme();
    const { id } = useParams();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let expense = {
        id: 0,
        name: "",
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        state: "draft",
        advance: true,
        display_name: "",
        total_amount: 0,
        unit_amount: 0,
        reference: '',
        employee_id: "",
        analytic_account_id: "",
        sheet_id: ""
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomComponent = (props: any) => {

        return <ActionIcon variant="subtle" component='a' href={`#expense-reports/${props.data.id}`}>
            <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const [colDefs, setColDefs] = useState<ColDef<any>[]>([
        { field: 'id', headerName: "Link", cellRenderer: CustomComponent },
        { field: "display_name", headerName: "Title", filter: 'agTextColumnFilter', },
        { field: "employee_id", headerName: "Employee", valueGetter: p => p.data.employee_id[1] },
        { field: "state", headerName: "State", filter: 'agTextColumnFilter', },
        { field: "payment_link", headerName: "Payment reference", valueGetter: p => p.data.payment_link },
        { field: "create_uid", headerName: "Created by", valueGetter: p => p.data.create_uid[1] },
        { field: "write_uid", headerName: "Last updated by", valueGetter: p => p.data.write_uid[1] },
        { field: "user_id", headerName: "Manager", valueGetter: p => p.data.user_id ? p.data.user_id[1] : '' },
        { field: "create_date", headerName: "Date created", valueGetter: p => dayjs(p.data.create_date).format('YYYY-MM-DD') },
        { field: "write_date", headerName: "Date updated", valueGetter: p => dayjs(p.data.write_date).format('YYYY-MM-DD') },
        { field: "total_amount", headerName: "Total Amount", type: 'rightAligned' },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const defaultColDef: ColDef = {
        flex: 1,
    };

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
    const loaded = Object.values(_store.expenses).length
    const rowData = Object.values(_store.clearings)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const managers: any[] = []
    if (_store.profile) {
        if (_store.profile.managers) {
            for (const o of _store.profile.managers) {
                managers.push({ value: String(o.id), label: o.name })
            }
        }

    }
    useEffect(() => {

        if (q1.data) {
            const _states: [string, string][] = q1.data

            setReportStates(_states)
        }

    }, [q1.data])
    if (!_store.profile) {
        return null;
    }

    if (loaded > 0) {
        expense = Object.values(_store.expenses)[0]
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
                                user_id: String(typeof (_store.report?.user_id) === 'object' ? _store.report?.user_id[0] : ""),
                                advance: _store.report?.advance ? _store.report?.advance : true,
                                state: _store.report?.state ? _store.report?.state : "draft",
                                payment_mode: "own_account",
                                clearing_residual: _store.report ? _store.report?.clearing_residual : 0,
                                advance_name: expense.name,
                                advance_product_uom_id: '1',
                                advance_unit_amount: expense.unit_amount,
                                advance_quantity: 1,
                                advance_reference: expense.reference,
                                advance_date: dayjs(expense.date).toDate(),
                                advance_employee_id: expense.employee_id,
                                advance_total_amount: expense.total_amount,
                                advance_payment_mode: 'own_account',
                                advance_attachments: [],
                                advance_sheet_id: expense.sheet_id
                            }}
                            validationSchema={ReportSchema}

                            onSubmit={async (values,) => {
                                console.log(values)
                                const formData = new FormData();
                                formData.append('name', values.name)

                                formData.append('advance_product_uom_id', values.advance_product_uom_id)
                                formData.append('advance_unit_amount', String(values.advance_unit_amount))
                                formData.append('advance_quantity', String(values.advance_quantity))
                                formData.append('advance_date', dayjs(values.advance_date).format('YYYY-MM-DD'))

                                formData.append('advance_payment_mode', values.advance_payment_mode)
                                formData.append('advance_sheet_id', values.advance_sheet_id)
                                try {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    let res: any | null = null
                                    if (id === 'new') {
                                        res = await axios.post(`/expenses/add-advance-report/`,
                                            formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        })

                                        if (res.status === 200) {
                                            console.log('success', res.data.report[0].id)
                                            location.href = `#advance-reports/${res.data.report[0].id}`
                                        }
                                    }
                                    else {
                                        res = await axios.post(`/expenses/update-advance-report/${id}`,
                                            formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        })

                                        if (res.status === 200) {
                                            console.log('success', res)
                                            setUstate(uuidv4())
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
                                                label="Report Summary"
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
                                                <Button size="compact-sm" variant="filled" onClick={async () => {
                                                    if (_store.report)
                                                        await PrintAdvanceReport({ id: _store.report.id, reportStates })
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
                                        <Grid.Col span={4}></Grid.Col>

                                        <Grid.Col span={4}>
                                            <TextInput
                                                label="Payment Reference"
                                                name="advance_name"
                                                id="advance_name"
                                                value={props.values.advance_name}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                disabled
                                            />
                                            {props.errors.name && props.touched.name ? <Text size='md' c='red'>{props.errors.name}</Text> : null}
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <NumberInput
                                                label="Total Amount Requested"
                                                name="advance_unit_amount"
                                                id="advance_unit_amount"
                                                value={props.values.advance_unit_amount}
                                                onChange={(e) => {
                                                    props.setFieldValue("advance_unit_amount", e)
                                                }}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.errors.advance_unit_amount && props.touched.advance_unit_amount ? <Text size='md' c='red'><>{props.errors.advance_unit_amount}</></Text> : null}
                                        </Grid.Col>

                                        <Grid.Col span={4}></Grid.Col>

                                        <Grid.Col span={4}>
                                            <DateInput
                                                label="Expense date"
                                                id="advance_date"
                                                name="advance_date"
                                                placeholder="Pick date"
                                                value={props.values.advance_date}
                                                onChange={(e) => {
                                                    props.setFieldValue("advance_date", e)
                                                }}
                                            />
                                            {props.errors.advance_date && props.touched.advance_date ? <Text size='md' c='red'><>{props.errors.advance_date}</></Text> : null}
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <NumberInput
                                                label="Amount Not Accounted for"
                                                name="clearing_residual"
                                                id="clearing_residual"
                                                value={props.values.clearing_residual}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                disabled
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>

                                        </Grid.Col>

                                        <Grid.Col span={8}>
                                            <FileInput
                                                label="Attachments"
                                                id="advance_attachments"
                                                name="advance_attachments"
                                                value={props.values.advance_attachments}
                                                onChange={(e) => {
                                                    console.log(e)
                                                    props.setFieldValue("advance_attachments", e)
                                                }}
                                                leftSectionPointerEvents="none"
                                                clearable
                                                multiple
                                                disabled
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}></Grid.Col>
                                        <Grid.Col span={12}>Expense Reports</Grid.Col>

                                        <Grid.Col span={12}>
                                            <Container size="lg" style={{ height: '60vh', padding: 0 }}>

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
                                        <Grid.Col span={4}>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Group justify="center">
                                                <Button size="compact-sm" variant="filled"
                                                    onClick={async () => {
                                                        const res = await submitReport(id)

                                                        if (res.message) {
                                                            console.log('success', res)
                                                            setUstate(uuidv4())

                                                        }
                                                    }}
                                                    disabled={workflow("submit", _store.report?.state)}
                                                >
                                                    Submit
                                                </Button>
                                            </Group>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Group justify="right">
                                                <Button size="compact-sm" type="submit" variant="filled"
                                                    disabled={workflow("save", _store.report?.state)}>
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