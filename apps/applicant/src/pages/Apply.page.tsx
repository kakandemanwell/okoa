import '@mantine/dates/styles.css';
import { useEffect, useState, } from 'react';
import * as Yup from 'yup';
import { Formik, } from 'formik';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';
import { Dialog, ActionIcon, Modal, Table, FileInput, rem, Button, TextInput, Textarea, Text, Grid, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileCv, IconPlus, IconTrash } from '@tabler/icons-react';
import { DateValue, YearPickerInput } from '@mantine/dates';
import { Base64 } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'
const ApplySchema = Yup.object().shape({
    partner_name: Yup.string().required('Required'),
    email_from: Yup.string().email().required('Required'),
    partner_mobile: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    resume: Yup.mixed().required('Your resume is required'),

});
const ExperienceSchema = Yup.object().shape({
    role: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    employer: Yup.string().required('Required'),
    months: Yup.number().required('Required'),
});

const EducationSchema = Yup.object().shape({
    qualification: Yup.string().required('Required'),
    fields: Yup.string().required('Required'),
    school: Yup.string().required('Required'),
    year: Yup.date().required('Required'),
    //attachment: Yup.mixed().required('Your resume is required'),
});
interface TExperience {
    role: string,
    description: string,
    employer: string,
    year: Date,
    months: number
}
interface TEducation {
    qualification: string,
    fields: string,
    school: string,
    year: Date,
    attachment: File
}
export function ApplyPage() {
    const form: HTMLElement | null = document.getElementById('job')
    const icon = <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const [experience, setExperience] = useState<Map<string, TExperience>>(new Map())
    const [education, setEducation] = useState<Map<string, TEducation>>(new Map())
    const [openedExperience, handleExperience] = useDisclosure(false);
    const [openedEducation, handleEducation] = useDisclosure(false);
    const [openedMessage, handleMessage] = useDisclosure(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [job, setJob] = useState<any | null>(null)
    const [message, setMessage] = useState("")
    useEffect(() => {
        if (form) {
            const _job: HTMLInputElement = form.getElementsByTagName('input')[0]
            setJob(JSON.parse(Base64.decode(_job.value))[0])
        }
    }, [form])

    const removeExperience = (id: string) => {
        const nextExperience = new Map([...experience])
        nextExperience.delete(id)
        setExperience(nextExperience)

    }
    const removeEducation = (id: string) => {
        const nextEducation = new Map([...education])
        nextEducation.delete(id)
        setEducation(nextEducation)

    }
    return (

        <Container size="sm" bg='var(--mantine-color-blue-light)' mb={10} p={10} style={{ float: 'left' }}>
            <Formik
                initialValues={{
                    partner_name: '',
                    email_from: '',
                    partner_mobile: '',
                    description: '',
                    resume: new File([''], 'No file'),
                }}
                validationSchema={ApplySchema}

                onSubmit={async (values,) => {
                    console.log(values)
                    const formData = new FormData();
                    formData.append('partner_name', values.partner_name)
                    formData.append('email_from', values.email_from)
                    formData.append('partner_mobile', values.partner_mobile)
                    formData.append('description', values.description)
                    formData.append('resume', values.resume)
                    formData.append('experience_ids', JSON.stringify([...experience]))
                    formData.append('education_ids', JSON.stringify([...education]))
                    formData.append('job_id', job.id)
                    for (const [k, v] of [...education]) {
                        formData.append(k, v.attachment)
                    }
                    try {
                        const res = await axios.post(`/applicant-ext/application/`,
                            formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })

                        if (res.status === 200) {
                            console.log('success', res)
                        }
                        else {
                            console.log('failure', res)
                            setMessage("There was an error while submitting your application. Contact support")
                            handleMessage.toggle()
                        }
                    }
                    catch (e) {
                        console.log('failure', e)
                        setMessage("There was an error while submitting your application. Contact support")
                        handleMessage.toggle()
                    }




                }}

            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <Grid>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="Your Name"
                                    name="partner_name"
                                    id="partner_name"
                                    value={props.values.partner_name}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    withAsterisk
                                />
                                {props.errors.partner_name && props.touched.partner_name ? <Text size='xs' c='red'>{props.errors.partner_name}</Text> : null}
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Your Email"
                                    name="email_from"
                                    id="email_from"
                                    value={props.values.email_from}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    withAsterisk
                                />
                                {props.errors.email_from && props.touched.email_from ? <Text size='xs' c='red'>{props.errors.email_from}</Text> : null}

                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label=" Your Phone Number"
                                    name="partner_mobile"
                                    id="partner_mobile"
                                    value={props.values.partner_mobile}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    withAsterisk
                                />
                                {props.errors.partner_mobile && props.touched.partner_mobile ? <Text size='xs' c='red'>{props.errors.partner_mobile}</Text> : null}

                            </Grid.Col>

                            <Grid.Col span={12}>
                                <FileInput
                                    label="Attach your CV"
                                    id="resume"
                                    name="resume"
                                    value={props.values.resume}
                                    onChange={(e) => {
                                        console.log(e)
                                        props.setFieldValue("resume", e)
                                    }}
                                    leftSection={icon}
                                    placeholder="Your CV"
                                    leftSectionPointerEvents="none"
                                    clearable
                                    withAsterisk
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>Experience</Grid.Col>
                            <Grid.Col span={12}>
                                <Table striped highlightOnHover withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Position/Role</Table.Th>
                                            <Table.Th>Description</Table.Th>
                                            <Table.Th>Employer</Table.Th>
                                            <Table.Th>First year</Table.Th>
                                            <Table.Th>Number of months</Table.Th>
                                            <Table.Th>Remove</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{[...experience].map(o => (
                                        <Table.Tr key={o[0]}>
                                            <Table.Td>{o[1].role}</Table.Td>
                                            <Table.Td>{o[1].description}</Table.Td>
                                            <Table.Td>{o[1].employer}</Table.Td>
                                            <Table.Td>{dayjs(o[1].year).format('YYYY')}</Table.Td>
                                            <Table.Td>{o[1].months}</Table.Td>
                                            <Table.Td>
                                                <ActionIcon variant="subtle" aria-label="Settings"
                                                    onClick={() => {
                                                        removeExperience(o[0])
                                                    }}>
                                                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}</Table.Tbody>
                                </Table>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Group justify="right">
                                    <Button size="xs" leftSection={<IconPlus size={14} />} variant="subtle" onClick={handleExperience.open}>
                                        Add Experience
                                    </Button>
                                </Group>
                                <Modal opened={openedExperience} onClose={handleExperience.close} title="Add Experience">
                                    <Formik
                                        initialValues={{
                                            role: '',
                                            description: '',
                                            employer: '',
                                            year: new Date(),
                                            months: 1
                                        }}
                                        validationSchema={ExperienceSchema}

                                        onSubmit={async (values,) => {
                                            const nextExperience = new Map([...experience])
                                            nextExperience.set(uuidv4(), values)
                                            setExperience(nextExperience)
                                            handleExperience.toggle()
                                        }}

                                    >
                                        {props => (
                                            <form onSubmit={props.handleSubmit}>
                                                <Grid>
                                                    <Grid.Col span={12}>
                                                        <TextInput
                                                            label="Role"
                                                            name="role"
                                                            id="role"
                                                            value={props.values.role}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        {props.errors.role && props.touched.role ? <Text size='md' c='red'>{props.errors.role}</Text> : null}
                                                    </Grid.Col>

                                                    <Grid.Col span={12}>
                                                        <Textarea
                                                            label="Description"
                                                            name="description"
                                                            id="description"
                                                            value={props.values.description}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            resize="vertical"
                                                            withAsterisk
                                                        />
                                                        {props.errors.description && props.touched.description ? <Text size='md' c='red'>{props.errors.description}</Text> : null}
                                                    </Grid.Col>
                                                    <Grid.Col span={12}>
                                                        <TextInput
                                                            label="Employer"
                                                            name="employer"
                                                            id="employer"
                                                            value={props.values.employer}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        {props.errors.employer && props.touched.employer ? <Text size='md' c='red'>{props.errors.employer}</Text> : null}
                                                    </Grid.Col>

                                                    <Grid.Col span={12}>
                                                        <YearPickerInput
                                                            label="First year with employer"
                                                            placeholder="Pick year"
                                                            value={props.values.year}
                                                            onChange={(e: DateValue) => {
                                                                props.setFieldValue("year", e)
                                                            }}
                                                        />
                                                        {props.errors.year && props.touched.year ? <Text size='md' c='red'><>{props.errors.year}</></Text> : null}
                                                    </Grid.Col>
                                                    <Grid.Col span={12}>
                                                        <TextInput
                                                            label="Number of months"
                                                            name="months"
                                                            id="months"
                                                            value={props.values.months}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        {props.errors.months && props.touched.months ? <Text size='md' c='red'>{props.errors.months}</Text> : null}
                                                    </Grid.Col>
                                                    <Grid.Col span={12}>
                                                        <Group justify="right">
                                                            <Button size='xs' type='submit'>Add</Button>
                                                        </Group>
                                                    </Grid.Col>

                                                </Grid>
                                            </form>)}

                                    </Formik>
                                </Modal>
                            </Grid.Col>
                            <Grid.Col span={12}>Education</Grid.Col>
                            <Grid.Col span={12}>
                                <Table striped highlightOnHover withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Qualification</Table.Th>
                                            <Table.Th>Field(s) of Study</Table.Th>
                                            <Table.Th>School</Table.Th>
                                            <Table.Th>Year of Completion</Table.Th>
                                            <Table.Th>Attachment</Table.Th>
                                            <Table.Th>Remove</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{[...education].map(o => (
                                        <Table.Tr key={o[0]}>
                                            <Table.Td>{o[1].qualification}</Table.Td>
                                            <Table.Td>{o[1].fields}</Table.Td>
                                            <Table.Td>{o[1].school}</Table.Td>
                                            <Table.Td>{dayjs(o[1].year).format('YYYY')}</Table.Td>
                                            <Table.Td>{o[1].attachment.name}</Table.Td>
                                            <Table.Td>
                                                <ActionIcon variant="subtle" aria-label="Settings"
                                                    onClick={() => {
                                                        removeEducation(o[0])
                                                    }}>
                                                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}</Table.Tbody>
                                </Table>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Group justify="right">
                                    <Button size="xs" leftSection={<IconPlus size={14} />} variant="subtle" onClick={handleEducation.open}>
                                        Add Education
                                    </Button>
                                </Group>
                                <Modal opened={openedEducation} onClose={handleEducation.close} title="Add Education">
                                    <Formik
                                        initialValues={{
                                            qualification: '',
                                            fields: '',
                                            school: '',
                                            year: new Date(),
                                            attachment: new File([''], 'No file')
                                        }}
                                        validationSchema={EducationSchema}

                                        onSubmit={async (values,) => {

                                            const nextEducation = new Map([...education])
                                            nextEducation.set(uuidv4(), values)
                                            setEducation(nextEducation)
                                            handleEducation.toggle()

                                        }}

                                    >
                                        {props => (
                                            <form onSubmit={props.handleSubmit}>
                                                <Grid>
                                                    <Grid.Col span={12}>
                                                        <TextInput
                                                            label="Qualification"
                                                            name="qualification"
                                                            id="qualification"
                                                            value={props.values.qualification}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        {props.errors.qualification && props.touched.qualification ? <Text size='md' c='red'>{props.errors.qualification}</Text> : null}
                                                    </Grid.Col>

                                                    <Grid.Col span={12}>
                                                        <TextInput
                                                            label="Fields of Study"
                                                            name="fields"
                                                            id="fields"
                                                            value={props.values.fields}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        {props.errors.fields && props.touched.fields ? <Text size='md' c='red'>{props.errors.fields}</Text> : null}
                                                    </Grid.Col>

                                                    <Grid.Col span={12}>
                                                        <TextInput
                                                            label="School"
                                                            name="school"
                                                            id="school"
                                                            value={props.values.school}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        {props.errors.school && props.touched.school ? <Text size='md' c='red'>{props.errors.school}</Text> : null}
                                                    </Grid.Col>

                                                    <Grid.Col span={12}>
                                                        <YearPickerInput
                                                            label="Year of Completion"
                                                            placeholder="Pick year"
                                                            value={props.values.year}
                                                            onChange={(e: DateValue) => {
                                                                props.setFieldValue("year", e)
                                                            }}
                                                        />
                                                        {props.errors.year && props.touched.year ? <Text size='md' c='red'><>{props.errors.year}</></Text> : null}
                                                    </Grid.Col>
                                                    <Grid.Col span={12}>
                                                        <FileInput
                                                            label="Attachment"
                                                            id="attachment"
                                                            name="attachment"
                                                            value={props.values.attachment}
                                                            onChange={(e) => {
                                                                console.log(e)
                                                                props.setFieldValue("attachment", e)
                                                            }}
                                                            leftSectionPointerEvents="none"
                                                            clearable
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={12}>
                                                        <Group justify="right">
                                                            <Button size='xs' type='submit'>Add</Button>
                                                        </Group>
                                                    </Grid.Col>

                                                </Grid>
                                            </form>)}

                                    </Formik>

                                </Modal>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea
                                    label=" Short Introduction"
                                    name="description"
                                    id="description"
                                    value={props.values.description}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    resize="vertical"
                                    withAsterisk
                                />
                                {props.errors.description && props.touched.description ? <Text size='xs' c='red'>{props.errors.description}</Text> : null}

                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Dialog opened={openedMessage} withCloseButton onClose={handleMessage.close} size="lg" radius="md">
                                    <Text size="sm" mb="xs" fw={500}>
                                        {message}
                                    </Text>
                                </Dialog>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Button size='xs' type='submit'>Apply</Button>
                            </Grid.Col>
                        </Grid>
                    </form>)}

            </Formik>
        </Container>


    );
}