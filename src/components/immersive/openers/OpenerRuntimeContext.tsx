import { createContext, useContext } from "react";

export type OpenerRuntimeOptions = {
  preview: boolean;
  autoPlay: boolean;
};

const defaults: OpenerRuntimeOptions = { preview: false, autoPlay: false };

export const OpenerRuntimeContext = createContext<OpenerRuntimeOptions>(defaults);

export function useOpenerRuntime() {
  return useContext(OpenerRuntimeContext);
}
