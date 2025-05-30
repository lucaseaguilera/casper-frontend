// src/views/UsuarioPerfil.tsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Stepper,
  Container,
  ActionIcon,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Select,
  Stack,
  Avatar,
  FileInput,
  ScrollArea,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCameraPlus } from '@tabler/icons-react';

// Interfaces de datos
interface UsuarioData {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  nacimiento: string;
  email: string;
  celular: string;
  provincia: string;
  ciudad: string;
  barrio: string;
  calle: string;
  altura: string;
  piso: string;
  departamento: string;
  usuario: string;
  contrasenia: string;
}

interface NegocioData {
  id: number;
  foto: string;
  nombre_tienda: string;
  razon_social: string;
  cuit: string;
  website: string;
  email: string;
  telefono: string;
  provincia: string;
  ciudad: string;
  barrio: string;
  calle: string;
  altura: string;
  local: string;
  facebook: string;
  instagram: string;
  sucursales: {
    id: number;
    nombre_tienda: string;
    sucursal: string;
    email: string;
    telefono: string;
    provincia: string;
    ciudad: string;
    barrio: string;
    calle: string;
    altura: string;
    local: string;
  }[];
}

// Datos mock
const mockUsuario: UsuarioData = {
  id: 11,
  foto: '/assets/users/avatar.svg',
  nombre: 'Roque',
  apellido: 'Peralta',
  dni: '12345678',
  nacimiento: '',
  email: 'roque.peraltao@gmail.com',
  celular: '351 1234567',
  provincia: '',
  ciudad: '',
  calle: '',
  altura: '',
  piso: '',
  departamento: '',
  usuario: 'roque.peraltao@gmail.com',
  contrasenia: '********',
};

const mockNegocio: NegocioData = {
  id: 11,
  nombre_tienda: 'Casper Pet Shop',
  razon_social: 'Casper SRL',
  cuit: '20-12345678-1',
  website: '',
  email: '',
  telefono: '',
  provincia: '',
  ciudad: '',
  barrio: '',
  calle: '',
  altura: '',
  local: '',
  facebook: '',
  instagram: '',
  sucursales: [],
}

