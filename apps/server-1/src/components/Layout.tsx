
import { AppShell, Burger, Group, NavLink, Button,Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileArrowLeft, IconFileArrowRight, IconDashboard } from '@tabler/icons-react';
import { useState } from 'react';
import logo  from '/logo.png';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppLayout(props: any) {
    const { children } = props
    const [opened, { toggle }] = useDisclosure();
    const [index, setIndex] = useState(location.hash)
    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
                width: { base: 100, md: 150, lg: 200 },
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Image h={50} src={logo} alt="Logo" />
                    <Group justify="right" style={{ flex: 1 }}>
                        <Group ml="xl" gap={4} visibleFrom="sm">
                            <Button component="a" href="#expense-reports/new" variant="subtle">
                                Create Expense Report
                            </Button>
                            <Button component="a" href="#advance-reports/new" variant="subtle">
                                Create Advance Report
                            </Button>
                            <Button component="a" href="/web/session/logout" variant="subtle">
                                Sign Out
                            </Button>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <NavLink
                    href="#"
                    label="Dashboard"
                    leftSection={<IconDashboard size="1rem" stroke={1.5}
                    />}
                    active={index==='#'}
                    onClick={()=>{setIndex('#')}}
                />
                <NavLink
                    href="#advance-reports"
                    label="Advance Reports"
                    leftSection={<IconFileArrowLeft size="1rem" stroke={1.5} />}                    
                    active={index==='#advance-reports'}
                    onClick={()=>{setIndex('#advance-reports')}}
                />
                <NavLink
                    href="#expense-reports"
                    label="Expense Reports"
                    leftSection={<IconFileArrowRight size="1rem" stroke={1.5} />}                    
                    active={index==='#expense-reports'}
                    onClick={()=>{setIndex('#expense-reports')}}
                />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}