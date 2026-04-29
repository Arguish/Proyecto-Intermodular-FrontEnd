import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReservations } from "../store/ReservationContext";

export default function SearchBar() {
    const { getResourceList, upcomingReservationsForResource } =
        useReservations();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [active, setActive] = useState(null);
    const [panelPos, setPanelPos] = useState(null);
    const inputRef = useRef();

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const q = query.trim().toLowerCase();
        const resources = getResourceList();
        const filtered = resources
            .filter((r) => r.name.toLowerCase().includes(q))
            .slice(0, 8);
        setResults(filtered);
    }, [query, getResourceList]);

    const onClickResult = (r) => {
        setActive({
            resource: r,
            reservations: upcomingReservationsForResource(r.type, r.name, 90),
        });
        const rect = inputRef.current.getBoundingClientRect();
        const panelWidth = Math.min(window.innerWidth - 16, 288);
        setPanelPos({ left: rect.left, top: rect.bottom, width: panelWidth });
    };

    return (
        <div className="w-full relative">
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Buscar aula o ítem..."
                className="h-7 w-full rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400"
            />

            {results.length > 0 && (
                <div className="absolute left-0 mt-1 w-full bg-surface border border-border shadow z-[10002] rounded text-xs">
                    {results.map((r) => (
                        <button
                            key={`${r.type}-${r.name}`}
                            onClick={() => onClickResult(r)}
                            className="w-full text-left px-2 py-1 hover:bg-primary-50"
                        >
                            <span className="font-medium text-[12px]">
                                {r.type === "aula" ? "Aula" : "Ítem"}:{" "}
                            </span>
                            <span className="text-[12px]">{r.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {active &&
                panelPos &&
                createPortal(
                    <div
                        style={{
                            left: Math.max(
                                8,
                                Math.min(
                                    panelPos.left,
                                    window.innerWidth - panelPos.width - 8,
                                ),
                            ),
                            top: panelPos.top + 6,
                            width: panelPos.width,
                        }}
                        className="bg-surface shadow p-2 rounded border border-border z-[10003] text-xs"
                    >
                        <div className="font-semibold mb-2">
                            {active.resource.type === "aula" ? "Aula" : "Ítem"}:{" "}
                            {active.resource.name}
                        </div>

                        {active.reservations.length === 0 ? (
                            <div className="text-[13px] text-text-secondary">
                                {active.resource.type === "aula"
                                    ? "Esta aula no está reservada en los próximos 90 días."
                                    : "Este ítem no está reservado en los próximos 90 días."}
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-auto">
                                {active.reservations.map((r) => (
                                    <div key={r.id} className="text-[13px]">
                                        <div className="font-medium">
                                            {r.date}
                                        </div>
                                        <div className="text-[11px] text-text-secondary">
                                            {r.horaInicio} - {r.horaFin} ·{" "}
                                            {[r.aula, r.item]
                                                .filter(Boolean)
                                                .join(" / ")}
                                        </div>
                                        {r.motivo && (
                                            <div className="text-[11px] truncate">
                                                {r.motivo}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-2 text-right">
                            <button
                                onClick={() => setActive(null)}
                                className="text-xs text-primary-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
