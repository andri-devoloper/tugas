'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface DataItem {
    namaLengkap: string;
    noAbsen: string;
    kelas: string;
    fileURL: string
    // Add any other properties you expect here
}
interface ApiResponse {
    status: number;
    message: string;
    data: DataItem[];
}

const ListTable: React.FC = () => {
    const [dataList, setDataList] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/tugas');
                const result: ApiResponse = await response.json();
                if (result.status === 200) {
                    setDataList(result.data);
                    // Extract unique classes
                    const classes = Array.from(new Set(result.data.map((item) => item.kelas)));
                    setUniqueClasses(classes);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                console.error(err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredDataList = selectedClass ? dataList.filter(data => data.kelas === selectedClass) : dataList;


    const totalPages = Math.ceil(filteredDataList.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDataList.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <section className="antialiased bg-gray-100 text-gray-600 h-screen px-10">
            <div className="flex flex-col pt-5 h-full">
                {/* Filter Dropdown */}
                <div className="mb-4">
                    <label htmlFor="classFilter" className="mr-2">Filter by Kelas:</label>
                    <select
                        id="classFilter"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="">Select Class</option> {/* Changed from "All Classes" to "Select Class" */}
                        {uniqueClasses.map((kelas) => (
                            <option key={kelas} value={kelas}>{kelas}</option>
                        ))}
                    </select>
                </div>
                {/* Table */}
                <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Daftar</h2>
                    </header>
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                    <tr>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">#</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Name</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">No Absen</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Kelas</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-center">Show</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {currentItems.map((data, index) => (
                                        <tr key={index}>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{index + 1}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{data.namaLengkap}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{data.noAbsen}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left font-medium text-green-500">{data.kelas}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <Link href={data.fileURL}>
                                                    {data.namaLengkap}
                                                </Link>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="mt-2 text-center">
                    Page {currentPage} of {totalPages}
                </div>
            </div>
        </section>
    );
};

export default ListTable;
