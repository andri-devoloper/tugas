import { NextRequest, NextResponse } from "next/server";
import app from "@/lib/firebase/init";
import {
  collection,
  addDoc,
  getFirestore,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { retrieveData, retrieveDataById } from "@/lib/firebase/service";

const db = getFirestore(app);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const detailProduct = await retrieveDataById("curhat", id);
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

  const tugas = await retrieveData("curhat");

  return NextResponse.json({ status: 200, message: "Success", data: tugas });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const curhat = formData.get("curhat") as string | null;

    if (!curhat) {
      return NextResponse.json(
        { status: 400, message: "Field curhat harus diisi" },
        { status: 400 }
      );
    }

    const data = { curhat };
    const docRef = await addDoc(collection(db, "curhat"), data);

    return NextResponse.json({
      status: 200,
      message: "Curhat berhasil diterima",
      data: { id: docRef.id, ...data },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Error saving data",
      error: error.message || "Terjadi kesalahan yang tidak terduga",
    });
  }
}

