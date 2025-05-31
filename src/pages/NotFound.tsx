// src/pages/NotFound.tsx
import { Container, Title, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '/assets/placeholders/no-results.svg'; 

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container fluid className="app-wrapper login" ta="center" pt="xl">
      <Stack align="center" gap="xl">
        <img src={notFoundImage} alt="404 - Página no encontrada" style={{ maxWidth: 300 }} />
        <Title order={2} className="color-white">404 - Página no encontrada</Title>
        <Text className="color-white">
          La ruta que estás buscando no existe o fue eliminada.
        </Text>
        <Button className="button primary" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </Stack>
    </Container>
  );
}