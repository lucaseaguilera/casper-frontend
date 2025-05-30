// src/views/ClienteDetalle.tsx
import { useParams, useNavigate, Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Tabs,
  Accordion,
  Avatar,
  Image,
  Grid,
  Button,
  Group,
  Text,
  Title,
  Table,
  List,
  ActionIcon,
  Stack,
  Anchor,
} from '@mantine/core';
import IconCaret from '/assets/icons/icon-caret.svg';
import PlaceholderNoResults from '/assets/placeholders/no-results.svg';

// Tipos de datos
interface Vacuna { nombre: string; detalle: string; }
interface VacunaAplicada extends Vacuna { fecha: string; }
interface AntiparasitarioAplicado { nombre: string; detalle: string; fecha: string;}
interface IntervencionMedica { nombre: string; detalle: string; fecha: string;}
interface OtroTratamiento { nombre: string; detalle: string; fecha: string;}
interface CorteBanio { tipo: string; detalle: string; fecha: string;}

interface Mascota {
  id: number;
  nombre: string;
  imagen: string;
  tipo: string;
  raza: string;
  genero: string;
  tamanio: string;
  peso: number;
  edad: number;
  nacimiento: string;
  salud: {
    vacunas_proximas: Vacuna[];
    vacunas_aplicadas: VacunaAplicada[];
    antiparasitarios_aplicados: AntiparasitarioAplicado[];
    intervenciones_medicas: IntervencionMedica[];
    otros_tratamientos: OtroTratamiento[];
  };
  servicios: {
    corte_banio: CorteBanio[];
  };
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  nacimiento: string;
  telefono: string;
  email: string;
  calle: string;
  altura: string;
  edificio: string;
  piso: string;
  departamento: string;
  cp: string;
  provincia: string;
  ciudad: string;
  barrio: string;
  registro_nro: string;
  registro_fecha: string;
  mascotas: Mascota[];
  cuidadores: Cuidador[];
}

interface Cuidador {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  nacimiento: string;
}

// Tipo y mock de compras
interface Compra {
  id: number;
  fecha: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  monto: number;
}
const mockCompras: Compra[] = [
  { id: 1, fecha: '2025-03-10', nombre: 'Pedigree Adultos 15Kg', categoria: 'Alimento balanceado', cantidad: 1, monto: 25304.01 },
  { id: 2, fecha: '2025-04-05', nombre: 'Purina Excellent Skin Care 8Kg', categoria: 'Alimento balanceado', cantidad: 2, monto: 50608.02 },
  { id: 3, fecha: '2025-02-14', nombre: 'Accesorio Correa Premium', categoria: 'Accesorios', cantidad: 1, monto: 1599.99 },
];

