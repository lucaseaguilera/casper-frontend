// src/views/ClienteWizard.tsx
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
  Checkbox,
  Switch,
  Stack,
  Avatar,
  FileInput,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCameraPlus } from '@tabler/icons-react';

// Interfaces de datos
interface ClienteData {
  nombre: string;
  apellido: string;
  registro_nro: string;
  registro_fecha: string;
  dni: string;
  nacimiento: string;
  email: string;
  celular: string;
  cuidadores: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    nacimiento: string;
    email: string;
    celular: string;
  }[];
  provincia?: string;
  ciudad?: string;
  barrio?: string;
  calle?: string;
  altura?: string;
  edificio?: string;
  piso?: string;
  departamento?: string;
}
interface MascotaData {
  id?: number;
  nombre: string;
  tipo: 'Perro' | 'Gato';
  raza: string;
  fechaNacimiento: string;
  genero: 'Macho' | 'Hembra';
  foto?: string;
}
interface NotificacionesData {
  activar: boolean;
  frecuencias: string[];
  medios: string[];
}

// Datos mock
const mockCliente: ClienteData = {
  nombre: 'Noel',
  apellido: 'Castro',
  registro_nro: '2030',
  registro_fecha: '15.10.2019',
  dni: '12345678',
  nacimiento: '1980-05-12',
  email: 'noel.castro@gmail.com',
  celular: '351 1234567',
  provincia: 'Córdoba',
  ciudad: 'Córdoba Capital',
  barrio: 'Centro',
  calle: '9 de Julio',
  altura: '123',
  edificio: 'A',
  piso: '2',
  departamento: 'B',
  cuidadores: [],
};

const mockMascotas: MascotaData[] = [
  { id: 1, nombre: 'Benito', tipo: 'Perro', raza: 'Fila Brasileño', fechaNacimiento: '20.05.2019', genero: 'Macho', foto: '/assets/pets/perro.jpg' },
  { id: 2, nombre: 'Mr Bubs', tipo: 'Gato', raza: 'Mestizo', fechaNacimiento: '10.10.2016', genero: 'Macho', foto: '/assets/pets/gato1.jpg' },
];

// Opciones de razas por tipo
const razaOptions = {
  Perro: [
    'Beagle','Border Collie','Boxer','Bulldog Inglés','Bulldog Francés','Chihuahua','Dachshund (Teckel)',
    'Golden Retriever','Labrador Retriever','Mestizo','Pastor Alemán','Poodle (Caniche)','Pug','Rottweiler','Shih Tzu','Yorkshire Terrier'
  ],
  Gato: [
    'Abyssinian','American Shorthair','Bengal','British Shorthair','Maine Coon','Mestizo','Persian (Persa)',
    'Ragdoll','Scottish Fold','Siamese','Sphynx'
  ],
};

