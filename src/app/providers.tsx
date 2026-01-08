"use client";

import QueryProvider from "@/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
    <SessionProvider>
        <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
    );
}