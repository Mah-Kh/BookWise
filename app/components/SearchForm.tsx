export default function SearchForm({
  action,
  search,
  placeholder,
}: {
  action: string;
  search: string;
  placeholder: string;
}) {
  return (
    <form action={action} method="GET" className="flex w-full max-w-xl gap-3">
      <input
        name="q"
        defaultValue={search}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm text-foreground outline-none placeholder:text-placeholder transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
      />

      <button
        type="submit"
        className="shrink-0 cursor-pointer rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}
