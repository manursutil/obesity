import { useState } from "react";
import axios from "axios";
import { differenceInMonths, parseISO } from "date-fns";

export default function EvaluationForm({ onResult }) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const today = new Date();
        const dob = parseISO(form.fecha_nacimiento);
        const edad_meses = differenceInMonths(today, dob);

        const payload = {
            sexo: form.sexo,
            edad_meses,
            peso: form.peso,
            altura: form.altura,
        };

        const url = `http://localhost:8000/evaluate-all?actividad=${form.actividad}`;

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

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Sexo</label>
                <select name="sexo" value={form.sexo} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                </select>
            </div>

            <div>
                <label>Fecha de nacimiento</label>
                <input
                    type="date"
                    name="fecha_nacimiento"
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Peso (kg)</label>
                <input
                    type="number"
                    name="peso"
                    value={form.peso}
                    onChange={handleChange}
                    step="0.1"
                />
            </div>

            <div>
                <label>Altura (m)</label>
                <input
                    type="number"
                    name="altura"
                    value={form.altura}
                    onChange={handleChange}
                    step="0.01"
                />
            </div>

            <div>
                <label>Actividad física</label>
                <select name="actividad" value={form.actividad} onChange={handleChange}>
                    <option value="sedentario">Sedentario</option>
                    <option value="moderado">Moderado</option>
                    <option value="activo">Activo</option>
                </select>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Evaluando..." : "Evaluar"}
            </button>
        </form>
    );
}
