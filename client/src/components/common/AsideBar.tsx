export interface AsideBarProps {
  children: React.ReactElement;
}

export type AsideBarOption = React.ReactElement;

export interface AsideBarOptionProps {
  children: AsideBarOption;
}

export interface AsideBarOptionsProps {
  children: AsideBarOption | AsideBarOption[];
}

function AsideBar({ children }: AsideBarProps) {
  return <aside className="bg-primary py-4 w-[280px] h-full">{children}</aside>;
}

function AsideOptions({ children }: AsideBarOptionsProps) {
  return <ul>{children}</ul>;
}

function AsideOption({ children }: AsideBarOptionsProps) {
  return (
    <li className="[&_a]:text-sm  [&_a]:text-secondary [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/20 [&_a]:inline-block [&_a]:py-3  [&_a]:px-6 [&_a]:hover:bg-gray-600 [&_a.active]:bg-gray-600 [&_a]:w-full">
      {children}
    </li>
  );
}

AsideBar.options = AsideOptions;
AsideBar.option = AsideOption;

export default AsideBar;
