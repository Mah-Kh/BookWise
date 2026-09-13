export default function LibraryLayout({ children }: LayoutProps<"/library">) {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      {children}
    </div>
  );
}
