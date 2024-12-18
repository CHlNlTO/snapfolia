interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  location: string;
  setLocation: (location: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
}: SearchBarProps) {
  return (
    <div className="mb-6 w-full max-w-sm">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search leaves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="all">All</option>
          <option value="faith-colleges">FAITH Colleges</option>
          <option value="batangas-lakelands">Batangas Lakelands</option>
          <option value="marian-orchard">Marian Orchard</option>
        </select>
      </div>
    </div>
  );
}
