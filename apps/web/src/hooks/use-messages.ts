"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyMessagesAction } from "@/lib/dashboard/actions";

export interface FeedbackAnswer {
  fieldId: string;
  label: string;
  fieldType: string;
  valueText: string | null;
  valueNumber: number | null;
  valueOptions: string[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  type: "FEEDBACK" | "INQUIRY";
  feedbackType: string | null;
  status: "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED";
  description: string;
  createdAt: string;
  productName: string;
  branchName: string | null;
  categoryName: string | null;
  ratingScore: number | null;
  answers: FeedbackAnswer[];
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanyMessagesAction();
      if (result.error) throw new Error(result.error);
      setMessages(result.items || []);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    refresh: fetchMessages,
  };
}
