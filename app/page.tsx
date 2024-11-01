"use client";

import React, { useState } from "react";

type FormData = {
  namaLengkap: string;
  noAbsen: string;
  kelas: string;
  file: File | null;
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    noAbsen: "",
    kelas: "",
    file: null,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("namaLengkap", formData.namaLengkap);
    formDataToSend.append("noAbsen", formData.noAbsen);
    formDataToSend.append("kelas", formData.kelas);
    if (formData.file) {
      formDataToSend.append("images", formData.file);
    }

    const response = await fetch("/api/tugas", {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);

      // Reset form hanya jika submit berhasil
      setFormData({
        namaLengkap: "",
        noAbsen: "",
        kelas: "",
        file: null,
      });
      window.location.href = "https://andev.my.id/";
    } else {
      console.error("Submit failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Masukkan Nama Lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">No Absen</label>
            <input
              type="text"
              name="noAbsen"
              value={formData.noAbsen}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Masukkan No Absen"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Kelas</label>
            <input
              type="text"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Masukkan Kelas"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
