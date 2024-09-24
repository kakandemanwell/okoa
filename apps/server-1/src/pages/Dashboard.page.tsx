import { useState, useEffect } from 'react';
import { Container, Grid, Table, Group, Text } from '@mantine/core';
import { PieChart } from '@mantine/charts';
import { DatePickerInput } from '@mantine/dates';
import { getDashboard, getReportStateOptions } from '../lib/utilities';
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
export function DashboardPage() {
  const [value, setValue] = useState<[Date | null, Date | null]>([dayjs().add(-30, 'day').toDate(), dayjs().toDate()]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [advanceTable, setAdvanceTable] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [expenseTable, setExpenseTable] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [advancePie, setAdvancePie] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [expensePie, setExpensePie] = useState<any[]>([])
  const [states, setStates] = useState<Map<string, string>>(new Map())
  const q1 = useQuery({
    queryKey: [`dashboard-${value[0] ? value[0].getTime() : ''}-${value[1] ? value[1].getTime() : ''}`], queryFn: async () => {

      const data = await getDashboard(value[0], value[1])
      return data
    }
  })

  const q2 = useQuery({
    queryKey: [`options`], queryFn: async () => {
      const data = await getReportStateOptions()
      return data
    }
  })
  useEffect(() => {
    if (q1.data) {
      setAdvanceTable(q1.data.a1)
      setExpenseTable(q1.data.r1)
      const a = q1.data.a1.filter((o: { state: string; }) => {
        return ['post', 'done'].includes(o.state)
      })


      if (a.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const total_amount: number = a.reduce((x: any, y: any) => x.total_amount + y.total_amount)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clearing_residual: number = a.reduce((x: any, y: any) => x.clearing_residual + y.clearing_residual)

        setAdvancePie([
          { name: '% Cleared', value: 100 * (total_amount - clearing_residual) / total_amount, color: 'indigo.6' },
          { name: '% Not Cleared', value: 100 * clearing_residual / total_amount, color: 'yellow.6' },
        ])
      }
      else{
        setAdvancePie([])
      }
      let total = 0
      let paid = 0
      q1.data.r1.forEach((o: { total_amount: number; state: string; }) => {
        total = total + o.total_amount
        if (o.state === 'done') {
          paid = paid + o.total_amount
        }
      })

      setExpensePie([
        { name: '% Paid', value: 100 * paid / total, color: 'indigo.6' },
        { name: '% Not Paid', value: 100 * (total - paid) / total, color: 'yellow.6' },
      ])
    }
    if (q2.data) {

      const m: Map<string, string> = new Map();
      for (const [k, v] of q2.data) {
        m.set(k, v)
      }
      setStates(m)
    }
  }, [q1.data, q2.data])
  console.log(expensePie,q1.data)
  return (
    <Container size="lg">
      <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

        <Grid.Col span={4}><Text fw={700} td="underline">Money/Funds</Text></Grid.Col>
        <Grid.Col span={8}>
          <Group justify='right'>
            <DatePickerInput
              type="range"
              label="Dates range"
              placeholder="Pick dates range"
              value={value}
              onChange={setValue}
            //clearable
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          {advancePie.length > 0 ?
            <Group justify='center'>
              <PieChart data={advancePie} size={320} withTooltip tooltipDataSource="segment" />
            </Group> : "No data"}
        </Grid.Col>
        <Grid.Col span={6}>
          {advanceTable.length > 0 ?
            <Group justify='center'>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>State</Table.Th>
                    <Table.Th><Group justify='right'>Uncleared</Group></Table.Th>
                    <Table.Th><Group justify='right'>Cleared</Group></Table.Th>
                    <Table.Th><Group justify='right'>Total</Group></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{advanceTable.map((o) => (
                  <Table.Tr key={`a-${o.state}`}>
                    <Table.Td>{states.get(o.state)}</Table.Td>
                    <Table.Td>
                      <Group justify='right'>{['post', 'done'].includes(o.state) ? new Intl.NumberFormat('en-US',).format(o.clearing_residual,) : '-'}</Group>
                    </Table.Td>
                    <Table.Td>
                      <Group justify='right'>{['post', 'done'].includes(o.state) ? new Intl.NumberFormat('en-US',).format(o.total_amount - o.clearing_residual,) : "-"}</Group>
                    </Table.Td>
                    <Table.Td>
                      <Group justify='right'>{new Intl.NumberFormat('en-US',).format(o.total_amount,)}</Group>
                    </Table.Td>
                  </Table.Tr>
                ))}</Table.Tbody>
              </Table>
            </Group> : "No data"}
        </Grid.Col>
        <Grid.Col span={12}><Text fw={700} td="underline">Expenses</Text></Grid.Col>
        <Grid.Col span={6}>
          {expensePie.length > 0 ? <Group justify='center'>
            <PieChart data={expensePie} size={320} withTooltip tooltipDataSource="segment" />
          </Group> : "No data"}

        </Grid.Col>
        <Grid.Col span={6}>
          {expenseTable.length > 0 ?
            <Group justify='center'>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>State</Table.Th>
                    <Table.Th><Group justify='right'>Amount</Group></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {expenseTable.map((o) => (
                    <Table.Tr key={`a-${o.state}`}>
                      <Table.Td>{states.get(o.state)}</Table.Td>
                      <Table.Td>
                        <Group justify='right'>{new Intl.NumberFormat('en-US',).format(o.total_amount,)}</Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Group> : "No data"}
        </Grid.Col>
      </Grid>
    </Container>

  );
}