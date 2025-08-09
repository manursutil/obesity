import { useState } from "react";

const EvaluationForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        birthDate: "",
        sex: "",
        weight: "",
        heightCm: "",
        activity: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculateMonths = (birthDateStr) => {
        if (!birthDateStr) return null;
        const birth = new Date(birthDateStr);
        const today = new Date();
        let months =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth());
        if (today.getDate() < birth.getDate()) months -= 1;
        return months >= 0 ? months : null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const edad_meses = calculateMonths(formData.birthDate);
            if (edad_meses === null) throw new Error("Fecha de nacimiento inválida");

            const altura_m = Number(formData.heightCm) / 100;
            const actividad = formData.activity || "moderado";

            const payload = {
                sexo: formData.sex,
                edad_meses,
                peso: Number(formData.weight),
                altura: Number(altura_m),
            };

            const evalRes = await fetch(
                `http://localhost:8000/evaluate-all?actividad=${encodeURIComponent(actividad)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            if (!evalRes.ok) throw new Error("No se pudo calcular la evaluación.");
            const results = await evalRes.json();

            let mealplan = null;
            try {
                const mpRes = await fetch(
                    `http://localhost:8000/generate-mealplan?actividad=${encodeURIComponent(actividad)}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );
                if (mpRes.ok) {
                    mealplan = await mpRes.json();
                }
            } catch {
                // ignore mealplan errors; results still shown
            }

            onComplete({ results, mealplan });
        } catch (err) {
            console.error(err);
            setError(err.message || "Error inesperado. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100";

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-sky-100/80 bg-white/70 backdrop-blur shadow-sm text-sm text-gray-800 divide-y divide-slate-100"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-semibold tracking-tight text-sky-700">
                    🧸 Evaluación
                </h2>
            </div>

            {/* Datos del niño */}
            <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full grid place-items-center bg-sky-100 text-sky-700">
                        🧸
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-sky-700">
                        Datos del niño
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Fecha de nacimiento
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                            className={inputBase}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Sexo
                        </label>
                        <select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            required
                            className={inputBase}
                        >
                            <option value="">Selecciona…</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                </div>
                {/* Optional live months preview */}
                {formData.birthDate && (
                    <p className="text-[11px] text-slate-500">
                        Edad estimada: {calculateMonths(formData.birthDate)} meses
                    </p>
                )}
            </div>

            {/* Peso */}
            <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full grid place-items-center bg-teal-100 text-teal-700">
                        ⚖️
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-sky-700">
                        Peso
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Peso (kg)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 24.2"
                            className={inputBase}
                        />
                    </div>
                </div>
                <p className="text-[11px] text-slate-500">
                    Usa una báscula reciente si es posible.
                </p>
            </div>

            {/* Altura */}
            <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full grid place-items-center bg-amber-100 text-amber-700">
                        📐
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-sky-700">
                        Altura
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Altura (cm)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            name="heightCm"
                            value={formData.heightCm}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 126.5"
                            className={inputBase}
                        />
                    </div>
                </div>
                <p className="text-[11px] text-slate-500">
                    Mide sin zapatos, en pared recta.
                </p>
            </div>

            {/* Actividad (opcional) */}
            <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full grid place-items-center bg-purple-100 text-purple-700">
                        🏃
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-sky-700">
                        Actividad (opcional)
                    </span>
                </div>
                <div>
                    <select
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        className={inputBase}
                    >
                        <option value="">(usa moderado por defecto)</option>
                        <option value="sedentario">Sedentario</option>
                        <option value="moderado">Moderado</option>
                        <option value="activo">Activo</option>
                    </select>
                </div>
                <p className="text-[11px] text-slate-500">
                    Si no seleccionas nada, se usará <strong>moderado</strong>.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="px-4 py-3">
                    <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {/* Submit */}
            <div className="px-4 py-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-3 font-medium text-white shadow-md transition hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Evaluando…" : "Evaluar"}
                </button>
                <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <span>🔒</span>
                    <span>Usamos estos datos solo para calcular tu evaluación.</span>
                </div>
            </div>
        </form>
    );
};

export default EvaluationForm;
