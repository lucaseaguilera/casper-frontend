// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@mantine/core/styles.css';
import './styles/styles.scss';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteWizard from './pages/ClienteWizard';
import ClienteDetalle from './pages/ClienteDetalle';
import Configuracion from './pages/Configuracion';
import UsuarioPerfil from './pages/UsuarioPerfil';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  colorScheme: 'dark',
});

const isAuthenticated = () => {
  // Simulate login status from localStorage
  return localStorage.getItem('authenticated') === 'true';
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Login />;
};

function App() {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="clientes/:id" element={<ClienteDetalle />} />
            <Route path="clientes/new" element={<ClienteWizard />} />
            <Route path="clientes/:id/edit" element={<ClienteWizard />} />
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="perfil" element={<UsuarioPerfil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;