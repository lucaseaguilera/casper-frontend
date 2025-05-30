// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  ScrollArea,
} from "@mantine/core";

const Layout = () => {
  return (
    <section className="app-wrapper">
      <Sidebar />
      <ScrollArea scrollbars="y" h="100vh" className="app-wrapper-content">
          <Outlet />
      </ScrollArea>
    </section>
  );
};

export default Layout;