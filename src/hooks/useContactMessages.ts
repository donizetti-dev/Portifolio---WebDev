import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContactMessage,
  getContactMessages,
  toggleMessageImportant,
  toggleMessageReplied,
} from '../services/dataService';
import type { ContactMessage, CreateContactMessageInput, MessageFilter } from '../types';

export const CONTACT_MESSAGES_QUERY_KEY = ['portfolio', 'contact-messages'] as const;

export type ToggleMessageParam = string | { id: string; nextValue?: boolean };

function resolveToggleParam(param: ToggleMessageParam): { id: string; nextValue?: boolean } {
  if (typeof param === 'string') {
    return { id: param };
  }
  return param;
}

export function useContactMessages(filter: MessageFilter = 'all') {
  const queryClient = useQueryClient();

  const query = useQuery<ContactMessage[], Error>({
    queryKey: CONTACT_MESSAGES_QUERY_KEY,
    queryFn: getContactMessages,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation<ContactMessage, Error, CreateContactMessageInput>({
    mutationFn: createContactMessage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY });
    },
  });

  const toggleRepliedMutation = useMutation<ContactMessage, Error, ToggleMessageParam>({
    mutationFn: (param) => {
      const { id, nextValue } = resolveToggleParam(param);
      return toggleMessageReplied(id, nextValue);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY });
    },
  });

  const toggleImportantMutation = useMutation<ContactMessage, Error, ToggleMessageParam>({
    mutationFn: (param) => {
      const { id, nextValue } = resolveToggleParam(param);
      return toggleMessageImportant(id, nextValue);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY });
    },
  });

  const allMessages = useMemo<ContactMessage[]>(() => query.data ?? [], [query.data]);

  const filteredMessages = useMemo<ContactMessage[]>(() => {
    switch (filter) {
      case 'replied':
      case 'answered':
        return allMessages.filter((msg) => msg.is_replied || msg.is_answered);
      case 'unreplied':
      case 'unanswered':
        return allMessages.filter((msg) => !msg.is_replied && !msg.is_answered);
      case 'important':
        return allMessages.filter((msg) => msg.is_important);
      case 'all':
      default:
        return allMessages;
    }
  }, [allMessages, filter]);

  const stats = useMemo(() => {
    const total = allMessages.length;
    const replied = allMessages.filter((msg) => msg.is_replied || msg.is_answered).length;
    const unreplied = total - replied;
    const important = allMessages.filter((msg) => msg.is_important).length;
    return {
      total,
      replied,
      answered: replied,
      unreplied,
      unanswered: unreplied,
      important,
    };
  }, [allMessages]);

  return {
    messages: filteredMessages,
    allMessages,
    stats,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createMessage: createMutation.mutateAsync,
    sendMessage: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isSubmitting: createMutation.isPending,
    isCreateSuccess: createMutation.isSuccess,
    createError: createMutation.error,
    resetCreateState: createMutation.reset,
    toggleReplied: toggleRepliedMutation.mutateAsync,
    toggleAnswered: toggleRepliedMutation.mutateAsync,
    toggleImportant: toggleImportantMutation.mutateAsync,
    isUpdating: toggleRepliedMutation.isPending || toggleImportantMutation.isPending,
  };
}

export default useContactMessages;
