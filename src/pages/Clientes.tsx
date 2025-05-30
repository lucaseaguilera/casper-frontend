import { useEffect, useState} from "react";
import {
  Container,
  TextInput,
  Loader,
  Pagination,
  SegmentedControl,
  Card,
  Text,
  Box,
  Title,
  Table,
  Button,
  CloseButton,
  Tooltip,
  Group,
  Stack,
  Image,
} from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import PetAvatars from '../components/PetAvatars';
import IconSearch from '/assets/icons/icon-search.svg';
import IconGrid from '/assets/icons/icon-grid.svg';
import IconList from '/assets/icons/icon-list.svg';
import IconCaret from '/assets/icons/icon-caret.svg';
import PlaceholderNoResults from '/assets/placeholders/no-results.svg';

// Tipos de datos
type Cliente = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  provincia: string;
  ciudad: string;
  barrio: string;
  mascotas: Mascota[];
  notificaciones: string[];
  notificaciones_status: string[]; // ["enabled", "disabled"]
};

const CLIENTES_MOCK: Cliente[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  nombre: `Cliente ${i + 1}`,
  apellido: `Apellido ${i + 1}`,
  telefono: `555-000-${i + 1}`,
  email: `clienteemail${i + 1}@mail.com`,
  provincia: `Provincia ${i + 1}`,
  ciudad: `Ciudad ${i + 1}`,
  barrio: `Barrio ${i + 1}`,
  mascotas: [
    {
      nombre: `Benito ${i + 1}`,
      imagen: "/assets/pets/perro.jpg",
    },
    {
      nombre: `Pelusa ${i + 2}`,
      imagen: "/assets/pets/gato1.jpg",
    },
    {
      nombre: `Mr. Bubs ${i + 3}`,
      imagen: "/assets/pets/gato2.jpg",
    },
  ],
  notificaciones: ["Whatsapp", "E-mail"],
  notificaciones_status: [i % 2 === 0 ? "enabled" : "disabled", "enabled"],
}));

