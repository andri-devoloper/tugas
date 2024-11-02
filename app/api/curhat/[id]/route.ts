import app from "@/lib/firebase/init";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";



const db = getFirestore(app);
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Ambil ID dari URL

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Referensi dokumen di Firestore berdasarkan ID
    const docRef = doc(db, "curhat", id);

    // Hapus dokumen dari Firestore
    await deleteDoc(docRef);

    return NextResponse.json(
      { status: 200, message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { status: 500, message: "Error deleting data", error },
      { status: 500 }
    );
  }
}
