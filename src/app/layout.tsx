import './globals.css'
import './style-custom.css'  // Adicione esta linha
import Providers from '../components/Providers'
import { getServerSession } from 'next-auth'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="pt">
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}