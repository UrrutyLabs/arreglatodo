"use client";

import { MobileNavigation } from "./MobileNavigation";
import { DesktopNavigation } from "./DesktopNavigation";

interface NavigationProps {
  showLogin?: boolean;
  showProfile?: boolean;
}

export function Navigation({ showLogin = true }: NavigationProps) {
  return (
    <>
      <MobileNavigation showLogin={showLogin} />
      <DesktopNavigation showLogin={showLogin} />
    </>
  );
}
