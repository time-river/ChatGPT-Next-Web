import React from "react";

export interface TopNavProps {
  onNavOpen: () => void;
}

export interface SideNavProps {
  open: boolean;

  onClose: () => void;
}

export interface SideNavItemPops {
  active: boolean;
  disabled: boolean;
  external: boolean;
  icon: React.JSX.Element;
  path: string;
  title: string;
}

export interface NavItemDef {
  title: string;
  icon: React.JSX.Element;
  path: string;
  disabled: boolean;
  external: boolean;
}
