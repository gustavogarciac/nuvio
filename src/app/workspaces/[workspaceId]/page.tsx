import React from 'react'

type Props = {
  params: {
    workspaceId: string
  }
}

const WorkspaceIdPage = ({ params }: Props) => {
  return <div>{params.workspaceId}</div>
}

export default WorkspaceIdPage