export default function UsuarioPerfil() {
  const { id } = useParams<{ id: string }>();

  const saveAndClose = () => {
    // enviar datos por api
    navigate('/clientes');
  };
  
  const navigate = useNavigate();
  const { search } = useLocation();
  const stepParam = Number(new URLSearchParams(search).get('step')) || 1;
  const [UsuarioId, setUsuarioId] = useState<string | undefined>(id);
  // Sucursales state and handler
  const [sucursales, setSucursales] = useState<NegocioData["sucursales"]>([]);
  const handleAddSucursal = () => {
    setSucursales(prev => [
      ...prev,
      {
        id: Date.now(),
        nombre_tienda: '',
        sucursal: '',
        email: '',
        telefono: '',
        provincia: '',
        ciudad: '',
        barrio: '',
        calle: '',
        altura: '',
        local: '',
        facebook: '',
        instagram: '',
      }
    ]);
  };

  // Formularios
  const formUsuario = useForm<UsuarioData>({
    initialValues: mockUsuario,
    validate: {
      nombre: (v) => (v ? null : 'Requerido'),
      apellido: (v) => (v ? null : 'Requerido'),
      dni: (v) => (v ? null : 'Requerido'),
      nacimiento: (v) => (v ? null : 'Requerido'),
      email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : 'Email inválido'),
      celular: (v) => (v ? null : 'Requerido'),
      provincia: (v) => (v ? null : 'Requerido'),
      ciudad: (v) => (v ? null : 'Requerido'),
      calle: (v) => (v ? null : 'Requerido'),
      altura: (v) => (v ? null : 'Requerido'),
    },
  });
  
  const formNegocio = useForm<NegocioData>({
    initialValues: mockNegocio,
    validate: {
      nombre_tienda: (v) => (v ? null : 'Requerido'),
      razon_social: (v) => (v ? null : 'Requerido'),
      cuit: (v) => (v ? null : 'Requerido'),
      provincia: (v) => (v ? null : 'Requerido'),
      ciudad: (v) => (v ? null : 'Requerido'),
      calle: (v) => (v ? null : 'Requerido'),
      altura: (v) => (v ? null : 'Requerido'),
      email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : 'Email inválido'),
      telefono: (v) => (v ? null : 'Requerido'),
    },
  });

  // Provincias y ciudades de ejemplo
  const [selectedProvincia, setSelectedProvincia] = useState<string>(formUsuario.values.provincia || '');
  const [provinciasData, setProvinciasData] = useState<{ provincia: string; ciudades: string[] }[]>([]);
  const provinciasOptions = provinciasData.map(p => p.provincia);
  const ciudadesOptions = provinciasData.find(p => p.provincia === selectedProvincia)?.ciudades || [];
  useEffect(() => {
    fetch('/data/provincias.json')
      .then(res => res.json())
      .then(data => setProvinciasData(data))
      .catch(err => console.error('Error cargando provincias:', err));
  }, []);


  const goToStep = (step: number) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('step', step.toString());
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const handleNext = () => {
    if (stepParam === 1 && formUsuario.validate().hasErrors) return;
    if (stepParam === 2 && formNegocio.validate().hasErrors) return;
    goToStep(stepParam + 1);
  };

  const handleBack = () => {
    if (stepParam === 2) goToStep(1);
  };

  // Imagen Usuario
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const previewUrl = userPhoto ? URL.createObjectURL(userPhoto) : formUsuario.values.foto || null;
  return (
    <Container fluid p="0" className='d-flex d-flex-column gap-6 page-full-height'>
      <Group 
        grow 
        justify='space-between' 
        p="lg" 
        gap="lg" 
        className="header border-bottom stack-sm"
      >
        <Group wrap='nowrap' className='header__title'>
          <ActionIcon variant="outline" className='button outline icon circle lg p-0' onClick={() => navigate(-1)}>  
            <svg width="24" height="24" className='icon-button' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.99816 11.5769C3.99769 11.4904 4.01321 11.4046 4.04383 11.3245C4.07446 11.2444 4.11958 11.1716 4.17661 11.1102L9.71476 5.19334C9.83064 5.06955 9.98779 5 10.1517 5C10.3155 5 10.4727 5.06955 10.5886 5.19334C10.7044 5.31714 10.7695 5.48504 10.7695 5.66011C10.7695 5.83519 10.7044 6.00309 10.5886 6.12688L5.48115 11.5769L10.5886 17.027C10.6459 17.0883 10.6914 17.161 10.7225 17.2411C10.7535 17.3212 10.7695 17.407 10.7695 17.4937C10.7695 17.5804 10.7535 17.6663 10.7225 17.7464C10.6914 17.8264 10.6459 17.8992 10.5886 17.9605C10.5312 18.0218 10.4631 18.0704 10.3881 18.1036C10.3131 18.1368 10.2328 18.1539 10.1517 18.1539C10.0705 18.1539 9.99018 18.1368 9.91521 18.1036C9.84025 18.0704 9.77214 18.0218 9.71476 17.9605L4.17661 12.0437C4.11958 11.9823 4.07446 11.9094 4.04383 11.8293C4.01321 11.7492 3.99769 11.6634 3.99816 11.5769Z" fill="white"/>
              <path d="M4.00089 11.5773C4.00089 11.403 4.06572 11.2358 4.18112 11.1125C4.29652 10.9892 4.45304 10.9199 4.61624 10.9199L19.3846 10.9199C19.5479 10.9199 19.7044 10.9892 19.8198 11.1125C19.9352 11.2358 20 11.403 20 11.5773C20 11.7517 19.9352 11.9189 19.8198 12.0422C19.7044 12.1655 19.5479 12.2348 19.3846 12.2348L4.61624 12.2348C4.45304 12.2348 4.29652 12.1655 4.18112 12.0422C4.06572 11.9189 4.00089 11.7517 4.00089 11.5773Z" fill="white"/>
            </svg>
          </ActionIcon>
          <Title order={2} className="header__title-name color-white">Perfil de usuario</Title>
        </Group> 
        <Group justify='flex-end'>
          <Text size="md" className="color-placeholder">
            Usuario: {formUsuario.values.nombre} {formUsuario.values.apellido}
          </Text>
        </Group>
      </Group>

        <Box className='user-container' p="xl">
          <Stepper 
            active={stepParam - 1}
            onStepClick={(step) => goToStep(step + 1)}
            mb="xl"
            className='stepper'
          >
            <Stepper.Step label="Datos del usuario" />
            <Stepper.Step label="Datos del negocio" />
          </Stepper>
          {stepParam === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  
              <Stack spacing="md" mb="xl">
                <Group justify="center">
                  <Group className='pet-edit-avatar'>
                    <Avatar src={previewUrl} className='avatar' size={150} radius={150} />
                    <FileInput
                      className='upload-avatar'
                      accept="image/*"
                      onChange={setUserPhoto}
                      inputProps={{ capture: 'environment' }}
                      leftSection={<IconCameraPlus size={28} color="white" />}
                      leftSectionPointerEvents="none"
                    />
                  </Group>
                </Group>
              </Stack>

              <Stack spacing="md" id='personal-data'>
                <Group grow>
                  <TextInput className='input' size='md' label="Nombre*" {...formUsuario.getInputProps('nombre')} />
                  <TextInput className='input' size='md' label="Apellido*" {...formUsuario.getInputProps('apellido')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Nro. DNI*" {...formUsuario.getInputProps('dni')} />
                  <TextInput placeholder='DD/MM/AAAA' className='input' size='md' label="Fecha Nacimiento*" {...formUsuario.getInputProps('nacimiento')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Email*" {...formUsuario.getInputProps('email')} />
                  <TextInput className='input' size='md' label="Celular*" {...formUsuario.getInputProps('celular')} />
                </Group>
              </Stack>

              <Stack spacing="md" mt="xl" id='location'>
                <Title order={3} className='color-white' mb="0">Ubicación</Title>
                <Group grow>
                  <Select
                    className="select"
                    label="Provincia*"
                    searchable
                    size="md"
                    placeholder='Seleccione una provincia'
                    data={provinciasOptions}
                    value={selectedProvincia}
                    onChange={(provincia) => {
                      setSelectedProvincia(provincia || '');
                      formUsuario.setFieldValue('provincia', provincia || '');
                      formUsuario.setFieldValue('ciudad', '');
                    }}
                  />
                  <Select
                    className="select"
                    label="Ciudad*"
                    searchable
                    size="md"
                    placeholder='Seleccione una ciudad'
                    data={ciudadesOptions}
                    value={formUsuario.values.ciudad}
                    onChange={(ciudad) => formUsuario.setFieldValue('ciudad', ciudad || '')}
                    disabled={!selectedProvincia}
                  />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Calle*" {...formUsuario.getInputProps('calle')} />
                  <TextInput className='input' size='md' label="Altura*" {...formUsuario.getInputProps('altura')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Piso" {...formUsuario.getInputProps('piso')} />
                  <TextInput className='input' size='md' label="Departamento" {...formUsuario.getInputProps('departamento')} />
                </Group>
              </Stack>

              <Group justify="space-between" gap="sm" mt="xl">
                <Button variant="default" className='button primary outline' onClick={saveAndClose}>Guardar y cerrar</Button>
                <Button type="submit"  className='button primary'>Continuar paso 2 →</Button>
              </Group>
            </form>
          )}
          {stepParam === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <Stack spacing="md" id='business-data'>
                <Group grow>
                  <TextInput className='input' size='md' label="Nombre Comercial*" {...formNegocio.getInputProps('nombre_tienda')} />
                  <TextInput className='input' size='md' label="Razón Social*" {...formNegocio.getInputProps('razon_social')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Nro. CUIT*" {...formNegocio.getInputProps('cuit')} />
                  <TextInput className='input' size='md' label="Sitio web" {...formNegocio.getInputProps('website')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Email*" {...formNegocio.getInputProps('email')} />
                  <TextInput className='input' size='md' label="Teléfono*" {...formNegocio.getInputProps('telefono')} />
                </Group>
              </Stack>
              <Stack spacing="md" mt="xl" id='business-location'>
                <Title order={3} className='color-white' mb="0">Ubicación</Title>
                <Group grow>
                  <Select
                    className="select"
                    label="Provincia*"
                    searchable
                    size="md"
                    placeholder='Seleccione una provincia'
                    data={provinciasOptions}
                    value={selectedProvincia}
                    onChange={(provincia) => {
                      setSelectedProvincia(provincia || '');
                      formNegocio.setFieldValue('provincia', provincia || '');
                      formNegocio.setFieldValue('ciudad', '');
                    }}
                  />
                  <Select
                    className="select"
                    label="Ciudad*"
                    searchable
                    size="md"
                    placeholder='Seleccione una ciudad'
                    data={ciudadesOptions}
                    value={formNegocio.values.ciudad}
                    onChange={(ciudad) => formNegocio.setFieldValue('ciudad', ciudad || '')}
                    disabled={!selectedProvincia}
                  />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Barrio*" {...formNegocio.getInputProps('barrio')} />
                  <TextInput className='input' size='md' label="Calle*" {...formNegocio.getInputProps('calle')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Altura*" {...formNegocio.getInputProps('altura')} />
                  <TextInput className='input' size='md' label="Local" {...formNegocio.getInputProps('local')} />
                </Group>
                <Group grow>
                  <TextInput className='input' size='md' label="Facebook" {...formNegocio.getInputProps('facebook')} />
                  <TextInput className='input' size='md' label="Instabram" {...formNegocio.getInputProps('instagram')} />
                </Group>
              </Stack>

              {sucursales.map((sucursal, idx) => {
                // Provincia/Ciudad binding for each sucursal
                const provincia = sucursal.provincia;
                const ciudad = sucursal.ciudad;
                const ciudadesOpts = provinciasData.find(p => p.provincia === provincia)?.ciudades || [];
                return (
                  <Stack spacing="md" key={idx} mt="xl" className="sucursal-stack">
                    <Box spacing="md" mt="xl">
                      <Title order={3} className='color-white' mb="0">Sucursal #{idx + 1}</Title>
                      <Group grow>
                        <TextInput
                          className='input'
                          label="Nombre Sucursal*"
                          value={sucursal.nombre_tienda}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].nombre_tienda = v;
                              return copy;
                            });
                          }}
                        />
                        <TextInput
                          className='input'
                          label="Sucursal"
                          value={sucursal.sucursal}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].sucursal = v;
                              return copy;
                            });
                          }}
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          className='input'
                          label="E-mail"
                          value={sucursal.email}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].email = v;
                              return copy;
                            });
                          }}
                        />
                        <TextInput
                          className='input'
                          label="Telefno*"
                          value={sucursal.telefono}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].telefono = v;
                              return copy;
                            });
                          }}
                        />
                      </Group>
                    </Box>
                    <Box spacing="md" mt="xl">
                      <Title order={3} className='color-white' mb="0">Ubicación de la sucursal</Title>
                      <Group grow>
                        <Select
                          className="select"
                          label="Provincia*"
                          searchable
                          size="md"
                          placeholder='Seleccione una provincia'
                          data={provinciasOptions}
                          value={provincia}
                          onChange={(prov) => {
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].provincia = prov || '';
                              copy[idx].ciudad = '';
                              return copy;
                            });
                          }}
                        />
                        <Select
                          className="select"
                          label="Ciudad*"
                          searchable
                          size="md"
                          placeholder='Seleccione una ciudad'
                          data={ciudadesOpts}
                          value={ciudad}
                          onChange={(ciud) => {
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].ciudad = ciud || '';
                              return copy;
                            });
                          }}
                          disabled={!provincia}
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          className='input'
                          size='md'
                          label="Barrio*"
                          value={sucursal.barrio}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].barrio = v;
                              return copy;
                            });
                          }}
                        />
                        <TextInput
                          className='input'
                          size='md'
                          label="Calle*"
                          value={sucursal.calle}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].calle = v;
                              return copy;
                            });
                          }}
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          className='input'
                          size='md'
                          label="Altura*"
                          value={sucursal.altura}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].altura = v;
                              return copy;
                            });
                          }}
                        />
                        <TextInput
                          className='input'
                          size='md'
                          label="Local"
                          value={sucursal.local}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].local = v;
                              return copy;
                            });
                          }}
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          className='input'
                          size='md'
                          label="Facebook"
                          value={sucursal.facebook}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].facebook = v;
                              return copy;
                            });
                          }}
                        />
                        <TextInput
                          className='input'
                          size='md'
                          label="Instabram"
                          value={sucursal.instagram}
                          onChange={e => {
                            const v = e.currentTarget.value;
                            setSucursales(prev => {
                              const copy = [...prev];
                              copy[idx].instagram = v;
                              return copy;
                            });
                          }}
                        />
                      </Group>
                    </Box>
                  </Stack>
                );
              })}
              <Button variant="outline" className='button primary text md' mt="xs" onClick={handleAddSucursal}>
                <svg width="20" height="20" viewBox="0 0 20 20" className='icon-button' fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.475 0 0 4.475 0 10C0 15.525 4.475 20 10 20C15.525 20 20 15.525 20 10C20 4.475 15.525 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z" fill="white"/>
                </svg>
                <span style={{ marginLeft: 8 }}>Agregar sucursal</span>
              </Button>
              <Group justify="space-between" gap="sm" mt="xl">
                <Button variant="default"  className='button primary outline' onClick={handleBack}>←</Button>
                <Button type="submit"  className='button primary'>Guardar y cerrar</Button>
              </Group>
            </form>
          )}
        </Box>

    </Container>
  );
}