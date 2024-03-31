import React from 'react'
import * as Components from '@/components' // Importa todos os componentes do diretório '@/components'
import ViewDiaria from './MerendeiraView/ViewDiaria'; // Importa o componente ViewDiaria do diretório './MerendeiraView/ViewDiaria'

interface propsMerendeira {
    view: string // Propriedade para definir a visualização atual
}

const Merendeira = (props: propsMerendeira) => {

    // Verifica se a visualização está vazia
    if (props.view === '') {
        return <></> // Retorna vazio se a visualização estiver vazia
    } else {
        return (
            <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
                {/* Renderiza o componente ViewDiaria se a visualização for 'Diaria' */}
                {props.view === 'Diaria' ? (
                  <ViewDiaria />
                ): (<></>)} {/* Retorna vazio se a visualização não for 'Diaria' */}
            </Components.EstContainer>
        )
    }
}

export default Merendeira // Exporta o componente Merendeira
