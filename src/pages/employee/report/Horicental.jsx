import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import Logo from "../../../assets/log_usea.png";

export default function ReportLandscape() {
    const employees = [
        { id: 1, name: "John Doe", department: "HR", position: "Manager", email: "john@example.com", mobile: "0123456781", joiningDate: "2023-01-01", manager: "Alice", status: "Active" },
        { id: 2, name: "Jane Smith", department: "IT", position: "Developer", email: "jane@example.com", mobile: "098765432", joiningDate: "2022-06-15", manager: "Bob", status: "Active" },
        { id: 3, name: "David Lee", department: "Finance", position: "Accountant", email: "david@example.com", mobile: "011223344", joiningDate: "2021-11-20", manager: "Carol", status: "Inactive" },
    ];

    const reportRef = useRef();

    const generatePDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0,
            filename: "khmer-report.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 3 },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }, // Horizontal
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div style={{ padding: 20 }}>
            <div
                ref={reportRef}
                style={{
                    width: "297mm", // Landscape width
                    minHeight: "210mm", // Landscape height
                    padding: "15mm",
                    margin: "auto",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                    fontSize: "12px",
                    lineHeight: "1.5",
                }}
                className="moul-regular"
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                    <div className="khmer-header" style={{ fontSize: "16px" }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
                    <div className="khmer-header" style={{ fontSize: "16px" }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                </div>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{ maxWidth: 150, height: 90, objectFit: "contain" }}
                    />
                    <h2 className="khmer-header">សាកលវិទ្យាល័យ សៅស៍អ៊ីសថ៍អេយសៀ</h2>
                    <h3>UNIVERSITY OF SOUTH-EAST ASIA</h3>
                </div>

                {/* Employee Table */}
                <table
                    style={{
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                        width: "100%",
                        border: "1px solid #000",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "25px" }}>ID</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "120px" }}>Employee</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "90px" }}>Department</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "110px" }}>Position</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "190px" }}>Email</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "100px" }}>Mobile</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "90px" }}>Joining Date</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "100px" }}>Manager</th>
                            <th style={{ border: "1px solid #000", padding: "4px", width: "70px" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{emp.id}</td>
                                <td style={{ border: "1px solid #000", padding: "4px" }}>{emp.name}</td>
                                <td style={{ border: "1px solid #000", padding: "4px" }}>{emp.department}</td>
                                <td style={{ border: "1px solid #000", padding: "4px" }}>{emp.position}</td>
                                <td style={{ border: "1px solid #000", padding: "4px" }}>{emp.email}</td>
                                <td style={{ border: "1px solid #000", padding: "4px" }}>{emp.mobile}</td>
                                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{emp.joiningDate}</td>
                                <td style={{ border: "1px solid #000", padding: "4px" }}>{emp.manager}</td>
                                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{emp.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={generatePDF} style={{ marginTop: 20 }}>
                Generate Khmer PDF (Landscape)
            </button>
        </div>
    );
}
