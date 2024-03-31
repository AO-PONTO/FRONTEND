import React from 'react'

// Componente funcional 'Header'
// Este componente representa o cabeçalho da página
const Header = () => {
  return (
    // Elemento 'header' que engloba o conteúdo do cabeçalho
    <header className="h-[64px] w-full bg-button flex justify-between px-5 items-center border-b border-primaryHover shadow-center">
      {/* Parágrafo que contém o texto do cabeçalho */}
      <p className="w-full text-xl font-semibold text-white text-center md:pl-0 pl-10">AO PONTO</p>
    </header>
  )
}

export default Header // Exporta o componente Header como padrão para ser utilizado em outros arquivos
