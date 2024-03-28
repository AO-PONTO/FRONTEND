import { IconType } from 'react-icons'
import { FaUser, FaUsers, FaBook, FaPaste, FaCheckCircle, FaHome, FaArrowAltCircleRight } from 'react-icons/fa'
import { MdFlatware } from 'react-icons/md'

export interface sectionElements {
    userType : string,
    menu : menuItem[]
}

interface menuItem {
    label : string,
    icon : IconType
}

export const sectionGestor: sectionElements = {
    userType: "gestor",
    menu: [
        { label: 'Escolas', icon: FaHome },
        { label: 'Usuários', icon: FaUser },
        { label: 'Disciplinas', icon: FaBook }
    ]
}

export const sectionDiretor: sectionElements = {
    userType: "diretor",
    menu: [
        { label: 'Usuários', icon: FaUser},
        { label: 'Séries', icon: FaHome },
        { label: 'Turmas' , icon: FaUsers },
        { label: 'Alunos' , icon: FaUser },
        { label: 'Compor Turma', icon: FaUsers },
        { label: 'Relatórios', icon: FaBook }
    ]
}

export const sectionNutricionista: sectionElements = {
    userType: "nutricionista",
    menu: [
        { label: 'Cardápio', icon: FaBook },
        { label: 'Atribuição', icon: FaArrowAltCircleRight }
    ]
}

export const sectionProfessor: sectionElements = {
    userType : "professor",
    menu: [
        //{ label: 'Cozinha', icon: MdFlatware },
        { label: 'Chamada', icon: FaCheckCircle },
        { label: 'Turmas', icon: FaUsers },
        { label: 'Relatorio', icon: FaPaste }
    ]
}


export const sectionMerendeira: sectionElements = {
    userType : "merendeira",
    menu: [
        { label: 'Diaria', icon: FaUsers }
    ]
}