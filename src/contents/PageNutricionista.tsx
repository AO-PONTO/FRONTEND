import React from 'react'
import * as Components from '@/components'
import ViewCadCard from './NutricionistaView/ViewCadCard'
import ViewListCard from './NutricionistaView/ViewListCard'
import ViewCadAtr from './NutricionistaView/ViewCadAtr'
import ViewListAtr from './NutricionistaView/ViewListAtr'


interface propsNutricionista {
  view: string
}

const Actions = ['Cadastrar', 'Listar']

const Nutricionista = (props:propsNutricionista) => {
  const [action, setAction] = React.useState<string>('Cadastrar')
  if (props.view === '') {
    return <></>
  } else {
    return (
      <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
        <Components.EleActions action={action} setAction={setAction} label={Actions} />
        {action === 'Cadastrar' ? (
          <>
            {props.view === 'Cardápio' ? (
              <ViewCadCard setView={setAction} />
            ): props.view === 'Atribuição' ? (
              <ViewCadAtr setView={setAction} />
            ): (<></>)}
          </>
        ) : action === 'Listar' ? (
          <>
            {props.view === 'Cardápio' ? (
              <ViewListCard setView={setAction} />
            ): props.view === 'Atribuição' ? (
              <ViewListAtr setView={setAction} />
            ): (<></>)}
          </>
        ) : (<></>)}
      </Components.EstContainer>
    )
  }
}

export default Nutricionista