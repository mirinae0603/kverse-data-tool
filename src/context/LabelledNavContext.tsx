import { getLabels } from '@/api/dashboard.api';
import { createContext, useContext, useEffect, useState,type ReactNode } from 'react';

type NavItem = { title: string; url: string };

interface LabelledContextType {
  items: NavItem[];
  setItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
  fetchLabels: () => void;
}

const LabelledContext = createContext<LabelledContextType | undefined>(undefined);

export const LabelledProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(()=>{
    fetchLabels();
  },[]);

  const fetchLabels = async () => {
    try {
      const data = await getLabels();
      const labels:NavItem[] = data.map((label:string)=>({title:label,url:`images/labelled?class=${label}`}));
      setItems(labels);
    } catch(error){
      console.log(error);
    }
  }

  return (
    <LabelledContext.Provider value={{ items, setItems,fetchLabels }}>
      {children}
    </LabelledContext.Provider>
  );
};

export const useLabelled = () => {
  const context = useContext(LabelledContext);
  if (!context) throw new Error("useLabelled must be used within LabelledProvider");
  return context;
};