import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
    return (
        <div className='p-3 md:p-4 shadow-sm flex justify-between items-center px-4 md:px-6 bg-background border-b border-border'>
            <Link href="/" className="flex items-center">
                <Image
                    src="/logo.png"
                    alt="Réstoir Health Logo"
                    width={140}
                    height={140}
                    className="rounded-lg w-24 h-auto md:w-36"
                />
            </Link>

            <div className='flex items-center gap-3'>
                <UserButton />
            </div>
        </div>
    )
}

export default AppHeader