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
import { typeEmpStatusOptions } from "../../../../data/Type";
import { getDepartmentsApi } from "../../../../services/departmentApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getReportRecruitmentApi } from "../../../../services/reportApi";
import * as XLSX from "xlsx";

export default function ReportAppraisalPage() {
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
        { breadcrumbName: `${content['report']}${content['recruiter']}` }
    ];
    useEffect(() => {
        document.title = `${content['report']}${content['recruiter']} | USEA`;
        const fetchData = async () => {
            try {
                const response = await getReportRecruitmentApi();
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

    const handleSearch = (value = '', dates = [], dept = null) => {
        const term = value.trim().toLowerCase();

        // If no search term, no date range, and no department, show all users
        if (!term && (!dates || dates.length === 0) && !dept) {
            setFilteredData(users);
            return;
        }

        const filtered = users.filter((emp) => {
            // Text filter
            const matchesText =
                !term ||
                (emp.first_name_en || '').toLowerCase().includes(term) ||
                (emp.first_name_kh || '').toLowerCase().includes(term) ||
                (emp.last_name_en || '').toLowerCase().includes(term) ||
                (emp.last_name_kh || '').toLowerCase().includes(term);

            // Date filter
            let matchesDate = true;
            if (dates && dates.length === 2 && emp.applied_date) {
                const start = dates[0].startOf('day').toDate();
                const end = dates[1].endOf('day').toDate();
                const appliedDate = new Date(emp.applied_date);
                matchesDate = appliedDate >= start && appliedDate <= end;
            }

            // Department filter
            let matchesDept = true;
            if (dept) {
                matchesDept = String(emp?.department) === String(dept);
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
                                children: [new TextRun({ text: 'ល.រ', font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,

                            })
                        ],
                        rowSpan: 2,
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: 'គោត្តនាម-នាម', font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,

                            })
                        ],
                        rowSpan: 2,
                        width: {
                            size: 15, type: WidthType.PERCENTAGE
                        },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "ភេទ", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        rowSpan: 2,
                        width: { size: 5, type: WidthType.PERCENTAGE },
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
                        rowSpan: 2,
                        width: { size: 15, type: WidthType.PERCENTAGE },
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
                        rowSpan: 2,
                        width: { size: 12, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),

                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "លទ្ធផលវាយតម្លៃ", font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,
                            })
                        ],
                        columnSpan: 2,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),

                ]
            });
            const headerRow2 = new TableRow({
                children: [
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: 'ស្វ័យរង្វាយតម្លៃ', font: "Siemreap", size: 24, color: "#002060", bold: true })],
                                alignment: AlignmentType.CENTER,

                            })
                        ],
                        width: {
                            size: 12, type: WidthType.PERCENTAGE
                        },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "អ្នកគ្រប់គ្រងវាយតម្លៃ", font: "Siemreap", size: 24, color: "#002060", bold: true })],

                            })
                        ],
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                ],
            });
            // Employee rows (same style)
            const rows = filteredData.map((emp, index) =>
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: "center", children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString(), font: "Siemreap", size: 24, color: "#002060", })], alignment: AlignmentType.CENTER })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp?.full_name_kh, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({ verticalAlign: "center", children: [new Paragraph({ children: [new TextRun({ text: "ប្រុស", font: "Siemreap", size: 24, color: "#002060", })], alignment: AlignmentType.CENTER })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp?.email, font: "Siemreap", size: 24, color: "#002060", })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, width: { size: 5000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: emp?.phone_no, font: "Siemreap", size: 24, color: "#002060", })] })] }),

                        new TableCell({
                            verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({
                                children: [new TextRun({
                                    text: "500"
                                    , font: "Siemreap", size: 24, color: "#002060",
                                })],
                                alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: { top: 100, bottom: 100, left: 50, right: 10 },
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: "500"
                                    , font: "Siemreap", size: 24, color: "#002060",
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),

                    ]
                })
            );

            const employeeTable = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [headerRow, headerRow2, ...rows]
            });

            const doc = new Document({
                sections: [
                    {
                        properties: { page: { size: { orientation: PageOrientation.PORTRAIT } } },
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

    const handleDownloadExcel = () => {
        if (!filteredData || filteredData.length === 0) return;

        // 1. Prepare header row
        const headerRow = [
            "នាយកដ្ឋាន",       // Department
            "មុខតំណែងដាក់ពាក្យ", // Job Title
            "អ្នកដាក់ពាក្យ",     // Applicant Name
            "ភេទ",             // Gender
            "ថ្ងៃដាក់ពាក្យ",   // Applied Date
            "អ៊ីម៉ែល",          // Email
            "លេខទូរស័ព្ទ",   // Phone
            "ស្ថានភាព"         // Status
        ];

        // 2. Build data rows
        const dataRows = filteredData.map(emp => [
            emp.department ?? "",
            emp.job_title ?? "",
            emp.full_name_kh ?? "",
            emp.gender ?? "",
            emp.applied_date
                ? new Date(emp.applied_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : "",
            emp.email ?? "",
            emp.phone_no ?? "",
            emp.status ?? ""
        ]);

        const worksheetData = [headerRow, ...dataRows];

        // 3. Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // 4. Apply header style (light blue background, bold, centered)
        const headerCells = Object.keys(worksheet).filter(cell => cell.startsWith("A1") || cell.startsWith("B1") || cell.startsWith("C1") || cell.startsWith("D1") || cell.startsWith("E1") || cell.startsWith("F1") || cell.startsWith("G1") || cell.startsWith("H1"));
        headerCells.forEach(cell => {
            if (worksheet[cell]) {
                worksheet[cell].s = {
                    fill: { fgColor: { rgb: "D9E1F2" } },
                    font: { bold: true, color: { rgb: "000000" }, sz: 12 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    }
                };
            }
        });

        // 5. Set column widths for Khmer text
        worksheet['!cols'] = [
            { wch: 20 }, // Department
            { wch: 25 }, // Job Title
            { wch: 25 }, // Applicant Name
            { wch: 10 }, // Gender
            { wch: 15 }, // Applied Date
            { wch: 25 }, // Email
            { wch: 15 }, // Phone
            { wch: 15 }, // Status
        ];

        // 6. Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");

        // 7. Save file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "employee_report.xlsx");
    };

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
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['report']}</p>
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
                                handleSearch(searchValue, dates);
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
                                <Select.Option key={dept.title_kh} value={dept.title_kh}>
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
                        id="docx-preview"
                        className="docx-preview"
                        style={{ minWidth: '800px' }}
                    />
                </div>
            </div>
        </div >
    );
}
