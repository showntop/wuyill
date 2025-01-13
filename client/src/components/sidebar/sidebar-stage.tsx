'use client';

import * as React from 'react';
import { ArrowRightToLine, CircleHelp, Gem, Plus, Settings, LayoutDashboard, Search, PenIcon, Pen } from 'lucide-react';
// import Link from 'next/link';
// import { User } from 'next-auth';
// import { UserAccountNav } from '@/components/layout/user-account-nav';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import LocaleSelect from '@/components/locale-selection';
// import { PageGenUrl } from '@/config';
// import { Button } from 'react-day-picker';
import { useSidebar } from '@/hooks/use-sidebar';
import { useNewConversation } from '@/hooks/use-new-conversation';
import { Toolbox } from './sidebar-toolbox';
import { useToggleToolbox } from '@/hooks/use-toggle-toolbox';
import Link from 'next/link';

interface NavBarProps {
    // user: User;
}

// export default function SidebarStage({ user }: NavBarProps) {
export default function SidebarStage({  }: NavBarProps) {
    const { toggleSidebar, isSidebarOpen } = useSidebar();
    const handleNewConversation = useNewConversation();
    const { toggle } = useToggleToolbox();

    return (
        <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col space-y-2 rounded-lg bg-gray-50 dark:bg-gray-700 py-3 items-end">
            {(
                <>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                aria-label="Toggle Sidebar"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 m-2"
                                onClick={toggleSidebar}
                            >
                                <ArrowRightToLine size={20} strokeWidth={2} className="text-gray-800 dark:text-white" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>打开侧边栏</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleNewConversation}
                                aria-label="New Search"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 m-2"
                            >
                                <Plus size={20} strokeWidth={2} className="text-gray-800 dark:text-white" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>新会话</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => window.location.href = '/'} // href ={'/'}
                                // prefetch={false}
                                aria-label="AI Search"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg py-1 px-2 m-2"
                            >
                            <Search size={20} strokeWidth={2} className="text-gray-800 dark:text-white"/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>AI Search</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => window.location.href = '/write'} // href ={'/'}
                                // prefetch={false}
                                aria-label="writing"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg py-1 px-2 m-2"
                            >
                            <Pen size={20} strokeWidth={2} className="text-gray-800 dark:text-white"/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>写作</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggle}
                                aria-label="AI Page Generator"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg py-1 px-2 m-2"
                            >
                                <LayoutDashboard size={20} strokeWidth={2} className="text-gray-800 dark:text-white" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>工具箱</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/pricing"
                                prefetch={false}
                                rel="nofollow"
                                aria-label="Upgrade Plan"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 m-2"
                            >
                                <Gem size={20} strokeWidth={2} className="text-gray-800 dark:text-white" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>Upgrade Plan</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/settings"
                                prefetch={false}
                                aria-label="Wuyill Settings"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 m-2"
                            >
                                <Settings size={20} strokeWidth={2} className="text-gray-800 dark:text-white" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>Settings</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/docs/wuyill-user-guide"
                                prefetch={false}
                                aria-label="Doc & Help"
                                className="inline-flex items-center justify-center hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 m-2"
                            >
                                <CircleHelp size={20} strokeWidth={2} className="text-gray-800 dark:text-white" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">
                            <p>Doc & FAQ</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <LocaleSelect className="bg-transparent hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 m-2" /> */}

                    {/* {user && (
                        <div className="items-center justify-center rounded-lg p-2">
                            <UserAccountNav user={user} />
                        </div>
                    )} */}
                </>
            )}
            <Toolbox />
        </div>
    );
}
