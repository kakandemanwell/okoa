import { useState, useEffect } from 'react';
import { Container, Grid, ActionIcon, Button, Group, Anchor } from '@mantine/core';
import { ColDef } from "ag-grid-community";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { useQuery } from '@tanstack/react-query'
import { IconEye, } from '@tabler/icons-react';
import dayjs from 'dayjs'
import { getExpenseReports, getReportStateOptions } from '../lib/utilities';
import { v4 as uuidv4 } from 'uuid';

const ref: string = uuidv4()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PaymentLink = (props: any) => {

  return (
    <Anchor href={`#advance-reports/${props.data.advance_sheet_id[0]}`} target="_blank" fz="xs">
      {props.data.payment_link}
    </Anchor>)
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomComponent = (props: any) => {

  return <ActionIcon variant="subtle" component='a' href={`#expense-reports/${props.data.id}`}>
    <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
  </ActionIcon>
};

export function ExpenseReports() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [states, setStates] = useState<Map<string, string>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef<any>[]>([
  ]);
  const defaultColDef: ColDef = {
    flex: 1,
  };

  const q1 = useQuery({
    queryKey: [`expense-reports-${ref}`], queryFn: async () => {
      const data = await getExpenseReports()
      return data
    }
  })

  const q2 = useQuery({
    queryKey: ['report-state-options'], queryFn: async () => {
      const data = await getReportStateOptions()
      return data
    }
  })
  useEffect(() => {
    if (q1.data) {
      setRowData(q1.data)
    }
    if (q2.data) {
      const _states: Map<string, string> = new Map(q2.data)
      setStates(_states)
      setColDefs([
        { field: 'id', headerName: "", cellRenderer: CustomComponent },
        { field: "display_name", headerName: "Title", filter: 'agTextColumnFilter', },
        { field: "employee_id", headerName: "Employee", valueGetter: p => p.data.employee_id[1] },
        { field: "state", headerName: "State", filter: 'agTextColumnFilter', valueGetter: p => _states.get(p.data.state) },
        { field: "payment_link", headerName: "Payment link", cellRenderer: PaymentLink },
        { field: "create_uid", headerName: "Created by", valueGetter: p => p.data.create_uid[1] },
        { field: "write_uid", headerName: "Last updated by", valueGetter: p => p.data.create_uid[1] },
        { field: "user_id", headerName: "Manager", valueGetter: p => p.data.write_uid[1] },
        { field: "create_date", headerName: "Date created", valueGetter: p => dayjs(p.data.create_date).format('YYYY-MM-DD') },
        { field: "write_date", headerName: "Date updated", valueGetter: p => dayjs(p.data.write_date).format('YYYY-MM-DD') },
        { field: "total_amount", headerName: "Total Amount", type: 'rightAligned' },
      ])
    }

  }, [q1.data, q2.data])

  return (
    <Container size="lg" >
      <Grid>
        <Grid.Col span={12}>Expense Reports</Grid.Col>
        <Grid.Col span={8}></Grid.Col>
        <Grid.Col span={4}>
          <Group justify="right">
            <Button component="a" href="#expense-reports/new" variant="subtle">
              Create Expense Report
            </Button>
          </Group>
        </Grid.Col>
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
      </Grid>
    </Container>

  );
}