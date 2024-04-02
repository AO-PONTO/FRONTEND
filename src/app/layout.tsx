// Importa o tipo 'Metadata' de 'next'
// 'Metadata' é um tipo fornecido pelo Next.js para definir metadados da página
import type { Metadata } from 'next'

// Importa o componente 'Inter' do pacote 'next/font/google'
// 'Inter' é uma fonte do Google Fonts
import { Inter } from 'next/font/google'

// Importa o arquivo de estilos globais './globals.css'
import './globals.css'

// Inicializa a fonte 'Inter' com o subconjunto 'latin'
const inter = Inter({ subsets: ['latin'] })

// Define metadados padrão para a aplicação
export const metadata: Metadata = {
  title: 'Ao Ponto', // Título da página
  description: 'Aplicação de Gestão de Escolas', // Descrição da página
}

// Componente funcional 'RootLayout'
// Este componente envolve o conteúdo principal da aplicação
// Ele define o idioma HTML e aplica estilos mínimos à altura do corpo da página
export default function RootLayout({
  children, // Propriedade 'children' que representa o conteúdo filho do componente
}: Readonly<{
  children: React.ReactNode // Tipo de 'children' como 'React.ReactNode'
}>) {
  return (
    <html lang="pt-br">{/* Define o idioma HTML como Português Brasileiro */}
      <body className={`${inter.className} min-h-[100vh]`}>{children}</body>{/* Aplica a classe da fonte 'Inter' e define a altura mínima do corpo da página como 100vh */}
    </html>
  )
}
