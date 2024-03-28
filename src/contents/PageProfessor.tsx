import React from 'react'
import Webcam from 'react-webcam'
import * as Components from '@/components'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { QrReader} from 'react-qr-reader'
import ViewTurmas from './ProfessorView/ViewTurmas'
import ViewChamada from './ProfessorView/ViewChamada'
import ViewCozinha from './ProfessorView/ViewCozinha'
import ViewRelatório from './ProfessorView/ViewRelatorio'

interface PropsProfessor {
  view: string;
}

interface propsDisciplinas {
    disciplina: string,
    turma: string,
    dias: string[],
    horarios: string[]
  }

interface propsPresenca {
  matricula: string,
  nome: string,
  presente: boolean
}

interface Invoice {
  invoice: string;
  paymentStatus: "Paid" | "Pending" | "Unpaid";
  totalAmount: string;
  paymentMethod: "Credit Card" | "PayPal" | "Bank Transfer";
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

const presenca:propsPresenca[] = [
    { matricula: '001', nome: "Prof. Silva", presente: false},
    { matricula: '002', nome: "Profa. Oliveira", presente: false},
    { matricula: '003', nome: "Prof. Santos", presente: true},
    { matricula: '004', nome: "Profa. Lima", presente: false},
    { matricula: '005', nome: "Prof. Pereira", presente: true},
    { matricula: '006', nome: "Profa. Costa", presente: false},
    { matricula: '007', nome: "Prof. Martins", presente: false},
    { matricula: '008', nome: "Profa. Almeida", presente: true},
  ]

const disciplinas:propsDisciplinas[] = [
    { disciplina: 'Ciencia', turma: '1° A', dias: ['Seg', 'Ter'], horarios: ['07h-09h', '09h-11h'] },
    { disciplina: 'Matematica', turma: '2° A', dias: ['Qua', 'Sex'], horarios: ['07h-09h', '09h-11h']},
    { disciplina: 'Fisica', turma: '1° B', dias: ['Seg', 'Qua'], horarios: ['09h-11h', '09h-11h'] },
    { disciplina: 'Matematica', turma: '1° B', dias: ['Ter', 'Qui'], horarios: ['07h-09h', '07h-09h'] },
    { disciplina: 'Ciencia', turma: '2° A', dias: ['Sex', 'Qui'], horarios: ['07h-11h', '09h-11h'] }
  ]

const Disciplinas: string[] = ['Ciencia', 'Matematica', 'Fisica']
const Turmas : string[] = ['1° A', '1° B', '2° A']
  
  const invoices: Invoice[] = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
  ]

interface propsTableRowMap {
    element: propsPresenca,
    setPresentData: React.Dispatch<React.SetStateAction<propsPresenca[]>>
}

const TableRowMap = (props: propsTableRowMap) => {
    const [checked, setChecked] = React.useState<boolean>(props.element.presente)
    return (
    <TableRow onClick={() => {
        props.setPresentData(presentData => presentData.map(item => item.matricula === props.element.matricula ? { ...item, presente: !item.presente } : item))
    }} className={`${checked ? 'bg-green-200' : 'bg-red-200'} relative`} key={props.element.matricula}>
        <input 
            className='w-full absolute opacity-0 h-full'
            type='checkbox' 
            id={props.element.matricula}
            defaultChecked={props.element.presente ? true : false}
            onChange={()=>setChecked(!checked)}
        />
        <TableCell>{props.element.matricula}</TableCell>
        <TableCell>{props.element.nome}</TableCell>
        {checked ? (<TableCell>Presente</TableCell>) : (<TableCell>Ausente</TableCell>)}
    </TableRow>
    )
}

const Professor: React.FC<PropsProfessor> = (props) => {
  const webcamRef = React.useRef<Webcam>(null)
  const [currentDate, setCurrentDate] = React.useState<string>('')
  const [presentData, setPresentData] = React.useState<propsPresenca[]>(presenca)
  const [reviewPresenca, setReviewPresenca] = React.useState<Boolean>(false)
  const [data, setData] = React.useState<string>('No result')
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [dataRelatorio, setDataRelatorio] = React.useState<Invoice[] | null>(null)

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

  const capture = React.useCallback(() => {
    if (webcamRef.current !== null) {
        // Cria um link temporário para realizar o download da imagem
        const a = document.createElement('a');
        a.href = webcamRef.current.getScreenshot() || '';
        a.download = `captured_image_${currentDate}.jpg`; // Nome do arquivo que será baixado
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        }
  }, [webcamRef, currentDate]);

  if (props.view === '') {
    return <></>;
  } else {
    return (
      <Components.EstContainer size='giant' shadow="center" rounded="medium" scroll>
        {props.view === 'Cozinha' ? (
          <ViewCozinha />
        ) : props.view === 'Chamada' ? (
          <ViewChamada />
        ) : props.view === 'Turmas' ? (
          <ViewTurmas />
        ) : props.view === 'Relatorio' ? (
          <ViewRelatório setView={() => {}} />
        ) : (
          <></>
        )}
      </Components.EstContainer>
    );
  }
};

export default Professor;
