import React, { useEffect, useRef, useState } from "react";
import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    WidthType,
    TextRun,
    AlignmentType,
    ImageRun,
    PageOrientation
} from "docx";
import { saveAs } from "file-saver";
import { renderAsync } from "docx-preview";
import Logo from "../../../assets/log_usea.png";

export default function ReportTestDocx() {
    const previewRef = useRef(null);
    const [docBlob, setDocBlob] = useState(null); // store blob for download

    const employees = [
        { id: 1, name: "John Doe", department: "HR", position: "Manager", email: "john@example.com", mobile: "0123456781", joiningDate: "2023-01-01", manager: "Alice", status: "Active" },
        { id: 2, name: "Jane Smith", department: "IT", position: "Developer", email: "jane@example.com", mobile: "098765432", joiningDate: "2022-06-15", manager: "Bob", status: "Active" },
        { id: 3, name: "David Lee", department: "Finance", position: "Accountant", email: "david@example.com", mobile: "011223344", joiningDate: "2021-11-20", manager: "Carol", status: "Inactive" },
    ];

    useEffect(() => {
        const generateAndPreview = async () => {
            const logoResponse = await fetch(Logo);
            const logoBuffer = await logoResponse.arrayBuffer();

            const headerTable = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [new TextRun({ text: "ព្រះរាជាណាចក្រកម្ពុជា", font: "Moul", size: 24 })],
                                        spacing: { before: 500, after: 0 },
                                        alignment: AlignmentType.CENTER
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({ text: "ជាតិ សាសនា ព្រះមហាក្សត្រ", font: "Moul", size: 24 })],
                                        alignment: AlignmentType.CENTER
                                    }),
                                    new Paragraph({
                                        children: [new ImageRun({ data: logoBuffer, transformation: { width: 80, height: 80 } })],
                                        alignment: AlignmentType.LEFT,
                                        indent: { left: 1800 },
                                        spacing: { before: 0, after: 0 }
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({ text: "សាកលវិទ្យាល័យ សៅស៍អ៊ីសថ៍អេយសៀ", font: "Moul", size: 24 })],
                                        alignment: AlignmentType.LEFT
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({ text: "UNIVERSITY OF SOUTH-EAST ASIA", font: "Times New Roman", size: 22 })],
                                        alignment: AlignmentType.LEFT,
                                        indent: { left: 550 },
                                    }),
                                ],
                                width: { size: 75, type: WidthType.PERCENTAGE },
                                verticalAlign: "center",
                                borders: {
                                    top: { style: "none", size: 0, color: "FFFFFF" },
                                    bottom: { style: "none", size: 0, color: "FFFFFF" },
                                    left: { style: "none", size: 0, color: "FFFFFF" },
                                    right: { style: "none", size: 0, color: "FFFFFF" }
                                }
                            })
                        ]
                    })
                ]
            });

            // Employee table header (same style)
            const headerRow = new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ID", font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })], width: { size: 8, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Employee", font: "Siemreap", size: 24 })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Department", font: "Siemreap", size: 24 })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Position", font: "Siemreap", size: 24 })] })], width: { size: 12, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Email", font: "Siemreap", size: 24 })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Mobile", font: "Siemreap", size: 24 })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Joining Date", font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Manager", font: "Siemreap", size: 24 })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE } }),
                ]
            });

            // Employee rows (same style)
            const rows = employees.map(emp =>
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.id.toString(), font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.name, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.department, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.position, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.email, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.mobile, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.joiningDate, font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.manager, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: emp.status, font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })] }),
                    ]
                })
            );

            const employeeTable = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [headerRow, ...rows]
            });

            const doc = new Document({
                sections: [
                    {
                        properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
                        children: [
                            headerTable,
                            new Paragraph({ text: "", spacing: { after: 200 } }),
                            employeeTable
                        ]
                    }
                ]
            });

            const blob = await Packer.toBlob(doc);
            setDocBlob(blob);

            if (previewRef.current) {
                renderAsync(blob, previewRef.current);
            }
        };

        generateAndPreview();
    }, []);

    const handleDownload = () => {
        if (docBlob) {
            saveAs(docBlob, "report.docx");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <div
                ref={previewRef}
                className="docx-preview"
                style={{ marginTop: 20, minHeight: 500, overflow: "auto", padding: 10, backgroundColor: "white" }}
            />
            <button onClick={handleDownload} style={{ marginTop: 20 }}>Download DOCX</button>
        </div>
    );
}
