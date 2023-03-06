import Image from 'next/image'
import React from 'react'

function ResultCard({score}) {
  return (
    <div className='flex flex-col w-full'>
        <div className='w-full'>
            <Image src={`/logos/${score.platform}.png`} className="w-full md:w-full object-fill" alt="logo" width={50} height={50} />
        </div>
        <div className='w-full space-y-1'>
            <p className='text-base'><span className='font-bold'>Name: </span>{score.name}</p>
            <p className='text-base'><span className='font-bold'>Platformm: </span>{score.platform}</p>
            <p className='text-base'><span className='font-bold'>State Code: </span>{score.stateCode}</p>
            <p className='text-base'><span className='font-bold'>Constituency Code: </span>{score.constituencyCode}</p>
            <p className='text-base'><span className='font-bold'>Contestant ID: </span>{score.contestantId}</p>
            <p className='text-base'><span className='font-bold'>Number of Votes: </span>{score.voteCount}</p>
        </div>
    </div>
  )
}

export default ResultCard