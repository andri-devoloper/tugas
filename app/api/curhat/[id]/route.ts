import app from "@/lib/firebase/init";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

const db = getFirestore(app);

export async function DELETE(request: NextRequest) {
  try {
    // Get the 'id' parameter from the request URL
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Reference the document in Firestore using the ID
    const docRef = doc(db, "curhat", id);

    // Delete the document from Firestore
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
