import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-card/80  border-b">
        <div className="max-w-screen-xl p-4 mx-auto flex items-center">
          <Link href={ROUTES.home}>
            <h2 className="text-xl font-medium">Video streaming</h2>
          </Link>
          <nav className="ml-auto">
            <Link href={ROUTES.admin}>
              <Button>
                <Settings />
                Manage Screens
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
