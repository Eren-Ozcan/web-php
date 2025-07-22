import React, { createContext, useContext, useState } from 'react';
import { ContentData, loadContent } from './content';

interface Ctx {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData>>;
}

const ContentContext = createContext<Ctx | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(loadContent());
  return (
    <ContentContext.Provider value={{ content, setContent }}>{children}</ContentContext.Provider>
  );
};

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
