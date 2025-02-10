// components/Layout.tsx
import { AppShell, Text, Group, Button, Burger, Skeleton, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Evidences', path: '/evidences' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Text size="xl">AI Debugger</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            active={router.pathname === item.path}
            onClick={() => router.push(item.path)}
            my="xs"
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
