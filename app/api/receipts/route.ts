import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"; // Import Clerk Auth

const prisma = new PrismaClient();

// 1. GET: Only fetch receipts belonging to the logged-in user
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const receipts = await prisma.receipt.findMany({
      where: {
        userId: userId, // <--- FILTER BY USER ID
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(receipts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// 2. POST: Save new receipt with the user's ID
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    const receipt = await prisma.receipt.create({
      data: {
        merchant: body.merchant,
        date: body.date,
        total: body.total,
        category: body.category,
        items: body.items, // Ensure your schema supports this (Json type or related model)
        userId: userId,    // <--- SAVE THE USER ID
        confidence: body.confidence,
      },
    });

    return NextResponse.json(receipt);
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// 3. DELETE: Allow deleting ONLY if the receipt belongs to the user
export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // Delete only if BOTH id matches AND userId matches
    const deleted = await prisma.receipt.deleteMany({
      where: {
        id: id,
        userId: userId, // <--- SECURITY CHECK
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Receipt not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// ... existing imports and code ...

// 4. UPDATE: Allow users to edit receipt details
export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, merchant, date, total, category } = body;

    const updatedReceipt = await prisma.receipt.update({
      where: {
        id: id,
        userId: userId, // Security: Ensure user owns this receipt
      },
      data: {
        merchant,
        date,
        total,
        category,
      },
    });

    return NextResponse.json(updatedReceipt);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 });
  }
}