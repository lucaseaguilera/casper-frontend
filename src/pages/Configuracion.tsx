// src/views/Configuracion.tsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  ActionIcon,
  Title,
  Text,
  Group,
  Button,
  Checkbox,
  Switch,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface NotificacionesData {
  activar: boolean;
  frecuencias: string[];
  medios: string[];
}

export default function Configuracion() {
  
  const navigate = useNavigate();
  const formNotif = useForm<NotificacionesData>({
    initialValues: { activar: true, frecuencias: [], medios: [] },
  });
  
  return (
    <Container fluid p="0">
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
          <Title order={2} className="header__title-name color-white">Configuración general</Title>
        </Group> 
      </Group>
      <Stack p="lg" align="stretch" mt="xl" justify="center">
          <form className='settings-container'>
            <Stack spacing="md" className='settings'>
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
                  <Text className='title-label'>TIPO DE MENSAJE</Text>
                  <Checkbox.Group {...formNotif.getInputProps('tipo')} className='color-white checkboxes'>
                    <Checkbox color='#8BB453' mb="sm" value="food" label="Escaso de alimentos" />
                    <Checkbox color='#8BB453' mb="sm" value="vaccines" label="Plan de vacunas" />
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
            </Stack>
            <Group justify="flex-end" gap="sm" mt="xl">
              <Button type="submit" className='button primary'>Guardar y cerrar</Button>
            </Group>
          </form>
      </Stack>
    </Container>
  );
}