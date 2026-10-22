import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";

export default function ProviderLicenses({ providerId }) {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!providerId) {
            setLicenses([]);
            setError("");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadLicenses() {
            setLoading(true);
            setError("");
            setLicenses([]);

            try {
                const data = await apiRequest(
                    `/providers/${providerId}/licenses`
                );

                if (!cancelled) {
                    setLicenses(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadLicenses();

        return () => {
            cancelled = true;
        };
    }, [providerId]);

    if (!providerId) {
        return <p>Select a provider to view licenses.</p>;
    }

    return (
        <section>
            <h2>Provider Licenses</h2>

            {loading && <p role="status">Loading licenses...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && licenses.length === 0 && (
                <p>No licenses found for this provider.</p>
            )}

            {!loading && !error && licenses.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>License Number</th>
                            <th>License Status</th>
                            <th>Expiration Date</th>
                            <th>Validity</th>
                        </tr>
                    </thead>

                    <tbody>
                        {licenses.map(license => (
                            <tr key={license.licenseId}>
                                <td>{license.licenseNumber}</td>
                                <td>{license.licenseStatus}</td>
                                <td>
                                    {license.expirationDate?.slice(0, 10)}
                                </td>
                                <td>
                                    {license.isExpired ? "Expired" : "Not expired"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}