// Datos de ejemplo de cliente
const mockClientes: Cliente[] = [
  {
    id: 1,
    nombre: 'Noel',
    apellido:'Castro',
    dni:'30248829',
    nacimiento:'15.10.1983',
    telefono: '3546 5115843',
    email: 'noel.castro@gmail.com',
    calle: 'Av. Chacabuco',
    altura:'630',
    edificio:'',
    piso:'Piso 3',
    departamento:'Dto. C',
    cp: '5000',
    provincia: 'Córdoba',
    ciudad: 'Córdoba Capital',
    barrio: 'Nueva Córdoba',
    registro_nro:'2030',
    registro_fecha:'15.01.2019',
    mascotas: [
      {
        id: 1,
        nombre: 'Benito',
        imagen: '/assets/pets/perro.jpg',
        tipo: 'Perro',
        raza: 'Fila Brasileño',
        genero: 'Macho',
        tamanio: 'Grande',
        peso: 57,
        edad: 6,
        nacimiento: '20.04.2019',
        salud: {
          vacunas_proximas: [
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual'
            }
          ],
          vacunas_aplicadas: [
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual', fecha: '22.01.2024'
            },
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual', fecha: '22.01.2023'
            },
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual', fecha: '22.01.2022'
            },
            { 
              nombre: 'Antirrábica',
              detalle: '20-24 semanas', fecha: '22.01.2021'
            },
            { 
              nombre: 'Traqueobronquitis',
              detalle: '18-20 semanas', fecha: '22.01.2020'
            },
            { 
              nombre: 'Polivalente canina',
              detalle: '12-16 semanas', fecha: '22.01.2020'
            }
          ],
          antiparasitarios_aplicados: [
            { 
              nombre: 'Drontal Plus Comprimidos',
              detalle: 'Febantel - Pirantel Prazicuantel', fecha: '22.01.2024'
            },
            { 
              nombre: 'Panacur Comprimidos',
              detalle: 'Fenbendanzol', fecha: '22.01.2023'
            }
          ],
          intervenciones_medicas: [
            { 
              nombre: 'Drontal Plus Comprimidos',
              detalle: 'Febantel - Pirantel Prazicuantel', fecha: '22.01.2024'
            },
            { 
              nombre: 'Panacur Comprimidos',
              detalle: 'Fenbendanzol', fecha: '22.01.2023'
            }
          ],
          otros_tratamientos: [
            { 
              nombre: 'Drontal Plus Comprimidos',
              detalle: 'Febantel - Pirantel Prazicuantel', fecha: '22.01.2024'
            },
            { 
              nombre: 'Panacur Comprimidos',
              detalle: 'Fenbendanzol', fecha: '22.01.2023'
            }
          ],
        },
        servicios: {
          corte_banio: [
            { 
              tipo: 'Corte',
              detalle: 'Loren Ipsum',
              fecha: '15.11.2023'
            },
            { 
              tipo: 'Baño',
              detalle: 'Lorem ipsum',
              fecha: '15.11.2023'
            },
            { 
              tipo: 'Corte y baño',
              detalle: 'Loren Ipsum',
              fecha: '15.11.2023'
            }
          ],
        },
      },
      {
        id: 2,
        nombre: 'Mr Bubs',
        imagen: '/assets/pets/gato1.jpg',
        tipo: 'Gato',
        raza: 'Persa',
        genero: 'Macho',
        tamanio: 'Mediano',
        peso: 17,
        edad: 3,
        nacimiento: '20.04.2019',
        salud: {
          vacunas_proximas: [
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual'
            }
          ],
          vacunas_aplicadas: [],
          antiparasitarios_aplicados: [
            { 
              nombre: 'Drontal Plus Comprimidos',
              detalle: 'Febantel - Pirantel Prazicuantel', fecha: '22.01.2024'
            },
            { 
              nombre: 'Panacur Comprimidos',
              detalle: 'Fenbendanzol', fecha: '22.01.2023'
            }
          ],
          intervenciones_medicas: [],
          otros_tratamientos: [],
        },
        servicios: {
          corte_banio: [
            { 
              tipo: 'Corte',
              detalle: 'Loren Ipsum',
              fecha: '15.11.2023'
            },
          ],
        },
      },
      {
        id: 3,
        nombre: 'Pelusa',
        imagen: '/assets/pets/gato2.jpg',
        tipo: 'Gato',
        raza: 'Mestizo',
        genero: 'Hembra',
        tamanio: 'Mediana',
        peso: 12,
        edad: 5,
        nacimiento: '20.04.2019',
        salud: {
          vacunas_proximas: [
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual'
            }
          ],
          vacunas_aplicadas: [
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual', fecha: '22.01.2024'
            },
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual', fecha: '22.01.2023'
            },
            { 
              nombre: 'Polivalente Rabia',
              detalle: 'Refuerzo anual', fecha: '22.01.2022'
            },
            { 
              nombre: 'Antirrábica',
              detalle: '20-24 semanas', fecha: '22.01.2021'
            },
            { 
              nombre: 'Traqueobronquitis',
              detalle: '18-20 semanas', fecha: '22.01.2020'
            },
            { 
              nombre: 'Polivalente canina',
              detalle: '12-16 semanas', fecha: '22.01.2020'
            }
          ],
          antiparasitarios_aplicados: [
            { 
              nombre: 'Drontal Plus Comprimidos',
              detalle: 'Febantel - Pirantel Prazicuantel', fecha: '22.01.2024'
            },
            { 
              nombre: 'Panacur Comprimidos',
              detalle: 'Fenbendanzol', fecha: '22.01.2023'
            }
          ],
          intervenciones_medicas: [],
          otros_tratamientos: [],
        },
        servicios: {
          corte_banio: [],
        },
      },
    ],
    cuidadores: [
      {
        id: 1,
        nombre: 'Ana Laura',
        apellido:'Vásquez',
        dni:'28339220',
        nacimiento: '13.09.1981',
        email:'ana.laura.vasquez@gmail.com',
        telefono:'3546 5115843',
      }
    ],
  },
];


