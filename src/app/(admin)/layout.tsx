import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { ROUTES } from "../../lib/constants";
import { HomeIcon } from "lucide-react";
import QueryProvider from "@/components/query-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <header className="bg-card/80  border-b">
        <div className="max-w-screen-xl p-4 mx-auto flex items-center">
          <h2 className="text-xl font-medium flex items-center">
            <Link href={ROUTES.home}>
              <HomeIcon />
            </Link>{" "}
            <span className="mx-2">/</span>{" "}
            <Link href={ROUTES.admin}>Dashboard</Link>
          </h2>
          <nav className="ml-auto">
            <Link href={ROUTES.newScreen}>
              <Button>Add new screen</Button>
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </QueryProvider>
  );
}
