import { useCallback, useEffect, useState } from "react";

import {
    getProviders,
    createProvider,
    updateProvider,
    deleteProvider
} from "./api/providerApi";

import ProviderForm from "./components/ProviderForm";
import ProviderLicenses from "./components/ProviderLicenses";
import LicenseReportsPage from "./pages/LicenseReportsPage";

import "./App.css";

export default function App() {

    const [providers, setProviders] = useState([]);
    const [search, setSearch] = useState("");

    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [selectedProviderId, setSelectedProviderId] =
        useState(null);

    const [page, setPage] = useState("providers");
    const [refreshKey, setRefreshKey] = useState(0);

    // Load providers when search changes or data is updated.
    useEffect(() => {

        let cancelled = false;

        async function loadProviders() {

            setLoading(true);
            setError("");

            try {

                const data = await getProviders(search);

                if (!cancelled) {
                    setProviders(data);
                }

            } catch (err) {

                if (!cancelled) {
                    setProviders([]);
                    setError(
                        err.message || "Unable to load providers."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadProviders();

        return () => {
            cancelled = true;
        };

    }, [search, refreshKey]);

    // Refresh provider listing after create/update/delete.
    const refreshProviders = useCallback(() => {
        setRefreshKey(current => current + 1);
    }, []);

    // Create or update provider.
    async function handleSave(data) {

        if (saving) return;

        setSaving(true);
        setError("");

        try {

            if (editing) {

                await updateProvider(
                    editing.providerId,
                    data
                );

            } else {

                await createProvider(data);

            }

            setShowForm(false);
            setEditing(null);

            refreshProviders();

        } catch (err) {

            setError(
                err.message || "Unable to save provider."
            );

            // Re-throw so ProviderForm can show the error.
            throw err;

        } finally {

            setSaving(false);

        }
    }

    // Edit selected provider.
    function handleEdit(provider) {

        setEditing(provider);
        setShowForm(true);
        setError("");

    }

    // Open create form.
    function handleAdd() {

        setEditing(null);
        setShowForm(true);
        setError("");

    }

    // Cancel create/edit operation.
    function handleCancel() {

        setShowForm(false);
        setEditing(null);

    }

    // Soft-delete provider through the API.
    async function handleDelete(provider) {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${provider.providerName}"?\n\n` +
            "The provider will be hidden from normal listings, " +
            "but its information will be retained for auditing."
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {

            await deleteProvider(provider.providerId);

            // Clear license selection if deleted provider
            // is currently selected.
            setSelectedProviderId(current =>
                current === provider.providerId
                    ? null
                    : current
            );

            // Close edit form if deleted provider
            // is being edited.
            if (editing?.providerId === provider.providerId) {
                setEditing(null);
                setShowForm(false);
            }

            refreshProviders();

        } catch (err) {

            setError(
                err.message || "Unable to delete provider."
            );

        }
    }

    // Switch between providers and reports.
    function handlePageChange(selectedPage) {

        setPage(selectedPage);
        setError("");

        if (selectedPage !== "providers") {
            setShowForm(false);
            setEditing(null);
        }
    }

    return (
        <main className="container">

            <header className="app-header">
                <h1>Provider Management</h1>

                <p>
                    Manage providers, associated licenses,
                    and provider lifecycle information.
                </p>
            </header>

            {/* Application navigation */}
            <nav className="app-navigation">

                <button
                    type="button"
                    className={
                        page === "providers"
                            ? "nav-button active"
                            : "nav-button"
                    }
                    onClick={() =>
                        handlePageChange("providers")
                    }
                >
                    Providers
                </button>

                <button
                    type="button"
                    className={
                        page === "reports"
                            ? "nav-button active"
                            : "nav-button"
                    }
                    onClick={() =>
                        handlePageChange("reports")
                    }
                >
                    License Reports
                </button>

            </nav>

            {/* Provider management screen */}
            {page === "providers" && (

                <section>

                    <div className="toolbar">

                        <input
                            type="search"
                            placeholder="Search providers..."
                            value={search}
                            onChange={event =>
                                setSearch(event.target.value)
                            }
                            aria-label="Search providers"
                        />

                        <button
                            type="button"
                            onClick={handleAdd}
                        >
                            Add Provider
                        </button>

                    </div>

                    {/* API error */}
                    {error && (
                        <div
                            className="error-message"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {/* Create/Edit form */}
                    {showForm && (

                        <ProviderForm
                            key={
                                editing?.providerId ?? "new"
                            }
                            provider={editing}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />

                    )}

                    {/* Loading state */}
                    {loading ? (

                        <p role="status">
                            Loading providers...
                        </p>

                    ) : providers.length === 0 ? (

                        <div className="empty-state">

                            <p>
                                {search
                                    ? "No matching providers found."
                                    : "No providers available."}
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="provider-table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Provider Name</th>
                                        <th>County</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {providers.map(provider => (

                                        <tr key={provider.providerId}>

                                            <td>
                                                {provider.providerId}
                                            </td>

                                            <td>
                                                {provider.providerName}
                                            </td>

                                            <td>
                                                {provider.county}
                                            </td>

                                            <td>
                                                {provider.status}
                                            </td>

                                            <td className="action-buttons">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(provider)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedProviderId(
                                                            provider.providerId
                                                        )
                                                    }
                                                >
                                                    View Licenses
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(provider)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {/* Selected provider licenses */}
                    <div className="license-section">

                        <ProviderLicenses
                            providerId={selectedProviderId}
                        />

                    </div>

                </section>

            )}

            {/* License reports screen */}
            {page === "reports" && (

                <LicenseReportsPage />

            )}

        </main>
    );
}