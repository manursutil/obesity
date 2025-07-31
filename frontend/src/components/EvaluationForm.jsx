import { useState } from "react";
import axios from "axios";
import { differenceInMonths, parseISO } from "date-fns";

export default function EvaluationForm({ onResult }) {
    const [form, setForm] = useState({
        sexo: "",
        fecha_nacimiento: "",
        peso: "",
        altura: ""
    });
    const [endpoint, setEndpoint] = useState("evaluate");
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

        try {
            const res = await axios.post(`http://localhost:8000/${endpoint}`, payload);
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
                <label>Indicador</label>
                <select
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                >
                    <option value="evaluate">IMC</option>
                    <option value="evaluate-hfa">Altura por edad</option>
                    <option value="evaluate-wfa">Peso por edad</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Evaluando..." : "Evaluar"}
            </button>
        </form>
    );
}
