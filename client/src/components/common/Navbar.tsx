import { Link } from "react-router";

export interface NavbarProps {
  children: React.ReactElement;
  logoTxt?: string;
}

export type NavOption = React.ReactElement;

export interface NavOptionProps {
  children: NavOption;
}

export interface NavOptionsProps {
  children: NavOption | NavOption[];
}

function Navbar({ children, logoTxt = "Header" }: NavbarProps) {
  return (
    <nav className="bg-primary px-6 py-3 flex justify-between items-center shadow col-[1/3]">
      <h1 className="text-2xl text-secondary">
        <Link to="/dashboard">{logoTxt}</Link>
      </h1>
      <div>{children}</div>
    </nav>
  );
}

function NavOptions({ children }: NavOptionsProps) {
  return <ul>{children}</ul>;
}

function NavOption({ children }: NavOptionProps) {
  return <li className="text-secondary text-sm">{children}</li>;
}

Navbar.options = NavOptions;
Navbar.option = NavOption;

export default Navbar;
