import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

type Props = {
  channelId: Id<'channels'>
}

export const useGetChannel = ({ channelId }: Props) => {
  const data = useQuery(api.channels.getById, { id: channelId })
  const isLoading = data === undefined

  return { data, isLoading }
}
