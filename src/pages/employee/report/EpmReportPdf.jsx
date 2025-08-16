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
