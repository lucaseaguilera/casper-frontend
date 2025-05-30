
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';

type OptionType = {
  label: string;
  value: string;
  type: 'cliente' | 'mascota';
  clienteId?: number;
};

const SearchComponent = () => {
  const navigate = useNavigate();

  const loadOptions = async (inputValue: string): Promise<any> => {
    if (inputValue.length < 3) {
      return [];
    }

    try {
      const response = await fetch('/data/searchData.json');
      const data = await response.json();

      const filteredClients = data.clients.filter((client: any) =>
        client.name.toLowerCase().includes(inputValue.toLowerCase())
      );

      const filteredPets = data.pets.filter((pet: any) =>
        pet.name.toLowerCase().includes(inputValue.toLowerCase())
      );

      const groupedOptions = [
        {
          label: 'Clientes',
          options: filteredClients.map((client: any) => ({
            label: client.name,
            value: `cliente-${client.id}`,
            type: 'cliente',
          })),
        },
        {
          label: 'Mascotas',
          options: filteredPets.map((pet: any) => ({
            label: pet.name,
            value: `mascota-${pet.id}`,
            type: 'mascota',
            clienteId: pet.clienteId,
          })),
        },
      ];

      return groupedOptions;
    } catch (error) {
      console.error('Error cargando datos:', error);
      return [];
    }
  };

  const handleChange = (selectedOption: OptionType | null) => {
    if (!selectedOption) return;

    if (selectedOption.type === 'cliente') {
      const clientId = selectedOption.value.split('-')[1];
      navigate(`/clientes/${clientId}`);
    } else if (selectedOption.type === 'mascota' && selectedOption.clienteId) {
      const petId = selectedOption.value.split('-')[1];
      navigate(`/clientes/${selectedOption.clienteId}?tab=mascotas&mascotaId=${petId}`);
    }
  };

  return (
    <div className="search-wrapper">
        <AsyncSelect
        cacheOptions
        classNamePrefix="react-select"
        loadOptions={loadOptions}
        defaultOptions={false}
        placeholder="Buscar cliente o mascota..."
        onChange={handleChange}
        noOptionsMessage={() => "Escribe al menos 3 letras"}
        />
    </div>
  );
};

export default SearchComponent;
