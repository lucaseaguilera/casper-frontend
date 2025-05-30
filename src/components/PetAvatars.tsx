import { Avatar, Tooltip } from '@mantine/core';

function PetAvatars({ mascotas }: { mascotas: { nombre: string; imagen: string }[] }) {
  return (
    <Tooltip.Group justify="flex-end">
      <Avatar.Group spacing="xs" className="client-card__avatars" justify="flex-end">
        {mascotas.map((m, idx) => (
          <Tooltip key={idx} label={m.nombre} position="top" withArrow>
            <Avatar
              src={m.imagen}
              size="lg"
              radius="xl"
              className="client-card__avatar"
            />
          </Tooltip>
        ))}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
export default PetAvatars;