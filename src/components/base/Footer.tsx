import React from 'react'

// Componente funcional 'Footer'
// Este componente representa o rodapé da página
const Footer = () => {
  return (
    // Elemento 'footer' que engloba o conteúdo do rodapé
    <footer className="h-[64px] w-full bg-button flex justify-center items-center border-t border-primaryHover shadow-center">
      {/* Parágrafo que contém o texto do rodapé */}
      <p className="text-xl font-semibold text-white">
        {/* Conteúdo do texto do rodapé */}
      </p>
    </footer>
  )
}

export default Footer // Exporta o componente Footer como padrão para ser utilizado em outros arquivos
