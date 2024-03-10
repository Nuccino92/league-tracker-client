import { ReactNode } from "react";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";

export default function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center flex-col w-full sm:h-screen">
      <AuthHeader />
      <div className="h-full flex items-center justify-center w-full">
        {children}
      </div>
      <AuthFooter />
    </div>
  );
}
