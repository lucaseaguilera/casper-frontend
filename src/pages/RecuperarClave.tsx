// src/pages/Login.tsx
import { useState } from 'react';
import { Avatar, Button, Container, Title, Stack, TextInput, Anchor, Text } from '@mantine/core';
import loginImage from '/assets/casper_brand.svg';
import { Label } from 'recharts';

function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    
    // validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa una cuenta de correo válida');
      hasError = true;
    } else {
      setEmailError(null);
    }
    
    if (!hasError) {
      // Simulate API request to send recovery email
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      }).then(() => {
        console.log('Correo de recuperación enviado');
        alert('Si el correo existe en nuestra base de datos, recibirás un email para recuperar tu contraseña.');
      });
    }
  };

  return (
    <Container fluid px="lg" className="app-wrapper login">
       <img src={loginImage} alt='Login' className='login-brand' />
       <Container size={480} className='login-box'>
        <Avatar className='login-avatar' p="sm" src="/assets/placeholders/key-recover.svg"></Avatar>
        <Title order={2} mb="lg" className='login-title color-white'>Recuperar clave de acceso</Title>
        <form className='login-form' onSubmit={handleSubmit}>
          <Stack gap="lg">
            <TextInput 
              label="Ingresa tu correo correo electrónico"
              placeholder="Correo electrónico"
              size="lg"
              radius="md"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              error={emailError}
              inputWrapperOrder={['input', 'error']}
              className='input'
            />
            <Text className='color-white' mt="0" size='sm' mb="lg">Te enviaremos una clave nueva que deberás cambiar cuando ingreses la próxima vez.</Text>
            <Button className='button primary' type='submit'>
              Recuperar contraseña
            </Button>
            <Anchor href="/" ta="center" underline="hover" className='button text d-inline-flex m-auto'>Volver al inicio de sesión</Anchor>
          </Stack>
        </form>
      </Container>
    </Container>
  );
}

export default RecoverPassword;