import React from 'react'

const Homepage = () => {
  return (
    <div className='space-y-8'>
        {/* Intro */}
        <section>
            <h1 className="text-3xl font-bold mb-2">Upload your receipt</h1>
            <p className='text-sm opacity-80'>
                We&apos;ll scan your receipt, list your purchased items and check them against
                recent Canadian recalls (last 5 days).
            </p>
        </section>

        {/* Upload area */}
        <section className='card bg-base-100 shadow-md'>
            <div className='card-body space-y-4'>
                <h2 className='card-title'>Step 1: Upload and Scan</h2>
                <input
                type='file'
                accept='image/*'
                className='file-input file-input-bordered w-full'
                ></input>
                <button className='btn btn-primary w-full' disabled>Upload and scan coming next</button>
                <p className='text-xs opacity-70'>
                    We only use your receipts to extract item names and check them against recall data.
                    Your session is temperary.
                </p>
            </div>
        </section>

        {/* Purchased items */}
        <section className="card bg-base-100 shadow-md">
            <div className='card-body'>
                <h2 className='card-title'>Step 2: Review Detected items</h2>
                <p className='text-sm opacity-70 mb-2'>Once we scan the receipt, the list of purchased items will appear below</p>

                {/* static placeholder list for now */}
                <ul className='list-disc ml-5 space-y-1'>
                    <li className='opacity-60'>
                         Example: 2% Milk 1L — $4.99 (placeholder)
                    </li>
                    <li className='opacity-60'>
                         Example: Whole Wheat Bread — $2.49 (placeholder)
                    </li>
                </ul>
            </div>
        </section>

        {/* recalls section */}
        <section className='card bg-base-100 shadow-md'>
            <div className='card-body space-y-3'>
                <h2 className='card-title'>Step 3: Check recalls</h2>
                <p className='text-sm opacity-70'>
                    After your items are loaded, you will be able to check them against
                    recent recalls notices.
                </p>
                 <button className='btn btn-primary w-full' disabled>Check recalls (disabled until items are ready)</button>
            </div>
        </section>
        {/* Result modal shell will appear here */}
    </div>
  )
}

export default Homepage