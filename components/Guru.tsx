'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface DataItem {
    namaLengkap: string;
    noAbsen: string;
    kelas: string;
    fileURL: string
    nilai: string
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
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/tugas');
                const result: ApiResponse = await response.json();
                if (result.status === 200) {
                    setDataList(result.data);
                    // Extract unique classes
                    const classes = Array.from(new Set(result.data.map(item => item.kelas)));
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

    const filteredDataList = selectedClass ? dataList.filter(item => item.kelas === selectedClass) : dataList;

    const handleEdit = (index: number, value: string) => {
        setEditIndex(index);
        setEditValue(value);
    };

    const handleInputChange = (value: string) => {
        setEditValue(value);
    };


    const handleSave = async () => {
        if (editIndex === null) return;

        try {
            const updatedDataList = [...dataList];
            updatedDataList[editIndex].nilai = editValue;
            setDataList(updatedDataList);

            const updatedItem = updatedDataList[editIndex];
            const response = await fetch('/api/tugas', {
                method: 'PUT',
                body: JSON.stringify(updatedItem),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 200) {
                console.log('Data updated successfully');
                setEditIndex(null); // Selesai mengedit
            } else {
                console.error('Error updating data:', result.message);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    return (
        <section className="antialiased bg-gray-100 text-gray-600 h-screen px-10">
            <div className="flex flex-col pt-5 h-full">
                {/* Dropdown untuk memilih kelas */}
                <div className="mb-4">
                    <label htmlFor="classDropdown" className="mr-2 font-semibold">Pilih Kelas:</label>
                    <select
                        id="classDropdown"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">Semua Kelas</option>
                        {uniqueClasses.map((kelas, index) => (
                            <option key={index} value={kelas}>
                                {kelas}
                            </option>
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
                                            <div className="font-semibold text-left">Nilai</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-center">Show</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {filteredDataList.map((data, index) => (
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
                                                {editIndex === index ? (
                                                    <input
                                                        type="number"
                                                        className="text-left font-medium text-green-500"
                                                        value={editValue}
                                                        onChange={(e) => handleInputChange(e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="text-left font-medium text-green-500">
                                                        {data.nilai}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                {editIndex === index ? (
                                                    <button
                                                        onClick={handleSave}
                                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(index, data.nilai)}
                                                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
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

            </div>
        </section>
    );
};

export default ListTable;
