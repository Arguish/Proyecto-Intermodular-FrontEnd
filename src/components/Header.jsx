export default function Header() {
  return (
    <header className="
      h-12
      flex items-center justify-between
      px-4
      border-b border-border
      bg-surface
      text-text-primary
    ">
      <div className="font-semibold text-sm text-primary-500">
        Classy
      </div>

      <div className="flex items-center w-1/3">
        <input
          type="text"
          placeholder="Buscar..."
          className="
            h-7
            w-full
            rounded-md
            border border-border
            bg-background
            px-2
            text-xs
            focus:outline-none
            focus:ring-1 focus:ring-primary-400
          "
        />
        <button className="
          ml-2
          text-text-primary
          hover:text-primary-500
          transition-colors
          cursor-pointer
          flex items-center justify-center
          w-6
          h-6
        ">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <div className="text-xs text-primary-500 cursor-pointer hover:underline">
        Iniciar sesión
      </div>
    </header>
  );
}
