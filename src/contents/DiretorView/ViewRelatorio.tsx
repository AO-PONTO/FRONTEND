import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { dataRelatMer } from '@/interface'
import api from '@/service/api'
import React from 'react'

const ViewRelatório = () => {
  const [relatorios, setRelatorios] = React.useState<dataRelatMer[]>([])

  const handleRelatorios = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/relatorio-merendeiras', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
        setRelatorios(response.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  React.useEffect(()=>{
    handleRelatorios()
  }, [])
  return (
    <>
      <h1 className='text-lg w-full px-2'>Listar Relatórios da Merenda</h1>
      <div className='flex flex-wrap p-2 w-full'>
        <Table>
          <TableCaption>Lista de Relatorios.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center w-1/4'>Dia</TableHead>
              <TableHead className='text-center w-1/4'>Alunos</TableHead>
              <TableHead className='text-center w-1/4'>Sobra Limpa</TableHead>
              <TableHead className='text-center w-1/4'>Sobra Suja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatorios.map((ele) => (
              <TableRow key={ele.uuid}>
                <TableCell>{ele.data}</TableCell>
                <TableCell>{ele.numero_alunos}</TableCell>
                <TableCell>{ele.sobra_limpa}</TableCell>
                <TableCell>{ele.sobra_suja}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>{relatorios.length} Relatorios Cadastradas</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  )
}

export default ViewRelatório