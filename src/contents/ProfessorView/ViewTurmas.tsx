import React from 'react'; // Importação do React
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Importação de componentes de tabela
import { cadTurma, dataSala, dataTurma, propSelect } from '@/interface'; // Importação de tipos e interfaces específicos
import api from '@/service/api'; // Importação do módulo de API

// Definição do componente para exibir as turmas
const ViewTurmas = () => {
  // Estados do componente
  const [turmas, setTurmas] = React.useState<cadTurma[]>([]); // Estado para armazenar as turmas
  const [salas, setSalas] = React.useState<dataSala[]>([]); // Estado para armazenar as salas

  // Array com os dias da semana
  const diaSemana: propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ];

  // Função para buscar as turmas associadas ao usuário
  const handleTurmas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto');
    if (dataUser) {
      const tempUser = JSON.parse(dataUser);
      try {
        const response = await api.get('/turmas', { params: { all: true, attribute: 'nome_professor', value: tempUser.user.nome }});
        if (response) {
          const tempData: cadTurma[] = response.data.map((item: dataTurma) => ({
            ...item,
            horario: JSON.parse(item.horario.replace(/'/g, '"'))
          }));
          setTurmas(tempData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Função para buscar as salas associadas ao usuário
  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto');
    if (dataUser) {
      const tempUser = JSON.parse(dataUser);
      try {
        const response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }});
        if(response) {
          setSalas(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Efeito para buscar as turmas e as salas ao montar o componente
  React.useEffect(()=>{
    handleTurmas();
    handleSalas();
  },[]);

  // Retorno do componente
  return (
    <>
      {/* Título da página */}
      <h1 className="text-lg mb-2">Minhas Turmas</h1>
      {/* Condicional para renderizar as turmas ou exibir uma mensagem de espera */}
      {turmas.length === 0 || salas.length === 0 ? (
        <p className='text-center w-full'>Aguarde alguns instantes...</p>
      ) : (
        <Table>
        {/* Tabela para exibir as turmas */}
          <TableHeader>
            <TableRow>
              <TableHead>Disciplinas</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Horarios</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.map((element) => (
              <TableRow key={element.uuid}>
                <TableCell>{element.disciplina}</TableCell>
                <TableCell>{salas.find(item => item.uuid === element.sala)?.nome + ' - ' + salas.find(item => item.uuid === element.sala)?.ano}</TableCell>
                {/* Mapeamento dos horários das turmas */}
                <TableCell>{element.horario.map(ele => <p key={ele.dia + ele.hora}>{diaSemana.find(item => item.uuid === ele.dia)?.name}</p>)}</TableCell>
                <TableCell>{element.horario.map(ele => <p key={ele.dia + ele.hora}>{ele.hora}:00</p>)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default ViewTurmas; // Exportação do componente
