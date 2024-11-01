import { retrieveData, retrieveDataById } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/lib/firebase/init";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const detailProduct = await retrieveDataById("tugas", id);
    if (detailProduct) {
      return NextResponse.json({
        status: 200,
        message: 200,
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
  const file = formData.get("images") as File | null;

  try {
    const db = getFirestore();
    const storage = getStorage();

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

    const data = { namaLengkap, noAbsen, kelas, fileURL };
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
