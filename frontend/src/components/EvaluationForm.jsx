import { useState } from "react";
import axios from "axios";
import { differenceInMonths, parseISO } from "date-fns";

export default function EvaluationForm({ onResult, onMealplan }) {
    const [form, setForm] = useState({
        sexo: "",
        fecha_nacimiento: "",
        peso: "",
        altura: "",
        actividad: "moderado"
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const buildPayload = () => {
        const today = new Date();
        const dob = parseISO(form.fecha_nacimiento);
        const edad_meses = differenceInMonths(today, dob);

        return {
            payload: {
                sexo: form.sexo,
                edad_meses,
                peso: form.peso,
                altura: form.altura
            },
            actividad: form.actividad
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { payload, actividad } = buildPayload();
        const url = `http://localhost:8000/evaluate-all?actividad=${actividad}`;

        try {
            const res = await axios.post(url, payload);
            onResult(res.data);
        } catch (err) {
            console.error(err);
            onResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleMealplan = async () => {
        setLoading(true);
        const { payload, actividad } = buildPayload();
        const url = `http://localhost:8000/generate-mealplan?actividad=${actividad}`;

        try {
            const res = await axios.post(url, payload);
            onMealplan(res.data);
        } catch (err) {
            console.error(err);
            onMealplan(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {[
                {
                    label: "Sexo",
                    name: "sexo",
                    type: "select",
                    options: [
                        { value: "", label: "Seleccionar" },
                        { value: "M", label: "Masculino" },
                        { value: "F", label: "Femenino" }
                    ]
                },
                {
                    label: "Fecha de nacimiento",
                    name: "fecha_nacimiento",
                    type: "date"
                },
                {
                    label: "Peso (kg)",
                    name: "peso",
                    type: "number",
                    step: "0.1"
                },
                {
                    label: "Altura (m)",
                    name: "altura",
                    type: "number",
                    step: "0.01"
                },
                {
                    label: "Actividad física",
                    name: "actividad",
                    type: "select",
                    options: [
                        { value: "sedentario", label: "Sedentario" },
                        { value: "moderado", label: "Moderado" },
                        { value: "activo", label: "Activo" }
                    ]
                }
            ].map((field) => (
                <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === "select" ? (
                        <select
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                            {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            step={field.step}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    )}
                </div>
            ))}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                >
                    {loading ? "Evaluando..." : "Evaluar"}
                </button>
                <button
                    type="button"
                    onClick={handleMealplan}
                    disabled={loading}
                    className="px-4 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                >
                    {loading ? "Generando..." : "Generar plan"}
                </button>
            </div>
        </form>
    );
}
