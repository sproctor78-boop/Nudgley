declare module 'react' {
  export type ReactNode = unknown;
  export type ButtonHTMLAttributes<T> = Record<string, unknown> & { className?: string; children?: ReactNode };
  export type ReactElement = unknown;
  export type SetStateAction<T> = T | ((prev: T) => T);
  export type Dispatch<A> = (value: A) => void;
  export interface Context<T> { Provider: (props: { value: T; children?: ReactNode }) => ReactElement }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, Dispatch<A>];
  export function useState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
  const React: { StrictMode: (props: { children?: ReactNode }) => ReactElement };
  export default React;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown;
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown;
  export const Fragment: unknown;
}

declare module 'react-dom/client' {
  export function createRoot(element: Element): { render(node: unknown): void };
}

declare module 'zod' {
  export namespace z { export type infer<T> = any; }
  export const z: any;
}

declare module 'vitest' {
  export const describe: any;
  export const expect: any;
  export const it: any;
}

declare module '*.css';

declare namespace JSX {
  interface IntrinsicAttributes { key?: unknown; }
  interface IntrinsicElements { [elemName: string]: any; }
}
