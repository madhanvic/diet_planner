export interface ChildrenProps {
  children: React.ReactElement;
}

export type Session = {
  [props: string]: string;
  role: string;
};
