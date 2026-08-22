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
    <form action={action} method="GET">
      <input name="q" defaultValue={search} placeholder={placeholder} />
      <button type="submit">Search</button>
    </form>
  );
}
