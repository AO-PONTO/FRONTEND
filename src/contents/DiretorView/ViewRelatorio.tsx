import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table' // Importa componentes de tabela personalizados
import { dataRelatMer } from '@/interface' // Importa tipos de dados de interface
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API

const ViewRelatório = () => { // Declaração do componente funcional

  // Define o estado usando hooks do React para armazenar os relatórios
  const [relatorios, setRelatorios] = React.useState<dataRelatMer[]>([])

  // Função para lidar com a obtenção dos relatórios da API
  const handleRelatorios = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Obtém os dados do usuário do localStorage
    if (dataUser) {
      const tempUser = JSON.parse(dataUser) // Faz o parsing dos dados do usuário
      try {
        const response = await api.get('/relatorio-merendeiras', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }}) // Faz a requisição para obter os relatórios da API
        setRelatorios(response.data) // Atualiza o estado dos relatórios com os dados obtidos da API
      } catch (error) {
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Efeito que é executado uma vez após a montagem do componente para obter os relatórios
  React.useEffect(()=>{
    handleRelatorios()
  }, [])

  return (
    <>
      <h1 className='text-lg w-full px-2'>Listar Relatórios da Merenda</h1>
      <div className='flex flex-wrap p-2 w-full'>
        <Table>
          <TableCaption>Lista de Relatórios.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center w-1/4'>Dia</TableHead>
              <TableHead className='text-center w-1/4'>Alunos</TableHead>
              <TableHead className='text-center w-1/4'>Sobra Limpa</TableHead>
              <TableHead className='text-center w-1/4'>Sobra Suja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatorios.map((ele) => ( // Mapeia e renderiza os relatórios na tabela
              <TableRow key={ele.uuid}>
                <TableCell className='text-center'>{ele.data}</TableCell> {/* Data do relatório */}
                <TableCell className='text-center'>{ele.numero_alunos}</TableCell> {/* Número de alunos */}
                <TableCell className='text-center'>{ele.sobra_limpa}</TableCell> {/* Quantidade de sobra limpa */}
                <TableCell className='text-center'>{ele.sobra_suja}</TableCell> {/* Quantidade de sobra suja */}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>{relatorios.length} Relatórios Cadastrados</TableCell> {/* Total de relatórios cadastrados */}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  )
}

export default ViewRelatório // Exporta o componente ViewRelatório
