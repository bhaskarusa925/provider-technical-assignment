import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";

export default function LicenseReportsPage() {
    const [activeLicenses, setActiveLicenses] = useState([]);
    const [expiredLicenses, setExpiredLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadReports() {
            setLoading(true);
            setError("");

            try {
                const [active, expired] = await Promise.all([
                    apiRequest(
                        "/reports/active-providers-active-licenses"
                    ),
                    apiRequest(
                        "/reports/active-providers-expired-licenses"
                    )
                ]);

                if (!cancelled) {
                    setActiveLicenses(active);
                    setExpiredLicenses(expired);
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

        loadReports();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <p role="status">Loading license reports...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    function renderTable(records) {
        if (records.length === 0) {
            return <p>No matching licenses found.</p>;
        }

        return (
            <table>
                <thead>
                    <tr>
                        <th>Provider</th>
                        <th>County</th>
                        <th>License</th>
                        <th>Status</th>
                        <th>Expiration</th>
                    </tr>
                </thead>

                <tbody>
                    {records.map(record => (
                        <tr key={record.licenseId}>
                            <td>{record.providerName}</td>
                            <td>{record.county}</td>
                            <td>{record.licenseNumber}</td>
                            <td>{record.licenseStatus}</td>
                            <td>
                                {record.expirationDate?.slice(0, 10)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <main>
            <h1>License Reports</h1>

            <section>
                <h2>Active Providers with Valid Active Licenses</h2>
                {renderTable(activeLicenses)}
            </section>

            <section>
                <h2>Active Providers with Expired Licenses</h2>
                {renderTable(expiredLicenses)}
            </section>
        </main>
    );
}