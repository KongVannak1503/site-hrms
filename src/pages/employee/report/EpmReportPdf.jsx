import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from '../../../assets/log_usea.png';

export default function EmployeeReport() {
    const employees = [
        { id: 1, name: "John Doe", department: "HR", position: "Manager", status: "Active" },
        { id: 2, name: "Jane Smith", department: "IT", position: "Developer", status: "Active" },
        { id: 3, name: "David Lee", department: "Finance", position: "Accountant", status: "Inactive" },
    ];

    const generatePDF = () => {
        const doc = new jsPDF();

        // If you want Khmer font support, you must embed custom font here (advanced)
        // For now, let's assume default font and UTF-8 support for Khmer (may not render perfectly)

        // Add logo (convert your Logo import to base64 or URL)
        // Example with base64:
        // doc.addImage(logoBase64, 'PNG', x, y, width, height);
        // For now, skip or add if you have base64 string

        // Add Khmer headers (adjust x,y)
        doc.setFontSize(14);
        doc.text("ព្រះរាជាណាចក្រកម្ពុជា", 105, 20, { align: "center" });
        doc.text("ជាតិ សាសនា ព្រះមហាក្សត្រ", 105, 30, { align: "center" });
        doc.text("323", 105, 40, { align: "center" });

        // Add University name (Khmer and English)
        doc.setFontSize(16);
        doc.text("សាកលវិទ្យាល័យ សៅស៍អ៊ីសថ៍អេយសៀ", 105, 60, { align: "center" });
        doc.text("UNIVERSITY OF SOUTH-EAST ASIA", 105, 70, { align: "center" });

        // Draw a line below header
        doc.setLineWidth(0.5);
        doc.line(15, 75, 195, 75); // horizontal line

        // Prepare table data
        const headers = [
            "ID", "Employee ID", "Employee", "Email", "Position", "Department",
            "Mobile", "Joining Date", "Manager", "Status"
        ];
        const rows = employees.map(emp => [
            emp.id,
            emp.employeeId || "N/A",
            emp.name,
            emp.email || "N/A",
            emp.position,
            emp.department,
            emp.mobile || "N/A",
            emp.joiningDate || "N/A",
            emp.manager || "N/A",
            emp.status,
        ]);

        // Add table with autoTable
        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 80,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            margin: { left: 15, right: 15 },
        });

        // Save file
        doc.save("employee_report.pdf");
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>
                <img src="" alt="" />
            </h2>

            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginBottom: 10,
                }}
            >
                <thead>
                    <th className="khmer-header" style={{ textAlign: 'center' }}>
                        ព្រះរាជាណាចក្រកម្ពុជា
                    </th>
                </thead>
            </table>
            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginBottom: 10,
                }}
            >
                <thead>
                    <th className="khmer-header">
                        ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </th>
                </thead>
            </table>

            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginBottom: 20,
                }}
            >
                <thead>
                    <th>
                        323
                    </th>
                </thead>
            </table>

            <table
                style={{
                    borderCollapse: "collapse",
                    // width: "100%",
                    marginBottom: 20,
                }}
            >
                <tr>
                    <td style={{ width: 800, position: 'relative' }}>
                        <img
                            src={Logo
                            }
                            alt="Logo"
                            className='mx-auto'
                            style={{
                                maxWidth: '100%',
                                height: 90,
                                objectFit: 'contain',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'absolute',
                                top: '-80px',
                                left: 350,
                            }}
                        />
                    </td>
                </tr>
                <tr>
                    <th style={{ textAlign: 'center', paddingTop: 10 }} className="khmer-header">សាកលវិទ្យាល័យ សៅស៍អ៊ីសថ៍អេយសៀ</th>
                </tr>
                <tr>
                    <th style={{ textAlign: 'center', paddingTop: 10 }}>UNIVERSITY OF SOUTH-EAST ASIA</th>
                </tr>
            </table>


            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginBottom: 20,
                }}
            >
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Employee ID</th>
                        <th style={thStyle}>Employee</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Position</th>
                        <th style={thStyle}>Department</th>
                        <th style={thStyle}>Mobile</th>
                        <th style={thStyle}>Joining Date</th>
                        <th style={thStyle}>Manager</th>
                        <th style={thStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td style={tdStyle}>{emp.id}</td>
                            <td style={tdStyle}>{emp.name}</td>
                            <td style={tdStyle}>{emp.department}</td>
                            <td style={tdStyle}>{emp.position}</td>
                            <td style={tdStyle}>{emp.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={generatePDF} style={{ padding: "10px 20px", fontSize: 16 }}>
                Download PDF
            </button>
        </div >
    );
}

// Simple styles
const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
};

const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
};
