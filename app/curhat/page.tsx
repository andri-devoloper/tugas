'use client'

import { useState } from "react"

type FormData = {
    curhat: string
}
export default function Curhat() {
    const [formData, setFormData] = useState<FormData>({
        curhat: ""
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("curhat", formData.curhat);

        try {
            const response = await fetch("/api/curhat", {
                method: "POST",
                body: formDataToSend,
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result);

                // Reset form hanya jika submit berhasil
                setFormData({
                    curhat: ''
                });
            } else {
                console.error("Submit failed");
            }
        } catch (error) {
            console.error("Error occurred while submitting:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-4xl w-full mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-red-300s">
                        <div className="w-full ">
                            <label
                                htmlFor="message"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Your message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                name="curhat"
                                value={formData.curhat}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                style={{ width: "100%" }}
                                placeholder="Your message..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-md py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                        >
                            {loading ? (
                                <span>
                                    <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                                        </path>
                                    </svg>
                                    loading
                                </span>
                            ) : (
                                "Upload"
                            )}
                        </button>
                    </form >
                </div>
            </div >
        </>
    )
}
