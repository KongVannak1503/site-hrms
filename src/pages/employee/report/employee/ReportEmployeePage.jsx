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
                                        children: [new TextRun({ text: "ព្រះរាជាណាចក្រកម្ពុជា", font: "Moul", size: 24 })],
                                        spacing: { before: 500, after: 200 },
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
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: 'ID', font: "Siemreap", size: 24 })],
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
                                children: [new TextRun({ text: "បុគ្គលិក", font: "Siemreap", size: 24 })],
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
                                children: [new TextRun({ text: "ភេទ", font: "Siemreap", size: 24 })],
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
                                children: [new TextRun({ text: "នាយកដ្ឋាន", font: "Siemreap", size: 24 })],

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
                                children: [new TextRun({ text: "តួនាទី", font: "Siemreap", size: 24 })],

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
                                children: [new TextRun({ text: "អ៊ីម៉ែល", font: "Siemreap", size: 24 })],

                            })
                        ],
                        margins: { top: 100, bottom: 100, left: 100, right: 10 }
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        shading: { fill: "D9E1F2" },
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "លេខទូរស័ព្ទ", font: "Siemreap", size: 24 })],

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
                                children: [new TextRun({ text: "ថ្ងៃចូលធ្វើការ", font: "Siemreap", size: 24 })],
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
                                children: [new TextRun({ text: "អ្នកគ្រប់គ្រង", font: "Siemreap", size: 24 })],

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
                                children: [new TextRun({ text: "ស្ថានភាព", font: "Siemreap", size: 24 })],
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
                        new TableCell({ verticalAlign: "center", children: [new Paragraph({ children: [new TextRun({ text: emp.employee_id.toString(), font: "Siemreap", size: 24 })], alignment: AlignmentType.CENTER })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp?.name_kh, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({
                            width: { size: 5, type: WidthType.PERCENTAGE }, // keep consistent
                            verticalAlign: "center",
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: emp.gender, font: "Siemreap", size: 24 })
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    style: "NoWrap" // prevent auto-expand
                                })
                            ]
                        }),

                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp?.positionId?.department.title_kh, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp.positionId?.title_kh, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, children: [new Paragraph({ children: [new TextRun({ text: emp.email, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({ verticalAlign: "center", margins: { top: 100, bottom: 100, left: 50, right: 10 }, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.phone, font: "Siemreap", size: 24 })] })] }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: { top: 100, bottom: 100, left: 50, right: 10 },
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: new Date(emp.joinDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',   // 16
                                        month: 'short',   // Aug
                                        year: 'numeric'   // 2025
                                    }), font: "Siemreap", size: 24
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
                                            size: 24
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
                                        new TextRun({ text: getStatusName(emp.status), font: "Siemreap", size: 24 })
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
                                            text: "Address: Wat Bo Village, SangKat Salakamroek, Siem Reap Municipality, Cambodia (Opposite Angkor High School)",
                                            font: "Times New Roman",
                                            size: 20,
                                        })],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: "Website: www.usea.edu.kh | Email: info@usea.edu.kh | Facebook: University of South-East Asia",
                                            font: "Times New Roman",
                                            size: 20,
                                        })],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: "Tel: 063 900 090, 092 42 99 66, 077 6678 73",
                                            font: "Times New Roman",
                                            size: 20,
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

        // Build raw data (including header row)
        const worksheetData = [
            [
                "ID",
                "បុគ្គលិក",
                "ភេទ",
                "នាយកដ្ឋាន",
                "តួនាទី",
                "អ៊ីម៉ែល",
                "លេខទូរស័ព្ទ",
                "ថ្ងៃចូលធ្វើការ",
                "អ្នកគ្រប់គ្រង",
                "ស្ថានភាព"
            ],
            ...filteredData.map(emp => [
                emp.employee_id ?? "",
                emp.name_kh ?? "",
                emp.gender ?? "",
                emp?.positionId?.department?.title_kh ?? "",
                emp?.positionId?.title_kh ?? "",
                emp.email ?? "",
                emp.phone ?? "",
                emp.joinDate ? new Date(emp.joinDate).toLocaleDateString("en-GB") : "",
                emp?.positionId?.department?.manager?.map(m => m.name_kh).join(", ") ?? "",
                getStatusName(emp.status) ?? "",
            ])
        ];

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Apply styles to header row (row 1)
        const headerStyle = {
            fill: { fgColor: { rgb: "D9E1F2" } }, // light blue background
            font: { bold: true, color: { rgb: "000000" }, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1"]; // Include last column
        headerCells.forEach(cell => {
            if (worksheet[cell]) worksheet[cell].s = headerStyle;
        });

        // Create workbook and append sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

        // Write file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "employee_report.xlsx");
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
                                handleSearch(searchValue, dates); // use current text input
                            }}
                            format="YYYY-MM-DD"
                        />
                        <Select
                            placeholder="Select Department"
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
                        <button onClick={handleDownloadPDF} className={`${Styles.btnPrint}`}> <PrinterOutlined /> {`${content['print'] || 'Print'}`}</button>
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
