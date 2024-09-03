import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import React from 'react'

type Props = {
  name: string
  creationTime: number
}

export const ChannelHero = ({ name, creationTime }: Props) => {
  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <p className="mb-2 flex items-center text-2xl font-bold"># {name}</p>
      <p className="mb-4 font-normal text-slate-800">
        Este canal foi criado em{' '}
        {format(creationTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às{' '}
        {format(creationTime, 'HH:mm')}. Este é o começo do canal {name}.
      </p>
    </div>
  )
}
