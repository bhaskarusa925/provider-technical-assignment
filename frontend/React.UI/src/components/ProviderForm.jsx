import { useState } from "react";

export default function ProviderForm({
    provider,
    onSave,
    onCancel
}) {
    const [form, setForm] = useState({
        providerName: provider?.providerName ?? "",
        county: provider?.county ?? "",
        status: provider?.status ?? "Pending"
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            await onSave(form);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{provider ? "Edit Provider" : "Create Provider"}</h2>

            {error && <p role="alert">{error}</p>}

            <label>
                Provider Name
                <input
                    required
                    maxLength={200}
                    value={form.providerName}
                    onChange={e =>
                        setForm({
                            ...form,
                            providerName: e.target.value
                        })
                    }
                />
            </label>

            <label>
                County
                <input
                    required
                    maxLength={100}
                    value={form.county}
                    onChange={e =>
                        setForm({
                            ...form,
                            county: e.target.value
                        })
                    }
                />
            </label>

            <label>
                Status
                <select
                    value={form.status}
                    onChange={e =>
                        setForm({
                            ...form,
                            status: e.target.value
                        })
                    }
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                </select>
            </label>

            <div>
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}