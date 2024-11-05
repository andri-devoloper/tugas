// File: app/api/tugas/route.ts
import { retrieveData, retrieveDataById } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "@/lib/firebase/init"; // Impor default `app`

const db = getFirestore(app); // Inisialisasi Firestore
const storage = getStorage(app); // Inisialisasi Storage

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const detailProduct = await retrieveDataById("tugas", id);
    if (detailProduct) {
      return NextResponse.json({
        status: 200,
        message: "Success",
        data: detailProduct,
      });
    }
    return NextResponse.json({
      status: 404,
      message: "Not Found",
      data: {},
    });
  }

  const tugas = await retrieveData("tugas");

  return NextResponse.json({ status: 200, message: "Success", data: tugas });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const namaLengkap = formData.get("namaLengkap");
  const noAbsen = formData.get("noAbsen");
  const kelas = formData.get("kelas");
  const nilai = "0";
  const file = formData.get("images") as File | null;

  try {
    // Cek duplikat namaLengkap
    const tugasRef = collection(db, "tugas");
    const q = query(tugasRef, where("namaLengkap", "==", namaLengkap));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Jika duplikat ditemukan, kirim respons error
      return NextResponse.json({
        status: 409,
        message: "Nama Lengkap sudah digunakan",
        data: {},
      });
    }

    let fileURL = "";
    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      fileURL = await getDownloadURL(uploadResult.ref);
    }

    const data = { namaLengkap, noAbsen, kelas, nilai, fileURL };
    const docRef = await addDoc(collection(db, "tugas"), data);

    return NextResponse.json({
      status: 200,
      message: "Data saved successfully",
      data: { id: docRef.id, ...data },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error saving data",
      error,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { namaLengkap, nilai } = await request.json();

    // Cari dokumen yang cocok berdasarkan "namaLengkap"
    const tugasRef = collection(db, "tugas");
    const q = query(tugasRef, where("namaLengkap", "==", namaLengkap));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({
        status: 404,
        message: "Data not found",
      });
    }

    // Ambil ID dokumen dan perbarui data
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, "tugas", docId);

    await updateDoc(docRef, { namaLengkap, nilai });

    return NextResponse.json({
      status: 200,
      message: "Data updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error updating data",
      error,
    });
  }
}
