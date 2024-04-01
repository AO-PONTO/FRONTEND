import React from 'react'; // Importação do React
import { EleAlert, EleButton, EleInput, EstModal } from '@/components'; // Importação de componentes customizados
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Importação de componentes de tabela customizados
import { cadAlunoTurma, cadTurma, dataAluno, dataFrequencia, dataSala, dataTurma, horario, propSelect } from '@/interface'; // Importação de tipos e interfaces específicos
import { formatDate, formatShortDate } from '@/lib/utils'; // Importação de funções utilitárias
import api from '@/service/api'; // Importação do módulo de API
import { QrReader } from 'react-qr-reader'; // Componente de leitura de QR code
import uuid from 'react-uuid'; // Biblioteca para geração de UUIDs

// Interface para representar a estrutura dos alunos em uma turma
interface mapAluno {
  aluno_turmas_uuid: string;
  chamada: boolean;
  created_at: string;
  data: string;
  updated_at: string | null;
  uuid: string;
  matricula: string;
  nome: string;
}

// Componente de chamada de presença
const ViewChamada = () => {
  // Estados do componente
  const [reviewPresenca, setReviewPresenca] = React.useState<boolean>(false); // Estado para revisar a presença
  const [currentDate, setCurrentDate] = React.useState<string>(''); // Estado para armazenar a data atual
  const [data, setData] = React.useState<string>('No result'); // Estado para armazenar dados do QR code
  const [openModal, setOpenModal] = React.useState<boolean>(false); // Estado para controlar a abertura do modal
  const [turma, setTurma] = React.useState<boolean>(false); // Estado para controlar a exibição da turma
  const [turmas, setTurmas] = React.useState<cadTurma[]>([]); // Estado para armazenar as turmas
  const [turmaSelect, setTurmaSelect] = React.useState<cadTurma>({ // Estado para armazenar a turma selecionada
    created_at: '',
    disciplina: '',
    horario: [],
    nome_professor: '',
    sala: '',
    updated_at: '',
    uuid: ''
  });
  const [alunos, setAlunos] = React.useState<mapAluno[]>([]); // Estado para armazenar os alunos da turma
  const [salas, setSalas] = React.useState<dataSala[]>([]); // Estado para armazenar as salas

  const [alert, setAlert] = React.useState<boolean>(false); // Estado para controlar a exibição do alerta
  const [exit, setExit] = React.useState<boolean>(false); // Estado para controlar a saída do alerta
  const [message, setMessage] = React.useState<string>(''); // Estado para armazenar a mensagem do alerta

  // Array com os dias da semana
  const diaSemana: propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ];

  const date = new Date();

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

  // Função para buscar os alunos de uma turma
  const handleAlunos = async (ele: cadTurma) => {
    try {
      const response = await api.get('/aluno-turmas', { params: {
        all: true, attribute: 'turma_uuid', value: ele.uuid
      }});
      const alunosDaTurma: mapAluno[] = [];
      response.data.map( async (item: cadAlunoTurma) => {
        const resp = await api.get('/alunos', { params: {
          all: false, attribute: 'uuid', value: item.aluno_uuid
        }});
        alunosDaTurma.push({
          aluno_turmas_uuid: item.uuid,
          chamada: false,
          created_at: formatDate(date),
          data: currentDate,
          updated_at: null,
          uuid: uuid(),
          matricula: resp.data.matricula.toString(),
          nome: resp.data.nome
        });
      });
      setAlunos(alunosDaTurma);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para submeter a chamada de presença
  const handleSubmit = async () => {
    const horarios: horario[] = [];
    turmaSelect.horario.map((item: horario) => {
      if (item.dia === date.getDay().toString()) {
        horarios.push(item);
      }
    });
    try {
      horarios.map(i => {
        alunos.map(async item => {
          const update: dataFrequencia = {
            aluno_turmas_uuid: item.aluno_turmas_uuid,
            chamada: item.chamada,
            created_at: item.created_at,
            data: item.data,
            hora: i.hora,
            updated_at: item.updated_at,
            uuid: item.uuid,
          };
          await api.post('/frequencias', update );
        });
      });
      setMessage('Frequencia Submetida');
      setAlert(true);
      setTurma(false);
      setReviewPresenca(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para verificar se a chamada já foi realizada no dia
  const validTurmaDay = async (ele: cadTurma) => {
    try {
      const response = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: ele.uuid }});
      const resp = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: response.data[0].uuid }});
      if (resp.data.filter((item: dataFrequencia) => item.data === currentDate).length !== 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Função para manipular a ação do alerta
  const alertAction = () => {
    if(exit) {
      setAlert(false);
    } else {
      setAlert(false);
    }
  };

  // Efeito para buscar as turmas e as salas ao montar o componente
  React.useEffect(()=>{
    handleTurmas();
    handleSalas();
  },[]);

  // Efeito para atualizar a data atual
  React.useEffect(() => {
    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    setCurrentDate(getCurrentDate());
  }, []);

  // Retorno do componente
  return (
    <>
      {/* Condicional para exibir a seleção de turma ou a chamada de presença */}
      {turma ? (
        <>
          <EleButton onClick={() => {
            setTurma(false);
            setReviewPresenca(false);
          }}>Voltar a Seleção de Turma</EleButton>
          {/* Condicional para exibir a revisão da presença ou o scanner QR code */}
          {reviewPresenca ? (
            <>
              <EleInput 
                label='Data de Hoje' 
                type='date' 
                value={currentDate} 
                name='data'
              />
              <div className='p-2 w-full'>
                {/* Tabela para exibir os alunos e registrar a presença */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Matricula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Presença</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunos.map((element) => {
                      return (
                        <TableRow onClick={() => {}} className={`${element.chamada ? 'bg-green-200' : 'bg-red-200'} relative`} key={element.matricula}>
                          <input 
                            className='w-full absolute opacity-0 h-full'
                            type='checkbox' 
                            id={element.matricula}
                            defaultChecked={element.chamada ? true : false}
                            onChange={() => {
                              const newArray = alunos.map(aluno => {
                                if (aluno.uuid === element.uuid) {
                                  return {...aluno, chamada: !aluno.chamada}
                                }
                                return aluno
                              });
                              setAlunos(newArray);
                            }}
                          />
                          <TableCell>{element.matricula}</TableCell>
                          <TableCell>{element.nome}</TableCell>
                          {element.chamada ? (<TableCell>Presente</TableCell>) : (<TableCell>Ausente</TableCell>)}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {/* Botão para submeter a chamada de presença */}
              <EleButton onClick={handleSubmit}>Submeter Chamada</EleButton>
            </>
          ) : (
            <>
              {/* Componente para ler QR code */}
              <QrReader
                onResult={(result) => {
                  if (!!result) {
                    setData(result?.getText());
                    setOpenModal(true);
                  }
                }}
                constraints={{facingMode : 'user'}}
                className='max-w-[500px] w-full m-auto'
              />
              {/* Modal para exibir os detalhes do aluno */}
              <EstModal confirm={() => {
                const newArray = alunos.map(aluno => {
                  if (aluno.matricula === data) {
                    return {...aluno, chamada: true};
                  }
                  return aluno;
                });
                setAlunos(newArray);
                setOpenModal(false);
              }} exit={()=> setOpenModal(false)} open={openModal}>
                {/* Detalhes do aluno */}
                {alunos.map((ele) => {
                  if (ele.matricula === data) {
                    return (
                      <div className='p-8'>
                        <p className='text-2xl text-center w-full'>Nome: {ele.nome}</p>
                        <p className='text-2xl text-center w-full'>Matricula: {ele.matricula}</p>
                      </div>
                    );
                  }
                }, [data])}
              </EstModal>
            </>
          )}
          {/* Botão para revisar ou voltar à seleção de turma */}
          <EleButton onClick={()=> {
            setReviewPresenca(!reviewPresenca);
          }}>{reviewPresenca ? 'Voltar' : 'Revisar'}</EleButton>
        </>
      ) : (
        <>
          {/* Condicional para exibir a seleção de turmas ou uma mensagem de espera */}
          {turmas.length === 0 || salas.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplinas</TableHead>
                  <TableHead>Série</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Exibição das turmas disponíveis */}
                {turmas.map((element) => (
                  <TableRow onClick={async () => {
                    if (element.horario.some(item => item.dia === date.getDay().toString())) {
                      if (await validTurmaDay(element)) {
                        setTurmaSelect(element);
                        setTurma(true);
                        handleAlunos(element);
                      } else {
                        setMessage('Erro ao tentar cadastrar presença nesta turma');
                        setAlert(true);
                      }
                    } else {
                      setMessage('Você não dará aula dessa matéria hoje');
                      setAlert(true);
                    }
                  }} key={element.uuid}>
                    <TableCell>{element.disciplina}</TableCell>
                    <TableCell>{salas.find(item => item.uuid === element.sala)?.nome + ' - ' + salas.find(item => item.uuid === element.sala)?.ano}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
      {/* Alerta para exibir mensagens */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  );
}

export default ViewChamada;
