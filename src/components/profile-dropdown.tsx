"use client";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { fireAuth } from "@/lib/firebase";
import { Button } from "./ui/button";

export default function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>
          <User className="w-14 h-14" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={() => {
            signOut(fireAuth);
          }}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
