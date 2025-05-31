import { Container, Card, Grid, Text, Title, Group, Box, Table, List } from '@mantine/core';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const mockStats = {
  clientes: 134,
  mascotas: 219,
  productoMasVendido_1: 'Alimento Premium Adulto',
  productoMasVendido_2: 'Collar Antipulgas',
  productoMasVendido_3: 'Juguete Interactivo',
};

const mockVacunas = [
  { nombre: 'Rabia', fecha: '2025-06-05', cliente: 'Sergio Pérez', mascota: 'Max' },
  { nombre: 'Triple Felina', fecha: '2025-06-08', cliente: 'Lucía Gómez', mascota: 'Mishi' },
  { nombre: 'Moquillo', fecha: '2025-06-12', cliente: 'Ramiro Díaz', mascota: 'Fido' },
];

const dataClientesEstado = [
  { tipo: 'Actualizados', cantidad: 40 },
  { tipo: 'Sin actualizar', cantidad: 250 },
];


const dataMascotasPorTipo = [
  { tipo: 'Perros', cantidad: 140 },
  { tipo: 'Gatos', cantidad: 60 },
];

const dataVentasMensuales = [
  { mes: 'Ene', ventas: 300 },
  { mes: 'Feb', ventas: 240 },
  { mes: 'Mar', ventas: 450 },
  { mes: 'Abr', ventas: 380 },
  { mes: 'May', ventas: 500 },
];

const dataClientesPorRegion = [
  { region: 'Córdoba / Capital', cantidad: 50 },
  { region: 'Buenos Aires / La Plata', cantidad: 40 },
  { region: 'Santa Fe / Rosario', cantidad: 30 },
  { region: 'Mendoza / Godoy Cruz', cantidad: 25 },
  { region: 'Salta / Salta', cantidad: 20 },
  { region: 'Neuquén / Neuquén', cantidad: 18 },
  { region: 'Chubut / Comodoro', cantidad: 15 },
  { region: 'Misiones / Posadas', cantidad: 12 },
];

const Dashboard = () => {
  const COLORS = ['#6A748B', '#A4AEC4'];

  return (
    <Container fluid p="xl">
      <Title order={1} className='color-white' mb="md">Dashboard</Title>
      <Grid mb="8px" gutter={"16"} align="stretch" >
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }} style={{ height: 'auto' }}>
          <Card className='card' shadow="sm" style={{ height: '100%' }}>
            <Group  justify='space-between'>
              <Text className='title-dashboard' size='xl'>CLIENTES </Text>
              <Text size='xl'><b>{mockStats.clientes}</b></Text>
            </Group>
            <Group  justify='space-between'>
              <Text size='md'>Actualizados: 40 </Text>
              <Text size='md'>Sin actualizar: 250</Text>
            </Group>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  dataKey="cantidad"
                  data={dataClientesEstado}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  stroke="#293040"
                  label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                  nameKey="tipo"
                >
                  {dataClientesEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }} style={{ height: 'auto' }}>
          <Card className='card' shadow="sm" style={{ height: '100%' }}>
            <Group  justify='space-between'>
              <Text className='title-dashboard' size='xl'>MASCOTAS</Text>
              <Text size='xl'><b>{mockStats.mascotas}</b></Text>
            </Group>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  dataKey="cantidad"
                  data={dataMascotasPorTipo}
                  cx="50%"
                  cy="50%"
                  stroke="#293040"
                  outerRadius={80}
                  label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                  nameKey="tipo"
                >
                  {dataMascotasPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }} style={{ height: 'auto' }}>
          <Card className='card' shadow="sm" style={{ height: '100%' }}>
            <Text className='title-dashboard'>PRODUCTOS MÁS VENDIDOS</Text>
            <List
              spacing="xs"
              mb="md"
            >
              <List.Item key="prod-1">
                <Text className='item-list-title'>1. {mockStats.productoMasVendido_1}</Text>
              </List.Item>
              <List.Item key="prod-2">
                <Text className='item-list-title'>2. {mockStats.productoMasVendido_2}</Text>
              </List.Item>
              <List.Item key="prod-3">
                <Text className='item-list-title'>3. {mockStats.productoMasVendido_3}</Text>
              </List.Item>
            </List>
          </Card>
        </Grid.Col>
      </Grid>
      <Grid mb="md">
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }} style={{ height: 'auto' }}>
          <Card className='card' shadow="sm" style={{ height: '100%' }}>
            <Text className='title-dashboard'>VENTAS MENSUALES</Text>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataVentasMensuales}>
                <XAxis dataKey="mes" stroke="#6A748B" tick={{ fill: '#6A748B' }}/>
                <YAxis stroke="#6A748B" tick={{ fill: '#6A748B' }}/>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1B1E', borderColor: '#535C6F' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="ventas" fill="#6A748B" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
         <Grid.Col span={{ base: 12, md: 12, lg: 6 }} style={{ height: 'auto' }}>
          <Card className='card' shadow="sm" style={{ height: '100%' }}>
            <Text className='title-dashboard'>CLIENTES POR PROVINCIA Y CIUDAD</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataClientesPorRegion} layout="vertical">
                <XAxis type="number" stroke="#6A748B" tick={{ fill: '#6A748B' }}/>
                <YAxis dataKey="region" type="category" width={160} stroke="#6A748B" tick={{ fill: '#6A748B' }}/>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1B1E', borderColor: '#535C6F' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="cantidad" fill="#6A748B" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
      </Grid>
      <Card className='card' shadow="sm">
        <Text className='title-dashboard'>PRÓXIMAS VACUNAS</Text>
        <Box className='table-wrapper'>
          <Table.ScrollContainer minWidth={1199}>
            <Table className='table result-table'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Vacuna</Table.Th>
                  <Table.Th>Fecha estimada de aplicación</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Mascota</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockVacunas.map((v, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>{v.nombre}</Table.Td>
                    <Table.Td>{v.fecha}</Table.Td>
                    <Table.Td>{v.cliente}</Table.Td>
                    <Table.Td>{v.mascota}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>
      </Card>
    </Container>
  );
};

export default Dashboard;