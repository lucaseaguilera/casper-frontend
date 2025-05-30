// src/pages/Login.tsx
import { useState } from 'react';
import { Avatar, Button, Container, Title, Stack, TextInput, PasswordInput, Anchor } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import loginImage from '/assets/casper_brand.svg';

function Login() {
  const [visible, { toggle }] = useDisclosure(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
    
    // validar password
    if (password.trim() === '') {
      setPasswordError('Contraseña inválida. Intenta nuevamente.');
      hasError = true;
    } else {
      setPasswordError(null);
    }
    
    if (!hasError) {
      // Simulate API login request
      new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'roque@mail.com' && password === '123456') {
            resolve(true);
          } else {
            resolve(false);
          }
        }, 1000);
      }).then((success) => {
        if (success) {
          console.log('Login exitoso');
          localStorage.setItem('authenticated', 'true');
          window.location.href = '/dashboard';
        } else {
          setPasswordError('Usuario o contraseña incorrectos');
        }
      });
    }
  };

  return (
    <Container fluid px="lg" className="app-wrapper login">
       <img src={loginImage} alt='Login' className='login-brand' />
       <Container size={480} className='login-box'>
        <Avatar className='login-avatar' p="sm" src="/assets/placeholders/avatar-login.svg"></Avatar>
        <Title order={2} mb="lg" className='login-title color-white'>Ingresá con tu cuenta</Title>
        <form className='login-form' onSubmit={handleSubmit}>
          <Stack gap="lg">
            <TextInput 
              placeholder="Correo electrónico"
              size="lg"
              radius="md"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              error={emailError}
              inputWrapperOrder={['input', 'error']}
              className='input'
            />
            <PasswordInput
              size="lg"
              radius="md"
              placeholder='Contraseña'
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              error={passwordError}
              visible={visible}
              onVisibilityChange={toggle}
              inputWrapperOrder={['input', 'error']}
              className='input'
            />
            <Button className='button primary' type='submit'>
              Ingresar
            </Button>
            <Anchor href="/recuperar-clave" target="_blank" ta="center" underline="hover" className='button text d-inline-flex m-auto'>Recuperar clave de acceso</Anchor>
          </Stack>
        </form>
      </Container>
    </Container>
  );
}

export default Login;