export default function ClienteWizard() {
  const { id } = useParams<{ id: string }>();
  const [cuidadores, setTakers] = useState<ClienteData[]>([]);  

  const handleAddTaker = () => {
    setTakers(prev => [...prev, { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '' },]);
  };

  const saveAndClose = () => {
    // enviar datos por api
    navigate('/clientes');
  };
  
  const navigate = useNavigate();
  const { search } = useLocation();
  const stepParam = Number(new URLSearchParams(search).get('step')) || 1;
  const isEditing = Boolean(id);
  const [clienteId, setClienteId] = useState<string | undefined>(id);
  const [mascotas, setMascotas] = useState<MascotaData[]>(mockMascotas);
  const [selectedPetId, setSelectedPetId] = useState<number | 'new' | null>(
    stepParam === 2 ? Number(new URLSearchParams(search).get('mascotaId')) || 'new' : null
  );

  // Formularios
  const formCliente = useForm<ClienteData>({
    initialValues: mockCliente,
    validate: {
      nombre: (v) => (v ? null : 'Requerido'),
      apellido: (v) => (v ? null : 'Requerido'),
      dni: (v) => (v ? null : 'Requerido'),
      nacimiento: (v) => (v ? null : 'Requerido'),
      email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : 'Email inválido'),
      celular: (v) => (v ? null : 'Requerido'),
    },
  });
  
  // Provincias y ciudades de ejemplo
  const [selectedProvincia, setSelectedProvincia] = useState<string>(formCliente.values.provincia || '');

  const [provinciasData, setProvinciasData] = useState<{ provincia: string; ciudades: string[] }[]>([]);
  const provinciasOptions = provinciasData.map(p => p.provincia);
  const ciudadesOptions = provinciasData.find(p => p.provincia === selectedProvincia)?.ciudades || [];
  useEffect(() => {
    fetch('/data/provincias.json')
      .then(res => res.json())
      .then(data => setProvinciasData(data))
      .catch(err => console.error('Error cargando provincias:', err));
  }, []);


  const selectedPet = mascotas.find((m) => m.id === selectedPetId) as MascotaData | undefined;
  const formMascota = useForm<MascotaData>({
    initialValues: selectedPet || { nombre: '', tipo: 'Perro', raza: '', fechaNacimiento: '', genero: 'Macho' },
    validate: { nombre: (v) => (v ? null : 'Requerido') },
  });

  const formNotif = useForm<NotificacionesData>({
    initialValues: { activar: true, frecuencias: [], medios: [] },
  });

  useEffect(() => {
    if (isEditing && id) {
      formCliente.setValues(mockCliente);
      setTakers(mockCliente.cuidadores);
    }
  }, [id]);

  const goToStep = (step: number, petId: number | 'new' | null = null) => {
    const params = new URLSearchParams();
    params.set('step', String(step));
    if (step === 2 && petId !== null) params.set('mascotaId', String(petId));
    navigate(`/clientes/${clienteId}/edit?${params.toString()}`);
  };

  const handleNext = () => {
    if (stepParam === 1) {
      const data = formCliente.validate().values;
      setClienteId(isEditing ? id! : 'nuevoId');
      goToStep(2, 'new');
    } else if (stepParam === 2) {
      const petData = formMascota.validate().values;
      const newPetData = { ...petData };
      if (!newPetData.id) newPetData.id = Date.now();
      setMascotas((prev) =>
        prev.some((m) => m.id === newPetData.id)
          ? prev.map((m) => (m.id === newPetData.id ? newPetData : m))
          : [...prev, newPetData]
      );
      goToStep(3);
    }
  };
  const handleBack = () => {
    if (stepParam === 2) goToStep(1);
    if (stepParam === 3) goToStep(2, selectedPetId);
  };
  const handleFinish = () => navigate('/clientes');

  // Imagen mascota
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const previewUrl = petPhoto ? URL.createObjectURL(petPhoto) : selectedPet?.foto ?? null;
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
          <Title order={2} className="header__title-name color-white">{isEditing ? 'Editar cliente' : 'Crear cliente'}</Title>
        </Group> 
        <Group justify='flex-end'>
          <Text size="md" className="color-placeholder">
            Cliente N° {formCliente.values.registro_nro} - Desde {formCliente.values.registro_fecha}
          </Text>
        </Group>
      </Group>
      <Container p="lg">
        <Stepper 
          active={stepParam - 1}
          onStepClick={(step) => goToStep(step + 1)}
          mb="xl"
          className='stepper'
        >
          <Stepper.Step label="Datos del cliente" />
          <Stepper.Step label="Mascotas" />
          <Stepper.Step label="Notificaciones" />
        </Stepper>
        {stepParam === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <Stack spacing="md" id='personal-data'>
              <Group grow>
                <TextInput className='input' size='md' label="Nombre*" {...formCliente.getInputProps('nombre')} />
                <TextInput className='input' size='md' label="Apellido*" {...formCliente.getInputProps('apellido')} />
              </Group>
              <Group grow>
                <TextInput className='input' size='md' label="Nro. DNI*" {...formCliente.getInputProps('dni')} />
                <TextInput  placeholder='DD/MM/AAAA' className='input' size='md' label="Fecha Nacimiento*" {...formCliente.getInputProps('nacimiento')} />
              </Group>
              <Group grow>
                <TextInput className='input' size='md' label="Email*" {...formCliente.getInputProps('email')} />
                <TextInput className='input' size='md' label="Celular*" {...formCliente.getInputProps('celular')} />
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
                    formCliente.setFieldValue('provincia', provincia || '');
                    formCliente.setFieldValue('ciudad', '');
                  }}
                />
                <Select
                  className="select"
                  label="Ciudad*"
                  searchable
                  size="md"
                  placeholder='Seleccione una ciudad'
                  data={ciudadesOptions}
                  value={formCliente.values.ciudad}
                  onChange={(ciudad) => formCliente.setFieldValue('ciudad', ciudad || '')}
                  disabled={!selectedProvincia}
                />
              </Group>
              <Group grow>
                <TextInput className='input' size='md' label="Barrio*" {...formCliente.getInputProps('barrio')} />
                <TextInput className='input' size='md' label="Calle*" {...formCliente.getInputProps('calle')} />
              </Group>
              <Group grow>
                <TextInput className='input' size='md' label="Altura*" {...formCliente.getInputProps('altura')} />
                <TextInput className='input' size='md' label="Edificio" {...formCliente.getInputProps('edificio')} />
              </Group>
              <Group grow>
                <TextInput className='input' size='md' label="Piso" {...formCliente.getInputProps('piso')} />
                <TextInput className='input' size='md' label="Departamento" {...formCliente.getInputProps('departamento')} />
              </Group>
            </Stack>

            {cuidadores.map((cuidador, idx) => (
              <Stack spacing="md" key={idx} mt="xl" className="taker-stack">
                <Title order={3} className='color-white' mb="0">Cuidador/a #{idx + 1}</Title>
                <Group grow>
                  <TextInput
                    className='input'
                    label="Nombre*"
                    value={cuidador.nombre}
                    onChange={e => {
                      const v = e.currentTarget.value;
                      setTakers(prev => {
                        const copy = [...prev];
                        copy[idx].nombre = v;
                        return copy;
                      });
                    }}
                  />
                  <TextInput
                    className='input'
                    label="Apellido*"
                    value={cuidador.apellido}
                    onChange={e => {
                      const v = e.currentTarget.value;
                      setTakers(prev => {
                        const copy = [...prev];
                        copy[idx].apellido = v;
                        return copy;
                      });
                    }}
                  />
                </Group>
                <Group grow>
                  <TextInput
                    className='input'
                    label="Nro. DNI"
                    value={cuidador.dni}
                    onChange={e => {
                      const v = e.currentTarget.value;
                      setTakers(prev => {
                        const copy = [...prev];
                        copy[idx].dni = v;
                        return copy;
                      });
                    }}
                  />
                  <TextInput
                    className='input'
                    label="Fecha nacimiento"
                    value={cuidador.nacimiento}
                    onChange={e => {
                      const v = e.currentTarget.value;
                      setTakers(prev => {
                        const copy = [...prev];
                        copy[idx].nacimiento = v;
                        return copy;
                      });
                    }}
                  />
                </Group>
                <Group grow>
                  <TextInput
                    className='input'
                    label="E-mail"
                    value={cuidador.email}
                    onChange={e => {
                      const v = e.currentTarget.value;
                      setTakers(prev => {
                        const copy = [...prev];
                        copy[idx].email = v;
                        return copy;
                      });
                    }}
                  />
                  <TextInput
                    className='input'
                    label="Celular*"
                    value={cuidador.celular}
                    onChange={e => {
                      const v = e.currentTarget.value;
                      setTakers(prev => {
                        const copy = [...prev];
                        copy[idx].celular = v;
                        return copy;
                      });
                    }}
                  />
                </Group>
              </Stack>
            ))}
            <Button variant="outline" className='button primary text md' mt="xs" onClick={handleAddTaker}>
              <svg width="20" height="20" viewBox="0 0 20 20" className='icon-button' fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.475 0 0 4.475 0 10C0 15.525 4.475 20 10 20C15.525 20 20 15.525 20 10C20 4.475 15.525 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z" fill="white"/>
              </svg>
              <span style={{ marginLeft: 8 }}>Agregar cuidador/a adicional</span>
            </Button>

            <Group justify="space-between" gap="sm" mt="xl">
              <Button variant="default" className='button primary outline' onClick={saveAndClose}>Guardar y cerrar</Button>
              <Button type="submit"  className='button primary'>Continuar paso 2 →</Button>
            </Group>
          </form>
        )}
        {stepParam === 2 && (
          <>
            <ScrollArea mb="xl" className='pet-list'>
              <Text className='title-label' ta="center" mb="md">SELECCIONA O CARGA UNA MASCOTA</Text>
              <Group spacing="md" justify="center" gap="lg">
                {mascotas.map((pet) => (
                  <Avatar.Group
                    key={pet.id}
                    className={`avatar-group d-flex d-flex-column items-center m-0 p-0 gap-1 ${pet.id === selectedPetId ? 'pet-active' : ''}`}
                  >
                    <Avatar
                      src={pet.foto}
                      className="avatar avatar-md m-auto"
                      onClick={() => {
                        setSelectedPetId(pet.id!);
                        formMascota.setValues(pet);
                      }}
                      style={{
                        border: pet.id === selectedPetId ? '2px solid #8bb453' : undefined,
                        cursor: 'pointer',
                      }}
                    />
                    <Text className='color-white'>{pet.nombre}</Text>
                  </Avatar.Group>
                ))}

                <Avatar.Group className="avatar-group d-flex d-flex-column items-center m-0 p-0 gap-1">
                  <Avatar
                    className='avatar avatar-md m-auto'
                    onClick={() => {
                      setSelectedPetId('new');
                      formMascota.reset();
                      setPetPhoto(null);
                    }} style={{ background: '#333', cursor: 'pointer' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                      <path d="M21.583 10.9468V12.5425H0.628906V10.9468H21.583ZM11.7988 0.679688V22.9355H10.0981V0.679688H11.7988Z" fill="#989DA6"/>
                    </svg>
                  </Avatar>
                  <Text className='color-white'>Agregar</Text>
                </Avatar.Group>
              </Group>
            </ScrollArea>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              {selectedPetId !== null && (
                <>
                  <Stack spacing="md">
                    <Group grow>
                      <Group justify="center">
                        <Group className='pet-edit-avatar'>
                          <Avatar src={previewUrl} className='avatar' size={200} radius={200} />
                          <FileInput
                            className='upload-avatar'
                            accept="image/*"
                            onChange={setPetPhoto}
                            inputProps={{ capture: 'environment' }}
                            leftSection={<IconCameraPlus size={28} color="white" />}
                            leftSectionPointerEvents="none"
                          />
                        </Group>
                      </Group>
                      <Group>
                        <TextInput 
                          className='input'
                          size='md'
                          label="Nombre mascota*"
                          {...formMascota.getInputProps('nombre')} 
                        />
                        <Group grow>
                          <Select
                            className='select'
                            label="Tipo*"
                            size='md'
                            checkIconPosition="right"
                            data={[{ value: 'Perro', label: 'Perro' }, { value: 'Gato', label: 'Gato' }]}
                            {...formMascota.getInputProps('tipo')}
                            onChange={(v) => {
                              formMascota.setFieldValue('tipo', v as any);
                              formMascota.setFieldValue('raza', '');
                            }}
                          />
                          <Select
                            className='select'
                            label="Raza*"
                            checkIconPosition="right"
                            size='md'
                            placeholder='Seleccione raza'
                            data={razaOptions[formMascota.values.tipo]}
                            {...formMascota.getInputProps('raza')}
                          />
                        </Group>
                      </Group>
                    </Group>
                  </Stack>
                  <Stack mt="sm">
                    <Group grow>
                      <TextInput 
                        size='md' 
                        className='input' 
                        label="Fecha Nacimiento*" 
                        placeholder='DD/MM/AAAA' 
                        {...formMascota.getInputProps('fechaNacimiento')} 
                      />
                      <Select
                        className='select'
                        label="Género*"
                        size='md'
                        checkIconPosition="right"
                        data={[{ value: 'Macho', label: 'Macho' }, { value: 'Hembra', label: 'Hembra' }]}
                        {...formMascota.getInputProps('genero')}
                      />
                    </Group>
                    <Group grow>
                      <TextInput 
                        size='md' 
                        className='input' 
                        label="Tamaño" 
                        {...formMascota.getInputProps('tamanio')} 
                      />
                      <TextInput 
                        size='md'
                        className='input' 
                        label="Peso en Kg."
                        {...formMascota.getInputProps('peso')} 
                      />
                    </Group>
                  </Stack>
                </>
              )}
              <Group justify="space-between" gap="sm" mt="xl">
                <Group>
                  <Button variant="default" className='button primary outline' onClick={handleBack}>←</Button>
                  <Button variant="default" className='button primary outline' onClick={saveAndClose}>Guardar y cerrar</Button>
                </Group>
                <Button type="submit" className='button primary'>Continuar paso 3 →</Button>
              </Group>
            </form>
          </>
        )}
        {stepParam === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); handleFinish(); }}>
            <Container spacing="md" className='settings'>
              <Stack mb="xl">
                <Switch label="Activar alertas automáticas" className='switch' color="#8BB453" size="lg" {...formNotif.getInputProps('activar', { type: 'checkbox' })} />
              </Stack>
              <Group grow align="flex-start" justify="flex-start" className='checkbox-container'>
                <Stack align="flex-start" justify="flex-start">
                  <Text className='title-label'>FRECUENCIA DE ENVÍO</Text>
                  <Checkbox.Group {...formNotif.getInputProps('frecuencias')} className='color-white checkboxes'>
                    <Checkbox color='#8BB453' mb="sm" value="3_days"	label="3 días"/>
                    <Checkbox color='#8BB453' mb="sm" value="2_days"	label="2 días" />
                    <Checkbox color='#8BB453' mb="sm" value="1_day"	label="1 día" />
                    <Checkbox color='#8BB453' mb="sm" value="same_day" label="Mismo día"/>
                  </Checkbox.Group>
                </Stack>
                <Stack align="flex-start" justify="flex-start">
                  <Text className='title-label'>MEDIOS DE NOTIFICACIÓN</Text>
                  <Checkbox.Group {...formNotif.getInputProps('medios')} className='color-white checkboxes'>
                    <Checkbox color='#8BB453' mb="sm" value="email" label="Email" />
                    <Checkbox color='#8BB453' mb="sm" value="whatsapp" label="Whatsapp" />
                  </Checkbox.Group>
                </Stack>
              </Group>
            </Container>
              <Group justify="space-between" gap="sm" mt="xl">
                <Button variant="default"  className='button primary outline' onClick={handleBack}>←</Button>
                <Button type="submit"  className='button primary'>Guardar y cerrar</Button>
              </Group>
          </form>
        )}
      </Container>
    </Container>
  );
}