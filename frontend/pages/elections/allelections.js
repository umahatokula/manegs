import { CONTRACT_ADDRESS } from '../../constants';
import { fetchSigner, getContract } from '@wagmi/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useContract, useSigner } from 'wagmi';
import { epochToHumanReadable, epochToHumanReadableTime, convertEpochToSpecificTimezone } from '../../utiils/dates';
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'

function Allelections() {

    const [elections, setElections] = useState();


    const { data: signer } = useSigner()
    const contract = useContract({
        address: CONTRACT_ADDRESS,
        abi: artifacts.abi,
        signerOrProvider: signer,
    })



    const getElections = async () => {

        try {
            const elections = await contract.getAllElections();
            const formattedElections = elections.map(election => {
                return {
                    electionName: election.electionName,
                    electionDate: epochToHumanReadable(election.electionDate.toNumber()),
                    startTime: convertEpochToSpecificTimezone(election.startTime.toNumber(), +1),
                    endTime: convertEpochToSpecificTimezone(election.endTime.toNumber(), +1),
                    electionId  : election.electionId?.toString(),
                }
            })
            setElections(formattedElections)
        } catch (error) {
            console.log("🚀 ~ file: allelections.js:40 ~ getElections ~ error:", error)
            
        }

    }

    useEffect(() => {
        if(!signer) return;
        getElections();
    },[signer])

    return (
        <div className='flex flex-col'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-bold'>All elections</h1>
                <Link href='/elections/create' className='py-2 px-4 text-sm bg-vote-500 text-white rounded-md'>Create Election Type</Link>
            </div>

            <div className='flex mt-12 w-full'>
                <div className='bg-white rounded-md shadow-md p-4 w-full'>
                    <table className='table-auto border-collapse w-full text-xs'>
                        <thead>
                            <tr className='text-left'>
                                <th>Election Name</th>
                                <th>Election Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elections && elections.map((election, idx) => {
                                return  <tr key={idx} className='my-3'>
                                            <td>{election.electionName}</td>
                                            <td>{election.electionDate}</td>
                                            <td>{election.startTime}</td>
                                            <td>{election.endTime}</td>
                                        </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Allelections