export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [activeTab, setActiveTab] = useState<string>('compras');
  const [compras, setCompras] = useState<Compra[]>(mockCompras);
  const [sortField, setSortField] = useState<keyof Compra>('fecha');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  useEffect(() => {
    const data = mockClientes.find((c) => c.id === Number(id));
    if (data) {
      setCliente(data);
      setActiveTab('compras');
      const initialSorted = [...mockCompras].sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setCompras(initialSorted);
    }
  }, [id]);

  if (!cliente) {
    return (
      <Stack className="placeholder no-results"> 
        <Stack className="placeholder__inner" gap="0">
          <Image
            alt="Sin resultados"
            className="placeholder__icon"
            fit="contain"
            src={PlaceholderNoResults}
          />
          <Title order={2} className="placeholder__title" mb="sm">Sin resultados</Title>
          <Text className="placeholder__text" mb="sm">El cliente que intentas ver no existe</Text>
          <Anchor href="/clientes" target="_blank" underline="never" className='button text d-inline-flex m-auto'>Volver a clientes</Anchor>
        </Stack>
      </Stack>
    );
  }

  const mascotas = cliente.mascotas;
  const cuidadores = cliente.cuidadores;

  function manejarOrden(field: keyof Compra) {
    const asc = sortField === field ? !sortAsc : true;
    const sorted = [...compras].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (field === 'fecha') {
        return asc
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
      }
      if (typeof aVal === 'string') {
        return asc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return asc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    setSortField(field);
    setSortAsc(asc);
    setCompras(sorted);
  }

  return (
    <Container fluid p="0" className='d-flex d-flex-column gap-6 page-full-height'>
      <Group 
        grow 
        justify='space-between' 
        p="lg" 
        gap="lg" 
        className="header border-bottom stack-xs"
      >
        <Group wrap='nowrap' className='header__title'>
          <ActionIcon variant="outline" className='button outline icon circle lg p-0' onClick={() => navigate(-1)}>  
            <svg width="24" height="24" className='icon-button' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.99816 11.5769C3.99769 11.4904 4.01321 11.4046 4.04383 11.3245C4.07446 11.2444 4.11958 11.1716 4.17661 11.1102L9.71476 5.19334C9.83064 5.06955 9.98779 5 10.1517 5C10.3155 5 10.4727 5.06955 10.5886 5.19334C10.7044 5.31714 10.7695 5.48504 10.7695 5.66011C10.7695 5.83519 10.7044 6.00309 10.5886 6.12688L5.48115 11.5769L10.5886 17.027C10.6459 17.0883 10.6914 17.161 10.7225 17.2411C10.7535 17.3212 10.7695 17.407 10.7695 17.4937C10.7695 17.5804 10.7535 17.6663 10.7225 17.7464C10.6914 17.8264 10.6459 17.8992 10.5886 17.9605C10.5312 18.0218 10.4631 18.0704 10.3881 18.1036C10.3131 18.1368 10.2328 18.1539 10.1517 18.1539C10.0705 18.1539 9.99018 18.1368 9.91521 18.1036C9.84025 18.0704 9.77214 18.0218 9.71476 17.9605L4.17661 12.0437C4.11958 11.9823 4.07446 11.9094 4.04383 11.8293C4.01321 11.7492 3.99769 11.6634 3.99816 11.5769Z" fill="white"/>
              <path d="M4.00089 11.5773C4.00089 11.403 4.06572 11.2358 4.18112 11.1125C4.29652 10.9892 4.45304 10.9199 4.61624 10.9199L19.3846 10.9199C19.5479 10.9199 19.7044 10.9892 19.8198 11.1125C19.9352 11.2358 20 11.403 20 11.5773C20 11.7517 19.9352 11.9189 19.8198 12.0422C19.7044 12.1655 19.5479 12.2348 19.3846 12.2348L4.61624 12.2348C4.45304 12.2348 4.29652 12.1655 4.18112 12.0422C4.06572 11.9189 4.00089 11.7517 4.00089 11.5773Z" fill="white"/>
            </svg>
          </ActionIcon>
          <Stack gap="0">
            <Text className='title-label'>CLIENTE</Text>
            <Title order={1} className="header__title-name">{cliente.nombre} {cliente.apellido}</Title>
          </Stack>
        </Group> 
        <Group className="header-actions">
          <Button
            className='button primary outline'
            variant="outline"
            component={Link}
            to={`/clientes/${cliente.id}/edit?step=3`}
          >
            <svg viewBox="0 0 18 20" fill="none" className='icon-button' xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5795 17.2656H7.42645C6.79584 17.2656 6.25532 17.9946 6.61567 18.6325C7.15619 19.4526 8.05706 19.9993 9.04802 19.9993C10.039 19.9993 10.9399 19.4526 11.3903 18.6325C11.7506 17.9946 11.3002 17.2656 10.5795 17.2656Z" fill="white"/>
              <path d="M17.8726 14.2609L17.5122 13.8053C16.0709 11.8917 15.3502 9.61365 15.3502 7.24446V6.6066C15.3502 3.32619 13.0079 0.410263 9.76475 0.0457722C5.98109 -0.409841 2.73796 2.59721 2.73796 6.33323V7.24446C2.73796 9.61365 2.01726 11.8917 0.575864 13.8053L0.215516 14.2609C0.0353417 14.4431 -0.0547455 14.8076 0.0353416 14.9899C0.305603 15.81 1.0263 16.3567 1.83708 16.3567H16.251C17.0618 16.3567 17.7825 15.81 17.9627 14.9899C18.0528 14.7165 17.9627 14.4431 17.8726 14.2609Z" fill="white"/>
            </svg>
            <span className='label' style={{ marginLeft: 8 }}>Configurar notificaciones</span>
          </Button>
          <Button
            className='button primary outline'
            variant="outline"
            component={Link}
            to={`/clientes/${cliente.id}/edit`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className='icon-button' width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10.8619 5.5286C11.1223 5.26824 11.5444 5.26824 11.8047 5.5286L14.4715 8.19527C14.7317 8.45561 14.7317 8.87772 14.4715 9.13807L8.94281 14.6667H6C5.63181 14.6667 5.33333 14.3681 5.33333 14V11.0572L10.8619 5.5286Z" fill="white"/>
            </svg>
            <span className='label' style={{ marginLeft: 8 }}>Editar Cliente</span>
          </Button>
        </Group>
      </Group>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className='profile page-tabs'
        height="100vh"
      >
        <Grid gutter={"48"} className="page-grid">
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }} className='border-right'>
              <Text className='title-label mb-2'>MASCOTAS</Text>
              <Tabs.List className='client-pets d-flex gap-4 mb-5'>
                {mascotas.map((m) => (
                  <Tabs.Tab
                    key={m.id}
                    value={String(m.id)}
                    className='p-0 d-flex d-flex-column items-center'
                  >
                    <Avatar.Group className="avatar-group d-flex d-flex-column items-center m-0 p-0 gap-1">
                      <Avatar
                        src={m.imagen}
                        radius="100"
                        className="avatar avatar-md m-auto"
                      />
                      <Text className='color-white'>{m.nombre}</Text>
                    </Avatar.Group>
                  </Tabs.Tab>
                ))}
                <Tabs.Tab
                  component={Link}
                  to={`/clientes/${cliente.id}/edit?step=2&mascotaId=new`}
                  value="add"
                  className='p-0 d-flex d-flex-column items-center'
                >
                  <Avatar.Group className="avatar-group d-flex d-flex-column items-center m-0 p-0 gap-1">
                      <Avatar
                        radius="100"
                        className='avatar avatar-md m-auto'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                          <path d="M21.583 10.9468V12.5425H0.628906V10.9468H21.583ZM11.7988 0.679688V22.9355H10.0981V0.679688H11.7988Z" fill="#989DA6"/>
                        </svg>
                      </Avatar>
                      <Text className='color-white'>Agregar</Text>
                    </Avatar.Group>
                </Tabs.Tab>
              </Tabs.List>
              <Text className='title-label mb-2'>CUIDADORES</Text>
              <Accordion
                defaultValue="taker-1"
                chevronPosition="right"
                className="accordion"
                variant="separated filled"
              >
                <Accordion.Item value="taker-1">
                  <Accordion.Control>
                    <Title order={3} className='color-white'>{cliente.nombre} {cliente.apellido}</Title>
                    <Text className='text-label'>PRINCIPAL</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                      <List
                      spacing="xs"
                      mb="sm"
                      >
                        <List.Item>
                          <Group className='d-flex gap-10 items-start'>
                            <Group className='d-flex d-flex-column items-start gap-0'>
                              <Text className='text-label'>DNI</Text>
                              <Text className='text-data'>{cliente.dni}</Text>
                            </Group>
                            <Group className='d-flex d-flex-column items-start gap-0'>
                              <Text className='text-label'>F. nacimiento</Text>
                              <Text className='text-data'>{cliente.nacimiento}</Text>
                            </Group>
                          </Group>
                         
                        </List.Item>
                        <List.Item>
                          <Text className='text-label'>Teléfono</Text>
                          <Text className='text-data'>{cliente.telefono}</Text>
                        </List.Item>
                        <List.Item>
                          <Text className='text-label'>E-mail</Text>
                          <Text className='text-data' truncate="end">{cliente.email}</Text>
                        </List.Item>
                        <List.Item>
                          <Text className='text-label'>Domicilio</Text>
                          <Text className='text-data'>{cliente.calle} {cliente.altura}, {cliente.edificio} {cliente.piso} {cliente.departamento}</Text>
                          <Text className='text-data'>{cliente.cp}, {cliente.barrio}, {cliente.ciudad}, {cliente.provincia}</Text>
                        </List.Item>
                        <List.Item>
                          <Text className='text-label'>Registro</Text>
                          <Text className='text-data'>Cliente N° {cliente.registro_nro} -  Desde {cliente.registro_fecha}</Text>
                        </List.Item>
                      </List>
                  </Accordion.Panel>
                </Accordion.Item>

                {cuidadores.map((d) => (
                  <Accordion.Item value={String(d.id)} key={d.id}>
                    <Accordion.Control>
                      <Title order={3} className='color-white'>{d.nombre} {d.apellido}</Title>
                      <Text className='text-label color-white'>CUIDADOR #{d.id}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <List
                        spacing="xs"
                        mb="sm"
                        >
                          <List.Item>
                            <Text className='text-label'>Teléfono</Text>
                            <Text className='text-data'>{d.telefono}</Text>
                          </List.Item>
                          <List.Item>
                            <Text className='text-label'>E-mail</Text>
                            <Text className='text-data' truncate="end">{d.email}</Text>
                          </List.Item>
                          <List.Item>
                            <Text className='text-label'>DNI</Text>
                            <Text className='text-data'>{d.dni}</Text>
                          </List.Item>
                          <List.Item>
                            <Text className='text-label'>Fecha Nacimiento</Text>
                            <Text className='text-data'>{d.nacimiento}</Text>
                          </List.Item>
                        </List>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                  
                {/* Panel Compras */}
                <Tabs.Panel value="compras">
                    <Title order={2} className='color-white mb-2'>
                      Últimas compras
                    </Title>

                    {compras.length > 0 ? ( 
                      <Stack className="table-wrapper">
                        <Table.ScrollContainer minWidth={600}>
                          <Table className="table result-table">
                              <Table.Thead>
                              <Table.Tr>
                                  <Table.Th
                                    onClick={() => manejarOrden('fecha')}
                                    className={`sortable ${sortField === 'fecha' ? `active ${sortAsc ? 'asc' : 'desc'}` : ''}`}
                                  >
                                    Fecha <img src={IconCaret} alt="" className="caret-icon" />
                                  </Table.Th>
                                  <Table.Th
                                    onClick={() => manejarOrden('nombre')}
                                    className={`sortable ${sortField === 'nombre' ? `active ${sortAsc ? 'asc' : 'desc'}` : ''}`}
                                  >
                                    Producto <img src={IconCaret} alt="" className="caret-icon" />
                                  </Table.Th>
                                  <Table.Th
                                    onClick={() => manejarOrden('categoria')}
                                    className={`sortable ${sortField === 'categoria' ? `active ${sortAsc ? 'asc' : 'desc'}` : ''}`}
                                  >
                                    Categoría <img src={IconCaret} alt="" className="caret-icon" />
                                  </Table.Th>
                                  <Table.Th
                                    onClick={() => manejarOrden('cantidad')}
                                    className={`sortable ${sortField === 'cantidad' ? `active ${sortAsc ? 'asc' : 'desc'}` : ''}`}
                                  >
                                    Cantidad <img src={IconCaret} alt="" className="caret-icon" />
                                  </Table.Th>
                                  <Table.Th
                                    onClick={() => manejarOrden('monto')}
                                    className={`sortable ${sortField === 'monto' ? `active ${sortAsc ? 'asc' : 'desc'}` : ''}`}
                                  >
                                    Monto <img src={IconCaret} alt="" className="caret-icon" />
                                  </Table.Th>
                              </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                              {compras.map((c) => (
                                  <Table.Tr key={c.id}>
                                  <Table.Td>{new Date(c.fecha).toLocaleDateString()}</Table.Td>
                                  <Table.Td>{c.nombre}</Table.Td>
                                  <Table.Td>{c.categoria}</Table.Td>
                                  <Table.Td>{c.cantidad}</Table.Td>
                                  <Table.Td>${c.monto.toFixed(2)}</Table.Td>
                                  </Table.Tr>
                              ))}
                              </Table.Tbody>
                          </Table>
                        </Table.ScrollContainer>
                      </Stack>
                    ) : (
                      <Text className='text-placeholder'>Aún no hay registro de compras. No hay nada para mostrar aquí :(</Text>
                    )}
                </Tabs.Panel>

                {/* Paneles Mascotas */}
                {mascotas.map((m) => (
                  <Tabs.Panel key={m.id} value={String(m.id)}>
                      <Grid gutter={"48"} className="pet-detail-grid">
                          <Grid.Col span={{ base: 12, md: 12, lg: 5 }} className='border-right'>
                              {/* Volver a compras */}
                              <Group mb="md">
                                  <Button variant="outline" className='button primary text md' onClick={() => setActiveTab('compras')}>
                                    <svg width="24" height="24" className='icon-button' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M3.99816 11.5769C3.99769 11.4904 4.01321 11.4046 4.04383 11.3245C4.07446 11.2444 4.11958 11.1716 4.17661 11.1102L9.71476 5.19334C9.83064 5.06955 9.98779 5 10.1517 5C10.3155 5 10.4727 5.06955 10.5886 5.19334C10.7044 5.31714 10.7695 5.48504 10.7695 5.66011C10.7695 5.83519 10.7044 6.00309 10.5886 6.12688L5.48115 11.5769L10.5886 17.027C10.6459 17.0883 10.6914 17.161 10.7225 17.2411C10.7535 17.3212 10.7695 17.407 10.7695 17.4937C10.7695 17.5804 10.7535 17.6663 10.7225 17.7464C10.6914 17.8264 10.6459 17.8992 10.5886 17.9605C10.5312 18.0218 10.4631 18.0704 10.3881 18.1036C10.3131 18.1368 10.2328 18.1539 10.1517 18.1539C10.0705 18.1539 9.99018 18.1368 9.91521 18.1036C9.84025 18.0704 9.77214 18.0218 9.71476 17.9605L4.17661 12.0437C4.11958 11.9823 4.07446 11.9094 4.04383 11.8293C4.01321 11.7492 3.99769 11.6634 3.99816 11.5769Z" fill="white"/>
                                      <path d="M4.00089 11.5773C4.00089 11.403 4.06572 11.2358 4.18112 11.1125C4.29652 10.9892 4.45304 10.9199 4.61624 10.9199L19.3846 10.9199C19.5479 10.9199 19.7044 10.9892 19.8198 11.1125C19.9352 11.2358 20 11.403 20 11.5773C20 11.7517 19.9352 11.9189 19.8198 12.0422C19.7044 12.1655 19.5479 12.2348 19.3846 12.2348L4.61624 12.2348C4.45304 12.2348 4.29652 12.1655 4.18112 12.0422C4.06572 11.9189 4.00089 11.7517 4.00089 11.5773Z" fill="white"/>
                                    </svg>
                                    <span style={{ marginLeft: 8 }}>Volver a compras</span>
                                  </Button>
                              </Group>
                              <Stack spacing="md">
                                  <Group className='d-flex d-flex-row'>
                                    <Avatar className='avatar' src={m.imagen} size={120} radius={120} />
                                    <Group className='d-flex d-flex-column items-start gap-0'>
                                      <Title order={2} className='color-white'>{m.nombre}</Title>
                                      <Text className='color-white'>
                                        {m.tipo} | {m.raza}
                                      </Text>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        className='button primary outline sm mt-3'
                                        component={Link}
                                        to={`/clientes/${cliente.id}/edit?step=2&mascotaId=${m.id}`}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className='icon-button' width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10.8619 5.5286C11.1223 5.26824 11.5444 5.26824 11.8047 5.5286L14.4715 8.19527C14.7317 8.45561 14.7317 8.87772 14.4715 9.13807L8.94281 14.6667H6C5.63181 14.6667 5.33333 14.3681 5.33333 14V11.0572L10.8619 5.5286Z" fill="white"/>
                                          </svg>
                                          <span style={{ marginLeft: 8 }}>Editar</span>
                                      </Button>
                                    </Group>
                                  </Group>
                                </Stack>
                                <Table className='table color-white mt-5'>
                                  <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td>Género</Table.Td>
                                        <Table.Td className='text-right'><b>{m.genero}</b></Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>Tamaño</Table.Td>
                                        <Table.Td className='text-right'><b>{m.tamanio}</b></Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>Peso</Table.Td>
                                        <Table.Td className='text-right'><b>{m.peso} Kg.</b></Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>Edad</Table.Td>
                                        <Table.Td className='text-right'><b>{m.edad}</b> años</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>Nacimiento</Table.Td>
                                        <Table.Td className='text-right'><b>{m.nacimiento}</b></Table.Td>
                                    </Table.Tr>
                                  </Table.Tbody>
                                </Table>
                          </Grid.Col>

                          <Grid.Col span={{ base: 12, md: 12, lg: 7 }}>
                            <Tabs defaultValue="salud" variant="outline">
                                <Tabs.List className='tab-buttons'>
                                  <Tabs.Tab value="salud">Libreta de salud</Tabs.Tab>
                                  <Tabs.Tab value="servicios">Servicios</Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="salud" pt="md">
                                  <Accordion chevronPosition="right" variant="separated" className='accordion-health'>
                                      <Accordion.Item value="vacunas" className='panel-vaccines'>
                                        <Accordion.Control>
                                          <Group className='d-flex gap-4 d-flex-row'>
                                            <Image
                                                radius="md"
                                                h={48}
                                                w={48}
                                                className='icon-vaccine'
                                                src="/assets/icons/icon-vaccine.svg"
                                              />
                                            <Title order={3} className='color-white'>Vacunas</Title>
                                          </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel>

                                            {m.salud.vacunas_proximas.length > 0 && (
                                              <>
                                                <Text className='title-label' mb="4px">
                                                  PRÓXIMAS
                                                </Text>
                                                <List
                                                  spacing="xs"
                                                  mb="md"
                                                  >
                                                  {m.salud.vacunas_proximas.map((v, i) => (
                                                    <List.Item key={i} className='item-list alert-yellow'>
                                                      <Group className='d-flex d-flex-column items-start gap-0'>
                                                        <Text className='item-list-title'>{v.nombre}</Text>
                                                        <Text  className='item-list-subtitle'>{v.detalle}</Text>
                                                      </Group>
                                                      <Button
                                                        size="xs"
                                                        variant="outline"
                                                        className='button icon check'
                                                      >
                                                        <svg width="24" height="24" className='icon-button' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M12 0C5.3832 0 0 5.3832 0 12C0 18.6168 5.3832 24 12 24C18.6168 24 24 18.6168 24 12C24 5.3832 18.6168 0 12 0ZM9.6012 17.2956L5.1456 12.8496L6.84 11.1504L9.5988 13.9044L15.9516 7.5516L17.6484 9.2484L9.6012 17.2956Z"/>
                                                        </svg>
                                                      </Button>
                                                    </List.Item>
                                                  ))}
                                                </List>
                                              </>
                                            )}

                                            <Text className='title-label' mb="4px">
                                              APLICADAS
                                            </Text>

                                            {m.salud.vacunas_aplicadas.length > 0 ? (
                                              <List
                                              spacing="xs"
                                              >
                                              {m.salud.vacunas_aplicadas.map((v, i) => (
                                                  <List.Item key={i} className='item-list'>
                                                    <Group className='d-flex d-flex-column items-start gap-0'>
                                                      <Text className='item-list-title'>{v.nombre}</Text>
                                                      <Text  className='item-list-subtitle'>{v.detalle}</Text>
                                                    </Group>
                                                    <Text className='item-list-date'>
                                                      <svg className='icon-button' height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                                                        <path d="M13,1h-2V0h-1v1h-5V0h-1v1h-2C.9,1,0,1.9,0,3v11c0,1.1.9,2,2,2h11c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM14,14c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-7.5h13v7.5ZM14,5.5H1v-2.5c0-.55.45-1,1-1h2v2h1v-2h5v2h1v-2h2c.55,0,1,.45,1,1v2.5Z" fill="#fff"/>
                                                      </svg>
                                                      <span style={{ marginLeft: 8 }}>{v.fecha}</span>
                                                    </Text>
                                                  </List.Item>
                                              ))}
                                              </List>
                                            ) : (
                                                <Text className='text-placeholder' size='sm'>Aún no se registraron vacunas aplicadas.</Text>
                                              )
                                            }
                                        </Accordion.Panel>
                                      </Accordion.Item>
                                      
                                      <Accordion.Item value="antiparasitarios" className='panel-parasites'>
                                        <Accordion.Control>
                                          <Group className='d-flex gap-4 d-flex-row'>
                                            <Image
                                                radius="md"
                                                h={48}
                                                w={48}
                                                className='icon-parasites'
                                                src="/assets/icons/icon-parasite.svg"
                                              />
                                            <Title order={3} className='color-white'>Anti-parasitarios</Title>
                                          </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel>

                                            {m.salud.antiparasitarios_aplicados.length > 0 ? (
                                              <List
                                              spacing="xs"
                                              >
                                              {m.salud.antiparasitarios_aplicados.map((v, i) => (
                                                  <List.Item key={i} className='item-list'>
                                                    <Group className='d-flex d-flex-column items-start gap-0'>
                                                      <Text className='item-list-title'>{v.nombre}</Text>
                                                      <Text  className='item-list-subtitle'>{v.detalle}</Text>
                                                    </Group>
                                                    <Text className='item-list-date'>
                                                      <svg className='icon-button' height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                                                        <path d="M13,1h-2V0h-1v1h-5V0h-1v1h-2C.9,1,0,1.9,0,3v11c0,1.1.9,2,2,2h11c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM14,14c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-7.5h13v7.5ZM14,5.5H1v-2.5c0-.55.45-1,1-1h2v2h1v-2h5v2h1v-2h2c.55,0,1,.45,1,1v2.5Z" fill="#fff"/>
                                                      </svg>
                                                      <span style={{ marginLeft: 8 }}>{v.fecha}</span>
                                                    </Text>
                                                  </List.Item>
                                              ))}
                                              </List>
                                              ) : (
                                                <Text className='text-placeholder' size='sm'>Aún no se registraron anti-parasitarios aplicados.</Text>
                                              )
                                            }
                                        </Accordion.Panel>
                                      </Accordion.Item>

                                       <Accordion.Item value="intervenciones_medicas" className='panel-interventions'>
                                        <Accordion.Control>
                                          <Group className='d-flex gap-4 d-flex-row'>
                                            <Image
                                                radius="md"
                                                h={48}
                                                w={48}
                                                className='icon-interventions'
                                                src="/assets/icons/icon-interventions.svg"
                                              />
                                            <Title order={3} className='color-white'>Intervenciones médicas</Title>
                                          </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            {m.salud.intervenciones_medicas.length > 0 ? (
                                              <List
                                              spacing="xs"
                                              >
                                              {m.salud.intervenciones_medicas.map((v, i) => (
                                                  <List.Item key={i} className='item-list'>
                                                    <Group className='d-flex d-flex-column items-start gap-0'>
                                                      <Text className='item-list-title'>{v.nombre}</Text>
                                                      <Text  className='item-list-subtitle'>{v.detalle}</Text>
                                                    </Group>
                                                    <Text className='item-list-date'>
                                                      <svg className='icon-button' height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                                                        <path d="M13,1h-2V0h-1v1h-5V0h-1v1h-2C.9,1,0,1.9,0,3v11c0,1.1.9,2,2,2h11c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM14,14c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-7.5h13v7.5ZM14,5.5H1v-2.5c0-.55.45-1,1-1h2v2h1v-2h5v2h1v-2h2c.55,0,1,.45,1,1v2.5Z" fill="#fff"/>
                                                      </svg>
                                                      <span style={{ marginLeft: 8 }}>{v.fecha}</span>
                                                    </Text>
                                                  </List.Item>
                                              ))}
                                              </List>
                                            ) : (
                                                <Text className='text-placeholder' size='sm'>Aún no se registraron intervenciones médicas.</Text>
                                              )
                                            }
                                        </Accordion.Panel>
                                      </Accordion.Item>

                                      <Accordion.Item value="otros_tratamientos" className='panel-others'>
                                        <Accordion.Control>
                                          <Group className='d-flex gap-4 d-flex-row'>
                                            <Image
                                                radius="md"
                                                h={48}
                                                w={48}
                                                className='icon-others'
                                                src="/assets/icons/icon-others.svg"
                                              />
                                            <Title order={3} className='color-white'>Otros tratamientos</Title>
                                          </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel>

                                            {m.salud.otros_tratamientos.length > 0 ? (
                                              <List
                                              spacing="xs"
                                              >
                                              {m.salud.otros_tratamientos.map((v, i) => (
                                                  <List.Item key={i} className='item-list'>
                                                    <Group className='d-flex d-flex-column items-start gap-0'>
                                                      <Text className='item-list-title'>{v.nombre}</Text>
                                                      <Text  className='item-list-subtitle'>{v.detalle}</Text>
                                                    </Group>
                                                    <Text className='item-list-date'>
                                                      <svg className='icon-button' height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                                                        <path d="M13,1h-2V0h-1v1h-5V0h-1v1h-2C.9,1,0,1.9,0,3v11c0,1.1.9,2,2,2h11c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM14,14c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-7.5h13v7.5ZM14,5.5H1v-2.5c0-.55.45-1,1-1h2v2h1v-2h5v2h1v-2h2c.55,0,1,.45,1,1v2.5Z" fill="#fff"/>
                                                      </svg>
                                                      <span style={{ marginLeft: 8 }}>{v.fecha}</span>
                                                    </Text>
                                                  </List.Item>
                                              ))}
                                              </List>
                                              ) : (
                                                <Text className='text-placeholder' size='sm'>Aún no se registraron tratamientos médicos adicionales.</Text>
                                              )
                                            }
                                        </Accordion.Panel>
                                      </Accordion.Item>

                                  </Accordion>
                                </Tabs.Panel>
                                <Tabs.Panel value="servicios" pt="md">
                                  <Accordion chevronPosition="right" variant="separated" className='accordion-health'>
                                      <Accordion.Item value="vacunas" className='panel-bath'>
                                        <Accordion.Control>
                                          <Group className='d-flex gap-4 d-flex-row'>
                                            <Image
                                                radius="md"
                                                h={48}
                                                w={48}
                                                className='icon-bath'
                                                src="/assets/icons/icon-bath.svg"
                                              />
                                            <Title order={3} className='color-white'>Corte y Baño</Title>
                                          </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel>

                                            {m.servicios.corte_banio.length > 0 ? (
                                              <List
                                              spacing="xs"
                                              >
                                              {m.servicios.corte_banio.map((v, i) => (
                                                  <List.Item key={i} className='item-list'>
                                                    <Group className='d-flex d-flex-column items-start gap-0'>
                                                      <Text className='item-list-title'>{v.tipo}</Text>
                                                      <Text  className='item-list-subtitle'>{v.detalle}</Text>
                                                    </Group>
                                                    <Text className='item-list-date'>
                                                      <svg className='icon-button' height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                                                        <path d="M13,1h-2V0h-1v1h-5V0h-1v1h-2C.9,1,0,1.9,0,3v11c0,1.1.9,2,2,2h11c1.1,0,2-.9,2-2V3c0-1.1-.9-2-2-2ZM14,14c0,.55-.45,1-1,1H2c-.55,0-1-.45-1-1v-7.5h13v7.5ZM14,5.5H1v-2.5c0-.55.45-1,1-1h2v2h1v-2h5v2h1v-2h2c.55,0,1,.45,1,1v2.5Z" fill="#fff"/>
                                                      </svg>
                                                      <span style={{ marginLeft: 8 }}>{v.fecha}</span>
                                                    </Text>
                                                  </List.Item>
                                              ))}
                                              </List>
                                               ) : (
                                                <Text className='text-placeholder' size='sm'>Aún no se registraron baños o cortes.</Text>
                                              )
                                            }
                                        </Accordion.Panel>
                                      </Accordion.Item>
                                    
                                  </Accordion>
                                </Tabs.Panel>
                            </Tabs>
                          </Grid.Col>
                      </Grid>
                  </Tabs.Panel>
                ))}
            </Grid.Col>
        </Grid>
      </Tabs>
    </Container>
  );
}