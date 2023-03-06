import { CONTRACT_ADDRESS } from '../../constants';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useAccount, useContract, useSigner } from 'wagmi';
import { getCustomDateEpoch, getCustomDateEpochFromDateAndTime } from '../../utiils/dates';
import artifacts from '../../src/artifacts/contracts/Vote.sol/Vote.json'

function CreateElection() {

    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [loading, setLoading] = useState(false);

    const { address } = useAccount()
    const { data: signer } = useSigner()
    const contract = useContract({
        address: CONTRACT_ADDRESS,
        abi: artifacts.abi,
        signerOrProvider: signer,
    })

    const createElection = async (data, e) => {

        try {

            // prep vars
            data.startTime = getCustomDateEpochFromDateAndTime(data.electionDate, data.startTime)
            data.endTime = getCustomDateEpochFromDateAndTime(data.electionDate, data.endTime)
            data.electionDate = getCustomDateEpoch(data.electionDate)

            const {electionName, electionDate, startTime, endTime} = data;

            const tx = await contract.registerElection(electionName, electionDate, startTime, endTime);
            setLoading(true)
            tx.wait();
            setLoading(false)

            // reset form fields
            e.target.reset();

            router.push('/elections/allelections')

        } catch (error) {
            console.log("🚀 ~ file: create.js:37 ~ createElection ~ error", error)
        }

    }

    const [registrar, setRegistrar] = useState([]);
    const getRegistrar = async () => {
      try {
        const registrar = await contract.getRegistrar();
        setRegistrar(registrar);
      } catch (error) {
        console.log("🚀 ~ file: register.js:28 ~ getRegistrar ~ error:", error)
        
      }
    }

    useEffect(() => {
        if(!signer) return;
        getRegistrar();
    },[signer])

    if(registrar !== address) {
        return <div className='bg-red-600 p-4 rounded-md'>
            <p className='text-white'>Access Denied! Only admin can perform this action</p>
        </div>
    }

    return (
        <div className='bg-vote-300 p-4 rounded-md shadow-xl'>
            <p className='text-2xl mb-12 font-bold'>Election Details</p>
            <div>
                <form onSubmit={handleSubmit(createElection)}>
                    <div className='mb-4'>
                        <label className='text-sm font-semibold text-vote-700'>Election Name</label>
                        <div>
                            <input {...register("electionName", { required: true })} className='w-full h-9 rounded-md p-2 text-sm' type="text" />
                            <span className='text-red-900 text-sm'>{errors.electionName && <span>This field is required</span>}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='text-sm font-semibold'>Election Date</label>
                        <div>
                            <input {...register("electionDate", { required: true })} className='w-full h-9 text-vote-700 rounded-md p-2 text-sm' type="date" />
                            <span className='text-red-900 text-sm'>{errors.electionDate && <span>This field is required</span>}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='text-sm font-semibold'>Election Start Time</label>
                        <div>
                            <input {...register("startTime", { required: true })} className='w-full h-9 text-vote-700 rounded-md p-2 text-sm' type="time" />
                            <span className='text-red-900 text-sm'>{errors.startTime && <span>This field is required</span>}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='text-sm font-semibold'>Election End Time</label>
                        <div>
                            <input {...register("endTime", { required: true })} className='w-full h-9 text-vote-700 rounded-md p-2 text-sm' type="time" />
                            <span className='text-red-900 text-sm'>{errors.endTime && <span>This field is required</span>}</span>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <button type='submit' className='bg-vote-700 w-full px-4 py-2 text-white rounded-md hover:bg-vote-900'>{loading ? 'Processing' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateElection