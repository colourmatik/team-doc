"use client";

import { useEffect, useState } from "react";
import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { FullscreenLoader } from "./fullscreen-loader";

const appearanceWithoutFooter = {
  elements: {
    footer: "hidden",
    input: {
      '::placeholder': {
        color: 'transparent',
        },
    },
 },
};

export default function AuthSwitcher() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [showLoader, setShowLoader] = useState(false);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (userId) {
      setShowLoader(true);
    }
  }, [isLoaded, userId]);

  if (showLoader) {
    return <FullscreenLoader label="Загрузка..." />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {mode === "signIn" ? (
        <div className="flex flex-col items-center">
          <SignIn routing="virtual" appearance={appearanceWithoutFooter} />
          <div className="mt-4 text-sm text-gray-600">
            Нет учётной записи?{" "}
            <button
            onClick={() => setMode("signUp")}
              className="
                inline-flex items-center justify-center
                 px-3 py-[6px]
                text-sm font-medium text-white
                bg-[#3D3E45] hover:bg-[#3B3C45]
                border border-[#2F3037]
                rounded-md
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.07),_0_2px_3px_rgba(34,42,53,0.2),_0_1px_1px_rgba(0,0,0,0.24)]
                transition-all duration-100
                cursor-pointer select-none
                isolate relative
              "
            >
  Зарегистрироваться
</button>


          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <SignUp routing="virtual" appearance={appearanceWithoutFooter} />
          <div className="mt-4 text-sm text-gray-600">
            Уже есть учётная запись?{" "}
            <button
              
              onClick={() => setMode("signIn")}
                 className="
                inline-flex items-center justify-center
                 px-3 py-[6px]
                text-sm font-medium text-white
                bg-[#3D3E45] hover:bg-[#3B3C45]
                border border-[#2F3037]
                rounded-md
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.07),_0_2px_3px_rgba(34,42,53,0.2),_0_1px_1px_rgba(0,0,0,0.24)]
                transition-all duration-100
                cursor-pointer select-none
                isolate relative
              "           
            >
              Войти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
