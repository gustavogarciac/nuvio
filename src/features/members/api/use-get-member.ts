import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

interface Props {
  memberId: Id<'members'>
}

export const useGetMember = ({ memberId }: Props) => {
  const data = useQuery(api.members.getById, { id: memberId })

  const isLoading = data === undefined

  return { data, isLoading }
}
