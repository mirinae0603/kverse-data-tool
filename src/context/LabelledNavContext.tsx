import { createContext, useContext, useState,type ReactNode } from 'react';

type NavItem = { title: string; url: string };

interface LabelledContextType {
  items: NavItem[];
  setItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
}

const LabelledContext = createContext<LabelledContextType | undefined>(undefined);

export const LabelledProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<NavItem[]>([
    { title: "Chapter", url: "annotations/unlabelled" },
    { title: "Index", url: "annotations/labelled" },
  ]);

  return (
    <LabelledContext.Provider value={{ items, setItems }}>
      {children}
    </LabelledContext.Provider>
  );
};

export const useLabelled = () => {
  const context = useContext(LabelledContext);
  if (!context) throw new Error("useLabelled must be used within LabelledProvider");
  return context;
};