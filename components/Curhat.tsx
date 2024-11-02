'use client'

import React, { useEffect, useState } from 'react';

interface DataItem {
    curhat: string;
    id: string;
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
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/curhat');
                const result: ApiResponse = await response.json();
                if (result.status === 200) {
                    setDataList(result.data);
                    // Extract unique classes
                    // const classes = Array.from(new Set(result.data.map((item) => item.kelas)));
                    // setUniqueClasses(classes);
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

    const handleDelete = async (id: string) => {
        setLoadingId(id);
        try {
            const response = await fetch(`/api/curhat/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Filter out the deleted item from the state
                setDataList(dataList.filter((item) => item.id !== id));
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setLoadingId(null); // Reset loading setelah selesai
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataList.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    return (
        <section className="antialiased bg-gray-100 text-gray-600 h-screen px-10">
            <div className="flex flex-col pt-5 h-full">

                {/* Table */}
                <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Curhat</h2>
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
                                            <div className="font-semibold text-left">Diskrisi</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Aksi</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {currentItems.map((data, index) => (
                                        <tr key={index}>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{indexOfFirstItem + index + 1}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-left">{data.curhat}</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap w-md">
                                                {loadingId === data.id ? (
                                                    <div className="w-md py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75">Loading...</div> // Animasi loading sederhana
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(data.id)}
                                                        className="w-md py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="mt-4 flex justify-center">
                            {Array.from({ length: Math.ceil(dataList.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ListTable;
