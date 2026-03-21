import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminShell from './AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (!session?.user) redirect('/login')
    if ((session.user as any).role !== 'ADMIN') redirect('/')

    return <AdminShell>{children}</AdminShell>
}
