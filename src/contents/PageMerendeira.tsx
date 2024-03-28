import React from 'react'
import * as Components from '@/components'
import ViewDiaria from './MerendeiraView/ViewDiaria';

interface propsMerendeira {
    view: string
}

const Merendeira = (props:propsMerendeira) => {

    if (props.view === '') {
        return <></>
    } else {
        return (
            <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
                {props.view === 'Diaria' ? (
                  <ViewDiaria />
                ): (<></>)}
            </Components.EstContainer>
        )
    }
}

export default Merendeira