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
    PageOrientation,
    Footer,
    PageNumber
} from "docx";
import { ExceptionOutlined, FileTextOutlined, FileWordFilled, FormOutlined, PlusOutlined, PrinterOutlined, RightCircleOutlined } from '@ant-design/icons';
import { saveAs } from "file-saver";
import { renderAsync } from "docx-preview";
import Logo from "../../../../assets/log_usea.png";
import { useAuth } from "../../../../contexts/AuthContext";
import CustomBreadcrumb from "../../../../components/breadcrumb/CustomBreadcrumb";
import { Styles } from '../../../../utils/CsStyle';
import { Button, Input, DatePicker, Select } from "antd";
import { getEmployeesApi } from "../../../../services/employeeApi";
import { typeEmpStatusOptions } from "../../../../data/Type";
import moment from "moment";
import { getDepartmentsApi } from "../../../../services/departmentApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getReportEmployeesApi } from "../../../../services/reportApi";
import * as XLSX from "xlsx";
import { formatDate } from "../../../../utils/utils";

export default function ReportEmployeePage() {
    const { content, language } = useAuth()
    const previewRef = useRef(null);
    const [docBlob, setDocBlob] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const { RangePicker } = DatePicker;
    const [searchValue, setSearchValue] = useState("");
    const [selectedDept, setSelectedDept] = useState(null);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: `${content['report']}${content['Employee']}` }
    ];
    useEffect(() => {
        document.title = `${content['report']}${content['Employee']} | USEA`;
        const fetchData = async () => {
            try {
                const response = await getReportEmployeesApi();
                console.log(response);

                const res = await getDepartmentsApi();
                setDepartments(res);

                if (Array.isArray(response)) {
                    setUsers(response);
                    setFilteredData(response);
                } else {
                    console.error('Data is not an array:', response);
                    setUsers([]);
                    setFilteredData([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [content]);

    const getStatusName = (statusId) => {
        const found = typeEmpStatusOptions.find(opt => opt.id === statusId);
        if (!found) return "";
        return found.name_kh;
    };

    const handleSearch = (value, dates, dept = selectedDept) => {
        const term = value?.trim().toLowerCase() || "";

        // If no search term, no date range, and no department, show all users
        if (!term && (!dates || dates.length === 0) && !dept) {
            setFilteredData(users);
            return;
        }

        const filtered = users.filter((emp) => {
            // Text filter
            const matchesText =
                (emp.first_name_en || '').toLowerCase().includes(term) ||
                (emp.first_name_kh || '').toLowerCase().includes(term) ||
                (emp.last_name_en || '').toLowerCase().includes(term) ||
                (emp.last_name_kh || '').toLowerCase().includes(term);

            // Date filter
            let matchesDate = true;
            if (dates && dates.length === 2) {
                const start = dates[0].startOf('day').toDate();
                const end = dates[1].endOf('day').toDate();
                const joinDate = new Date(emp.joinDate);
                matchesDate = joinDate >= start && joinDate <= end;
            }

            // Department filter
            let matchesDept = true;
            if (dept) {
                matchesDept = String(emp?.positionId?.department?._id) === String(dept);
            }

            return matchesText && matchesDate && matchesDept;
        });

        setFilteredData(filtered);
    };





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
                                        children: [new TextRun({ text: "ព្រះរាជាណាចក្រកម្ពុជា", font: "Moul", size: 24, color: "#002060", })],
                                        spacing: { before: 500, after: 200 },
                                        alignment: AlignmentType.CENTER
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({ text: "ជាតិ សាសនា ព្រះមហាក្សត្រ", font: "Moul", size: 24, color: "#002060", })],
                                        alignment: AlignmentType.CENTER
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "\u0033",   // second icon (replace with correct Unicode for your icon)
                                                font: "Tacteing",
                                                size: 32,
                                                color: "#002060",
                                            }),
                                            new TextRun({
                                                text: "\u0032",   // first icon
                                                font: "Tacteing",
                                                size: 32,
                                                color: "#002060",
                                            }),
                                            new TextRun({
                                                text: "\u0033",   // second icon (replace with correct Unicode for your icon)
                                                font: "Tacteing",
                                                size: 32,
                                                color: "#002060",
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),

                                    new Paragraph({
                                        children: [new ImageRun({ data: logoBuffer, transformation: { width: 80, height: 80 } })],
                                        alignment: AlignmentType.LEFT,
                                        indent: { left: 1800 },
                                        spacing: { before: 0, after: 0 }
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({ text: "សាកលវិទ្យាល័យ សៅស៍អ៊ីសថ៍អេយសៀ", font: "Moul", size: 24, color: "#002060", })],
                                        alignment: AlignmentType.LEFT
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({ text: "UNIVERSITY OF SOUTH-EAST ASIA", font: "Times New Roman", size: 22, color: "#002060", })],
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
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: 'ID', font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,

                            })
                        ],
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "បុគ្គលិក", font: "Siemreap", size: 24, color: "#002060", bold: true })],
                            })
                        ],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "ភេទ", font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,
                            })
                        ],
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "នាយកដ្ឋាន", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "តួនាទី", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        width: { size: 12, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "អ៊ីម៉ែល", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "លេខទូរស័ព្ទ", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "ថ្ងៃចូលធ្វើការ", font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,

                            })
                        ],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 },
                        style: "NoWrap"
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "អ្នកគ្រប់គ្រង", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "ស្ថានភាព", font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,
                                // remove style: "NoWrap"
                            })
                        ],
                        width: { size: 10, type: WidthType.PERCENTAGE }, // keep this
                        margins: { top: 100, bottom: 100, left: 100, right: 10 },
                    }),
                ]
            });


            // Employee rows (same style)
            const rows = filteredData.map(emp =>
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: "center", children: [new Paragraph({ children: [new TextRun({ text: emp.employee_id.toString(), font: "Siemreap", size: 24, color: "#002060", })], alignment: AlignmentType.CENTER })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp?.name_kh, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({
                            width: { size: 5, type: WidthType.PERCENTAGE }, // keep consistent
                            verticalAlign: "center",
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: emp.gender, font: "Siemreap", size: 24, color: "#002060", })
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    style: "NoWrap" // prevent auto-expand
                                })
                            ]
                        }),

                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp?.positionId?.department.title_kh, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp.positionId?.title_kh, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp.email, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.phone, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: { top: 100, bottom: 100, left: 50, right: 10 },
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: new Date(emp.joinDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',   // 16
                                        month: 'short',   // Aug
                                        year: 'numeric'   // 2025
                                    }), font: "Siemreap", size: 24, color: "#002060",
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: { top: 100, bottom: 100, left: 50, right: 10 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: emp.positionId?.department?.manager?.map(m => m.name_kh).join(', ') || '',
                                            font: "Siemreap",
                                            size: 24,
                                            color: "#002060"
                                        })
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: { top: 100, bottom: 100, left: 100, right: 10 },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: getStatusName(emp.status), font: "Siemreap", size: 24, color: "#002060", })
                                    ],
                                    alignment: AlignmentType.CENTER
                                })
                            ]
                        })

                    ]
                })
            );

            const employeeTable = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [headerRow, ...rows],
            });

            const doc = new Document({
                sections: [
                    {
                        properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
                        footers: {
                            default: new Footer({
                                children: [
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: "អាសយដ្ឋានៈ ភូមិវត្តបូព៌ សង្កាត់សាលាកំរើក ក្រុងសៀមរាប ខេត្តសៀមរាប(ទល់មុខវិទ្យាល័យ អង្គរ)",
                                            font: "Siemreap",
                                            size: 16, color: "#002060",
                                        })],
                                        spacing: {
                                            before: 300,  // space before paragraph (in twentieths of a point, 200 = 10pt)
                                        },
                                        alignment: AlignmentType.CENTER,
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: "ទូរស័ព្ទៈ ០៦៣ ៩០០ ០៩០ - ០១៧ ៣៨៦ ៦៧៨ - ០៩០ ៩០៥ ៩០២ - ០៧០ ៤០៨ ៤៣៨",
                                            font: "Siemreap",
                                            size: 16, color: "#002060",
                                        })],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: "គេហទំព័រៈ www.usea.edu.kh  អ៊ីម៉ែលៈ info@usea.edu.kh ហ្វេសប៊ុកៈ University of South-East ",
                                            font: "Siemreap",
                                            size: 16, color: "#002060",
                                        })],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                        },

                        children: [
                            headerTable,
                            new Paragraph({ text: "", spacing: { after: 200 } }),
                            employeeTable
                        ],

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
    }, [filteredData]);

    const handleDownload = () => {
        if (docBlob) {
            saveAs(docBlob, "employee_report.docx");
        }
    };

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;

        // Convert preview DOM to canvas
        const canvas = await html2canvas(previewRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Create jsPDF instance (landscape)
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("employee_report.pdf");
    };

    // ... (rest of the component code above handleDownloadExcel)

    const handleDownloadExcel = () => {
        if (!filteredData || filteredData.length === 0) return;

        // Helper function for date formatting (assuming it exists elsewhere, 
        // using a basic version here for compilation safety based on your usage)
        const formatDate = (dateString) => {
            if (!dateString) return "";
            return new Date(dateString).toLocaleDateString("en-GB");
        };

        // Total columns = 22 (A to V)
        // Single-column headers are A to N (14 columns, indices 0-13)
        // Current Address merge is O1:R1 (indices 14-17)
        // Birth Address merge is S1:V1 (indices 18-21)


        // Row 1: Main Headers (22 elements total)
        const headerRow1 = [
            "ID",                   // A1 (0)
            "បុគ្គលិក",             // B1 (1)
            "ភេទ",                  // C1 (2)
            "ថ្ងៃ ខែ ឆ្នាំកំណើត",    // D1 (3)
            "សញ្ជាតិ",              // E1 (4)
            "លេខអត្តសញ្ញាណប័ណ្ណ", // F1 (5)
            "លេខលិខិតឆ្លងដែន",    // G1 (6)
            "នាយកដ្ឋាន",            // H1 (7)
            "តួនាទី",               // I1 (8)
            "អ៊ីម៉ែល",              // J1 (9)
            "លេខទូរស័ព្ទ",          // K1 (10)
            "ថ្ងៃចូលធ្វើការ",        // L1 (11)
            "អ្នកគ្រប់គ្រង",         // M1 (12)
            "ស្ថានភាព",             // N1 (13)
            "អាសយដ្ឋានបច្ចុប្បន្ន", "", "", "", // O1 (14) - R1 (17) merged
            "អាសយដ្ឋានកំណើត", "", "", ""     // S1 (18) - V1 (21) merged
        ];

        // Row 2: Sub-Headers (22 elements total)
        const headerRow2 = [
            // Blanks for the 14 single-column headers (A2 to N2)
            "", "", "", "", "", "", "", "", "", "", "", "", "", "",
            // Current Address details (O2 to R2)
            "ទីក្រុង/ខេត្ត", "ស្រុក/ខណ្ឌ", "ឃុំ/សង្កាត់", "ភូមិ",
            // Birth Address details (S2 to V2)
            "ទីក្រុង/ខេត្ត", "ស្រុក/ខណ្ឌ", "ឃុំ/សង្កាត់", "ភូមិ"
        ];

        const worksheetData = [
            headerRow1,
            headerRow2,
            ...filteredData.map(emp => [
                emp.employee_id ?? "",
                emp.name_kh ?? "",
                emp.gender ?? "",
                formatDate(emp.date_of_birth) ?? "",
                emp.nationality ?? "",
                emp.id_card_no ?? "",
                emp.passport_no ?? "",
                emp?.positionId?.department?.title_kh ?? "",
                emp?.positionId?.title_kh ?? "",
                emp.email ?? "",
                emp.phone ?? "",
                emp.joinDate ? new Date(emp.joinDate).toLocaleDateString("en-GB") : "",
                emp?.positionId?.department?.manager?.map(m => m.name_kh).join(", ") ?? "",
                getStatusName(emp.status) ?? "",
                // Current Address details (starts at column O, index 14)
                emp?.city?.name ?? "",
                emp?.district ?? "",
                emp?.community ?? "",
                emp?.village ?? "",
                // Birth Address details (starts at column S, index 18)
                emp?.present_present_city?.name ?? "",
                emp?.present_district ?? "",
                emp?.present_community ?? "",
                emp?.present_village ?? ""
            ])
        ];

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // --- Merging Logic ---

        // 1. Merge all single-column headers (A1 to N1) to span two rows (A1:A2, B1:B2, etc.)
        const singleColumnMerges = [];
        // Columns A (index 0) through N (index 13)
        for (let c = 0; c <= 13; c++) {
            singleColumnMerges.push({ s: { r: 0, c: c }, e: { r: 1, c: c } }); // Merge row 0 (1) and row 1 (2)
        }

        // 2. Merge the two address headers to span four columns (one row each)
        const addressHeaderMerges = [
            // Current Address: O1:R1 (indices 14 to 17)
            { s: { r: 0, c: 14 }, e: { r: 0, c: 17 } },
            // Birth Address: S1:V1 (indices 18 to 21)
            { s: { r: 0, c: 18 }, e: { r: 0, c: 21 } }
        ];

        worksheet["!merges"] = [
            ...singleColumnMerges,
            ...addressHeaderMerges
        ];

        // --- Styling Logic ---

        // Define the style for ALL header cells (both row 1 and row 2)
        const headerStyle = {
            fill: { fgColor: { rgb: "D9E1F2" } },
            font: { bold: true, color: { rgb: "000000" }, sz: 12 },
            // Ensures centering, both horizontally and vertically
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        // Loop up to 21 (index 0 to 21 = 22 columns total)
        const totalColumns = 21;

        // Apply the style to ALL header cells in both rows (A1 to V2)
        for (let r = 0; r <= 1; r++) {
            for (let c = 0; c <= totalColumns; c++) {
                const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
                // Ensure the cell object exists before applying style
                if (!worksheet[cellRef]) {
                    worksheet[cellRef] = { v: worksheetData[r][c] || "" };
                }
                worksheet[cellRef].s = headerStyle;
            }
        }

        // Set column widths for a better visual output
        worksheet["!cols"] = [
            { wch: 5 },  // A - ID
            { wch: 15 }, // B - បុគ្គលិក
            { wch: 5 },  // C - ភេទ
            { wch: 15 }, // D - ថ្ងៃ ខែ ឆ្នាំកំណើត
            { wch: 10 }, // E - សញ្ជាតិ
            { wch: 15 }, // F - លេខអត្តសញ្ញាណប័ណ្ណ
            { wch: 15 }, // G - លេខលិខិតឆ្លងដែន
            { wch: 15 }, // H - នាយកដ្ឋាន
            { wch: 15 }, // I - តួនាទី
            { wch: 20 }, // J - អ៊ីម៉ែល
            { wch: 15 }, // K - លេខទូរស័ព្ទ
            { wch: 12 }, // L - ថ្ងៃចូលធ្វើការ
            { wch: 15 }, // M - អ្នកគ្រប់គ្រង
            { wch: 10 }, // N - ស្ថានភាព
            // Current Address Details (O-R)
            { wch: 10 }, // O - ទីក្រុង/ខេត្ត
            { wch: 10 }, // P - ស្រុក/ខណ្ឌ
            { wch: 10 }, // Q - ឃុំ/សង្កាត់
            { wch: 10 }, // R - ភូមិ
            // Birth Address Details (S-V)
            { wch: 10 }, // S - ទីក្រុង/ខេត្ត
            { wch: 10 }, // T - ស្រុក/ខណ្ឌ
            { wch: 10 }, // U - ឃុំ/សង្កាត់
            { wch: 10 }  // V - ភូមិ
        ];


        // Create workbook and append sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

        // Write file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "employee_report.xlsx");
    };
    // ... (rest of the component code below handleDownloadExcel)


    const handlePrintPDF = async () => {
        if (!previewRef.current) return;

        const canvas = await html2canvas(previewRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.autoPrint();
        window.open(pdf.output("bloburl")); // opens PDF without browser header/footer
    };
    return (
        <div style={{ padding: 20, paddingTop: 0 }}>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['report']}{content['spaceKh']}{content['employee']}</p>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>
            <div
                className="border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    borderRadius: 8,
                    marginTop: 10,
                    overflowX: 'auto'
                }}
            >
                <div className='block sm:flex justify-between items-center mb-4'>
                    <div className="flex gap-4">
                        <RangePicker
                            onChange={(dates) => {
                                setDateRange(dates);
                                handleSearch(searchValue, dates); // use current text input
                            }}
                            format="YYYY-MM-DD"
                            placeholder={[content['startDate'], content['endDate']]}
                        />
                        <Select
                            placeholder={`${content['select']}${content['spaceKh']}${content['department']}`}
                            allowClear
                            style={{ width: 200 }}
                            value={selectedDept || undefined}
                            onChange={(value) => {
                                setSelectedDept(value);
                                handleSearch(searchValue, dateRange, value);
                            }}
                        >
                            {departments.map((dept) => (
                                <Select.Option key={dept._id} value={dept._id}>
                                    {dept.title_kh}
                                </Select.Option>
                            ))}
                        </Select>

                    </div>
                    <div className='flex items-center gap-3'>
                        <button onClick={handleDownload} className={`${Styles.btnWord}`}> <FileWordFilled /> {`${content['word'] || 'Word'}`}</button>
                        <button onClick={handleDownloadExcel} className={`${Styles.btnExcel}`}>
                            <ExceptionOutlined /> {`${content['excel'] || 'Excel'}`}
                        </button>
                        <button onClick={handlePrintPDF} className={`${Styles.btnPrint}`}> <PrinterOutlined /> {`${content['print'] || 'Print'}`}</button>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <div
                        ref={previewRef}
                        className="docx-preview"
                        style={{ minWidth: '1200px' }}
                    />
                </div>
            </div>
        </div >
    );
}
