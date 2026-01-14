"use client";

import { use } from "react";
import { ProDetailScreen } from "@/screens/pros/ProDetailScreen";

interface PageProps {
  params: Promise<{ proProfileId: string }>;
}

export default function AdminProDetailPage({ params }: PageProps) {
  const { proProfileId } = use(params);
  return <ProDetailScreen proProfileId={proProfileId} />;
}
