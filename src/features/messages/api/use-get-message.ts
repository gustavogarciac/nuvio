import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

type Props = {
  messageId: Id<'messages'>
}

export const useGetMessage = ({ messageId }: Props) => {
  const data = useQuery(api.messages.getById, { id: messageId })
  const isLoading = data === undefined

  return { data, isLoading }
}