const Clientes = () => {
  const navigate = useNavigate();
  const [clientesOriginales, setClientesOriginales] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [vista, setVista] = useState<"tarjetas" | "tabla">("tarjetas");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  const resultadosPorPagina = vista === "tarjetas" ? 15 : 30;

  const [orden, setOrden] = useState<{ campo: string; direccion: "asc" | "desc" }>({
    campo: "id",
    direccion: "asc",
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setClientesOriginales(CLIENTES_MOCK);
      setClientesFiltrados(CLIENTES_MOCK);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (busqueda.length < 3) {
      setClientesFiltrados(clientesOriginales);
      setPaginaActual(1);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const texto = busqueda.toLowerCase();
      const resultados = clientesOriginales.filter((cliente) =>
        `${cliente.nombre} ${cliente.apellido} ${cliente.mascotas.map(m => m.nombre).join(" ")}`.toLowerCase().includes(texto)
      );
      setClientesFiltrados(resultados);
      setPaginaActual(1);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, clientesOriginales]);

  useEffect(() => {
    const ordenados = [...clientesFiltrados].sort((a, b) => {
      const aVal = a[orden.campo as keyof Cliente];
      const bVal = b[orden.campo as keyof Cliente];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return orden.direccion === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return orden.direccion === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    setClientesFiltrados(ordenados);
  }, [orden]);

  const totalPaginas = Math.ceil(clientesFiltrados.length / resultadosPorPagina);

  const clientesPagina = clientesFiltrados.slice(
    (paginaActual - 1) * resultadosPorPagina,
    paginaActual * resultadosPorPagina
  );

  const irADetalle = (id: number) => navigate(`/clientes/${id}`);

  const manejarOrden = (campo: string) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };
  
  return (
    <Container fluid p="lg">
      <Group grow className="header header-search" justify="space-between" gap="xl">
        <Group className="header__title-search">
          <Title order={1} className="header__title-name">Clientes</Title>
          <Group className="header-search-box input-search-control">
            <TextInput
              placeholder="Filtrar por nombre de cliente o mascota"
              value={busqueda}
              onChange={(e) => setBusqueda(e.currentTarget.value)}
              className="input-search"
              style={{ maxWidth: "640px" }}
              leftSection={<img src={IconSearch} alt='Buscar' className="icon-search" />}
              leftSectionPointerEvents="none"
              leftSectionWidth={40}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setBusqueda('')}
                  style={{ display: busqueda ? undefined : 'none', borderRadius: '100%', right: '10px' }}
                />
              }
            />
          </Group>
        </Group>
        <Group className="header-actions">
          <div className="control-views">
            <SegmentedControl
              value={vista}
              classNames={{
                root: 'switch-view',
                indicator: 'switch-segment',
                label: 'switch-label',
              }}
              onChange={(val) => {
                setVista(val as 'tarjetas' | 'tabla');
                setPaginaActual(1);
              }}
              data={[
                {
                  value: 'tarjetas',
                  label: <img src={IconGrid} width={20} alt="tarjetas" />, 
                },
                {
                  value: 'tabla',
                  label: <img src={IconList} width={20} alt="listado" />,
                },
              ]}
            />
          </div>

          {/* Ocultamos por ahora el boton de crear cliente */}
          <Button size="xs" variant="outline" display={"none"} className="button primary outline" component={Link} to="/clientes/new">
              <svg className='icon-button' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.475 0 0 4.475 0 10C0 15.525 4.475 20 10 20C15.525 20 20 15.525 20 10C20 4.475 15.525 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z"/>
              </svg>
              <span style={{ marginLeft: 8 }}>Nuevo Cliente</span>
          </Button>
        </Group>
      </Group>
      <div className="result-wrapper">
        {loading ? (
            <Group className="loading">
             <Loader 
               className="loader"
               size="lg"
               color="#8BB453"
             />
           </Group>
        ) : clientesFiltrados.length === 0 ? (
          <Stack className="placeholder no-results"> 
            <Stack className="placeholder__inner" gap="0">
              <Image
                alt="Sin resultados"
                className="placeholder__icon"
                fit="contain"
                src={PlaceholderNoResults}
              />
              <Title order={2} className="placeholder__title" mb="sm">No se encontraron resultados</Title>
              <Text className="placeholder__text">Intentá buscando con otro nombre.</Text>
            </Stack>
          </Stack>
        ) : vista === "tabla" ? (
          <div className="table-wrapper">
            <Table.ScrollContainer minWidth={1199}>
              <Table className="table result-table">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th
                    onClick={() => manejarOrden("id")}
                    className={`sortable ${orden.campo === "id" ? `active ${orden.direccion}` : ""}`}
                  >
                    ID
                    <img src={IconCaret} alt="" className="caret-icon" />
                  </Table.Th>
                  <Table.Th
                    onClick={() => manejarOrden("nombre")}
                    className={`sortable ${orden.campo === "nombre" ? `active ${orden.direccion}` : ""}`}
                  >
                    Nombre
                    <img src={IconCaret} alt="" className="caret-icon" />
                  </Table.Th>
                  <Table.Th
                    onClick={() => manejarOrden("apellido")}
                    className={`sortable ${orden.campo === "apellido" ? `active ${orden.direccion}` : ""}`}
                  >
                    Apellido
                    <img src={IconCaret} alt="" className="caret-icon" />
                  </Table.Th>
                  <Table.Th>Teléfono</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th
                    onClick={() => manejarOrden("provincia")}
                    className={`sortable ${orden.campo === "provincia" ? `active ${orden.direccion}` : ""}`}
                  >
                    Provincia
                    <img src={IconCaret} alt="" className="caret-icon" />
                  </Table.Th>
                  <Table.Th
                    onClick={() => manejarOrden("ciudad")}
                    className={`sortable ${orden.campo === "ciudad" ? `active ${orden.direccion}` : ""}`}
                  >
                    Ciudad
                    <img src={IconCaret} alt="" className="caret-icon" />
                  </Table.Th>
                  <Table.Th
                    onClick={() => manejarOrden("barrio")}
                    className={`sortable ${orden.campo === "barrio" ? `active ${orden.direccion}` : ""}`}
                  >
                    Barrio
                    <img src={IconCaret} alt="" className="caret-icon" />
                  </Table.Th>
                  <Table.Th>Mascotas</Table.Th>
                  <Table.Th>Notificaciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {clientesPagina.map((cliente) => (
                  <Table.Tr key={cliente.id} onClick={() => irADetalle(cliente.id)} style={{ cursor: "pointer" }}>
                    <Table.Td>{cliente.id}</Table.Td>
                    <Table.Td>{cliente.nombre}</Table.Td>
                    <Table.Td>{cliente.apellido}</Table.Td>
                    <Table.Td>{cliente.telefono}</Table.Td>
                    <Table.Td>{cliente.email}</Table.Td>
                    <Table.Td>{cliente.provincia}</Table.Td>
                    <Table.Td>{cliente.ciudad}</Table.Td>
                    <Table.Td>{cliente.barrio}</Table.Td>
                    <Table.Td>{cliente.mascotas.map((m) => m.nombre).join(", ")}</Table.Td>
                    <Table.Td>
                      {cliente.notificaciones
                        .map((tipo, i) => ({
                          tipo,
                          estado: cliente.notificaciones_status[i],
                        }))
                        .filter((n) => n.estado === "enabled")
                        .map((n) => n.tipo)
                        .join(", ") || "—"}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </div>
        ) : (
          <div className="result-grid">
            {clientesPagina.map((cliente) => {
              const whatsappEstado = cliente.notificaciones_status[0];
              const emailEstado = cliente.notificaciones_status[1];
              const tooltip = `${whatsappEstado === "enabled" ? "Whatsapp activado" : "Whatsapp desactivado"}, ${emailEstado === "enabled" ? "E-mail activado" : "E-mail desactivado"}`;
              const iconClass = whatsappEstado === "enabled" || emailEstado === "enabled" ? "enabled" : "disabled";
              return (

                
                <Card
                  key={cliente.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ cursor: "pointer" }}
                  classNames={{
                    root: 'client-card',
                  }}
                  onClick={() => irADetalle(cliente.id)}
                >
                  <Group grow preventGrowOverflow={false} wrap="nowrap" justify="space-between" className="client-card__inner">
                    <Stack>
                      <Title order={2} className="client-card__name">
                        {cliente.nombre} {cliente.apellido}
                        <Tooltip label={tooltip} withArrow>
                          {/* Si hay alguna notificacion activada, la className cambia a "enabled", si no tiene ninguna notificacion activa, la imagen cambia a className "disabled" */}
                          <img src="/assets/icons/icon-bell-active.svg" className={iconClass} alt="Notificaciones" />
                        </Tooltip>
                      </Title>
                      <Group gap="xs" className="client-card__data">
                        <Stack gap="4px">
                          <Text className="text-label">Celular:</Text>
                          <Text className="text-data">{cliente.telefono}</Text>
                        </Stack>
                        <Stack gap="4px">
                          <Text className="text-label">E-mail:</Text>
                          <Box maw={200} miw={100}>
                            <Text className="text-data" truncate="end">
                              {cliente.email}
                            </Text>
                          </Box>
                        </Stack>
                      </Group>
                    </Stack>
                    <PetAvatars mascotas={cliente.mascotas} />
                  </Group>
                </Card>
              );
            })}
          </div>
        )}
        {!loading && totalPaginas > 1 && (
          <Pagination
            classNames={{
              root: 'pagination',
            }}
            total={totalPaginas}
            value={paginaActual}
            onChange={setPaginaActual}
            mt="lg"
          />
        )}
      </div>
    </Container>
  );
};

export default Clientes;