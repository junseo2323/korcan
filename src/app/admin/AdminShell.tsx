'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, MessageSquare, Megaphone, LayoutGrid, Menu, X, ChevronRight, BarChart2 } from 'lucide-react'

const navItems = [
    { href: '/admin', label: '개요', icon: LayoutDashboard, exact: true },
    { href: '/admin/analytics', label: '애널리틱스', icon: BarChart2 },
    { href: '/admin/users', label: '사용자', icon: Users },
    { href: '/admin/posts', label: '콘텐츠 관리', icon: FileText },
    { href: '/admin/chats', label: '채팅 내역', icon: MessageSquare },
    { href: '/admin/banners', label: '배너 관리', icon: Megaphone },
    { href: '/admin/home-layout', label: '홈 레이아웃', icon: LayoutGrid },
]

const Shell = styled.div`
    display: flex;
    min-height: 100vh;
    background: #f4f6fb;
`

const Sidebar = styled.aside<{ $open: boolean }>`
    width: 240px;
    background: #1a1f2e;
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 200;
    transform: ${({ $open }) => $open ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.25s ease;

    @media (min-width: 768px) {
        position: sticky;
        transform: translateX(0);
        flex-shrink: 0;
    }
`

const SidebarLogo = styled.div`
    padding: 1.5rem 1.25rem 1rem;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    span { color: #6366f1; }
`

const NavList = styled.nav`
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
`

const NavLink = styled(Link)<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.875rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: ${({ $active }) => $active ? '600' : '400'};
    text-decoration: none;
    color: ${({ $active }) => $active ? 'white' : 'rgba(255,255,255,0.55)'};
    background: ${({ $active }) => $active ? 'rgba(99,102,241,0.25)' : 'transparent'};
    border-left: ${({ $active }) => $active ? '3px solid #6366f1' : '3px solid transparent'};
    transition: all 0.15s;

    &:hover {
        background: rgba(255,255,255,0.07);
        color: white;
    }
`

const Overlay = styled.div<{ $open: boolean }>`
    display: ${({ $open }) => $open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 199;

    @media (min-width: 768px) {
        display: none;
    }
`

const Main = styled.main`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`

const TopBar = styled.div`
    height: 56px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
    gap: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;

    @media (min-width: 768px) {
        display: none;
    }
`

const HamburgerBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #374151;
`

const TopBarTitle = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: #1a1f2e;
`

const PageContent = styled.div`
    flex: 1;
    padding: 1.5rem;

    @media (min-width: 768px) {
        padding: 2rem;
    }
`

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const currentPage = navItems.find(item =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href)
    )

    const isActive = (item: typeof navItems[0]) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href)

    return (
        <Shell>
            <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

            <Sidebar $open={sidebarOpen}>
                <SidebarLogo>
                    KorCan <span>Admin</span>
                </SidebarLogo>
                <NavList>
                    {navItems.map(({ href, label, icon: Icon, exact }) => (
                        <NavLink
                            key={href}
                            href={href}
                            $active={isActive({ href, label, icon: Icon, exact })}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </NavList>
            </Sidebar>

            <Main>
                <TopBar>
                    <HamburgerBtn onClick={() => setSidebarOpen(true)}>
                        <Menu size={22} />
                    </HamburgerBtn>
                    <TopBarTitle>{currentPage?.label || 'Admin'}</TopBarTitle>
                </TopBar>
                <PageContent>{children}</PageContent>
            </Main>
        </Shell>
    )
}
